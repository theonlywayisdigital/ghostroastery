"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpinnerGap, ShoppingBag, Plus } from "@phosphor-icons/react";
import { createBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { OrderCard } from "./OrderCard";
import type { Order } from "@/types/database";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase
      .from("ghost_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerGap size={24} weight="duotone" className="animate-spin text-neutral-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
            <ShoppingBag size={40} weight="duotone" className="text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-neutral-400 mb-6">
            Start building your custom coffee brand.
          </p>
          <Link href="/build">
            <Button variant="primary">Build Your Brand</Button>
          </Link>
        </div>
      </FadeIn>
    );
  }

  // Group orders by brand name
  const brands = new Set(orders.map((o) => o.brand_name).filter(Boolean));
  const hasMiltipleBrands = brands.size > 1;

  // If multiple brands, group them; otherwise flat list
  const groupedOrders = hasMiltipleBrands
    ? Array.from(brands).map((brand) => ({
        brand: brand as string,
        orders: orders.filter((o) => o.brand_name === brand),
      }))
    : null;

  // Orders without a brand name (legacy)
  const unbrandedOrders = hasMiltipleBrands
    ? orders.filter((o) => !o.brand_name)
    : null;

  return (
    <div className="space-y-6">
      {/* Build a new brand CTA */}
      <FadeIn>
        <Link
          href="/build"
          className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-neutral-700 hover:border-accent transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Plus size={28} weight="duotone" className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
              Build a new brand →
            </p>
            <p className="text-sm text-neutral-400">
              Create a new branded coffee bag from scratch
            </p>
          </div>
        </Link>
      </FadeIn>

      {/* Grouped by brand */}
      {groupedOrders ? (
        <>
          {groupedOrders.map(({ brand, orders: brandOrders }) => (
            <div key={brand}>
              <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                {brand}
              </h3>
              <div className="space-y-4">
                {brandOrders.map((order, i) => (
                  <FadeIn key={order.id} delay={i * 0.05}>
                    <OrderCard order={order} />
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
          {unbrandedOrders && unbrandedOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 mb-3 uppercase tracking-wider">
                Other orders
              </h3>
              <div className="space-y-4">
                {unbrandedOrders.map((order, i) => (
                  <FadeIn key={order.id} delay={i * 0.05}>
                    <OrderCard order={order} />
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Flat list */
        <div className="space-y-4">
          {orders.map((order, i) => (
            <FadeIn key={order.id} delay={i * 0.05}>
              <OrderCard order={order} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
