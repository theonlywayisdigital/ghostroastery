import {
  Palette,
  Tag,
  Fire,
  Truck,
  Coffee,
  ShieldCheck,
  Package,
  Clock,
  MapPin,
  Barbell,
  Buildings,
  ForkKnife,
  Heart,
  Lightbulb,
  Storefront,
} from "@phosphor-icons/react";

export const Icons = {
  // How it works
  Design: Palette,
  Brand: Tag,
  Roast: Fire,
  Deliver: Truck,

  // Trust signals
  UKBased: MapPin,
  Specialty: Coffee,
  FoodSafe: ShieldCheck,
  SmallBatch: Clock,
  ShipsUK: Package,

  // Business types
  Cafe: Coffee,
  Gym: Barbell,
  Office: Buildings,
  Restaurant: ForkKnife,
  Wellness: Heart,
  Entrepreneur: Lightbulb,
  Retail: Storefront,
};

export type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 28 }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent className={className} size={size} weight="duotone" />;
}
