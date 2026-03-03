"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthTab = "signin" | "signup";

interface AccountAuthGuardProps {
  user: User | null;
  isLoading: boolean;
  children: ReactNode;
}

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

export function AccountAuthGuard({
  user,
  isLoading,
  children,
}: AccountAuthGuardProps) {
  const [tab, setTab] = useState<AuthTab>("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpBusiness, setSignUpBusiness] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (authError) {
      setError(authError.message);
    }
    setAuthLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    if (signUpName.length < 2) {
      setError("Name must be at least 2 characters");
      setAuthLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setAuthLoading(false);
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
    } else if (data.user && !data.session) {
      // Email confirmation required — show success message
      setSignUpSuccess(true);
    }
    // If data.session exists, onAuthStateChange in useAuth will fire
    // and the guard will automatically show the children
    setAuthLoading(false);
  }

  async function handleGoogleSignIn() {
    setAuthLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (authError) {
      setError(authError.message);
      setAuthLoading(false);
    }
  }

  const inputClassName =
    "w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors";

  if (signUpSuccess) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-3">Check Your Email</h1>
          <p className="text-neutral-400 mb-2">
            We&apos;ve sent a confirmation link to
          </p>
          <p className="text-foreground font-semibold mb-6">{signUpEmail}</p>
          <p className="text-neutral-500 text-sm mb-8">
            Click the link in the email to activate your account, then come back
            here and sign in.
          </p>
          <button
            onClick={() => {
              setSignUpSuccess(false);
              setTab("signin");
              setSignInEmail(signUpEmail);
              setSignUpEmail("");
              setSignUpPassword("");
              setSignUpName("");
              setSignUpBusiness("");
            }}
            className="px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-black text-center mb-2">Your Account</h1>
      <p className="text-neutral-400 text-center mb-8">
        Sign in to view your orders and manage your account.
      </p>

      {/* Tab toggle */}
      <div className="flex bg-neutral-900 rounded-lg p-1 mb-8">
        <button
          onClick={() => {
            setTab("signin");
            setError(null);
          }}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
            tab === "signin"
              ? "bg-neutral-700 text-foreground"
              : "text-neutral-400 hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setTab("signup");
            setError(null);
          }}
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
        disabled={authLoading}
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

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
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
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </motion.form>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
      )}
    </div>
  );
}
