"use client";

import { ConnectButton } from "@/components/ConnectButton";
import MetricsTable from "@/components/MetricsTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface MetricsResponse {
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

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [shopConnected, setShopConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");
  const [shop, setShop] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const shopParam = searchParams.get("shop");
    const errorParam = searchParams.get("error");
    const shopIdParam = searchParams.get("shopId");

    if (connected === "true" && shopParam) {
      setShopConnected(true);
      setShop(shopParam);
      if (shopIdParam) {
        setShopId(shopIdParam);
      }
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (shopConnected && shopId) {
      fetchMetrics();
    }
  }, [shopConnected, shopId]);

  const fetchMetrics = async () => {
    if (!shopId) {
      setError("Shop ID not available");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/shops/${shopId}/metrics`);
      setMetrics(response.data);
    } catch (err) {
      setError(
        `Failed to fetch metrics: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setShopConnected(true);
  };

  const handleDisconnect = () => {
    setShopConnected(false);
    setMetrics(null);
    setShopId("");
    setShop("");
    setError("");
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "50px auto",
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "0 20px",
      }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Shopify Dashboard
      </h1>

      {error && (
        <div className="w-full max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!shopConnected ? (
        <ConnectButton onConnect={handleConnect} />
      ) : (
        <div className="w-full">
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            ✅ Successfully connected to {shop}
            {shopId && <div className="text-sm mt-1">Shop ID: {shopId}</div>}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading metrics...</div>
            </div>
          )}

          {metrics && <MetricsTable metrics={metrics} />}

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Refresh Metrics"}
            </button>

            <button
              onClick={handleDisconnect}
              className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <p>
          This dashboard provides a clean interface for viewing Shopify metrics.
        </p>
        <p>
          Use the main page for OAuth testing and this page for the dashboard
          view.
        </p>
      </div>
    </div>
  );
}
