"use client";

<<<<<<< HEAD
import React from "react";

type ConnectButtonProps = {
  onConnect: () => void;
};

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  const handleConnect = () => {
    if (onConnect) onConnect();
<<<<<<< HEAD
<<<<<<< HEAD
    window.location.href = "/api/shopify/oauth/start"; 
=======
    window.location.href = "/api/auth/shopify?shop=brokeragetets.myshopify.com";
>>>>>>> e0a5cf4 (Implement tests for metrics calculation and hitting metrics API)
=======
    window.location.href = "/api/auth/shopify?shop=brokeragetets.myshopify.com";
>>>>>>> 4ec2a43 (fix pages)
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
=======
import { useState } from "react";

interface ConnectButtonProps {
  onConnect: () => void;
}

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  const [shop, setShop] = useState("");
  const [error, setError] = useState("");

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
    <div className="w-full max-w-md mx-auto">
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
>>>>>>> e7d6fe4 (feat: add dashboard page and components for displaying Shopify metrics)
  );
}
