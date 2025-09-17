"use client";

import { useEffect, useState, Suspense } from "react";
import { IMetricsResponse } from "@/types/metrics";
import MetricsTable from "@/components/MetricsTable";
import { useSearchParams, useRouter } from "next/navigation";
import { MetricsButton } from "@/components/MetricsButton";

function MetricsPageContent() {
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
      if (shopIdParam) setShopId(shopIdParam);
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    } else if (shopIdParam) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Shop Metrics</h1>

      {!metrics && shopId && (
        <MetricsButton onClick={fetchMetrics} loading={loading} />
      )}

      {!shopId && !error && (
        <div className="text-gray-600 mb-4">
          Please connect your Shopify store first to view metrics.
        </div>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading && !metrics && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-gray-600">Generating metrics table...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {metrics && <MetricsTable metrics={metrics} />}
    </div>
  );
}

export default function MetricsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 gap-6">
          <h1 className="text-3xl font-bold text-gray-800">Shop Metrics</h1>
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <MetricsPageContent />
    </Suspense>
  );
}
