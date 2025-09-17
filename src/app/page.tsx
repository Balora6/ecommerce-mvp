"use client";

import { ConnectButton } from "@/components/ConnectButton";
import MetricsTable from "@/components/MetricsTable";
import { useState, useEffect } from "react";
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

export default function HomePage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [shopConnected, setShopConnected] = useState(false);
  const [shopId, setShopId] = useState("");
  const [error, setError] = useState("");
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
      }
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (shopConnected && shopId) {
      fetch(`/api/shops/${shopId}/metrics`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setMetrics(data))
        .catch((err) => {
          setError(`Failed to fetch metrics: ${err.message}`);
        });
    }
  }, [shopConnected, shopId]);

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

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            borderRadius: "4px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {error}
        </div>
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
          ✅ Successfully connected to Shopify
        </div>
      )}

      {metrics && <MetricsTable metrics={metrics} />}
    </div>
  );
}
