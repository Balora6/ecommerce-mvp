"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [shopConnected, setShopConnected] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const handleConnect = () => {
    setShopConnected(true);
    window.location.href = "/api/auth/shopify?shop=brokeragetets.myshopify.com";
  };

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

      {!searchParams.get("connected") && (
        <ConnectButton onClick={handleConnect} />
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
