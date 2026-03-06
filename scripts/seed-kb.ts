import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Supabase URL:", supabaseUrl);
console.log("Service key loaded:", supabaseServiceKey ? "Yes" : "No");

// ── Types ─────────────────────────────────────────────────────

interface CategorySeed {
  name: string;
  slug: string;
  audience: string[];
  sort_order: number;
  is_active: boolean;
}

interface ArticleSeed {
  title: string;
  slug: string;
  type: "faq" | "guide" | "tutorial";
  audience: string[];
  content: string;
  excerpt: string;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  sort_order: number;
  category_slug: string; // resolved to category_id at insert time
}

// ── Categories ────────────────────────────────────────────────

const categories: CategorySeed[] = [
  { name: "Getting Started", slug: "getting-started", audience: ["customer", "roaster"], sort_order: 1, is_active: true },
  { name: "Orders & Fulfilment", slug: "orders-fulfilment", audience: ["customer", "roaster"], sort_order: 2, is_active: true },
  { name: "Products & Catalogue", slug: "products-catalogue", audience: ["roaster"], sort_order: 3, is_active: true },
  { name: "Storefront", slug: "storefront", audience: ["roaster"], sort_order: 4, is_active: true },
  { name: "Wholesale", slug: "wholesale", audience: ["customer", "roaster"], sort_order: 5, is_active: true },
  { name: "Marketing", slug: "marketing", audience: ["roaster"], sort_order: 6, is_active: true },
  { name: "Website Builder", slug: "website-builder", audience: ["roaster"], sort_order: 7, is_active: true },
  { name: "Billing & Subscriptions", slug: "billing-subscriptions", audience: ["roaster"], sort_order: 8, is_active: true },
  { name: "Account & Security", slug: "account-security", audience: ["customer", "roaster"], sort_order: 9, is_active: true },
  { name: "Support", slug: "support", audience: ["customer", "roaster"], sort_order: 10, is_active: true },
  { name: "Branding & Labels", slug: "branding-labels", audience: ["customer"], sort_order: 11, is_active: true },
  { name: "Contacts & CRM", slug: "contacts-crm", audience: ["roaster"], sort_order: 12, is_active: true },
];

// ── Articles ──────────────────────────────────────────────────

