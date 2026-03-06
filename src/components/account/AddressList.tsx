"use client";

import { useEffect, useState, useCallback } from "react";
import { SpinnerGap, MapPin, Plus } from "@phosphor-icons/react";
import { createBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import type { DeliveryAddress } from "@/types/database";
import type { AddressInput } from "@/lib/validation";

export function AddressList() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAddresses = useCallback(async () => {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("delivery_addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  async function handleSave(data: AddressInput) {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingAddress) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("delivery_addresses") as any)
        .update({
          label: data.label,
          name: data.name,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
        })
        .eq("id", editingAddress.id);

      if (error) {
        toast({ title: "Failed to update address", variant: "error" });
        return;
      }
      toast({ title: "Address updated", variant: "success" });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("delivery_addresses") as any).insert({
        user_id: user.id,
        label: data.label,
        name: data.name,
        line1: data.line1,
        line2: data.line2 || null,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        is_default: addresses.length === 0,
      });

      if (error) {
        toast({
          title: error.message.includes("Maximum")
            ? "Maximum 5 addresses allowed"
            : "Failed to add address",
          variant: "error",
        });
        return;
      }
      toast({ title: "Address added", variant: "success" });
    }

    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  }

  async function handleSetDefault(id: string) {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("delivery_addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to set default", variant: "error" });
      return;
    }
    toast({ title: "Default address updated", variant: "success" });
    fetchAddresses();
  }

  async function handleDelete() {
    if (!deletingId) return;
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("delivery_addresses")
      .delete()
      .eq("id", deletingId);

    if (error) {
      toast({ title: "Failed to delete address", variant: "error" });
    } else {
      toast({ title: "Address deleted", variant: "success" });
      fetchAddresses();
    }
    setDeletingId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerGap size={24} weight="duotone" className="animate-spin text-neutral-500" />
      </div>
    );
  }

  if (showForm || editingAddress) {
    return (
      <FadeIn direction="none">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddress ? "Edit Address" : "Add Address"}
          </h3>
          <AddressForm
            address={editingAddress || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      </FadeIn>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          {`${addresses.length} of 5 addresses used`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
          disabled={addresses.length >= 5}
          className="flex items-center gap-2"
        >
          <Plus size={20} weight="duotone" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <FadeIn>
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
              <MapPin size={40} weight="duotone" className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
            <p className="text-neutral-400 mb-6">
              Add a delivery address for faster checkout.
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Add Your First Address
            </Button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, i) => (
            <FadeIn key={address.id} delay={i * 0.05}>
              <AddressCard
                address={address}
                onEdit={() => setEditingAddress(address)}
                onSetDefault={() => handleSetDefault(address.id)}
                onDelete={() => setDeletingId(address.id)}
              />
            </FadeIn>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete address"
        description="Are you sure you want to delete this delivery address? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="danger"
      />
    </>
  );
}
