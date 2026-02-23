import {
  Palette,
  Tag,
  Flame,
  Truck,
  Coffee,
  ShieldCheck,
  Package,
  Clock,
  MapPin,
  Dumbbell,
  Building2,
  UtensilsCrossed,
  Heart,
  Lightbulb,
  Store,
} from "lucide-react";

export const Icons = {
  // How it works
  Design: Palette,
  Brand: Tag,
  Roast: Flame,
  Deliver: Truck,

  // Trust signals
  UKBased: MapPin,
  Specialty: Coffee,
  FoodSafe: ShieldCheck,
  SmallBatch: Clock,
  ShipsUK: Package,

  // Business types
  Cafe: Coffee,
  Gym: Dumbbell,
  Office: Building2,
  Restaurant: UtensilsCrossed,
  Wellness: Heart,
  Entrepreneur: Lightbulb,
  Retail: Store,
};

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 24 }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent className={className} size={size} />;
}
