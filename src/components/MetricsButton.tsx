"use client";

type MetricsButtonProps = {
  onClick: () => void;
};

export function MetricsButton({ onClick }: MetricsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 flex items-center justify-center"
    >
      Get Shop Metrics
    </button>
  );
}