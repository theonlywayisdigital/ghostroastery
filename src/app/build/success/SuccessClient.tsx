"use client";

import { motion } from "framer-motion";
import { Package, Coffee, Truck, DownloadSimple } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface SuccessClientProps {
  orderNumber: string;
  bagSize: string;
  bagColour: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  pricePerBag: number;
  totalPrice: number;
  labelFileUrl: string | null;
  mockupImageUrl: string | null;
  brandName: string;
  turnaroundDays: string;
  deliveryAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
  } | null;
}

function AnimatedCheckmark() {
  return (
    <motion.div
      className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.svg
        className="w-12 h-12 text-green-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  );
}

function TimelineStep({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.15 }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <Icon size={20} weight="duotone" className="text-accent" />
        </div>
        {index < 2 && <div className="w-px h-8 bg-neutral-700 my-2" />}
      </div>
      <div className="pb-8">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
    </motion.div>
  );
}

export function SuccessClient({
  orderNumber,
  bagSize,
  bagColour,
  roastProfile,
  grind,
  quantity,
  pricePerBag,
  totalPrice,
  labelFileUrl,
  mockupImageUrl,
  brandName,
  turnaroundDays,
  deliveryAddress,
}: SuccessClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
        {/* Success header */}
        <div className="text-center mb-12">
          <AnimatedCheckmark />
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Order confirmed!
          </motion.h1>
          <motion.p
            className="mt-4 text-neutral-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order number:{" "}
            <span className="font-mono text-foreground">{orderNumber}</span>
          </motion.p>
          <motion.p
            className="mt-2 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {`A confirmation email has been sent to your inbox.`}
          </motion.p>
        </div>

        {/* Bag mockup preview */}
        {mockupImageUrl && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden bg-neutral-800 shadow-2xl">
              <Image
                src={mockupImageUrl}
                alt={`${brandName || orderNumber} bag mockup`}
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>
            <a
              href={mockupImageUrl}
              download={`${brandName || orderNumber}-mockup.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 text-sm text-accent hover:underline"
            >
              <DownloadSimple size={16} weight="duotone" />
              Download your mockup
            </a>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order summary */}
          <motion.div
            className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-foreground mb-4">
              Order Details
            </h3>

            <div className="space-y-2 text-sm">
              {brandName && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Brand</span>
                  <span className="text-foreground">{brandName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-400">Bag Size</span>
                <span className="text-foreground">{bagSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Colour</span>
                <span className="text-foreground">{bagColour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Flavour Profile</span>
                <span className="text-foreground">{roastProfile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Grind</span>
                <span className="text-foreground">{grind}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Quantity</span>
                <span className="text-foreground">{quantity} bags</span>
              </div>
              {labelFileUrl && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Label</span>
                  <span className="text-foreground">Uploaded</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-700">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-400">
                  {quantity} × £{pricePerBag.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery address */}
            {deliveryAddress && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Delivery Address
                </h4>
                <div className="text-sm text-neutral-400 leading-relaxed">
                  <p>{deliveryAddress.name}</p>
                  <p>{deliveryAddress.line1}</p>
                  {deliveryAddress.line2 && <p>{deliveryAddress.line2}</p>}
                  <p>{deliveryAddress.city}</p>
                  <p>{deliveryAddress.postalCode}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-foreground mb-6">
              What happens next
            </h3>

            <TimelineStep
              icon={Package}
              title="We receive your order and label file"
              description="Our team reviews your specifications and prepares your order"
              index={0}
            />
            <TimelineStep
              icon={Coffee}
              title="Your coffee is roasted fresh to your profile"
              description="Small-batch roasted to your exact specifications"
              index={1}
            />
            <TimelineStep
              icon={Truck}
              title="Packed and shipped to your door"
              description="Carefully packaged with your custom labels applied"
              index={2}
            />

            <motion.div
              className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm font-medium text-foreground">
                Estimated turnaround
              </p>
              <p className="text-2xl font-bold text-accent mt-1">
                {turnaroundDays}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <a
            href={`${process.env.NEXT_PUBLIC_PORTAL_URL || ""}/my-orders`}
            className="px-8 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Go to my account
          </a>
          <Link
            href="/build"
            className="px-8 py-4 border border-neutral-700 text-foreground rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Start a new order
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
