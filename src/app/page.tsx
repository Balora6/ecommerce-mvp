"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HomePage() {
  const [shopConnected, setShopConnected] = useState(false);
  const [shopId, setShopId] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const shopParam = searchParams.get("shop");
    const errorParam = searchParams.get("error");
    const shopIdParam = searchParams.get("shopId");

    if (connected === "true" && shopParam) {
      setShopConnected(true);
      if (shopIdParam) {
        setShopId(shopIdParam);
        router.push(`/metrics?shopId=${shopIdParam}`);
      }
    } else if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
    }
  }, [searchParams]);

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
          ✅ Successfully connected to Shopify. Redirecting to metrics...
        </div>
      )}
    </div>
  );
}