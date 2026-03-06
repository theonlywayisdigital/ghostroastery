"use client";

import { MapPin, PencilSimple, Star, Trash } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import type { DeliveryAddress } from "@/types/database";

interface AddressCardProps {
  address: DeliveryAddress;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

export function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
}: AddressCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} weight="duotone" className="text-white" />
          <span className="font-semibold text-foreground">{address.label}</span>
          {address.is_default && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              <Star size={12} weight="duotone" />
              Default
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-neutral-400 space-y-0.5 mb-4">
        <p>{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}</p>
        <p>{address.postal_code}</p>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-neutral-700">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-700 rounded-md transition-colors"
        >
          <PencilSimple size={14} weight="duotone" />
          Edit
        </button>
        {!address.is_default && (
          <button
            onClick={onSetDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-700 rounded-md transition-colors"
          >
            <Star size={14} weight="duotone" />
            Set as Default
          </button>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors ml-auto"
        >
          <Trash size={14} weight="duotone" />
          Delete
        </button>
      </div>
    </Card>
  );
}
