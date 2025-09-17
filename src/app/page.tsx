"use client";

<<<<<<< HEAD
import { ConnectButton } from "@/components/ConnectButton";
<<<<<<< HEAD
<<<<<<< HEAD
import MetricsTable from "@/components/MetricsTable";
import axios from "axios";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [metrics, setMetrics] = useState(null);
  const [shopConnected, setShopConnected] = useState(false);

  useEffect(() => {
      if (shopConnected) {
          axios.get('/api/metrics')
              .then(res => setMetrics(res.data))
      }
  }, [shopConnected]);

  return (
    <div
    style={{
      maxWidth: "600px",
      margin: "50px auto",
      fontFamily: "Arial",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    }}
  >
    <h1>Shopify Dashboard</h1>
    {!shopConnected && (
      <ConnectButton onConnect={() => setShopConnected(true)} />
    )}
    {metrics && <MetricsTable metrics={metrics} />}
  </div>
  
  );
}
=======
=======
>>>>>>> 4ec2a43 (fix pages)
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
=======
import { useState } from "react";
>>>>>>> 3bb73ff (Refactor HomePage and MetricsPage to streamline Shopify connection handling and improve user experience)

export default function HomePage() {
<<<<<<< HEAD
  const [shop, setShop] = useState("");
  const [isConnected, setIsConnected] = useState(false);
=======
  const [shopConnected, setShopConnected] = useState(false);
<<<<<<< HEAD
  const [shopId, setShopId] = useState("");
>>>>>>> 4ec2a43 (fix pages)
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [shopId, setShopId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const shopParam = searchParams.get("shop");
    const errorParam = searchParams.get("error");
    const shopIdParam = searchParams.get("shopId");

    if (connected === "true" && shopParam) {
      setIsConnected(true);
      setShop(shopParam);
      if (shopIdParam) {
        setShopId(shopIdParam);
        router.push(`/metrics?shopId=${shopIdParam}`);
      }
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    }
  }, [searchParams]);
=======
  const [error, setError] = useState("");

>>>>>>> 3bb73ff (Refactor HomePage and MetricsPage to streamline Shopify connection handling and improve user experience)

<<<<<<< HEAD
  const fetchMetrics = async () => {
    if (!shopId) {
      setError("Shop ID not available");
      return;
    }

    setLoadingMetrics(true);
    setError("");

    try {
      const response = await fetch(`/api/shops/${shopId}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(
        `Failed to fetch metrics: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleConnect = () => {
    if (!shop.trim()) {
      setError("Please enter a shop domain");
      return;
    }

    // Validate shop domain format
    if (!shop.includes(".myshopify.com")) {
      setError(
        "Please enter a valid Shopify domain (e.g., your-shop.myshopify.com)"
      );
      return;
    }

    setError("");
    // Redirect to OAuth endpoint
    window.location.href = `/api/auth/shopify?shop=${encodeURIComponent(shop)}`;
  };

=======
>>>>>>> 4ec2a43 (fix pages)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Shopify OAuth Test
        </h1>

        {!isConnected ? (
          <div>
            <div className="mb-4">
              <label
                htmlFor="shop"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Shop Domain
              </label>
              <input
                type="text"
                id="shop"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="your-shop.myshopify.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleConnect}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Connect Shopify
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Successfully connected to {shop}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Shop:</strong> {shop}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> Connected
              </p>
              {shopId && (
                <p className="text-sm text-gray-600">
                  <strong>Shop ID:</strong> {shopId}
                </p>
              )}
            </div>

            <button
              onClick={fetchMetrics}
              disabled={loadingMetrics}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMetrics
                ? "Loading Metrics..."
                : "Fetch Metrics (Last 30 Days)"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {metrics && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Metrics (Last 30 Days)
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(metrics, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsConnected(false);
                setShop("");
                setShopId("");
                setError("");
                setMetrics(null);
                // Clear URL parameters
                window.history.replaceState(
                  {},
                  document.title,
                  window.location.pathname
                );
              }}
              className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Disconnect
            </button>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>This is a test interface for Shopify OAuth integration.</p>
          <p>
            Enter your Shopify development store domain to test the connection.
          </p>
        </div>
<<<<<<< HEAD
      </div>
    </div>
  );
}
>>>>>>> d8103e9 (feature: add shopify auth logic and sample ui for it)
=======
      )}

      {!shopConnected && (
        <ConnectButton onConnect={() => setShopConnected(true)} />
      )}

      {shopConnected && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#efe",
            border: "1px solid #cfc",
            color: "#363",
            borderRadius: "4px",
            width: "100%",
            textAlign: "center",
          }}
        >
          Connecting to Shopify...
        </div>
      )}
    </div>
  );
}
>>>>>>> 4ec2a43 (fix pages)
