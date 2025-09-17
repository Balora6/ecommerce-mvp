import { IShopifyOrder, IMetricsResponse } from "@/types/metrics";
import { formatDateForDisplay } from "@/utils/date";

export function calculateMetrics(
  shopId: string,
  orders: IShopifyOrder[],
  from: Date,
  to: Date
): IMetricsResponse {
  const currency = orders.length > 0 ? orders[0].currency : "USD";

  const grossRevenue = orders.reduce((sum, order) => {
    return sum + parseFloat(order.total_price);
  }, 0);

  const refundedAmount = orders.reduce((sum, order) => {
    if (!order.refunds) return sum;

    return (
      sum +
      order.refunds.reduce((refundSum, refund) => {
        return (
          refundSum +
          refund.transactions.reduce((transactionSum, transaction) => {
            if (transaction.kind === "refund") {
              return transactionSum + parseFloat(transaction.amount);
            }
            return transactionSum;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const netRevenue = grossRevenue - refundedAmount;

  const avgOrderValue = orders.length > 0 ? grossRevenue / orders.length : 0;

  return {
    shopId,
    from: formatDateForDisplay(from),
    to: formatDateForDisplay(to),
    ordersCount: orders.length,
    grossRevenue: Math.round(grossRevenue * 100) / 100,
    currency,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    refundedAmount: Math.round(refundedAmount * 100) / 100,
    netRevenue: Math.round(netRevenue * 100) / 100,
  };
}
