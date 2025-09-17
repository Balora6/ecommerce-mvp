"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function HomePageContent() {
  const [shopConnected, setShopConnected] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  // Reset shopConnected state when user returns from metrics page
  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected === "true") {
      setShopConnected(false);
    }
  }, [searchParams]);

  const handleConnect = () => {
    setShopConnected(true);
    const shopDomain =
      process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN ||
      "brokeragetets.myshopify.com";
    window.location.href = `/api/auth/shopify?shop=${shopDomain}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Shopify Dashboard</h1>

      {error && (
        <div className="w-full text-center px-4 py-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!searchParams.get("connected") && (
        <ConnectButton onClick={handleConnect} loading={shopConnected} />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 gap-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopify Dashboard
          </h1>
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
