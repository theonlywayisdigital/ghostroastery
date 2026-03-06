"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  wholesaleEnquirySchema,
  WholesaleEnquiryInput,
  businessTypeOptions,
  volumeOptions,
  bagSizeOptions,
  brandedOptions,
} from "@/lib/validation";
import { CheckCircle } from "@phosphor-icons/react";

export function WholesaleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WholesaleEnquiryInput>({
    resolver: zodResolver(wholesaleEnquirySchema),
  });

  const onSubmit = async (data: WholesaleEnquiryInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/wholesale-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setIsSuccess(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <FadeIn>
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
          <CheckCircle size={56} weight="duotone" className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thanks for your enquiry</h3>
          <p className="text-neutral-300">
            We&apos;ll be in touch within 2 business days.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          label="Full name"
          placeholder="Your name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="businessName"
          label="Business name"
          placeholder="Your business"
          required
          error={errors.businessName?.message}
          {...register("businessName")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          id="businessType"
          label="Business type"
          placeholder="Select type"
          required
          options={businessTypeOptions}
          error={errors.businessType?.message}
          {...register("businessType")}
        />
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="you@business.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="Optional"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          id="estimatedVolume"
          label="Estimated monthly volume"
          placeholder="Select volume"
          required
          options={volumeOptions}
          error={errors.estimatedVolume?.message}
          {...register("estimatedVolume")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          id="bagSizePreference"
          label="Bag size preference"
          placeholder="Select size"
          required
          options={bagSizeOptions}
          error={errors.bagSizePreference?.message}
          {...register("bagSizePreference")}
        />
        <Select
          id="branded"
          label="Branded or unbranded"
          placeholder="Select option"
          required
          options={brandedOptions}
          error={errors.branded?.message}
          {...register("branded")}
        />
      </div>

      <Textarea
        id="message"
        label="Tell us about your order"
        placeholder="Any specific requirements, timelines, or questions?"
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Send Enquiry
      </Button>
    </form>
  );
}
