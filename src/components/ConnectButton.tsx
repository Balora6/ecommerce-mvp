"use client";

interface ConnectButtonProps {
  onClick: () => void;
}

export function ConnectButton({ onClick }: ConnectButtonProps) {
  return (
    <button
      onClick={onClick}
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
