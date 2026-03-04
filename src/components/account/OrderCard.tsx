"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronDown, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatPriceFromPounds } from "@/lib/utils";
import type { Order } from "@/types/database";

interface OrderCardProps {
  order: Order;
}

function ReorderDropdown({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div className="flex">
        <Link href={`/build?reorder=${orderId}`}>
          <Button variant="outline" size="sm" className="rounded-r-none border-r-0">
            Reorder this
          </Button>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="px-2 border border-neutral-600 rounded-r-lg hover:bg-neutral-800 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-10 overflow-hidden">
          <Link
            href={`/build?reorder=${orderId}`}
            className="block px-4 py-3 hover:bg-neutral-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            <p className="text-sm font-medium text-foreground">Reorder this</p>
            <p className="text-xs text-neutral-400">Same spec, straight to checkout</p>
          </Link>
          <Link
            href={`/build?reorder=${orderId}&start=1`}
            className="block px-4 py-3 hover:bg-neutral-700 transition-colors border-t border-neutral-700"
            onClick={() => setOpen(false)}
          >
            <p className="text-sm font-medium text-foreground">Use as a starting point</p>
            <p className="text-xs text-neutral-400">Pre-fill spec but start from Step 1</p>
          </Link>
        </div>
      )}
    </div>
  );
}

function MockupThumbnail({ order }: { order: Order }) {
  if (order.mockup_image_url) {
    return (
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
        <Image
          src={order.mockup_image_url}
          alt={`${order.brand_name || order.order_number} bag mockup`}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Placeholder for legacy orders
  return (
    <div className="w-16 h-16 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
      <Package className="w-7 h-7 text-neutral-500" />
    </div>
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const createdDate = new Date(order.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="p-5">
      <div className="flex gap-4">
        {/* Bag mockup thumbnail */}
        <MockupThumbnail order={order} />

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              {order.brand_name && (
                <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {order.brand_name}
                </p>
              )}
              <p className="font-semibold text-foreground">{order.order_number}</p>
              <p className="text-xs text-neutral-500">{createdDate}</p>
            </div>
            <OrderStatusBadge status={order.order_status || "Pending"} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <p className="text-neutral-500">Bag Size</p>
              <p className="text-foreground">{order.bag_size}</p>
            </div>
            <div>
              <p className="text-neutral-500">Roast</p>
              <p className="text-foreground">{order.roast_profile}</p>
            </div>
            <div>
              <p className="text-neutral-500">Grind</p>
              <p className="text-foreground">{order.grind}</p>
            </div>
            <div>
              <p className="text-neutral-500">Quantity</p>
              <p className="text-foreground">{`${order.quantity} bags`}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-foreground">
                {formatPriceFromPounds(order.total_price)}
              </p>
              {order.mockup_image_url && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-neutral-400 hover:text-foreground transition-colors"
                >
                  {expanded ? "Hide details" : "View details"}
                </button>
              )}
            </div>
            <ReorderDropdown orderId={order.id} />
          </div>
        </div>
      </div>

      {/* Expanded detail view */}
      {expanded && order.mockup_image_url && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-neutral-800">
              <Image
                src={order.mockup_image_url}
                alt={`${order.brand_name || order.order_number} bag mockup`}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <a
              href={order.mockup_image_url}
              download={`${order.brand_name || order.order_number}-mockup.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <Download className="w-4 h-4" />
              Download mockup
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
