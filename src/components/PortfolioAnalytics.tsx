import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenIcon } from "@/components/TokenIcon";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { VirtualState } from "@/hooks/use-virtual-state";

const COLORS = [
  "hsl(263, 70%, 58%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 80%, 50%)",
];

interface PortfolioAnalyticsProps {
  state: VirtualState;
  prices: Record<string, number>;
}

export function PortfolioAnalytics({ state, prices }: PortfolioAnalyticsProps) {
  const { t } = useTranslation();

  // Portfolio Allocation Data
  const allocationData = useMemo(() => {
    const holdings: { name: string; value: number; amount: number }[] = [];
    
    // Wallet balances
    Object.entries(state.balances).forEach(([token, amount]) => {
      if (amount > 0) {
        const value = amount * (prices[token] || 0);
        const existing = holdings.find((h) => h.name === token);
        if (existing) {
          existing.value += value;
          existing.amount += amount;
        } else {
          holdings.push({ name: token, value, amount });
        }
      }
    });

    // Supplied positions
    state.supplies.forEach((supply) => {
      const value = supply.amount * (prices[supply.asset] || 0);
      const existing = holdings.find((h) => h.name === supply.asset);
      if (existing) {
        existing.value += value;
        existing.amount += supply.amount;
      } else {
        holdings.push({ name: supply.asset, value, amount: supply.amount });
      }
    });

    return holdings.filter((h) => h.value > 0.01);
  }, [state.balances, state.supplies, prices]);

  // Generate simulated historical yield data
  const yieldData = useMemo(() => {
    const days = 7;
    const data = [];
    const baseYield = state.supplies.reduce((sum, s) => sum + s.apy, 0) / Math.max(state.supplies.length, 1);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.5) * 2;
      data.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        yield: Math.max(0, baseYield + variance),
      });
    }
    return data;
  }, [state.supplies]);

  // Generate P&L history based on transactions
  const pnlData = useMemo(() => {
    const data = [];
    let runningPnl = 0;
    const txByDay = new Map<string, number>();
    
    // Group transactions by day
    state.transactions.slice().reverse().forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const value = tx.amount * (prices[tx.asset.split(">")[0]] || 1);
      
      if (tx.type === "supply" || tx.type === "stake") {
        txByDay.set(date, (txByDay.get(date) || 0) - value * 0.001); // Small negative for deposits (fees)
      } else if (tx.type === "withdraw" || tx.type === "claim_rewards") {
        txByDay.set(date, (txByDay.get(date) || 0) + value * 0.05); // Simulated gains
      }
    });

    // Convert to chart data
    const days = Array.from(txByDay.entries()).slice(-7);
    if (days.length === 0) {
      // Generate placeholder data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.3) * 20;
        runningPnl += variance;
        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          pnl: runningPnl,
        });
      }
    } else {
      days.forEach(([date, change]) => {
        runningPnl += change;
        data.push({ date, pnl: runningPnl });
      });
    }

    return data;
  }, [state.transactions, prices]);

  const totalValue = allocationData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    yield: { label: "Yield %", color: "hsl(var(--primary))" },
    pnl: { label: "P&L $", color: "hsl(var(--success))" },
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">{t("portfolioAllocation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-40 h-40">
                {allocationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {allocationData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No holdings</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 w-full">
                {allocationData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <TokenIcon symbol={item.name} size="sm" />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        ${item.value.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-foreground">{t("yieldOverTime")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-36 w-full">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#yieldGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-foreground">{t("pnlHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-36 w-full">
                <LineChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
