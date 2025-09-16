export interface MetricsResponse {
  shopId: string;
  from: string;
  to: string;
  ordersCount: number;
  grossRevenue: number;
  currency: string;
  avgOrderValue: number;
  refundedAmount: number;
  netRevenue: number;
}

export interface ShopifyOrder {
  id: number;
  total_price: string;
  currency: string;
  created_at: string;
  financial_status: string;
  refunds?: Array<{
    id: number;
    created_at: string;
    transactions: Array<{
      amount: string;
      kind: string;
    }>;
  }>;
}

export interface ShopifyOrdersResponse {
  orders: ShopifyOrder[];
}
