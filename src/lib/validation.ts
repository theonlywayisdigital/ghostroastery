import { z } from "zod";

// Wholesale enquiry form schema
export const wholesaleEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.enum([
    "cafe",
    "gym",
    "office",
    "restaurant",
    "wellness",
    "entrepreneur",
    "other",
  ]),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  estimatedVolume: z.enum(["150-300", "300-500", "500-1000", "1000+"]),
  bagSizePreference: z.enum(["250g", "500g", "1kg", "mixed"]),
  branded: z.enum(["branded", "unbranded", "not-sure"]),
  message: z.string().optional(),
});

export type WholesaleEnquiryInput = z.infer<typeof wholesaleEnquirySchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.enum([
    "general",
    "bespoke",
    "wholesale",
    "press",
    "other",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Checkout order validation (server-side)
export const checkoutOrderSchema = z.object({
  bagSize: z.enum(["250g", "500g"]),
  bagColour: z.string().min(1, "Bag colour is required"),
  roastProfile: z.string().min(1, "Roast profile is required"),
  grind: z.string().min(1, "Grind option is required"),
  quantity: z.number().int().min(10).max(100),
});

export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;

// Subject options for contact form
export const subjectOptions = [
  { value: "general", label: "General enquiry" },
  { value: "bespoke", label: "Bespoke order question" },
  { value: "wholesale", label: "Wholesale question" },
  { value: "press", label: "Press & partnerships" },
  { value: "other", label: "Other" },
];

// Business type options for wholesale form
export const businessTypeOptions = [
  { value: "cafe", label: "Cafe / Coffee Shop" },
  { value: "gym", label: "Gym & Fitness" },
  { value: "office", label: "Office & Corporate" },
  { value: "restaurant", label: "Restaurant" },
  { value: "wellness", label: "Wellness Brand" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "other", label: "Other" },
];

// Volume options for wholesale form
export const volumeOptions = [
  { value: "150-300", label: "150–300 bags" },
  { value: "300-500", label: "300–500 bags" },
  { value: "500-1000", label: "500–1000 bags" },
  { value: "1000+", label: "1000+ bags" },
];

// Bag size options
export const bagSizeOptions = [
  { value: "250g", label: "250g" },
  { value: "500g", label: "500g" },
  { value: "1kg", label: "1kg" },
  { value: "mixed", label: "Mixed" },
];

// Branded options
export const brandedOptions = [
  { value: "branded", label: "Branded" },
  { value: "unbranded", label: "Unbranded" },
  { value: "not-sure", label: "Not sure yet" },
];

// ============================================
// ACCOUNT SCHEMAS
// ============================================

// Delivery address schema
export const addressSchema = z.object({
  label: z.string().min(1, "Label is required").max(50, "Label is too long"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal_code: z
    .string()
    .regex(
      /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      "Please enter a valid UK postcode"
    ),
  country: z.string().min(1, "Country is required"),
});

export type AddressInput = z.infer<typeof addressSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  business_name: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
