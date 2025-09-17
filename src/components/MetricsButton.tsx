"use client";

type MetricsButtonProps = {
  onClick: () => void;
  loading?: boolean;
};

export function MetricsButton({
  onClick,
  loading = false,
}: MetricsButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-3 text-white text-lg font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
      }`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {loading ? "Loading..." : "Get Shop Metrics"}
    </button>
  );
}
