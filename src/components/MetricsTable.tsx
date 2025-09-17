"use client";

interface MetricsData {
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

interface MetricsTableProps {
  metrics: MetricsData;
}

export default function MetricsTable({ metrics }: MetricsTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Shopify Metrics
      </h2>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Period:</span>
            <span className="ml-2 text-gray-600">
              {formatDate(metrics.from)} - {formatDate(metrics.to)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Shop ID:</span>
            <span className="ml-2 text-gray-600">{metrics.shopId}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Orders</h3>
          <p className="text-3xl font-bold text-green-600">
            {metrics.ordersCount}
          </p>
          <p className="text-sm text-green-700">Total orders</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Gross Revenue
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(metrics.grossRevenue, metrics.currency)}
          </p>
          <p className="text-sm text-blue-700">Before refunds</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Net Revenue
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(metrics.netRevenue, metrics.currency)}
          </p>
          <p className="text-sm text-purple-700">After refunds</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Average Order Value
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatCurrency(metrics.avgOrderValue, metrics.currency)}
          </p>
          <p className="text-sm text-orange-700">Per order</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Refunded Amount
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(metrics.refundedAmount, metrics.currency)}
          </p>
          <p className="text-sm text-red-700">Total refunds</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Refund Rate
          </h3>
          <p className="text-3xl font-bold text-gray-600">
            {metrics.grossRevenue > 0
              ? ((metrics.refundedAmount / metrics.grossRevenue) * 100).toFixed(
                  1
                )
              : "0.0"}
            %
          </p>
          <p className="text-sm text-gray-700">Of gross revenue</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Raw Data</h3>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto bg-white p-3 rounded border">
          {JSON.stringify(metrics, null, 2)}
        </pre>
      </div>
    </div>
  );
}
