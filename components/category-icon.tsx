import {
  Scissors,
  ShieldPlus,
  Sparkles,
  FlaskConical,
  ScanLine,
  Bone,
  Search,
  Siren,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Scissors,
  ShieldPlus,
  Sparkles,
  FlaskConical,
  ScanLine,
  Bone,
  Search,
  Siren,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}
