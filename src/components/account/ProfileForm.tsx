"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerGap } from "@phosphor-icons/react";
import { createBrowserClient } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { useToast } from "@/components/ui/Toast";
import {
  profileUpdateSchema,
  changePasswordSchema,
  type ProfileUpdateInput,
} from "@/lib/validation";
import type { User } from "@supabase/supabase-js";
import type { User as DbUser } from "@/types/database";

interface ProfileFormProps {
  user: User;
  profile: DbUser | null;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { toast } = useToast();
  const isGoogleUser = user.app_metadata?.provider === "google";

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      business_name: profile?.business_name || "",
    },
  });

  // Reset form when profile loads
  useEffect(() => {
    if (profile) {
      resetProfile({
        full_name: profile.full_name || "",
        business_name: profile.business_name || "",
      });
    }
  }, [profile, resetProfile]);

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword,
  } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onProfileSave(data: ProfileUpdateInput) {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("users")
      .update({
        full_name: data.full_name,
        business_name: data.business_name || null,
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Failed to update profile", variant: "error" });
      return;
    }
    toast({ title: "Profile updated", variant: "success" });
  }

  async function onPasswordChange(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const supabase = createBrowserClient();

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: data.currentPassword,
    });

    if (signInError) {
      toast({
        title: "Current password is incorrect",
        variant: "error",
      });
      return;
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (updateError) {
      toast({ title: "Failed to change password", variant: "error" });
      return;
    }

    toast({ title: "Password changed successfully", variant: "success" });
    resetPassword();
  }

  return (
    <div className="space-y-8 max-w-lg">
      {/* Profile Details */}
      <FadeIn>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
          <form
            onSubmit={handleProfileSubmit(onProfileSave)}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              error={profileErrors.full_name?.message}
              {...registerProfile("full_name")}
            />
            <Input
              label="Business Name"
              placeholder="Optional"
              error={profileErrors.business_name?.message}
              {...registerProfile("business_name")}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Email cannot be changed
              </p>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={profileSubmitting}
            >
              Save Changes
            </Button>
          </form>
        </Card>
      </FadeIn>

      {/* Change Password — hidden for Google OAuth users */}
      {!isGoogleUser && (
        <FadeIn delay={0.1}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form
              onSubmit={handlePasswordSubmit(onPasswordChange)}
              className="space-y-4"
            >
              <Input
                type="password"
                label="Current Password"
                error={passwordErrors.currentPassword?.message}
                {...registerPassword("currentPassword")}
              />
              <Input
                type="password"
                label="New Password"
                error={passwordErrors.newPassword?.message}
                {...registerPassword("newPassword")}
              />
              <Input
                type="password"
                label="Confirm New Password"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword("confirmPassword")}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={passwordSubmitting}
              >
                Change Password
              </Button>
            </form>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
