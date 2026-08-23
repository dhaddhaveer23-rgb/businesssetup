import {
  UtensilsCrossed,
  Coffee,
  Shirt,
  Code,
  Scissors,
  Dumbbell,
  Building2,
  ShoppingBag,
  HardHat,
  Briefcase,
  Store
} from 'lucide-react';

const map = {
  UtensilsCrossed,
  Coffee,
  Shirt,
  Code,
  Scissors,
  Dumbbell,
  Building2,
  ShoppingBag,
  HardHat,
  Briefcase
};

export default function BusinessTypeIcon({ name, className, size }) {
  const Icon = map[name] || Store;
  return <Icon className={className} size={size} />;
}