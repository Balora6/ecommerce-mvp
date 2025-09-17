"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const [shopConnected, setShopConnected] = useState(false);
  const [error, setError] = useState("");
  const [shopDomain, setShopDomain] = useState("");
  const searchParams = useSearchParams();

  const handleConnect = () => {
    if (!shopDomain.trim()) {
      setError("Please enter your Shopify store domain");
      return;
    }

    // Validate shop domain format
    const domain = shopDomain.trim().toLowerCase();
    if (!domain.includes(".myshopify.com")) {
      setError(
        "Please enter a valid Shopify domain (e.g., your-store.myshopify.com)"
      );
      return;
    }

    setShopConnected(true);
    setError("");
    window.location.href = `/api/auth/shopify?shop=${encodeURIComponent(
      domain
    )}`;
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="your-store.myshopify.com"
            value={shopDomain}
            onChange={(e) => setShopDomain(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <ConnectButton onClick={handleConnect} />
        </div>
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
