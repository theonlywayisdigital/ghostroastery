"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";

type AuthTab = "signin" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
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

export function AuthModal({ open, onClose, onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpBusiness, setSignUpBusiness] = useState("");

  const supabase = useMemo(() => createBrowserClient(), []);

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
    } else {
      onAuthSuccess();
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
      setSignUpSuccess(true);
    } else if (data.session) {
      onAuthSuccess();
    }
    setAuthLoading(false);
  }

  async function handleGoogleSignIn() {
    setAuthLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setAuthLoading(false);
    }
  }

  const inputClassName =
    "w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Save your label
                  </h2>
                  <p className="text-sm text-neutral-400 mt-0.5">
                    Sign in to save labels to your profile
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {signUpSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Check Your Email</h3>
                    <p className="text-sm text-neutral-400 mb-1">
                      We&apos;ve sent a confirmation link to
                    </p>
                    <p className="text-foreground font-semibold mb-4">
                      {signUpEmail}
                    </p>
                    <button
                      onClick={() => {
                        setSignUpSuccess(false);
                        setTab("signin");
                        setSignInEmail(signUpEmail);
                      }}
                      className="px-5 py-2.5 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Tab toggle */}
                    <div className="flex bg-neutral-900 rounded-lg p-1 mb-5 mt-3">
                      <button
                        onClick={() => {
                          setTab("signin");
                          setError(null);
                        }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
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
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
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
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 mb-4"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-px bg-neutral-700" />
                      <span className="text-xs text-neutral-500">or</span>
                      <div className="flex-1 h-px bg-neutral-700" />
                    </div>

                    {/* Sign In Form */}
                    {tab === "signin" && (
                      <form onSubmit={handleSignIn} className="space-y-3">
                        <input
                          type="email"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="Email"
                          required
                          className={inputClassName}
                        />
                        <input
                          type="password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Password"
                          required
                          minLength={6}
                          className={inputClassName}
                        />
                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          {authLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </form>
                    )}

                    {/* Sign Up Form */}
                    {tab === "signup" && (
                      <form onSubmit={handleSignUp} className="space-y-3">
                        <input
                          type="text"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="Full Name"
                          required
                          minLength={2}
                          className={inputClassName}
                        />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="Email"
                          required
                          className={inputClassName}
                        />
                        <input
                          type="password"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Password"
                          required
                          minLength={6}
                          className={inputClassName}
                        />
                        <input
                          type="text"
                          value={signUpBusiness}
                          onChange={(e) => setSignUpBusiness(e.target.value)}
                          placeholder="Business Name (optional)"
                          className={inputClassName}
                        />
                        <button
                          type="submit"
                          disabled={authLoading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          {authLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </form>
                    )}

                    {error && (
                      <p className="mt-3 text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
