"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";

interface TemplateEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateEmailModal({ open, onClose }: TemplateEmailModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/label/template-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      // Trigger the download
      const link = document.createElement("a");
      link.href = "/api/label/download-template";
      link.download = "ghost-roastery-label-template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close the modal
      onClose();
      setEmail("");
      setName("");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

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
              className="w-full max-w-sm bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Download Template
                  </h2>
                  <p className="text-sm text-neutral-400 mt-0.5">
                    Enter your email to get the blank label template
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 pb-5 pt-3 space-y-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">
                    Name <span className="text-neutral-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputClassName}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-neutral-900 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {submitting ? "Downloading..." : "Download Template"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
