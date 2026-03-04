"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { createBrowserClient } from "@/lib/supabase";

type AuthTab = "signin" | "signup";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function Step8Auth() {
  const { state, dispatch, user } = useBuilder();
  const [tab, setTab] = useState<AuthTab>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpBusiness, setSignUpBusiness] = useState("");

  // Address fields (collected during signup)
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostcode, setAddressPostcode] = useState("");

  const supabase = createBrowserClient();

  async function proceedToCheckout(email: string, userId?: string) {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("brandName", state.brandName);
      formData.append("bagSize", state.bagSize || "");
      formData.append("bagSizeName", state.bagSizeName || "");
      formData.append("bagColour", state.bagColourName || "");
      formData.append("roastProfile", state.roastProfileName || "");
      formData.append("roastProfileSlug", state.roastProfile || "");
      formData.append("grind", state.grindName || "");
      formData.append("grindId", state.grind || "");
      formData.append("quantity", String(state.quantity));
      formData.append("pricePerBag", String(state.pricePerBag || 0));
      formData.append("totalPrice", String(state.totalPrice || 0));
      formData.append("customerEmail", email);
      if (userId) formData.append("userId", userId);
      if (state.labelFile) {
        formData.append("labelFile", state.labelFile);
      } else if (state.labelPdfUrl) {
        formData.append("labelPdfUrl", state.labelPdfUrl);
      }
      if (state.savedLabelId) {
        formData.append("labelId", state.savedLabelId);
      }
      if (state.labelPreviewUrl) {
        formData.append("labelPreviewUrl", state.labelPreviewUrl);
      }

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  // If user is already signed in (e.g. came back from Stripe cancel), proceed
  // This is handled by Step7Summary skipping to checkout directly
  // But if they land here somehow while signed in, show a proceed button
  if (user) {
    return (
      <div>
        <StepHeading
          heading="You're signed in."
          subheading={`Signed in as ${user.email}`}
        />
        <div className="max-w-md mx-auto">
          <motion.button
            onClick={() => proceedToCheckout(user.email!, user.id)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to checkout…
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </motion.button>
          {error && (
            <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => dispatch({ type: "PREV_STEP" })}
              className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      await proceedToCheckout(data.user.email!, data.user.id);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signUpName.length < 2) {
      setError("Name must be at least 2 characters");
      setIsLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!addressLine1.trim() || !addressCity.trim() || !addressPostcode.trim()) {
      setError("Please fill in your delivery address");
      setIsLoading(false);
      return;
    }

    // UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(addressPostcode.trim())) {
      setError("Please enter a valid UK postcode");
      setIsLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          full_name: signUpName,
          business_name: signUpBusiness || undefined,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      // Save delivery address as default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("delivery_addresses") as any).insert({
        user_id: data.user.id,
        label: "Default",
        name: signUpName,
        line1: addressLine1.trim(),
        line2: addressLine2.trim() || null,
        city: addressCity.trim(),
        postal_code: addressPostcode.trim().toUpperCase(),
        country: "GB",
        is_default: true,
      });

      await proceedToCheckout(data.user.email!, data.user.id);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/build?step=8`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    }
  }

  async function handleGuestCheckout() {
    // For guest checkout, we still need an email from the Stripe session
    // So we redirect directly — Stripe will collect the email
    await proceedToCheckout("guest@checkout.pending");
  }

  const inputClassName =
    "w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="pb-24">
      <StepHeading
        heading="Almost there."
        subheading="Save your order to your account."
      />

      <div className="max-w-md mx-auto">
        {/* Tab toggle */}
        <div className="flex bg-neutral-900 rounded-lg p-1 mb-8">
          <button
            onClick={() => { setTab("signin"); setError(null); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              tab === "signin"
                ? "bg-neutral-700 text-foreground"
                : "text-neutral-400 hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); setError(null); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
              tab === "signup"
                ? "bg-neutral-700 text-foreground"
                : "text-neutral-400 hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 mb-6"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-neutral-700" />
          <span className="text-sm text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-700" />
        </div>

        {/* Sign In Form */}
        {tab === "signin" && (
          <motion.form
            onSubmit={handleSignIn}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="signin"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputClassName}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>
        )}

        {/* Sign Up Form */}
        {tab === "signup" && (
          <motion.form
            onSubmit={handleSignUp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="signup"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="John Smith"
                  required
                  minLength={2}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Business Name{" "}
                  <span className="text-neutral-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={signUpBusiness}
                  onChange={(e) => setSignUpBusiness(e.target.value)}
                  placeholder="Your Coffee Co."
                  className={inputClassName}
                />
              </div>

              {/* Delivery address section */}
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm font-medium text-foreground mb-3">
                  Delivery Address
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="123 High Street"
                      required
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">
                      Address Line 2{" "}
                      <span className="text-neutral-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Flat 2, Building Name"
                      className={inputClassName}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        placeholder="London"
                        required
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={addressPostcode}
                        onChange={(e) => setAddressPostcode(e.target.value)}
                        placeholder="SW1A 1AA"
                        required
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.form>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Guest checkout link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGuestCheckout}
            disabled={isLoading}
            className="text-sm text-neutral-400 hover:text-foreground underline underline-offset-4 transition-colors disabled:opacity-50"
          >
            Continue as guest
          </button>
        </div>
      </div>

      {/* Back navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
