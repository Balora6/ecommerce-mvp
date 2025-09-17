"use client";

import { useEffect, useState } from "react";
import { IMetricsResponse } from "@/types/metrics";
import MetricsTable from "@/components/MetricsTable";
import { useSearchParams, useRouter } from "next/navigation";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<IMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");
  const [shopConnected, setShopConnected] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const shopParam = searchParams.get("shop");
    const errorParam = searchParams.get("error");
    const shopIdParam = searchParams.get("shopId");

    if (connected === "true" && shopParam) {
      setShopConnected(true);
      if (shopIdParam) {
        setShopId(shopIdParam);
        // Remove the router.push to avoid infinite redirects
        // The shopId is already set from URL params
      }
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    } else if (shopIdParam) {
      // Handle direct access with shopId
      setShopId(shopIdParam);
      setShopConnected(true);
    }
  }, [searchParams]);

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

      {!metrics && shopId && (
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Loading Metrics..." : "Get Shop Metrics"}
        </button>
      )}

      {!shopId && !error && (
        <div className="text-gray-600 mb-4">
          Please connect your Shopify store first to view metrics.
        </div>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {metrics && <MetricsTable metrics={metrics} />}
    </div>
  );
}
