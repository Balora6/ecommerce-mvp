import axios from "axios";
import { ShopifyOrdersResponse, ShopifyOrder } from "@/types/metrics";
import { logSecurely } from "./security";

export class ShopifyClient {
  private accessToken: string;
  private shopDomain: string;

  constructor(accessToken: string, shopDomain: string) {
    this.accessToken = accessToken;
    this.shopDomain = shopDomain;
  }

  private getBaseUrl(): string {
    return `https://${this.shopDomain}.myshopify.com/admin/api/2023-10`;
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

      logSecurely("Fetching orders from Shopify", { url, params });

      const response = await axios.get<ShopifyOrdersResponse>(url, {
        headers: this.getHeaders(),
        params,
      });

      return response.data.orders;
    } catch (error) {
      logSecurely("Error fetching orders from Shopify", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : String(error)}`);
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
      logSecurely("Error fetching shop info from Shopify", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to fetch shop info: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
