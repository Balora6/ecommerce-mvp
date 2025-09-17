"use client";

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