"use client";

import { cn } from "@/lib/utils";
import type { PricingData } from "@/lib/pricing";
import { getBracketLabel } from "@/lib/pricing";

interface PricingTableProps {
  pricingData: PricingData;
  className?: string;
}

export function PricingTable({ pricingData, className }: PricingTableProps) {
  const { brackets, prices } = pricingData;
  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  // Get unique bag sizes from prices
  const bagSizes = [...new Set(prices.map((p) => p.bagSize))].sort();
  const lastBracket = brackets[brackets.length - 1];

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="text-left py-4 px-4 text-neutral-400 font-medium">
              Quantity
            </th>
            {bagSizes.map((size) => (
              <th
                key={size}
                className="text-center py-4 px-4 font-bold text-lg"
              >
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {brackets.map((bracket) => {
            const isLast = bracket.id === lastBracket?.id;
            return (
              <tr
                key={bracket.id}
                className={`border-b border-neutral-700/50 ${isLast ? "bg-accent/5" : ""}`}
              >
                <td className={`py-4 px-4 text-neutral-300 ${isLast ? "font-medium" : ""}`}>
                  {`${getBracketLabel(bracket)} bags`}
                  {isLast && (
                    <span className="ml-2 text-xs text-accent">Best value</span>
                  )}
                </td>
                {bagSizes.map((size) => {
                  const price = prices.find(
                    (p) => p.bracketId === bracket.id && p.bagSize === size
                  );
                  return (
                    <td
                      key={`${bracket.id}-${size}`}
                      className={`text-center py-4 px-4 ${isLast ? "font-bold text-accent" : "font-semibold"}`}
                    >
                      {price ? (
                        <>
                          {formatPrice(price.pricePerBag)}
                          <span className={`text-neutral-500 text-sm ${isLast ? "font-normal" : ""}`}>/bag</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
