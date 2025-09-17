"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IMetricsResponse } from "@/types/metrics";
import MetricsTable from "@/components/MetricsTable";


export default function MetricsPage() {
  const [metrics, setMetrics] = useState<IMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const shopId = searchParams.get("shopId") || "";

  const fetchMetrics = async () => {
    if (!shopId) {
      setError("Shop ID not available");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/shops/${shopId}/metrics`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data: IMetricsResponse = await res.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Shop Metrics</h1>

      {!metrics && (
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Loading Metrics..." : "Get Shop Metrics"}
        </button>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {metrics && <MetricsTable metrics={metrics} />}
    </div>
  );
}
