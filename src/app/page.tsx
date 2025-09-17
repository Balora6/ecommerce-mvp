"use client";

<<<<<<< HEAD
import { ConnectButton } from "@/components/ConnectButton";
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
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [shop, setShop] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const shopParam = searchParams.get("shop");
    const errorParam = searchParams.get("error");

    if (connected === "true" && shopParam) {
      setIsConnected(true);
      setShop(shopParam);
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    }
  }, [searchParams]);

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

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Shop:</strong> {shop}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> Connected
              </p>
            </div>

            <button
              onClick={() => {
                setIsConnected(false);
                setShop("");
                setError("");
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
      </div>
    </div>
  );
}
>>>>>>> d8103e9 (feature: add shopify auth logic and sample ui for it)
