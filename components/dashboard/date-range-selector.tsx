"use client";

import { useRouter, useSearchParams } from "next/navigation";

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This month", value: "month" },
  { label: "This year", value: "year" },
];

export default function DateRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "7days";

  function handleRangeChange(range: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Time Range:</span>
      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleRangeChange(option.value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              currentRange === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
