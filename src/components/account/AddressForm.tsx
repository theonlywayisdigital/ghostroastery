"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addressSchema, type AddressInput } from "@/lib/validation";
import type { DeliveryAddress } from "@/types/database";

interface AddressFormProps {
  address?: DeliveryAddress;
  onSave: (data: AddressInput) => Promise<void>;
  onCancel: () => void;
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          label: address.label,
          name: address.name,
          line1: address.line1,
          line2: address.line2 || "",
          city: address.city,
          postal_code: address.postal_code,
          country: address.country,
        }
      : { country: "GB" },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input
        label="Label"
        placeholder='e.g. "Office", "Warehouse"'
        error={errors.label?.message}
        {...register("label")}
      />
      <Input
        label="Recipient Name"
        placeholder="John Smith"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Address Line 1"
        placeholder="123 High Street"
        error={errors.line1?.message}
        {...register("line1")}
      />
      <Input
        label="Address Line 2"
        placeholder="Flat 4 (optional)"
        error={errors.line2?.message}
        {...register("line2")}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="London"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Postcode"
          placeholder="SW1A 1AA"
          error={errors.postal_code?.message}
          {...register("postal_code")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
          {address ? "Save Changes" : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
