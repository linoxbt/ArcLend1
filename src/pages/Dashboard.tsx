import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HealthGauge } from "@/components/HealthGauge";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { portfolioStats, earningsData, recentTransactions, formatCurrency } from "@/lib/mock-data";

const stats = [
  { label: "Total Supplied", value: formatCurrency(portfolioStats.totalSupplied), icon: TrendingUp, change: "+2.4%" },
  { label: "Total Borrowed", value: formatCurrency(portfolioStats.totalBorrowed), icon: TrendingDown, change: "-0.8%" },
  { label: "Net Worth", value: formatCurrency(portfolioStats.netWorth), icon: DollarSign, change: "+3.1%" },
  { label: "Net APY", value: `${portfolioStats.netAPY}%`, icon: Percent, change: "+0.12%" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h1>
        <PrivacyBadge />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glow-purple border-border bg-card">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <span className="text-xs text-success">{s.change}</span>
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
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ background: "hsl(240,10%,6%)", border: "1px solid hsl(240,10%,16%)", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="earnings" stroke="hsl(263, 70%, 58%)" fill="url(#purpleGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
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
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-success/30 bg-success/5">
              <span className="text-3xl font-bold text-success">{portfolioStats.overallHealthFactor.toFixed(2)}</span>
            </div>
            <HealthGauge value={portfolioStats.overallHealthFactor} size="lg" />
            <p className="text-center text-xs text-muted-foreground">Your overall health factor is in the safe zone</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tx.token.icon}</span>
                  <div>
                    <p className="text-sm font-medium capitalize text-foreground">{tx.type} {tx.token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-foreground">{tx.amount.toLocaleString()} {tx.token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{tx.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
