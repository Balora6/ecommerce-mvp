"use client";

interface ConnectButtonProps {
  onClick: () => void;
}

export function ConnectButton({ onClick }: ConnectButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-95 flex items-center justify-center"
    >
      Connect Shopify
    </button>
  );
}