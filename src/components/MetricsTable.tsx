import React from "react";
import type { IMetricsResponse } from "../types/metrics";
import { useRouter } from "next/navigation";

export default function MetricsTable({
  metrics,
}: {
  metrics: IMetricsResponse;
}) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="w-full max-w-3xl mt-6">
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white text-left">
            <tr>
              <th className="px-6 py-3">Metric</th>
              <th className="px-6 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">
                Orders Count
              </td>
              <td className="px-6 py-4">{metrics.ordersCount}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">Currency</td>
              <td className="px-6 py-4">{metrics.currency}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">
                Gross Revenue
              </td>
              <td className="px-6 py-4">{metrics.grossRevenue}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">
                Average Order Value
              </td>
              <td className="px-6 py-4">{metrics.avgOrderValue}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">
                Refunded Amount
              </td>
              <td className="px-6 py-4">{metrics.refundedAmount}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-700">
                Net Revenue
              </td>
              <td className="px-6 py-4">{metrics.netRevenue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
