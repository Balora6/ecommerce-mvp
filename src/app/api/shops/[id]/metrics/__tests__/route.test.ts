/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { calculateMetrics } from "@/lib/metrics";
import { IShopifyOrder } from "@/types/metrics";

describe("/api/shops/[id]/metrics API Route", () => {
  describe("Response Structure and Types", () => {
    it("should return correct response structure and types when calculateMetrics is called", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "100.00",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
          refunds: [
            {
              id: 1,
              created_at: "2024-01-16T10:00:00Z",
              transactions: [
                {
                  amount: "20.00",
                  kind: "refund",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          total_price: "150.00",
          currency: "USD",
          created_at: "2024-01-20T10:00:00Z",
          financial_status: "paid",
        },
      ];

      const result = calculateMetrics(shopId, mockOrders, from, to);

      expect(result).toHaveProperty("shopId");
      expect(result).toHaveProperty("from");
      expect(result).toHaveProperty("to");
      expect(result).toHaveProperty("ordersCount");
      expect(result).toHaveProperty("grossRevenue");
      expect(result).toHaveProperty("currency");
      expect(result).toHaveProperty("avgOrderValue");
      expect(result).toHaveProperty("refundedAmount");
      expect(result).toHaveProperty("netRevenue");

      expect(typeof result.shopId).toBe("string");
      expect(typeof result.from).toBe("string");
      expect(typeof result.to).toBe("string");
      expect(typeof result.ordersCount).toBe("number");
      expect(typeof result.grossRevenue).toBe("number");
      expect(typeof result.currency).toBe("string");
      expect(typeof result.avgOrderValue).toBe("number");
      expect(typeof result.refundedAmount).toBe("number");
      expect(typeof result.netRevenue).toBe("number");

      expect(result.shopId).toBe(shopId);
      expect(result.ordersCount).toBe(2);
      expect(result.grossRevenue).toBe(250.0); 
      expect(result.currency).toBe("USD");
      expect(result.avgOrderValue).toBe(125.0); 
      expect(result.refundedAmount).toBe(20.0);
      expect(result.netRevenue).toBe(230.0); 
    });

    it("should return zeros with correct shape when no orders are provided", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const result = calculateMetrics(shopId, [], from, to);

      expect(result).toHaveProperty("shopId");
      expect(result).toHaveProperty("from");
      expect(result).toHaveProperty("to");
      expect(result).toHaveProperty("ordersCount");
      expect(result).toHaveProperty("grossRevenue");
      expect(result).toHaveProperty("currency");
      expect(result).toHaveProperty("avgOrderValue");
      expect(result).toHaveProperty("refundedAmount");
      expect(result).toHaveProperty("netRevenue");

      expect(result.shopId).toBe(shopId);
      expect(result.ordersCount).toBe(0);
      expect(result.grossRevenue).toBe(0);
      expect(result.currency).toBe("USD");
      expect(result.avgOrderValue).toBe(0);
      expect(result.refundedAmount).toBe(0);
      expect(result.netRevenue).toBe(0);
    });

    it("should handle complex refund scenarios correctly", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "500.00",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
          refunds: [
            {
              id: 1,
              created_at: "2024-01-16T10:00:00Z",
              transactions: [
                {
                  amount: "100.00",
                  kind: "refund",
                },
                {
                  amount: "50.00",
                  kind: "refund",
                },
                {
                  amount: "25.00",
                  kind: "capture", 
                },
              ],
            },
          ],
        },
      ];

      const result = calculateMetrics(shopId, mockOrders, from, to);

      expect(result.ordersCount).toBe(1);
      expect(result.grossRevenue).toBe(500.0);
      expect(result.refundedAmount).toBe(150.0); 
      expect(result.netRevenue).toBe(350.0); 
      expect(result.avgOrderValue).toBe(500.0);
    });

    it("should handle date range correctly", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const result = calculateMetrics(shopId, [], from, to);

      expect(result.from).toBe("2024-01-01");
      expect(result.to).toBe("2024-01-31");
    });

    it("should handle different currencies correctly", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "100.00",
          currency: "EUR",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
        },
      ];

      const result = calculateMetrics(shopId, mockOrders, from, to);

      expect(result.currency).toBe("EUR");
      expect(result.grossRevenue).toBe(100.0);
    });

    it("should validate numeric values are properly rounded", () => {
      const shopId = "test-shop-id";
      const from = new Date("2024-01-01");
      const to = new Date("2024-01-31");

      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "33.333",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
        },
        {
          id: 2,
          total_price: "66.666",
          currency: "USD",
          created_at: "2024-01-16T10:00:00Z",
          financial_status: "paid",
        },
      ];

      const result = calculateMetrics(shopId, mockOrders, from, to);


      expect(result.grossRevenue).toBe(100.0); 
      expect(result.avgOrderValue).toBe(50.0); 
      expect(Number.isInteger(result.grossRevenue * 100)).toBe(true); 
      expect(Number.isInteger(result.avgOrderValue * 100)).toBe(true); 
    });
  });
});
