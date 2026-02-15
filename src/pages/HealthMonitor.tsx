import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HealthGauge } from "@/components/HealthGauge";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { healthPositions, liquidationHistory, portfolioStats, formatCurrency } from "@/lib/mock-data";

export default function HealthMonitor() {
  const [alerts, setAlerts] = useState({ at15: true, at12: true, at10: false });

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Health & Liquidation Monitor</h1>
        <PrivacyBadge />
      </div>

      <Card className="mb-6 glow-purple border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm text-primary">Your health factor is computed in encrypted state — invisible to liquidation bots</p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-sm text-foreground">Overall Health</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-success/30 bg-success/5">
              <span className="text-4xl font-bold text-success">{portfolioStats.overallHealthFactor.toFixed(2)}</span>
            </div>
            <HealthGauge value={portfolioStats.overallHealthFactor} size="lg" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Bell className="h-4 w-4" /> Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[{ key: "at15" as const, label: "Alert at HF ≤ 1.5", desc: "Early warning" },
              { key: "at12" as const, label: "Alert at HF ≤ 1.2", desc: "Caution zone" },
              { key: "at10" as const, label: "Alert at HF ≤ 1.0", desc: "Liquidation risk" }].map((a) => (
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
        <CardContent className="space-y-3">
          {healthPositions.map((hp, i) => (
            <motion.div key={hp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{hp.token.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{hp.token.symbol}</p>
                  <p className="text-xs text-muted-foreground">LTV: {(hp.ltv * 100).toFixed(0)}% | Liq: {(hp.liquidationThreshold * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Supplied: {hp.supplied}</p>
                <p>Borrowed: {hp.borrowed}</p>
              </div>
              <HealthGauge value={hp.healthFactor} size="md" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Liquidation History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {liquidationHistory.map((liq) => (
            <div key={liq.id} className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger/5 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{liq.collateralToken.symbol} → {liq.debtToken.symbol}</p>
                <p className="text-xs text-muted-foreground">{liq.timestamp.toLocaleDateString()}</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-foreground">{liq.collateralAmount} {liq.collateralToken.symbol} liquidated</p>
                <p className="text-muted-foreground">HF: {liq.healthFactorBefore.toFixed(2)} → {liq.healthFactorAfter.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
