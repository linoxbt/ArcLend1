import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HealthGauge } from "@/components/HealthGauge";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { connected } = useWalletState();
  const navigate = useNavigate();

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Connect your Solana wallet to view your portfolio, positions, and health factors.
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  // When connected but no on-chain program deployed yet, show placeholder state
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Portfolio Dashboard</h1>
        <PrivacyBadge />
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Supplied", icon: TrendingUp, value: "$0.00" },
          { label: "Total Borrowed", icon: TrendingDown, value: "$0.00" },
          { label: "Net Worth", icon: DollarSign, value: "$0.00" },
          { label: "Net APY", icon: Percent, value: "0.00%" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glow-purple border-border bg-card">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground sm:text-2xl">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-60 items-center justify-center text-center">
              <div>
                <p className="text-sm text-muted-foreground">No earnings data yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Supply assets to start earning yield</p>
                <Button size="sm" className="mt-4" onClick={() => navigate("/markets")}>
                  Browse Markets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm text-foreground">
              Health Factor
              <PrivacyBadge compact />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-muted/30 bg-muted/5">
              <span className="text-3xl font-bold text-muted-foreground">—</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">No active positions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No recent transactions</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
