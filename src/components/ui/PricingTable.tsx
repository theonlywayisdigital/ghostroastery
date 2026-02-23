"use client";

import { cn } from "@/lib/utils";

interface PricingTier {
  bagSize: string;
  tier_25_49: number;
  tier_50_99: number;
  tier_100_150: number;
}

interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
}

export function PricingTable({ tiers, className }: PricingTableProps) {
  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left py-4 px-4 text-neutral-400 font-medium">
              Quantity
            </th>
            {tiers.map((tier) => (
              <th
                key={tier.bagSize}
                className="text-center py-4 px-4 font-bold text-lg"
              >
                {tier.bagSize}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-700/50">
            <td className="py-4 px-4 text-neutral-300">25–49 bags</td>
            {tiers.map((tier) => (
              <td
                key={`${tier.bagSize}-25`}
                className="text-center py-4 px-4 font-semibold"
              >
                {formatPrice(tier.tier_25_49)}
                <span className="text-neutral-500 text-sm">/bag</span>
              </td>
            ))}
          </tr>
          <tr className="border-b border-neutral-700/50">
            <td className="py-4 px-4 text-neutral-300">50–99 bags</td>
            {tiers.map((tier) => (
              <td
                key={`${tier.bagSize}-50`}
                className="text-center py-4 px-4 font-semibold"
              >
                {formatPrice(tier.tier_50_99)}
                <span className="text-neutral-500 text-sm">/bag</span>
              </td>
            ))}
          </tr>
          <tr className="border-b border-neutral-700/50 bg-accent/5">
            <td className="py-4 px-4 text-neutral-300 font-medium">
              100–150 bags
              <span className="ml-2 text-xs text-accent">Best value</span>
            </td>
            {tiers.map((tier) => (
              <td
                key={`${tier.bagSize}-100`}
                className="text-center py-4 px-4 font-bold text-accent"
              >
                {formatPrice(tier.tier_100_150)}
                <span className="text-neutral-500 text-sm font-normal">/bag</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
