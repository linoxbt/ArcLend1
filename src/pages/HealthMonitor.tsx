import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";

export default function HealthMonitor() {
  const { connected } = useWalletState();
  const [alerts, setAlerts] = useState({ at15: true, at12: true, at10: false });

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Connect your Solana wallet to monitor your health factors and liquidation risks.
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Health & Liquidation Monitor</h1>
        <PrivacyBadge />
      </div>

      <Card className="mb-6 glow-purple border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-primary">Your health factor is computed in encrypted state — invisible to liquidation bots</p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-sm text-foreground">Overall Health</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-muted/30 bg-muted/5">
              <span className="text-4xl font-bold text-muted-foreground">—</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">No active positions to monitor</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Bell className="h-4 w-4" /> Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "at15" as const, label: "Alert at HF ≤ 1.5", desc: "Early warning" },
              { key: "at12" as const, label: "Alert at HF ≤ 1.2", desc: "Caution zone" },
              { key: "at10" as const, label: "Alert at HF ≤ 1.0", desc: "Liquidation risk" },
            ].map((a) => (
              <div key={a.key} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <Switch checked={alerts[a.key]} onCheckedChange={(v) => setAlerts({ ...alerts, [a.key]: v })} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Positions Health</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No positions to display</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Liquidation History</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No liquidation events</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
