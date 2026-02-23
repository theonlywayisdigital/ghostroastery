import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./Button";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8",
        hover && "transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800/80",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ProductPathCardProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  variant?: "primary" | "secondary";
}

export function ProductPathCard({
  title,
  description,
  features,
  ctaText,
  ctaHref,
  variant = "primary",
}: ProductPathCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-2xl md:text-3xl font-black mb-3">{title}</h3>
      <p className="text-neutral-300 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-neutral-400">
            <span className="text-accent mt-1">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={ctaHref}>
        <Button
          variant={variant === "primary" ? "primary" : "outline"}
          className="w-full"
        >
          {ctaText}
        </Button>
      </Link>
    </Card>
  );
}

interface TileCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function TileCard({ icon, title, description, className }: TileCardProps) {
  return (
    <div
      className={cn(
        "bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6 text-center",
        "transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}
