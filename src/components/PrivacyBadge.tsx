import { Shield } from "lucide-react";

export function PrivacyBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
      <Shield className="h-3 w-3" />
      {!compact && "Encrypted via Arcium"}
      {compact && "Encrypted"}
    </span>
  );
}
