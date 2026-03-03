"use client";

import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "In Production": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Dispatched: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        statusStyles[status] || "bg-neutral-700 text-neutral-300 border-neutral-600"
      )}
    >
      {status}
    </span>
  );
}
