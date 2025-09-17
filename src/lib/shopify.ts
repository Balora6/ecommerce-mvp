import axios from "axios";
import { ShopifyOrdersResponse, ShopifyOrder } from "@/types/metrics";
import { safeLogger } from "./security";

export class ShopifyClient {
  private accessToken: string;
  private shopDomain: string;

  constructor(accessToken: string, shopDomain: string) {
    this.accessToken = accessToken;
    this.shopDomain = shopDomain;
  }

  private getBaseUrl(): string {
    // Handle both cases: shop name only or full domain
    const domain = this.shopDomain.includes(".myshopify.com")
      ? this.shopDomain
      : `${this.shopDomain}.myshopify.com`;
    return `https://${domain}/admin/api/2025-07`;
  }

  private getHeaders() {
    return {
      "X-Shopify-Access-Token": this.accessToken,
      "Content-Type": "application/json",
    };
  }

  async getOrders(
    createdAtMin: string,
    createdAtMax: string
  ): Promise<ShopifyOrder[]> {
    try {
      const url = `${this.getBaseUrl()}/orders.json`;
      const params = {
        status: "any",
        created_at_min: createdAtMin,
        created_at_max: createdAtMax,
        limit: 250,
        financial_status: "any",
      };

      safeLogger.info("Fetching orders from Shopify", {
        url,
        params,
        shopDomain: this.shopDomain,
        hasAccessToken: !!this.accessToken,
      });

      const response = await axios.get<ShopifyOrdersResponse>(url, {
        headers: this.getHeaders(),
        params,
      });

      safeLogger.info("Successfully fetched orders", {
        ordersCount: response.data.orders.length,
      });

      return response.data.orders;
    } catch (error) {
      // Check if it's the protected customer data error
      const errorDetails = {
        error: error instanceof Error ? error.message : String(error),
        shopDomain: this.shopDomain,
        url: `${this.getBaseUrl()}/orders.json`,
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText,
        responseData: (error as any)?.response?.data,
      };

      safeLogger.error("Error fetching orders from Shopify", errorDetails);

      // Handle specific Shopify API errors
      const status = (error as any)?.response?.status;
      const errorMessage = (error as any)?.response?.data?.errors;

      if (status === 403 && errorMessage?.includes("protected customer data")) {
        safeLogger.info(
          "Protected customer data access denied. App needs approval for protected customer data access."
        );
        throw new Error(
          "ACCESS_DENIED: This app needs approval for protected customer data access. " +
            "Please apply for access at https://shopify.dev/docs/apps/launch/protected-customer-data"
        );
      }

      if (status === 429) {
        safeLogger.error("Shopify API rate limit exceeded", {
          shopDomain: this.shopDomain,
        });
        throw new Error(
          "Shopify API rate limit exceeded. Please try again later."
        );
      }

      if (status === 401) {
        safeLogger.error("Shopify API authentication failed", {
          shopDomain: this.shopDomain,
        });
        throw new Error(
          "Invalid or expired access token. Please reconnect your Shopify store."
        );
      }

      throw new Error(
        `Failed to fetch orders: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getShopInfo(): Promise<{ domain: string; name: string }> {
    try {
      const url = `${this.getBaseUrl()}/shop.json`;

      const response = await axios.get(url, {
        headers: this.getHeaders(),
      });

      return response.data.shop;
    } catch (error) {
      safeLogger.error("Error fetching shop info from Shopify", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(
        `Failed to fetch shop info: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