const articles: ArticleSeed[] = [
  // ─── Getting Started (customer, roaster) ────────────────────
  {
    title: "How to create an account",
    slug: "how-to-create-an-account",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    tags: ["account", "register", "sign up", "onboarding"],
    excerpt: "Learn how to create your Ghost Roastery account and get started on the platform.",
    content: `Creating an account on Ghost Roastery is quick and straightforward. Follow these steps to get started.

## Steps

1. **Go to the registration page** — Visit the Ghost Roastery website and click the **Sign Up** button in the top navigation bar.
2. **Choose your account type** — Select whether you are signing up as a **Customer** (looking to order custom-branded coffee) or a **Roaster** (offering roasting services).
3. **Enter your details** — Fill in your full name, email address, and choose a strong password.
4. **Accept the terms** — Read and accept the Terms of Service and Privacy Policy.
5. **Click Create Account** — Submit the form to create your account.
6. **Verify your email** — Check your inbox for a verification email and click the link to activate your account.

## Tips

- Use a business email address for better credibility, especially if you are signing up as a roaster.
- Your password must be at least 8 characters long and include a mix of letters and numbers.
- If you don't receive the verification email, check your spam or junk folder.`,
  },
  {
    title: "How to verify your email address",
    slug: "how-to-verify-your-email",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["email", "verification", "activate", "confirm"],
    excerpt: "Verify your email address to activate your account and access all platform features.",
    content: `Email verification is required to access your Ghost Roastery account. Here's how to complete the process.

## Steps

1. **Check your inbox** — After signing up, look for an email from Ghost Roastery with the subject line "Confirm your email address".
2. **Click the verification link** — Open the email and click the **Verify Email** button or link.
3. **You're verified** — You will be redirected to the platform and can now log in with full access.

## If you didn't receive the email

1. **Check spam/junk folders** — Verification emails sometimes end up in spam.
2. **Resend the verification** — Go to the login page, enter your credentials, and click **Resend verification email** if prompted.
3. **Check your email address** — Make sure you signed up with the correct email. If you made a typo, you will need to create a new account.

## Tips

- Verification links expire after 24 hours. If yours has expired, request a new one from the login page.
- Add noreply@ghostroastery.com to your contacts to prevent future emails from going to spam.`,
  },
  {
    title: "How to log in",
    slug: "how-to-log-in",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["login", "sign in", "access", "credentials"],
    excerpt: "Log in to your Ghost Roastery account to access the dashboard and manage your orders.",
    content: `Access your Ghost Roastery account by logging in with your email and password.

## Steps

1. **Go to the login page** — Click **Log In** in the top navigation bar on the Ghost Roastery website.
2. **Enter your email** — Type the email address you used when creating your account.
3. **Enter your password** — Type your password carefully.
4. **Click Log In** — Press the login button to access your dashboard.

## If you have two-factor authentication enabled

1. **Enter your 2FA code** — After entering your email and password, you will be prompted to enter a 6-digit code from your authenticator app.
2. **Click Verify** — Submit the code to complete login.

## Tips

- If you have forgotten your password, click **Forgot password?** on the login page to reset it.
- For security, your account will be temporarily locked after multiple failed login attempts.`,
  },
  {
    title: "How to reset your password",
    slug: "how-to-reset-your-password",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["password", "reset", "forgot", "recovery"],
    excerpt: "Reset your password if you've forgotten it or need to change it for security reasons.",
    content: `If you have forgotten your password or need to reset it, follow these steps.

## Steps

1. **Go to the login page** — Navigate to the Ghost Roastery login page.
2. **Click Forgot password** — Below the password field, click the **Forgot password?** link.
3. **Enter your email** — Type the email address associated with your account.
4. **Click Send reset link** — A password reset email will be sent to your inbox.
5. **Check your email** — Open the reset email and click the **Reset Password** link.
6. **Choose a new password** — Enter your new password and confirm it.
7. **Click Save** — Your password has been updated. You can now log in with your new password.

## Tips

- Choose a strong password with at least 8 characters, including uppercase, lowercase, and numbers.
- The reset link expires after 1 hour. If it has expired, request a new one.
- If you still cannot access your account, contact support for assistance.`,
  },
  {
    title: "Understanding the dashboard",
    slug: "understanding-the-dashboard",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: true,
    sort_order: 5,
    tags: ["dashboard", "overview", "home", "navigation"],
    excerpt: "Get familiar with your Ghost Roastery dashboard and learn what each section does.",
    content: `The dashboard is your home base on Ghost Roastery. It gives you a quick overview of your activity and quick access to key features.

## For Customers

Your customer dashboard shows:

- **Recent Orders** — Your most recent orders and their current statuses.
- **My Brands** — Quick access to your coffee brands and saved label designs.
- **Quick Actions** — Shortcuts to place a new order, browse roasters, or contact support.
- **Notifications** — Recent updates about your orders and account.

## For Roasters

Your roaster dashboard shows:

- **Order Summary** — Overview of pending, in-progress, and completed orders.
- **Revenue Overview** — Quick stats on your earnings and payouts.
- **Recent Activity** — Latest orders, messages, and platform updates.
- **Quick Actions** — Shortcuts to manage products, view orders, or update your storefront.
- **Performance Metrics** — Key stats like order completion rate and average delivery time.

## Tips

- The dashboard refreshes automatically to show the latest data.
- Use the sidebar navigation to access all platform features.
- Click on any order or notification to view its full details.`,
  },
  {
    title: "Navigating the platform",
    slug: "navigating-the-platform",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "getting-started",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["navigation", "sidebar", "menu", "layout"],
    excerpt: "Learn how to navigate the Ghost Roastery platform using the sidebar and main menu.",
    content: `Ghost Roastery uses a sidebar navigation layout to give you quick access to all features.

## Sidebar Navigation

The sidebar on the left side of the screen is your main navigation tool. It contains links to all major sections of the platform.

### For Customers

- **Dashboard** — Your home page with an activity overview.
- **My Orders** — View and track all your orders.
- **My Brands** — Manage your coffee brands and label designs.
- **Wholesale** — Browse wholesale suppliers and catalogues.
- **Support** — Access help articles and submit support tickets.
- **Settings** — Manage your profile, security, and notifications.

### For Roasters

- **Dashboard** — Your home page with order and revenue overview.
- **Orders** — Manage incoming and outgoing orders.
- **Products** — Manage your product catalogue.
- **Storefront** — Customise your online storefront.
- **Wholesale** — Manage wholesale buyers and pricing.
- **Marketing** — Email campaigns, social media, automations, and more.
- **Website** — Build and manage your website.
- **Contacts** — Manage your customer and business contacts.
- **Support** — Access help and support tickets.
- **Settings** — Profile, billing, team, and security settings.

## Tips

- On mobile, tap the hamburger menu icon to open the sidebar.
- The sidebar highlights the section you are currently viewing.
- Use keyboard shortcuts where available for faster navigation.`,
  },

  // ─── Orders & Fulfilment ────────────────────────────────────
  {
    title: "How to view your orders",
    slug: "how-to-view-your-orders",
    type: "guide",
    audience: ["customer"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    tags: ["orders", "view", "history", "my orders"],
    excerpt: "View all your orders in one place, including order details, statuses, and tracking information.",
    content: `The My Orders page shows all your orders across the platform — including Ghost Roastery orders and wholesale orders.

## Steps

1. **Open the sidebar** — Click on **My Orders** in the left sidebar navigation.
2. **Browse your orders** — You will see a list of all your orders, with the most recent at the top.
3. **Filter orders** — Use the filter bar to narrow orders by status, date range, or order type.
4. **View order details** — Click on any order to see its full details, including items, delivery address, tracking, and status history.

## Order Information

Each order card shows:

- **Order number** — A unique reference for the order.
- **Order date** — When the order was placed.
- **Status** — The current status of the order (e.g. Pending, Processing, Dispatched, Delivered).
- **Total** — The total order value.
- **Order type** — Whether it is a Ghost Roastery order, storefront order, or wholesale order.

## Tips

- Use the search bar to find a specific order by its order number.
- Click on the status badge to understand what each status means.
- You can view both active and past orders from the same page.`,
  },
  {
    title: "How to track an order",
    slug: "how-to-track-an-order",
    type: "guide",
    audience: ["customer"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["tracking", "delivery", "shipment", "status"],
    excerpt: "Track your order from placement to delivery with real-time status updates.",
    content: `Once your order has been dispatched, you can track its delivery progress.

## Steps

1. **Go to My Orders** — Open the sidebar and click **My Orders**.
2. **Find your order** — Locate the order you want to track. Dispatched orders will show a **Track** option.
3. **View tracking details** — Click on the order to open its detail page. The tracking section shows the courier, tracking number, and a link to track the shipment.
4. **Click the tracking link** — This will open the courier's website where you can see real-time delivery updates.

## Order Status Timeline

Your order goes through these stages:

- **Pending** — Order received, awaiting confirmation.
- **Processing** — Order is being prepared by the roaster.
- **Dispatched** — Order has been shipped. Tracking information is available.
- **Delivered** — Order has been delivered to the provided address.

## Tips

- You will receive an email notification when your order is dispatched with tracking details.
- If tracking information is not available yet, the roaster may still be preparing the shipment.
- Contact support if your order shows as delivered but you have not received it.`,
  },
  {
    title: "How to cancel an order",
    slug: "how-to-cancel-an-order",
    type: "guide",
    audience: ["customer"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["cancel", "refund", "order cancellation"],
    excerpt: "Learn how to request an order cancellation and understand the cancellation policy.",
    content: `You may be able to cancel an order depending on its current status.

## Steps

1. **Go to My Orders** — Open the sidebar and click **My Orders**.
2. **Find the order** — Locate the order you wish to cancel.
3. **Open order details** — Click on the order to view its detail page.
4. **Request cancellation** — If the order is still in a cancellable state (typically Pending or Artwork Review), you will see a **Request Cancellation** option.
5. **Confirm your request** — Provide a reason for cancellation and confirm.

## Cancellation Policy

- **Pending orders** — Can usually be cancelled without issue.
- **Orders in production** — Once an order has entered production, cancellation may not be possible. You can still request it, but it will be reviewed by the roaster.
- **Dispatched orders** — Cannot be cancelled as the order is already in transit.

## Tips

- Cancel as early as possible for the best chance of a full refund.
- If you cannot cancel online, contact support and they can assist.
- Refunds are processed back to the original payment method and may take 5-10 business days.`,
  },
  {
    title: "Managing orders as a roaster",
    slug: "managing-orders-as-a-roaster",
    type: "guide",
    audience: ["roaster"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["orders", "manage", "roaster", "fulfilment", "production"],
    excerpt: "Learn how to view, manage, and fulfil orders as a roaster on the platform.",
    content: `As a roaster, you can manage all your incoming orders from the Orders section of your dashboard.

## Steps

1. **Go to Orders** — Click **Orders** in the sidebar navigation.
2. **View your order list** — All orders assigned to you are displayed, sorted by most recent.
3. **Filter and search** — Use the filter bar to view orders by status, date, or order type.
4. **Open an order** — Click on any order to see full details including items, customer information, delivery address, and status history.

## Processing an Order

1. **Review the order** — Check the items, quantities, and any special instructions.
2. **Update the status** — Progress the order through statuses as you work on it (e.g. from Accepted to In Production to Processing).
3. **Print labels** — If applicable, print shipping labels from the order detail page.
4. **Dispatch the order** — Once packed and ready, mark the order as Dispatched and add tracking information.

## Tips

- Keep order statuses up to date so customers can track their order progress.
- Use the activity timeline on each order to add notes or communicate with the admin team.
- Orders that require artwork review will show artwork files that need your approval before production.`,
  },
  {
    title: "Understanding order statuses",
    slug: "understanding-order-statuses",
    type: "faq",
    audience: ["customer", "roaster"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["status", "order status", "pending", "dispatched", "delivered"],
    excerpt: "A breakdown of all order statuses and what each one means for your order.",
    content: `Every order on Ghost Roastery has a status that tells you where it is in the fulfilment process.

## Ghost Roastery Order Statuses

| Status | Meaning |
|--------|---------|
| **Pending** | Order has been placed and is awaiting review. |
| **Artwork Review** | Label artwork is being reviewed for quality and compliance. |
| **Approved** | Artwork and order have been approved. Ready for allocation. |
| **Allocated** | Order has been assigned to a roasting partner. |
| **Accepted** | The roasting partner has accepted the order. |
| **In Production** | Coffee is being roasted and packaged. |
| **Processing** | Order is being prepared for shipment. |
| **Dispatched** | Order has been shipped. Tracking information is available. |
| **Delivered** | Order has been delivered to the customer. |
| **Cancelled** | Order has been cancelled. |
| **Disputed** | A dispute has been raised on the order. |

## Storefront & Wholesale Order Statuses

| Status | Meaning |
|--------|---------|
| **Pending** | Order placed, awaiting payment confirmation. |
| **Paid** | Payment confirmed. |
| **Confirmed** | Order confirmed by the roaster. |
| **Processing** | Order is being prepared. |
| **Dispatched** | Order shipped with tracking. |
| **Delivered** | Order delivered. |
| **Cancelled** | Order cancelled. |

## Tips

- You will receive email notifications as your order moves through each status.
- If an order is stuck on one status for an extended period, contact support for assistance.`,
  },
  {
    title: "Order types explained",
    slug: "order-types-explained",
    type: "faq",
    audience: ["customer", "roaster"],
    category_slug: "orders-fulfilment",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["order type", "ghost roastery", "storefront", "wholesale"],
    excerpt: "Understand the different types of orders on the platform and how they work.",
    content: `Ghost Roastery supports several order types, each with a different workflow.

## Ghost Roastery Orders

These are orders placed through the main Ghost Roastery platform for custom-branded coffee. They go through a full workflow including artwork review, partner allocation, and production.

**Key features:**
- Custom label artwork and branding
- Allocated to a roasting partner
- Full fulfilment pipeline with artwork review

## Storefront Orders

These are orders placed through a roaster's online storefront. Customers buy directly from the roaster's branded shop.

**Key features:**
- Placed via the roaster's storefront or embedded shop
- Managed directly by the roaster
- Standard e-commerce fulfilment flow

## Wholesale Orders

These are bulk orders placed by approved wholesale buyers from a roaster's wholesale catalogue.

**Key features:**
- Require wholesale access approval
- May have tiered pricing and payment terms
- Larger quantities at wholesale prices

## Tips

- As a customer, you can identify the order type by the badge shown on each order card.
- As a roaster, each order type has its own section in your Orders dashboard for easy management.`,
  },

  // ─── Products & Catalogue (roaster) ─────────────────────────
  {
    title: "How to add a new product",
    slug: "how-to-add-a-new-product",
    type: "guide",
    audience: ["roaster"],
    category_slug: "products-catalogue",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    tags: ["product", "add", "create", "catalogue", "coffee"],
    excerpt: "Add a new product to your catalogue so customers can discover and order your coffee.",
    content: `Adding products to your catalogue makes them available on your storefront and wholesale channels.

## Steps

1. **Go to Products** — Click **Products** in the sidebar navigation.
2. **Click Add Product** — Click the **Add Product** button in the top right corner.
3. **Enter product details** — Fill in the product name, description, and category.
4. **Set pricing** — Enter the retail price and optionally set wholesale pricing tiers.
5. **Add images** — Upload one or more product images. The first image will be used as the main product photo.
6. **Configure options** — Set available sizes, grind options, and roast profiles if applicable.
7. **Set inventory** — Enter stock quantities or mark as unlimited.
8. **Publish** — Toggle the product to **Active** and click **Save** to publish it to your catalogue.

## Tips

- Write detailed product descriptions that highlight flavour notes, origin, and roast level.
- Use high-quality product images — they make a significant difference in sales.
- Products must be active to appear on your storefront and in wholesale catalogues.
- You can save a product as a draft and publish it later.`,
  },
  {
    title: "How to edit or delete a product",
    slug: "how-to-edit-or-delete-a-product",
    type: "guide",
    audience: ["roaster"],
    category_slug: "products-catalogue",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["product", "edit", "delete", "update", "catalogue"],
    excerpt: "Update product details or remove a product from your catalogue.",
    content: `Keep your product catalogue up to date by editing details or removing products that are no longer available.

## Editing a Product

1. **Go to Products** — Click **Products** in the sidebar.
2. **Find the product** — Use the search bar or browse your product list.
3. **Click Edit** — Click on the product to open its edit page.
4. **Make your changes** — Update any fields such as name, price, description, or images.
5. **Click Save** — Your changes are saved and immediately reflected on your storefront.

## Deleting a Product

1. **Go to Products** — Click **Products** in the sidebar.
2. **Find the product** — Locate the product you want to remove.
3. **Click Delete** — Open the product and click the **Delete** button, or use the actions menu on the product list.
4. **Confirm deletion** — Confirm that you want to permanently remove the product.

## Tips

- Instead of deleting a product, consider setting it to **Inactive**. This hides it from your storefront but preserves the data.
- Deleting a product does not affect past orders that included it.
- Price changes only apply to new orders — existing orders keep their original pricing.`,
  },
  {
    title: "Managing product images",
    slug: "managing-product-images",
    type: "guide",
    audience: ["roaster"],
    category_slug: "products-catalogue",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["product", "images", "photos", "upload", "gallery"],
    excerpt: "Upload, reorder, and manage product images for your catalogue listings.",
    content: `Great product images help customers understand what they are buying and increase conversion rates.

## Uploading Images

1. **Open a product** — Go to Products and click on the product you want to update.
2. **Scroll to the images section** — You will see the current images and an upload area.
3. **Upload images** — Click the upload area or drag and drop images. Supported formats are JPG, PNG, and WebP.
4. **Reorder images** — Drag images to reorder them. The first image is used as the main product photo.
5. **Save** — Click Save to update the product.

## Removing Images

1. **Open a product** — Navigate to the product edit page.
2. **Hover over an image** — A remove button will appear.
3. **Click remove** — The image will be removed from the product.
4. **Save** — Click Save to confirm changes.

## Tips

- Use square images (1:1 ratio) for the most consistent appearance across the platform.
- Keep image file sizes under 5MB for faster loading.
- Upload at least 2-3 images per product to give customers a complete view.
- The first image appears in search results and product cards, so make it your best shot.`,
  },
  {
    title: "Understanding product limits",
    slug: "understanding-product-limits",
    type: "faq",
    audience: ["roaster"],
    category_slug: "products-catalogue",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["product", "limits", "subscription", "plan", "quota"],
    excerpt: "Learn about product limits based on your subscription tier and how to increase them.",
    content: `The number of products you can list depends on your subscription plan.

## Product Limits by Plan

Each subscription tier includes a set number of active products:

- **Free** — Limited number of products to help you get started.
- **Starter** — A moderate product allowance suitable for small roasters.
- **Professional** — A generous product limit for growing businesses.
- **Enterprise** — Unlimited products.

Check your current plan and product usage in **Settings > Billing & Subscription**.

## What Counts Towards the Limit

- Only **active** products count towards your limit.
- **Inactive** or **draft** products do not count.
- Each product variant (e.g. different sizes) is part of the same product and does not count separately.

## Increasing Your Limit

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — View your current plan details.
3. **Upgrade your plan** — Click **Upgrade** to move to a higher tier with more product slots.

## Tips

- If you have reached your limit, consider deactivating products that are not selling well to make room for new ones.
- Contact support if you need a custom product limit for your account.`,
  },

  // ─── Storefront (roaster) ──────────────────────────────────
  {
    title: "Setting up your storefront",
    slug: "setting-up-your-storefront",
    type: "guide",
    audience: ["roaster"],
    category_slug: "storefront",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    tags: ["storefront", "setup", "online shop", "store"],
    excerpt: "Set up your branded online storefront to sell directly to customers.",
    content: `Your storefront is your own branded online shop where customers can browse and buy your products.

## Steps

1. **Go to Storefront** — Click **Storefront** in the sidebar navigation.
2. **Enable your storefront** — Toggle the storefront on if it is not already enabled.
3. **Set your store name** — Enter the name that will appear at the top of your shop.
4. **Add a description** — Write a short description about your roastery and what makes your coffee special.
5. **Upload your logo** — Add your brand logo to personalise your storefront header.
6. **Choose your products** — Select which products from your catalogue to display on the storefront.
7. **Configure shipping** — Set up delivery options and shipping rates.
8. **Save and preview** — Save your settings and preview your storefront to see how it looks.

## Tips

- A well-written description and professional logo make a strong first impression.
- Start with your best-selling products to make the storefront appealing from day one.
- Share your storefront link on social media and in email campaigns to drive traffic.
- You can embed your storefront on your existing website using the embed code feature.`,
  },
  {
    title: "Customising storefront branding",
    slug: "customising-storefront-branding",
    type: "guide",
    audience: ["roaster"],
    category_slug: "storefront",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["storefront", "branding", "logo", "colours", "design"],
    excerpt: "Customise the look and feel of your storefront with your brand colours and logo.",
    content: `Make your storefront match your brand identity by customising its visual appearance.

## Steps

1. **Go to Storefront** — Click **Storefront** in the sidebar.
2. **Open Branding settings** — Navigate to the branding or appearance section.
3. **Upload your logo** — Add or update your brand logo.
4. **Set brand colours** — Choose your primary brand colour. This will be used for buttons, links, and accents throughout your storefront.
5. **Add a banner image** — Upload a hero banner image for the top of your storefront.
6. **Preview your changes** — Click Preview to see how your storefront looks with the new branding.
7. **Save** — Click Save to apply the changes.

## Tips

- Use high-resolution images for your logo and banner to ensure they look sharp on all devices.
- Keep your colour scheme consistent with your existing brand materials.
- Test your storefront on both desktop and mobile after making changes.`,
  },
  {
    title: "Managing storefront products",
    slug: "managing-storefront-products",
    type: "guide",
    audience: ["roaster"],
    category_slug: "storefront",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["storefront", "products", "display", "visibility"],
    excerpt: "Choose which products appear on your storefront and manage their display order.",
    content: `Control which products are visible on your storefront and how they are presented to customers.

## Steps

1. **Go to Storefront** — Click **Storefront** in the sidebar.
2. **Open Product Settings** — Navigate to the products section of your storefront settings.
3. **Select products** — Choose which products from your catalogue to display. Only active products can be added.
4. **Reorder products** — Drag and drop products to set their display order on the storefront.
5. **Save** — Click Save to update your storefront.

## Tips

- Feature your best-selling or flagship products at the top.
- Regularly update your storefront with new products or seasonal offerings.
- Products that are set to inactive in your catalogue will automatically be hidden from the storefront.`,
  },
  {
    title: "Generating embed code",
    slug: "generating-embed-code",
    type: "guide",
    audience: ["roaster"],
    category_slug: "storefront",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["storefront", "embed", "widget", "website", "integration"],
    excerpt: "Generate an embed code to add your storefront or product widgets to any website.",
    content: `Embed your storefront directly on your existing website so customers can shop without leaving your site.

## Steps

1. **Go to Storefront** — Click **Storefront** in the sidebar.
2. **Find the Embed section** — Look for the embed code or widget section.
3. **Choose embed type** — Select whether you want to embed the full storefront or individual product widgets.
4. **Customise the widget** — Adjust settings like width, colour scheme, and which products to include.
5. **Copy the embed code** — Click **Copy Code** to copy the HTML snippet.
6. **Paste on your website** — Add the embed code to your website's HTML where you want the shop to appear.

## Tips

- The embed code works on any website that supports custom HTML, including WordPress, Squarespace, and Wix.
- The embedded shop automatically updates when you change products or pricing.
- Test the embed on your site to ensure it displays correctly and matches your website's design.`,
  },
  {
    title: "Storefront SEO settings",
    slug: "storefront-seo-settings",
    type: "guide",
    audience: ["roaster"],
    category_slug: "storefront",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["storefront", "seo", "search", "meta", "google"],
    excerpt: "Optimise your storefront for search engines to attract more organic traffic.",
    content: `Good SEO settings help customers find your storefront through search engines like Google.

## Steps

1. **Go to Storefront** — Click **Storefront** in the sidebar.
2. **Open SEO settings** — Navigate to the SEO or meta settings section.
3. **Set the page title** — Write a descriptive title for your storefront (recommended: under 60 characters).
4. **Write a meta description** — Describe your shop in 1-2 sentences (recommended: under 160 characters).
5. **Add keywords** — Include relevant keywords that customers might search for.
6. **Save** — Click Save to apply your SEO settings.

## Tips

- Include your roastery name and key product types in the title (e.g. "Fresh Specialty Coffee | Your Roastery Name").
- Write a meta description that tells customers what makes your coffee special.
- Update SEO settings when you add new product categories or change your focus.`,
  },

  // ─── Wholesale (customer) ──────────────────────────────────
  {
    title: "How to browse wholesale suppliers",
    slug: "how-to-browse-wholesale-suppliers",
    type: "guide",
    audience: ["customer"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["wholesale", "browse", "suppliers", "roasters", "discover"],
    excerpt: "Discover wholesale coffee suppliers and find the right roaster for your business.",
    content: `Browse the wholesale marketplace to find roasters offering bulk coffee at wholesale prices.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar navigation.
2. **Browse suppliers** — You will see a list of roasters offering wholesale access.
3. **Filter suppliers** — Use filters to narrow down by location, coffee type, or minimum order.
4. **View a supplier profile** — Click on a roaster to see their wholesale information, product range, and terms.
5. **Apply for access** — If interested, click **Apply for Wholesale Access** to request an account.

## Tips

- Read each supplier's terms and minimum order requirements before applying.
- Some roasters offer sample packs so you can taste their coffee before committing to a wholesale order.
- You can apply to multiple roasters to compare offerings.`,
  },
  {
    title: "Understanding wholesale tiers and terms",
    slug: "understanding-wholesale-tiers-and-terms",
    type: "faq",
    audience: ["customer"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["wholesale", "tiers", "pricing", "terms", "payment"],
    excerpt: "Learn how wholesale pricing tiers and payment terms work on the platform.",
    content: `Roasters can set up multiple pricing tiers and payment terms for their wholesale buyers.

## Pricing Tiers

Wholesale pricing is often tiered based on order volume:

- **Tier 1** — Standard wholesale pricing for smaller orders.
- **Tier 2** — Better pricing for medium-volume orders.
- **Tier 3** — Best pricing for large-volume orders.

Each roaster sets their own tier thresholds and prices. You can see which tier you qualify for on the roaster's wholesale page.

## Payment Terms

Roasters may offer different payment terms:

- **Pay on order** — Payment is required when the order is placed.
- **Net 7 / Net 14 / Net 30** — Payment is due within 7, 14, or 30 days of the invoice date.
- **Custom terms** — Some roasters offer custom payment arrangements for regular buyers.

## Tips

- Your pricing tier may be assigned when the roaster approves your wholesale application.
- Contact the roaster directly if you want to discuss custom pricing or terms.
- Consistent ordering may help you qualify for better pricing tiers over time.`,
  },
  {
    title: "How to browse a supplier catalogue",
    slug: "how-to-browse-a-supplier-catalogue",
    type: "guide",
    audience: ["customer"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["wholesale", "catalogue", "products", "browse", "order"],
    excerpt: "Browse a wholesale supplier's product catalogue and place orders at wholesale prices.",
    content: `Once you have been approved as a wholesale buyer, you can browse and order from a roaster's wholesale catalogue.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar.
2. **Select a supplier** — Click on a roaster you have wholesale access with.
3. **Browse their catalogue** — View all available wholesale products with their wholesale pricing.
4. **Add to cart** — Select the products and quantities you want and add them to your cart.
5. **Review your order** — Check your cart, delivery address, and total before placing the order.
6. **Place your order** — Confirm and submit your wholesale order.

## Tips

- Wholesale prices are shown based on your assigned pricing tier.
- Check product availability as some items may be seasonal or limited.
- You can save favourite products for quick reordering.`,
  },
  {
    title: "How to apply for wholesale access",
    slug: "how-to-apply-for-wholesale-access",
    type: "guide",
    audience: ["customer"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["wholesale", "apply", "access", "approval", "request"],
    excerpt: "Apply for wholesale access with a roaster to unlock wholesale pricing and ordering.",
    content: `To order at wholesale prices, you need to apply for wholesale access with each roaster.

## Steps

1. **Find a supplier** — Browse the wholesale marketplace or go directly to a roaster's profile.
2. **Click Apply for Wholesale Access** — You will find this button on the roaster's wholesale page.
3. **Fill in the application** — Provide your business details, expected order volume, and any other requested information.
4. **Submit your application** — Click Submit and wait for the roaster to review your request.
5. **Wait for approval** — The roaster will review your application and either approve, decline, or request more information.
6. **Start ordering** — Once approved, you can access the roaster's wholesale catalogue and pricing.

## Tips

- Provide accurate business information to increase your chances of approval.
- Some roasters auto-approve wholesale applications, while others review them manually.
- You will receive an email notification when your application status changes.`,
  },

  // ─── Wholesale (roaster) ───────────────────────────────────
  {
    title: "Managing wholesale buyer requests",
    slug: "managing-wholesale-buyer-requests",
    type: "guide",
    audience: ["roaster"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["wholesale", "buyers", "requests", "approve", "manage"],
    excerpt: "Review and manage wholesale access requests from potential buyers.",
    content: `When customers apply for wholesale access, you can review and manage their requests.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar.
2. **Open Buyer Requests** — Navigate to the buyer requests or applications section.
3. **Review a request** — Click on a pending request to see the applicant's business details and expected order volume.
4. **Approve or decline** — Choose to approve the buyer (granting them wholesale access) or decline the request.
5. **Assign a pricing tier** — When approving, select which pricing tier to assign to the buyer.

## Tips

- Review applications promptly to maintain a good relationship with potential buyers.
- You can change a buyer's pricing tier at any time after approval.
- Declining a request does not prevent the buyer from applying again in the future.`,
  },
  {
    title: "Setting wholesale pricing tiers",
    slug: "setting-wholesale-pricing-tiers",
    type: "guide",
    audience: ["roaster"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["wholesale", "pricing", "tiers", "discount", "bulk"],
    excerpt: "Create pricing tiers to offer volume-based discounts to your wholesale buyers.",
    content: `Set up pricing tiers to reward buyers who order in larger quantities.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar.
2. **Open Pricing Settings** — Navigate to pricing tiers or wholesale settings.
3. **Create a tier** — Click **Add Tier** and give it a name (e.g. Silver, Gold, Platinum).
4. **Set the discount** — Define the discount percentage or fixed price for this tier.
5. **Set tier criteria** — Optionally define minimum order quantities or spend thresholds.
6. **Save** — Click Save to create the tier.
7. **Assign to buyers** — When approving buyer requests, assign them to the appropriate tier.

## Tips

- Start with 2-3 tiers to keep things simple.
- Clearly communicate tier requirements to your buyers so they know how to qualify for better pricing.
- You can adjust tier pricing at any time — changes apply to future orders only.`,
  },
  {
    title: "Configuring payment terms",
    slug: "configuring-payment-terms",
    type: "guide",
    audience: ["roaster"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 7,
    tags: ["wholesale", "payment", "terms", "invoice", "net 30"],
    excerpt: "Set up payment terms for your wholesale buyers, such as Net 30 or pay on order.",
    content: `Configure payment terms to define when wholesale buyers need to pay for their orders.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar.
2. **Open Payment Settings** — Navigate to payment terms or billing settings.
3. **Set default terms** — Choose the default payment terms for new wholesale buyers (e.g. Pay on Order, Net 7, Net 14, Net 30).
4. **Customise per buyer** — Optionally set different terms for individual buyers based on their relationship or order history.
5. **Save** — Click Save to apply the settings.

## Tips

- Start with shorter payment terms (Pay on Order or Net 7) for new buyers and extend terms as trust builds.
- Invoices are automatically generated based on your payment terms settings.
- Monitor outstanding invoices from the Billing section to ensure timely payments.`,
  },
  {
    title: "Auto-approving wholesale buyers",
    slug: "auto-approving-wholesale-buyers",
    type: "guide",
    audience: ["roaster"],
    category_slug: "wholesale",
    is_active: true,
    is_featured: false,
    sort_order: 8,
    tags: ["wholesale", "auto-approve", "automation", "buyers"],
    excerpt: "Enable auto-approval to automatically grant wholesale access to new applicants.",
    content: `Save time by automatically approving wholesale buyer applications.

## Steps

1. **Go to Wholesale** — Click **Wholesale** in the sidebar.
2. **Open Settings** — Navigate to wholesale settings.
3. **Enable Auto-Approve** — Toggle the auto-approve option on.
4. **Set the default tier** — Choose which pricing tier auto-approved buyers will be assigned to.
5. **Set the default payment terms** — Choose the default payment terms for auto-approved buyers.
6. **Save** — Click Save to enable auto-approval.

## When to Use Auto-Approve

- **Enable it** if you want to grow quickly and are comfortable with any business ordering from you.
- **Disable it** if you want to vet each buyer and only work with selected businesses.

## Tips

- Even with auto-approve enabled, you can still manually change a buyer's tier or revoke access.
- Review auto-approved buyers periodically to ensure they meet your standards.`,
  },

  // ─── Marketing (roaster) ───────────────────────────────────
  {
    title: "Creating an email campaign",
    slug: "creating-an-email-campaign",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["email", "campaign", "marketing", "newsletter"],
    excerpt: "Create and send email marketing campaigns to your customers and subscribers.",
    content: `Email campaigns help you stay connected with your audience and promote your products.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Email Campaigns** — Navigate to the campaigns section.
3. **Click Create Campaign** — Start a new email campaign.
4. **Set campaign details** — Enter the campaign name, subject line, and sender name.
5. **Choose your audience** — Select which contacts or segments to send to.
6. **Design your email** — Use the visual editor to build your email with text, images, buttons, and product blocks.
7. **Preview and test** — Send a test email to yourself to check how it looks.
8. **Send or schedule** — Choose to send immediately or schedule for a future date and time.

## Tips

- Personalise your subject line to increase open rates.
- Keep emails concise and focused on a single call to action.
- Test your email on both desktop and mobile before sending.
- Use segmentation to send more relevant content to different customer groups.`,
  },
  {
    title: "Using the email visual editor",
    slug: "using-the-email-visual-editor",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["email", "editor", "visual", "design", "template"],
    excerpt: "Design beautiful emails using the drag-and-drop visual editor.",
    content: `The visual email editor lets you build professional-looking emails without any coding.

## Steps

1. **Open the editor** — When creating or editing a campaign, click **Design Email** to open the visual editor.
2. **Choose a layout** — Start with a blank canvas or select a pre-built template.
3. **Add content blocks** — Drag and drop blocks onto the canvas: text, images, buttons, dividers, product cards, and more.
4. **Edit content** — Click on any block to edit its content, styling, and settings.
5. **Customise design** — Adjust colours, fonts, padding, and alignment to match your brand.
6. **Add links** — Link buttons and text to your storefront, products, or external URLs.
7. **Preview** — Use the preview mode to see how the email will look on desktop and mobile.
8. **Save** — Click Save to return to the campaign settings.

## Tips

- Keep your email width under 600px for optimal display across email clients.
- Use your brand colours consistently for a professional look.
- Always include an unsubscribe link — this is added automatically at the bottom.
- Test in multiple email clients if possible (Gmail, Outlook, Apple Mail).`,
  },
  {
    title: "Sending and scheduling campaigns",
    slug: "sending-and-scheduling-campaigns",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["email", "send", "schedule", "campaign", "timing"],
    excerpt: "Send your email campaign immediately or schedule it for the optimal time.",
    content: `Choose when to deliver your campaign to maximise engagement.

## Sending Immediately

1. **Open your campaign** — Go to Marketing > Campaigns and select the campaign.
2. **Review everything** — Check the audience, subject line, and email design.
3. **Click Send Now** — Your campaign will be queued and delivered within minutes.

## Scheduling for Later

1. **Open your campaign** — Go to Marketing > Campaigns and select the campaign.
2. **Click Schedule** — Instead of Send Now, choose the Schedule option.
3. **Pick a date and time** — Select when you want the campaign to be sent.
4. **Confirm** — Click Confirm to schedule the campaign.

## Tips

- Schedule campaigns during business hours for best open rates.
- Tuesday, Wednesday, and Thursday mornings tend to have the highest email engagement.
- You can cancel or reschedule a scheduled campaign any time before it is sent.
- Check your campaign's timezone to ensure it sends at the right time.`,
  },
  {
    title: "Viewing campaign reports",
    slug: "viewing-campaign-reports",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["email", "reports", "analytics", "open rate", "click rate"],
    excerpt: "Track the performance of your email campaigns with detailed reports.",
    content: `Campaign reports show you how your emails performed so you can improve future campaigns.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Campaigns** — Navigate to the campaigns list.
3. **Find a sent campaign** — Locate the campaign you want to review (it must have been sent).
4. **Click View Report** — Open the campaign's report page.

## Key Metrics

- **Sent** — Total number of emails sent.
- **Delivered** — Number of emails successfully delivered.
- **Open Rate** — Percentage of recipients who opened the email.
- **Click Rate** — Percentage of recipients who clicked a link.
- **Bounce Rate** — Percentage of emails that could not be delivered.
- **Unsubscribes** — Number of people who unsubscribed after receiving the email.

## Tips

- Aim for an open rate above 20% and a click rate above 2%.
- A/B test subject lines to improve open rates over time.
- High bounce rates may indicate outdated contacts — clean your contact list regularly.`,
  },
  {
    title: "Using the Content Calendar",
    slug: "using-the-content-calendar",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["calendar", "content", "planning", "schedule", "marketing"],
    excerpt: "Plan and visualise your marketing activities with the Content Calendar.",
    content: `The Content Calendar gives you a visual overview of all your scheduled marketing activities.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Content Calendar** — Navigate to the Calendar section.
3. **View scheduled items** — See all your scheduled email campaigns, social media posts, and blog posts on one calendar.
4. **Switch views** — Toggle between monthly, weekly, or daily views.
5. **Click an item** — Click on any calendar entry to view its details or edit it.

## Tips

- Use the calendar to plan campaigns around holidays, product launches, or seasonal events.
- Colour-coded entries help you distinguish between email campaigns, social posts, and blog articles.
- Aim for a consistent posting schedule to keep your audience engaged.`,
  },
  {
    title: "Scheduling social media posts",
    slug: "scheduling-social-media-posts",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["social media", "schedule", "post", "instagram", "facebook"],
    excerpt: "Schedule social media posts to your connected accounts from the platform.",
    content: `Plan and schedule your social media content directly from Ghost Roastery.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Social Media** — Navigate to the social media section.
3. **Click Create Post** — Start a new social media post.
4. **Write your content** — Enter the text for your post. You can customise the message for each platform.
5. **Add images or video** — Upload media to include with your post.
6. **Select platforms** — Choose which connected social accounts to post to.
7. **Schedule or post now** — Set a date and time for the post, or publish immediately.
8. **Confirm** — Click Schedule or Post to finalise.

## Tips

- Schedule posts in advance to maintain a consistent social media presence.
- Use the Content Calendar to visualise your social media schedule alongside other marketing activities.
- Optimise posting times for each platform — Instagram and Facebook often perform best during lunch hours and evenings.`,
  },
  {
    title: "Connecting social media accounts",
    slug: "connecting-social-media-accounts",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 7,
    tags: ["social media", "connect", "facebook", "instagram", "integration"],
    excerpt: "Connect your social media accounts to schedule and publish posts from the platform.",
    content: `Connect your social accounts to manage your social media marketing from one place.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Social Media** — Navigate to the social media section.
3. **Click Connect Account** — Choose the platform you want to connect (e.g. Facebook, Instagram).
4. **Authorise access** — You will be redirected to the platform to log in and grant permissions.
5. **Select pages/profiles** — Choose which pages or profiles you want to manage.
6. **Confirm connection** — Click Confirm to complete the setup.

## Supported Platforms

- Facebook Pages
- Instagram Business accounts

## Tips

- You need admin access to the social media accounts you want to connect.
- Reconnect accounts if you notice posting issues — tokens can expire over time.
- You can disconnect an account at any time from the social media settings.`,
  },
  {
    title: "Creating marketing automations",
    slug: "creating-marketing-automations",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 8,
    tags: ["automation", "workflow", "trigger", "marketing", "email"],
    excerpt: "Set up automated marketing workflows triggered by customer actions or schedules.",
    content: `Marketing automations let you send targeted messages automatically based on triggers and conditions.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Automations** — Navigate to the automations section.
3. **Click Create Automation** — Start a new automation workflow.
4. **Choose a trigger** — Select what starts the automation (e.g. new subscriber, order placed, abandoned cart).
5. **Add steps** — Build your workflow by adding actions like sending an email, waiting a period, or checking a condition.
6. **Configure each step** — Set the email content, wait duration, or condition logic for each step.
7. **Review and activate** — Preview the workflow, then toggle it to Active.

## Common Automations

- **Welcome series** — Send a series of introduction emails when someone signs up.
- **Order confirmation** — Automatically email customers when they place an order.
- **Win-back** — Re-engage customers who have not ordered in a while.
- **Review request** — Ask for feedback after an order is delivered.

## Tips

- Start simple with one or two automations and expand as you learn what works.
- Test your automation by triggering it with a test contact before activating.
- Monitor automation performance in the reports section.`,
  },
  {
    title: "Using the AI Automation Builder",
    slug: "using-the-ai-automation-builder",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 9,
    tags: ["ai", "automation", "builder", "workflow", "artificial intelligence"],
    excerpt: "Use AI to generate marketing automation workflows from a simple text description.",
    content: `The AI Automation Builder helps you create marketing workflows by describing what you want in plain English.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Automations** — Navigate to the automations section.
3. **Click AI Builder** — Select the AI Automation Builder option.
4. **Describe your automation** — Type a plain-English description of what you want (e.g. "Send a welcome email when someone signs up, then follow up with a discount code 3 days later").
5. **Review the generated workflow** — The AI will create a visual automation workflow based on your description.
6. **Edit if needed** — Make any adjustments to the generated steps, timing, or content.
7. **Activate** — Once satisfied, activate the automation.

## Tips

- Be specific in your descriptions for better results (include timing, conditions, and actions).
- The AI-generated workflow is fully editable — use it as a starting point and refine.
- You can regenerate the workflow with a different description if the first result is not quite right.`,
  },
  {
    title: "Creating discount codes",
    slug: "creating-discount-codes",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 10,
    tags: ["discount", "coupon", "promo", "code", "offer"],
    excerpt: "Create discount codes to offer promotions and incentives to your customers.",
    content: `Discount codes are a great way to drive sales and reward loyal customers.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Discount Codes** — Navigate to the discount codes section.
3. **Click Create Discount** — Start creating a new discount code.
4. **Set the code** — Enter the discount code customers will use (e.g. WELCOME10, SUMMER20).
5. **Choose the discount type** — Select percentage off or fixed amount off.
6. **Set the value** — Enter the discount percentage or amount.
7. **Set conditions** — Optionally set a minimum order value, usage limit, or expiry date.
8. **Choose applicable products** — Apply to all products or select specific ones.
9. **Save** — Click Save to create the discount code.

## Tips

- Keep codes short and memorable.
- Set an expiry date to create urgency.
- Use unique codes for different campaigns to track which promotions perform best.
- Share codes via email campaigns, social media, or on your storefront banner.`,
  },
  {
    title: "Building forms",
    slug: "building-forms",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 11,
    tags: ["forms", "signup", "subscribe", "lead", "capture"],
    excerpt: "Build custom forms to capture leads, newsletter signups, and customer feedback.",
    content: `Forms help you collect information from visitors and grow your contact list.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Forms** — Navigate to the forms section.
3. **Click Create Form** — Start building a new form.
4. **Choose a form type** — Select from options like newsletter signup, contact form, or feedback form.
5. **Add fields** — Drag and drop fields onto the form (name, email, phone, custom fields, etc.).
6. **Customise appearance** — Adjust colours, fonts, and layout to match your brand.
7. **Set the thank you message** — Write the confirmation message shown after submission.
8. **Publish** — Save the form and copy the embed code or share link.

## Tips

- Keep forms short — fewer fields means higher completion rates.
- Always include an email field to add respondents to your contact list.
- Use forms on your website, in emails, or share them on social media.
- Form submissions can trigger marketing automations automatically.`,
  },
  {
    title: "Viewing form submissions",
    slug: "viewing-form-submissions",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 12,
    tags: ["forms", "submissions", "responses", "data", "leads"],
    excerpt: "View and manage responses submitted through your forms.",
    content: `Track all form submissions to manage leads and customer enquiries.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Forms** — Navigate to the forms section.
3. **Select a form** — Click on the form you want to view submissions for.
4. **View Submissions** — Click the **Submissions** tab to see all responses.
5. **Review entries** — Browse through individual submissions with all their field data.

## Tips

- Export submissions as a CSV file for use in spreadsheets or other tools.
- Form submissions that include an email address are automatically added to your contacts.
- Set up email notifications to be alerted when new submissions come in.`,
  },
  {
    title: "Writing blog posts",
    slug: "writing-blog-posts",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 13,
    tags: ["blog", "writing", "content", "article", "publish"],
    excerpt: "Write and publish blog posts to your website to attract visitors and share your story.",
    content: `Blog posts help you share expertise, tell your story, and improve your website's search rankings.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open Blog** — Navigate to the blog section.
3. **Click Create Post** — Start a new blog post.
4. **Write your content** — Use the editor to write your article with headings, images, and formatting.
5. **Set the title and excerpt** — Write an engaging title and a short summary for the blog listing.
6. **Add a featured image** — Upload an image that will appear at the top of the post and in previews.
7. **Set SEO details** — Add a meta title and description for search engine optimisation.
8. **Publish or schedule** — Publish immediately or schedule the post for a future date.

## Tips

- Write about topics your customers care about: coffee origins, brewing guides, behind-the-scenes stories.
- Aim for at least 500 words per post for better SEO performance.
- Include internal links to your products or storefront where relevant.
- Share published posts on social media to drive traffic.`,
  },
  {
    title: "Using AI Studio",
    slug: "using-ai-studio",
    type: "guide",
    audience: ["roaster"],
    category_slug: "marketing",
    is_active: true,
    is_featured: false,
    sort_order: 14,
    tags: ["ai", "studio", "content", "generate", "artificial intelligence"],
    excerpt: "Use AI Studio to generate marketing content, product descriptions, and more.",
    content: `AI Studio helps you create high-quality marketing content quickly using artificial intelligence.

## Steps

1. **Go to Marketing** — Click **Marketing** in the sidebar.
2. **Open AI Studio** — Navigate to the AI Studio section.
3. **Choose a content type** — Select what you want to create (e.g. product description, email copy, social media post, blog outline).
4. **Provide context** — Enter details about your product, audience, or campaign goals.
5. **Generate content** — Click Generate and the AI will create content based on your input.
6. **Review and edit** — Review the generated content and make any adjustments.
7. **Use the content** — Copy the content to use in your campaigns, product listings, or social posts.

## Tips

- The more context you provide, the better the AI output will be.
- Always review and personalise AI-generated content before publishing.
- Use AI Studio to overcome writer's block or generate multiple variations to test.
- Generated content can be used directly in email campaigns, blog posts, and social media.`,
  },

  // ─── Website Builder (roaster) ─────────────────────────────
  {
    title: "Getting started with Website Builder",
    slug: "getting-started-with-website-builder",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["website", "builder", "create", "setup", "getting started"],
    excerpt: "Learn the basics of the Website Builder and create your first website.",
    content: `The Website Builder lets you create a professional website for your roastery without any coding.

## Steps

1. **Go to Website** — Click **Website** in the sidebar navigation.
2. **Start building** — If this is your first time, you will see a setup wizard to help you get started.
3. **Choose a template** — Select a starting template or begin with a blank site.
4. **Set your site name** — Enter the name that will appear in the browser tab and header.
5. **Add your first page** — The homepage is created automatically. You can start adding content sections to it.
6. **Preview your site** — Click Preview to see how your website looks.
7. **Publish** — When ready, publish your site to make it live.

## Tips

- Start with the homepage and add more pages as needed.
- The Website Builder is separate from your storefront — it is a full website for your roastery.
- You can connect a custom domain to give your site a professional URL.`,
  },
  {
    title: "Creating and managing pages",
    slug: "creating-and-managing-pages",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["website", "pages", "create", "manage", "edit"],
    excerpt: "Add, edit, and manage the pages on your website.",
    content: `Your website can have multiple pages such as Home, About, Menu, Contact, and more.

## Creating a New Page

1. **Go to Website** — Click **Website** in the sidebar.
2. **Open Pages** — Navigate to the pages management section.
3. **Click Add Page** — Create a new page.
4. **Set the page title** — Enter a name for the page (e.g. "About Us", "Our Story").
5. **Set the URL slug** — The slug is automatically generated from the title but can be customised.
6. **Add content sections** — Build the page content by adding sections.
7. **Save** — Click Save to create the page.

## Managing Pages

- **Reorder pages** — Drag pages to change their order in the navigation menu.
- **Edit a page** — Click on any page to edit its content and settings.
- **Hide a page** — Toggle a page to hidden to remove it from navigation without deleting it.
- **Delete a page** — Remove a page permanently (this cannot be undone).

## Tips

- Keep your navigation simple — 5-7 pages is ideal for most roastery websites.
- Every page should have a clear purpose and call to action.
- Set SEO titles and descriptions for each page to improve search rankings.`,
  },
  {
    title: "Adding website sections",
    slug: "adding-website-sections",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["website", "sections", "blocks", "content", "layout"],
    excerpt: "Add content sections like hero banners, text blocks, and galleries to your pages.",
    content: `Sections are the building blocks of your website pages. Each section displays a different type of content.

## Steps

1. **Open a page** — Go to Website > Pages and select the page you want to edit.
2. **Click Add Section** — Choose from the available section types.
3. **Select a section type** — Options include hero banner, text block, image gallery, product showcase, contact form, testimonials, and more.
4. **Configure the section** — Fill in the section's content, images, and settings.
5. **Position the section** — Drag the section to reorder it on the page.
6. **Save** — Click Save to apply your changes.

## Available Section Types

- **Hero** — Large banner with headline, text, and call-to-action button.
- **Text** — Rich text content block.
- **Image Gallery** — Display a grid of images.
- **Products** — Showcase selected products from your catalogue.
- **Testimonials** — Display customer reviews and quotes.
- **Contact** — Embedded contact form.
- **Map** — Show your location on a map.
- **Video** — Embed a video from YouTube or Vimeo.

## Tips

- Start each page with a strong hero section to grab attention.
- Mix section types to create visual variety and keep visitors engaged.
- Use high-quality images throughout for a professional look.`,
  },
  {
    title: "Managing website menus",
    slug: "managing-website-menus",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["website", "menu", "navigation", "links", "header"],
    excerpt: "Customise your website's navigation menu to help visitors find their way around.",
    content: `The navigation menu is how visitors move between pages on your website.

## Steps

1. **Go to Website** — Click **Website** in the sidebar.
2. **Open Menu Settings** — Navigate to the menu or navigation section.
3. **Add menu items** — Click **Add Item** to add a link to the menu.
4. **Choose the link type** — Link to an internal page, an external URL, or a specific section on a page.
5. **Reorder items** — Drag and drop to change the order of menu items.
6. **Create dropdowns** — Nest items under a parent to create dropdown menus.
7. **Save** — Click Save to update your menu.

## Tips

- Put your most important pages first in the menu.
- Keep menu items to 7 or fewer for a clean navigation.
- Use clear, short labels that visitors will immediately understand (e.g. "About" instead of "About Our Company").
- Include a link to your storefront or shop page to drive sales.`,
  },
  {
    title: "Customising website design",
    slug: "customising-website-design",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["website", "design", "theme", "fonts", "colours"],
    excerpt: "Customise the overall design of your website including colours, fonts, and layout.",
    content: `Make your website match your brand by customising the global design settings.

## Steps

1. **Go to Website** — Click **Website** in the sidebar.
2. **Open Design Settings** — Navigate to the design or theme settings.
3. **Choose colours** — Set your primary colour, secondary colour, background colour, and text colour.
4. **Select fonts** — Choose heading and body fonts from the available options.
5. **Adjust spacing** — Configure the overall spacing and padding for a tighter or more spacious layout.
6. **Preview** — Check how your changes look across all pages.
7. **Save** — Click Save to apply the new design.

## Tips

- Stick to 2-3 colours for a clean, professional look.
- Use fonts that are easy to read on screens — avoid overly decorative fonts for body text.
- Design changes apply to all pages at once, keeping your site consistent.`,
  },
  {
    title: "Choosing a navigation layout",
    slug: "choosing-a-navigation-layout",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["website", "navigation", "layout", "header", "sidebar"],
    excerpt: "Choose between different navigation layouts for your website header.",
    content: `The navigation layout determines how your website header and menu are displayed.

## Steps

1. **Go to Website** — Click **Website** in the sidebar.
2. **Open Design Settings** — Navigate to the design or layout settings.
3. **Choose a layout** — Select from available navigation styles:
   - **Centered** — Logo centered with menu items below or alongside.
   - **Left-aligned** — Logo on the left, menu items on the right.
   - **Minimal** — Compact header with a hamburger menu.
4. **Preview** — See how each layout looks with your content.
5. **Save** — Click Save to apply your chosen layout.

## Tips

- The left-aligned layout is the most common and familiar for visitors.
- Use the minimal layout if you have many menu items and want a cleaner look.
- Test your layout on mobile to ensure the menu is easy to use on smaller screens.`,
  },
  {
    title: "Connecting a custom domain",
    slug: "connecting-a-custom-domain",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 7,
    tags: ["website", "domain", "custom", "DNS", "URL"],
    excerpt: "Connect your own domain name to your Ghost Roastery website.",
    content: `Use your own domain name (e.g. www.yourroastery.com) instead of the default Ghost Roastery URL.

## Steps

1. **Go to Website** — Click **Website** in the sidebar.
2. **Open Domain Settings** — Navigate to the domain or URL settings.
3. **Enter your domain** — Type your custom domain name (e.g. www.yourroastery.com).
4. **Update your DNS** — Add the DNS records shown on screen to your domain registrar (typically a CNAME or A record).
5. **Verify the connection** — Click **Verify** to check that the DNS records are properly configured.
6. **Wait for propagation** — DNS changes can take up to 48 hours to propagate, though it is usually much faster.
7. **SSL certificate** — An SSL certificate is automatically provisioned once the domain is verified.

## Tips

- You will need access to your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare) to update DNS records.
- If you are unsure how to update DNS, contact your domain registrar's support.
- Once connected, both your custom domain and the default Ghost Roastery URL will work.
- The SSL certificate ensures your site is secure (https://).`,
  },
  {
    title: "Previewing your website",
    slug: "previewing-your-website",
    type: "guide",
    audience: ["roaster"],
    category_slug: "website-builder",
    is_active: true,
    is_featured: false,
    sort_order: 8,
    tags: ["website", "preview", "view", "test", "live"],
    excerpt: "Preview your website before publishing to see how it looks to visitors.",
    content: `Always preview your website before publishing to ensure everything looks correct.

## Steps

1. **Go to Website** — Click **Website** in the sidebar.
2. **Click Preview** — Use the Preview button to open a preview of your site.
3. **Navigate through pages** — Click through your pages to check content, images, and layout.
4. **Test on different screen sizes** — Use the responsive preview to see how your site looks on desktop, tablet, and mobile.
5. **Check links** — Make sure all navigation links and buttons work correctly.
6. **Close preview** — Return to the editor to make any adjustments.

## Tips

- Check every page, not just the homepage.
- Test forms and interactive elements to make sure they work.
- View on mobile — a large percentage of visitors will be on their phones.
- Share the preview link with a colleague for a second opinion before publishing.`,
  },

  // ─── Billing & Subscriptions (roaster) ─────────────────────
  {
    title: "Understanding subscription tiers",
    slug: "understanding-subscription-tiers",
    type: "faq",
    audience: ["roaster"],
    category_slug: "billing-subscriptions",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["subscription", "plan", "tier", "pricing", "features"],
    excerpt: "Compare subscription tiers and understand what features are included in each plan.",
    content: `Ghost Roastery offers several subscription tiers designed for roasters at different stages of growth.

## Plans Overview

Each plan includes a set of features and limits:

- **Free** — Get started with basic features and limited product listings. Ideal for trying out the platform.
- **Starter** — Includes storefront, basic marketing tools, and more product slots. Suitable for small roasters.
- **Professional** — Full marketing suite, website builder, wholesale features, and higher limits. For growing businesses.
- **Enterprise** — Unlimited everything, priority support, and custom features. For established roasteries.

## How to View Your Plan

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — View your current plan, usage, and renewal date.

## Tips

- Start with the Free plan and upgrade as your business grows.
- You can upgrade or downgrade your plan at any time.
- Annual billing offers a discount compared to monthly billing.
- Contact support if you need a custom plan for your specific needs.`,
  },
  {
    title: "How to upgrade your plan",
    slug: "how-to-upgrade-your-plan",
    type: "guide",
    audience: ["roaster"],
    category_slug: "billing-subscriptions",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["upgrade", "plan", "subscription", "billing", "change"],
    excerpt: "Upgrade your subscription plan to access more features and higher limits.",
    content: `Upgrade your plan to unlock additional features and increase your product and contact limits.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — View your current plan.
3. **Click Upgrade** — Browse available plans and their features.
4. **Select a plan** — Choose the plan that best fits your needs.
5. **Choose billing frequency** — Select monthly or annual billing (annual saves money).
6. **Enter payment details** — Add or confirm your payment method.
7. **Confirm upgrade** — Review and confirm your upgrade. The new features are available immediately.

## Tips

- Upgrades take effect immediately. You will be charged a prorated amount for the remaining billing period.
- Downgrades take effect at the end of your current billing period.
- Review the feature comparison to ensure the new plan has everything you need.`,
  },
  {
    title: "Managing payment methods",
    slug: "managing-payment-methods",
    type: "guide",
    audience: ["roaster"],
    category_slug: "billing-subscriptions",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["payment", "card", "billing", "method", "update"],
    excerpt: "Add, update, or remove payment methods used for your subscription and platform fees.",
    content: `Keep your payment methods up to date to ensure uninterrupted access to the platform.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — Navigate to the billing section.
3. **View payment methods** — See your currently saved payment methods.
4. **Add a new method** — Click **Add Payment Method** and enter your card details.
5. **Set as default** — Choose which payment method to use for automatic billing.
6. **Remove a method** — Click Remove on any payment method you no longer want on file.

## Tips

- Update your payment method before it expires to avoid service interruption.
- All payment information is securely processed through Stripe.
- You will receive an email notification if a payment fails.`,
  },
  {
    title: "Viewing payout history",
    slug: "viewing-payout-history",
    type: "guide",
    audience: ["roaster"],
    category_slug: "billing-subscriptions",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["payout", "earnings", "history", "revenue", "payments"],
    excerpt: "View your payout history and track earnings from completed orders.",
    content: `Track all your payouts and earnings from the billing section.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — Navigate to the billing section.
3. **View Payouts** — Click on the Payouts tab to see your payout history.
4. **Review payout details** — Each payout entry shows the date, amount, status, and related orders.
5. **Filter by date** — Use the date filter to view payouts for a specific period.

## Payout Statuses

- **Pending** — Payout has been calculated but not yet processed.
- **Processing** — Payout is being transferred to your account.
- **Completed** — Payout has been deposited to your bank account.
- **Failed** — Payout failed — check your bank details and contact support.

## Tips

- Payouts are processed according to your agreed payout schedule.
- Ensure your bank details are correct and up to date in your settings.
- Contact support if a payout is overdue or shows as failed.`,
  },
  {
    title: "Configuring invoice settings",
    slug: "configuring-invoice-settings",
    type: "guide",
    audience: ["roaster"],
    category_slug: "billing-subscriptions",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["invoice", "billing", "settings", "tax", "vat"],
    excerpt: "Configure your invoice settings including business details, tax information, and numbering.",
    content: `Set up your invoice settings so invoices are generated correctly for your business.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Billing & Subscription** — Navigate to the billing section.
3. **Open Invoice Settings** — Find the invoice configuration section.
4. **Enter business details** — Add your business name, address, and registration number.
5. **Set tax information** — Enter your VAT number or tax ID if applicable.
6. **Customise invoice numbering** — Set the prefix and starting number for your invoices.
7. **Save** — Click Save to apply your invoice settings.

## Tips

- Ensure your business details match your official registration for tax compliance.
- Invoice numbering must be sequential — the system handles this automatically.
- You can download past invoices from the billing history section.`,
  },

  // ─── Account & Security ────────────────────────────────────
  {
    title: "How to update your profile",
    slug: "how-to-update-your-profile",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["profile", "update", "name", "email", "avatar"],
    excerpt: "Update your profile information including name, email, and profile photo.",
    content: `Keep your profile up to date so other users and the platform can identify you correctly.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar or click your avatar in the top right.
2. **Open Profile** — Navigate to the profile section.
3. **Update your details** — Edit your name, display name, phone number, or other profile fields.
4. **Upload a profile photo** — Click on your avatar to upload or change your profile photo.
5. **Save** — Click Save to update your profile.

## Tips

- Use a professional profile photo, especially if you are a roaster — customers may see it.
- Keep your contact information current so you can receive important notifications.
- Changing your email address may require re-verification.`,
  },
  {
    title: "How to change your password",
    slug: "how-to-change-your-password",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["password", "change", "security", "update"],
    excerpt: "Change your account password for security or personal preference.",
    content: `Regularly changing your password helps keep your account secure.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Security** — Navigate to the security or password section.
3. **Enter your current password** — Type your existing password to verify your identity.
4. **Enter a new password** — Choose a strong new password.
5. **Confirm the new password** — Type the new password again to confirm.
6. **Click Save** — Your password is updated immediately.

## Tips

- Use a unique password that you do not use on other websites.
- A strong password is at least 8 characters with a mix of uppercase, lowercase, and numbers.
- Consider using a password manager to generate and store strong passwords.
- If you cannot remember your current password, use the "Forgot password" option on the login page instead.`,
  },
  {
    title: "How to enable two-factor authentication",
    slug: "how-to-enable-two-factor-authentication",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: true,
    sort_order: 3,
    tags: ["2fa", "two-factor", "security", "authenticator", "totp"],
    excerpt: "Add an extra layer of security to your account by enabling two-factor authentication.",
    content: `Two-factor authentication (2FA) adds an extra security step when logging in, protecting your account even if your password is compromised.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Security** — Navigate to the security section.
3. **Click Enable 2FA** — Find the two-factor authentication option and click Enable.
4. **Install an authenticator app** — If you do not already have one, download an authenticator app such as Google Authenticator, Authy, or 1Password.
5. **Scan the QR code** — Use your authenticator app to scan the QR code displayed on screen.
6. **Enter the verification code** — Type the 6-digit code from your authenticator app to confirm setup.
7. **Save your backup codes** — Download or write down the backup codes provided. These can be used to access your account if you lose your authenticator device.
8. **Done** — 2FA is now enabled on your account.

## Tips

- Store your backup codes in a safe place — you will need them if you lose access to your authenticator app.
- Each code in the authenticator app refreshes every 30 seconds.
- 2FA is strongly recommended for all accounts, especially roaster accounts with access to financial data.`,
  },
  {
    title: "How to disable two-factor authentication",
    slug: "how-to-disable-two-factor-authentication",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 4,
    tags: ["2fa", "disable", "remove", "security"],
    excerpt: "Remove two-factor authentication from your account if you no longer want to use it.",
    content: `You can disable 2FA if needed, though we recommend keeping it enabled for security.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Security** — Navigate to the security section.
3. **Click Disable 2FA** — Find the two-factor authentication option and click Disable.
4. **Enter your password** — Confirm your identity by entering your account password.
5. **Enter a 2FA code** — Provide a current code from your authenticator app.
6. **Confirm** — Click Confirm to disable 2FA.

## Tips

- Disabling 2FA makes your account less secure. Only do this if necessary.
- If you are switching to a new phone, set up 2FA on the new device before disabling it on the old one.
- If you have lost your authenticator device and cannot enter a code, use a backup code instead.`,
  },
  {
    title: "How to use 2FA when logging in",
    slug: "how-to-use-2fa-when-logging-in",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 5,
    tags: ["2fa", "login", "authenticator", "code", "verify"],
    excerpt: "Enter your two-factor authentication code during the login process.",
    content: `When 2FA is enabled, you will need to enter a code from your authenticator app each time you log in.

## Steps

1. **Enter your email and password** — Log in as normal on the login page.
2. **Enter your 2FA code** — A prompt will appear asking for your 6-digit authenticator code.
3. **Open your authenticator app** — Find the Ghost Roastery entry and note the current code.
4. **Type the code** — Enter the 6-digit code and click **Verify**.
5. **You're logged in** — If the code is correct, you will be taken to your dashboard.

## If You Cannot Access Your Authenticator

1. **Use a backup code** — Click the **Use backup code** link on the 2FA prompt.
2. **Enter a backup code** — Type one of the backup codes you saved when setting up 2FA.
3. **Contact support** — If you have lost both your authenticator and backup codes, contact support for help regaining access.

## Tips

- Codes refresh every 30 seconds. If a code is not accepted, wait for a new one.
- Each backup code can only be used once.
- If you regularly have trouble with 2FA, make sure your device's time is set to automatic.`,
  },
  {
    title: "Managing notification preferences",
    slug: "managing-notification-preferences",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 6,
    tags: ["notifications", "email", "preferences", "alerts", "settings"],
    excerpt: "Control which notifications you receive and how you receive them.",
    content: `Customise your notification preferences to stay informed without being overwhelmed.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Notifications** — Navigate to the notification preferences section.
3. **Review notification types** — See the different categories of notifications (orders, marketing, security, platform updates).
4. **Toggle notifications** — Turn each notification type on or off according to your preference.
5. **Choose delivery method** — Select how you want to receive notifications (email, in-app, or both).
6. **Save** — Click Save to apply your preferences.

## Tips

- Keep security notifications enabled so you are alerted to any suspicious activity.
- Order status notifications are important for staying informed about your orders.
- You can always change your preferences later.`,
  },
  {
    title: "Managing your team",
    slug: "managing-your-team",
    type: "guide",
    audience: ["roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 7,
    tags: ["team", "invite", "roles", "members", "permissions"],
    excerpt: "Invite team members and manage their roles and permissions.",
    content: `Add team members to your roastery account so they can help manage orders, products, and more.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Team** — Navigate to the team management section.
3. **Click Invite Member** — Enter the email address of the person you want to invite.
4. **Assign a role** — Choose their role and permissions (e.g. Admin, Editor, Viewer).
5. **Send the invitation** — Click Send. The invitee will receive an email with a link to join your team.

## Managing Existing Members

- **Change roles** — Click on a team member to update their role or permissions.
- **Remove a member** — Click Remove to revoke their access to your account.

## Tips

- Only invite people you trust. Team members with Admin access can manage billing and settings.
- Review team access regularly and remove anyone who no longer needs access.
- Team members do not need to create their own subscription — they share your plan.`,
  },
  {
    title: "How to delete your account",
    slug: "how-to-delete-your-account",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "account-security",
    is_active: true,
    is_featured: false,
    sort_order: 8,
    tags: ["delete", "account", "remove", "close", "deactivate"],
    excerpt: "Permanently delete your account and all associated data from the platform.",
    content: `If you no longer wish to use Ghost Roastery, you can permanently delete your account.

## Steps

1. **Go to Settings** — Click **Settings** in the sidebar.
2. **Open Account** — Navigate to the account section.
3. **Click Delete Account** — Scroll to the bottom and find the delete account option.
4. **Read the warning** — Understand that account deletion is permanent and cannot be undone.
5. **Enter your password** — Confirm your identity by entering your password.
6. **Type the confirmation** — Type the confirmation phrase shown on screen.
7. **Click Confirm Delete** — Your account will be permanently deleted.

## What Gets Deleted

- Your profile and personal information.
- Your order history and saved preferences.
- For roasters: your products, storefront, and all related data.

## What Does NOT Get Deleted

- Completed orders that have already been fulfilled and delivered.
- Financial records required for legal compliance.

## Tips

- Consider exporting your data before deleting your account.
- If you are a roaster, ensure all pending orders are fulfilled before deleting.
- If you change your mind, you can create a new account, but your old data cannot be recovered.
- Contact support if you want to temporarily deactivate your account instead of deleting it.`,
  },

  // ─── Support (customer, roaster) ───────────────────────────
  {
    title: "How to create a support ticket",
    slug: "how-to-create-a-support-ticket",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "support",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["support", "ticket", "help", "contact", "issue"],
    excerpt: "Submit a support ticket to get help from the Ghost Roastery support team.",
    content: `If you need help with something that is not covered in the Help Centre, submit a support ticket.

## Steps

1. **Go to Support** — Click **Support** in the sidebar or navigate to the Help Centre.
2. **Click Create Ticket** — Find and click the button to submit a new support ticket.
3. **Choose a category** — Select the category that best matches your issue (e.g. Order Issue, Billing, Technical).
4. **Set the priority** — Choose the priority level (Low, Medium, High, Urgent).
5. **Describe your issue** — Write a clear description of the problem, including any relevant order numbers or screenshots.
6. **Attach files** — Upload any screenshots or documents that might help the support team understand your issue.
7. **Submit** — Click Submit to create the ticket.

## Tips

- Include as much detail as possible to help the support team resolve your issue quickly.
- Reference order numbers, error messages, or screenshots to speed up the process.
- You will receive an email notification when the support team responds to your ticket.
- Check the Help Centre first — your question may already be answered.`,
  },
  {
    title: "How to track your support tickets",
    slug: "how-to-track-your-support-tickets",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "support",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["support", "ticket", "track", "status", "follow up"],
    excerpt: "View the status of your support tickets and follow up on open issues.",
    content: `Keep track of your support tickets and communicate with the support team.

## Steps

1. **Go to Support** — Click **Support** in the sidebar.
2. **View My Tickets** — See a list of all your submitted support tickets.
3. **Check the status** — Each ticket shows its current status (Open, In Progress, Waiting on You, Resolved, Closed).
4. **Open a ticket** — Click on a ticket to view the full conversation and any updates.
5. **Reply** — Add a message to provide more information or ask a follow-up question.

## Ticket Statuses

| Status | Meaning |
|--------|---------|
| **Open** | Ticket has been submitted and is waiting for a response. |
| **In Progress** | The support team is actively working on your issue. |
| **Waiting on You** | The support team needs more information from you. |
| **Resolved** | Your issue has been resolved. |
| **Closed** | The ticket has been closed. |

## Tips

- Respond promptly when a ticket is marked as "Waiting on You" to avoid delays.
- If a resolved ticket did not fix your issue, reply to reopen it rather than creating a new one.
- You will receive email notifications for any updates to your tickets.`,
  },
  {
    title: "Using the Help Centre",
    slug: "using-the-help-centre",
    type: "guide",
    audience: ["customer", "roaster"],
    category_slug: "support",
    is_active: true,
    is_featured: false,
    sort_order: 3,
    tags: ["help centre", "knowledge base", "articles", "search", "self-service"],
    excerpt: "Find answers to common questions using the Help Centre knowledge base.",
    content: `The Help Centre contains articles and guides to help you use the platform effectively.

## Steps

1. **Go to Help** — Click **Help** in the sidebar navigation or visit the Help Centre page.
2. **Search for an answer** — Use the search bar to find articles related to your question.
3. **Browse categories** — If you are not sure what to search for, browse articles by category.
4. **Read an article** — Click on an article to read the full guide with step-by-step instructions.
5. **Rate the article** — Let us know if the article was helpful by clicking the thumbs up or down button.

## Tips

- Use specific search terms for better results (e.g. "reset password" instead of just "password").
- Featured articles cover the most common topics and are a great starting point.
- If you cannot find the answer you need, create a support ticket for personalised help.
- The Help Centre is updated regularly with new articles and guides.`,
  },

  // ─── Branding & Labels (customer) ──────────────────────────
  {
    title: "Viewing your coffee brands",
    slug: "viewing-your-coffee-brands",
    type: "guide",
    audience: ["customer"],
    category_slug: "branding-labels",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["brands", "coffee", "my brands", "view", "manage"],
    excerpt: "View and manage all your coffee brands and their associated products.",
    content: `The My Brands section shows all the coffee brands you have created on the platform.

## Steps

1. **Go to My Brands** — Click **My Brands** in the sidebar navigation.
2. **Browse your brands** — See a list of all your coffee brands with their logos and descriptions.
3. **View brand details** — Click on a brand to see its full details, products, and label designs.
4. **View associated orders** — See all orders placed under each brand.

## Tips

- Keep your brand information up to date, especially if your branding evolves.
- Each brand can have its own unique label designs and product range.
- Contact support if you need to transfer a brand to a different account.`,
  },
  {
    title: "Managing saved label designs",
    slug: "managing-saved-label-designs",
    type: "guide",
    audience: ["customer"],
    category_slug: "branding-labels",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["labels", "design", "saved", "artwork", "templates"],
    excerpt: "View and manage your saved label designs for future orders.",
    content: `Your saved label designs make it quick to reorder with the same artwork.

## Steps

1. **Go to My Brands** — Click **My Brands** in the sidebar.
2. **Select a brand** — Click on the brand whose labels you want to manage.
3. **View saved labels** — See all label designs saved under this brand.
4. **Preview a label** — Click on a label to see a full preview of the design.
5. **Use for a new order** — When placing a new order, you can select a saved label design instead of uploading new artwork.

## Tips

- Save multiple label variations for different products or seasonal designs.
- Label designs are linked to your brand, making it easy to keep everything organised.
- You can update a saved label design at any time — changes will only apply to future orders.`,
  },

  // ─── Contacts & CRM (roaster) ─────────────────────────────
  {
    title: "Managing contacts",
    slug: "managing-contacts",
    type: "guide",
    audience: ["roaster"],
    category_slug: "contacts-crm",
    is_active: true,
    is_featured: false,
    sort_order: 1,
    tags: ["contacts", "crm", "customers", "manage", "database"],
    excerpt: "View and manage your contact database including customers, leads, and subscribers.",
    content: `The Contacts section is your CRM — a central place to manage all your customer relationships.

## Steps

1. **Go to Contacts** — Click **Contacts** in the sidebar navigation.
2. **View your contacts** — Browse the list of all your contacts, including customers, wholesale buyers, and newsletter subscribers.
3. **Search and filter** — Use the search bar and filters to find specific contacts by name, email, or tags.
4. **View a contact** — Click on a contact to see their full profile, order history, and activity.
5. **Edit a contact** — Update contact details, add notes, or assign tags.

## Adding Contacts

- **Automatic** — Contacts are automatically created when someone places an order, signs up via a form, or subscribes to your newsletter.
- **Manual** — Click **Add Contact** to manually add a contact.
- **Import** — Import contacts from a CSV file.

## Tips

- Use tags to segment contacts for targeted marketing campaigns.
- Keep contact records clean by merging duplicates.
- The contact profile shows a complete history of orders and interactions.
- Export your contacts as a CSV for use in external tools.`,
  },
  {
    title: "Managing businesses",
    slug: "managing-businesses",
    type: "guide",
    audience: ["roaster"],
    category_slug: "contacts-crm",
    is_active: true,
    is_featured: false,
    sort_order: 2,
    tags: ["businesses", "companies", "b2b", "wholesale", "crm"],
    excerpt: "Manage business contacts and link them to individual contacts for B2B relationships.",
    content: `The Businesses section helps you manage B2B relationships by grouping contacts under their company.

## Steps

1. **Go to Contacts** — Click **Contacts** in the sidebar.
2. **Open Businesses** — Navigate to the Businesses tab.
3. **View businesses** — Browse the list of all businesses linked to your contacts.
4. **View a business** — Click on a business to see its profile, linked contacts, and order history.
5. **Edit a business** — Update the business name, address, industry, and other details.

## Adding a Business

1. **Click Add Business** — Create a new business entry.
2. **Enter details** — Fill in the business name, address, and any relevant information.
3. **Link contacts** — Associate individual contacts with this business.
4. **Save** — Click Save to create the business record.

## Tips

- Link wholesale buyers to their business for a clearer view of B2B relationships.
- Business profiles aggregate all orders placed by any contact linked to that business.
- Use business records to track wholesale accounts and key customer relationships.`,
  },
];

// ── Main Seed Function ────────────────────────────────────────

async function seed() {
  console.log("\n🌱 Seeding Knowledge Base...\n");

  // Step 1: Clear existing data
  console.log("Clearing existing KB data...");
  const { error: deleteArticlesErr } = await supabase.from("kb_articles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteArticlesErr) {
    console.error("  Error clearing articles:", deleteArticlesErr.message);
  } else {
    console.log("  ✓ Cleared kb_articles");
  }

  const { error: deleteCategoriesErr } = await supabase.from("kb_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteCategoriesErr) {
    console.error("  Error clearing categories:", deleteCategoriesErr.message);
  } else {
    console.log("  ✓ Cleared kb_categories");
  }

  // Step 2: Insert categories
  console.log("\nInserting categories...");
  const { data: insertedCategories, error: catError } = await supabase
    .from("kb_categories")
    .insert(categories)
    .select("id, slug");

  if (catError) {
    console.error("  Error inserting categories:", catError.message);
    process.exit(1);
  }

  console.log(`  ✓ Inserted ${insertedCategories.length} categories`);

  // Build slug-to-id map
  const categoryMap = new Map<string, string>();
  for (const cat of insertedCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // Step 3: Insert articles
  console.log("\nInserting articles...");

  const articleRows = articles.map((article) => {
    const { category_slug, ...rest } = article;
    const category_id = categoryMap.get(category_slug);
    if (!category_id) {
      console.error(`  ⚠ Category not found for slug: ${category_slug}`);
    }
    return {
      ...rest,
      category_id: category_id || null,
    };
  });

  // Insert in batches of 20 to avoid payload limits
  const batchSize = 20;
  let totalInserted = 0;

  for (let i = 0; i < articleRows.length; i += batchSize) {
    const batch = articleRows.slice(i, i + batchSize);
    const { data, error: artError } = await supabase
      .from("kb_articles")
      .insert(batch)
      .select("id");

    if (artError) {
      console.error(`  Error inserting batch ${Math.floor(i / batchSize) + 1}:`, artError.message);
      process.exit(1);
    }

    totalInserted += data.length;
    console.log(`  ✓ Batch ${Math.floor(i / batchSize) + 1}: inserted ${data.length} articles (${totalInserted}/${articleRows.length})`);
  }

  // Summary
  console.log("\n✅ Seeding complete!");
  console.log(`   Categories: ${insertedCategories.length}`);
  console.log(`   Articles:   ${totalInserted}`);

  const featuredCount = articles.filter((a) => a.is_featured).length;
  console.log(`   Featured:   ${featuredCount}`);

  // Audience breakdown
  const customerOnly = articles.filter((a) => a.audience.includes("customer") && !a.audience.includes("roaster")).length;
  const roasterOnly = articles.filter((a) => a.audience.includes("roaster") && !a.audience.includes("customer")).length;
  const both = articles.filter((a) => a.audience.includes("customer") && a.audience.includes("roaster")).length;
  console.log(`   Customer-only: ${customerOnly} | Roaster-only: ${roasterOnly} | Both: ${both}`);
  console.log("");
}

seed().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
