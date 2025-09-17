"use client";

import React from "react";

type ConnectButtonProps = {
  onConnect?: () => void;
};

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  const handleConnect = () => {
    if (onConnect) onConnect();
    window.location.href = "/api/shopify/oauth/start"; 
  };

  return (
    <button
      onClick={handleConnect}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "#008060",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Connect Shopify
    </button>
  );
}
