import { calculateMetrics } from "../metrics";
import { IShopifyOrder } from "@/types/metrics";

describe("Metrics Aggregator", () => {
  const mockShopId = "test-shop-id";
  const mockFrom = new Date("2024-01-01");
  const mockTo = new Date("2024-01-31");

  describe("calculateMetrics", () => {
    it("should calculate metrics correctly with orders and refunds", () => {
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
          refunds: [],
        },
        {
          id: 3,
          total_price: "75.50",
          currency: "USD",
          created_at: "2024-01-25T10:00:00Z",
          financial_status: "paid",
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result).toEqual({
        shopId: mockShopId,
        from: "2024-01-01",
        to: "2024-01-31",
        ordersCount: 3,
        grossRevenue: 325.5, // 100 + 150 + 75.5
        currency: "USD",
        avgOrderValue: 108.5, // 325.5 / 3
        refundedAmount: 20.0,
        netRevenue: 305.5, // 325.5 - 20.0
      });
    });

    it("should handle orders with multiple refunds", () => {
      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "200.00",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
          refunds: [
            {
              id: 1,
              created_at: "2024-01-16T10:00:00Z",
              transactions: [
                {
                  amount: "50.00",
                  kind: "refund",
                },
                {
                  amount: "25.00",
                  kind: "refund",
                },
              ],
            },
            {
              id: 2,
              created_at: "2024-01-17T10:00:00Z",
              transactions: [
                {
                  amount: "10.00",
                  kind: "refund",
                },
              ],
            },
          ],
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result).toEqual({
        shopId: mockShopId,
        from: "2024-01-01",
        to: "2024-01-31",
        ordersCount: 1,
        grossRevenue: 200.0,
        currency: "USD",
        avgOrderValue: 200.0,
        refundedAmount: 85.0, // 50 + 25 + 10
        netRevenue: 115.0, // 200 - 85
      });
    });

    it("should handle orders with non-refund transactions", () => {
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
                {
                  amount: "10.00",
                  kind: "capture", // This should be ignored
                },
                {
                  amount: "5.00",
                  kind: "refund",
                },
              ],
            },
          ],
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result).toEqual({
        shopId: mockShopId,
        from: "2024-01-01",
        to: "2024-01-31",
        ordersCount: 1,
        grossRevenue: 100.0,
        currency: "USD",
        avgOrderValue: 100.0,
        refundedAmount: 25.0, // Only 20 + 5 (refund transactions)
        netRevenue: 75.0, // 100 - 25
      });
    });

    it("should return zeros when no orders provided", () => {
      const result = calculateMetrics(mockShopId, [], mockFrom, mockTo);

      expect(result).toEqual({
        shopId: mockShopId,
        from: "2024-01-01",
        to: "2024-01-31",
        ordersCount: 0,
        grossRevenue: 0,
        currency: "USD", // Default currency when no orders
        avgOrderValue: 0,
        refundedAmount: 0,
        netRevenue: 0,
      });
    });

    it("should handle orders without refunds", () => {
      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "100.00",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
        },
        {
          id: 2,
          total_price: "200.00",
          currency: "USD",
          created_at: "2024-01-20T10:00:00Z",
          financial_status: "paid",
          refunds: [],
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result).toEqual({
        shopId: mockShopId,
        from: "2024-01-01",
        to: "2024-01-31",
        ordersCount: 2,
        grossRevenue: 300.0,
        currency: "USD",
        avgOrderValue: 150.0,
        refundedAmount: 0,
        netRevenue: 300.0,
      });
    });

    it("should round monetary values to 2 decimal places", () => {
      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "100.123",
          currency: "USD",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
          refunds: [
            {
              id: 1,
              created_at: "2024-01-16T10:00:00Z",
              transactions: [
                {
                  amount: "33.456",
                  kind: "refund",
                },
              ],
            },
          ],
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result.grossRevenue).toBe(100.12); // Rounded
      expect(result.refundedAmount).toBe(33.46); // Rounded
      expect(result.netRevenue).toBe(66.67); // Rounded
      expect(result.avgOrderValue).toBe(100.12); // Rounded
    });

    it("should use currency from first order", () => {
      const mockOrders: IShopifyOrder[] = [
        {
          id: 1,
          total_price: "100.00",
          currency: "EUR",
          created_at: "2024-01-15T10:00:00Z",
          financial_status: "paid",
        },
        {
          id: 2,
          total_price: "200.00",
          currency: "USD", // Different currency, should be ignored
          created_at: "2024-01-20T10:00:00Z",
          financial_status: "paid",
        },
      ];

      const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

      expect(result.currency).toBe("EUR");
    });
  });
});
