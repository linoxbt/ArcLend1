import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { HealthGauge } from "@/components/HealthGauge";
import { lendingPools, formatCurrency, type LendingPool } from "@/lib/mock-data";

export default function Markets() {
  const [sortBy, setSortBy] = useState<"supplyAPY" | "borrowAPY" | "totalLiquidity">("totalLiquidity");
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null);
  const [modalType, setModalType] = useState<"supply" | "borrow">("supply");
  const [amount, setAmount] = useState("");

  const sorted = [...lendingPools].sort((a, b) => b[sortBy] - a[sortBy]);

  const openModal = (pool: LendingPool, type: "supply" | "borrow") => {
    setSelectedPool(pool);
    setModalType(type);
    setAmount("");
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Lending Markets</h1>
        <div className="flex gap-2">
          {(["totalLiquidity", "supplyAPY", "borrowAPY"] as const).map((key) => (
            <Button key={key} size="sm" variant={sortBy === key ? "default" : "outline"} onClick={() => setSortBy(key)} className="text-xs">
              <ArrowUpDown className="mr-1 h-3 w-3" />
              {key === "totalLiquidity" ? "Liquidity" : key === "supplyAPY" ? "Supply APY" : "Borrow APY"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((pool, i) => (
          <motion.div key={pool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glow-purple border-border bg-card transition-all hover:border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pool.token.icon}</span>
                    <div>
                      <p className="text-base font-bold text-foreground">{pool.token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{pool.token.name}</p>
                    </div>
                  </div>
                  <PrivacyBadge compact />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Supply APY</p>
                    <p className="text-lg font-bold text-success">{pool.supplyAPY}%</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Borrow APY</p>
                    <p className="text-lg font-bold text-warning">{pool.borrowAPY}%</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Liquidity</span>
                    <span className="text-foreground">{formatCurrency(pool.totalLiquidity)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Utilization</span>
                    <span className="text-foreground">{pool.utilization}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pool.utilization}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => openModal(pool, "supply")}>Supply</Button>
                  <Button size="sm" variant="outline" className="flex-1 border-primary/30 text-primary" onClick={() => openModal(pool, "borrow")}>Borrow</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedPool} onOpenChange={() => setSelectedPool(null)}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">{selectedPool?.token.icon}</span>
              {modalType === "supply" ? "Supply" : "Borrow"} {selectedPool?.token.symbol}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {modalType === "supply" ? `Earn ${selectedPool?.supplyAPY}% APY` : `Borrow at ${selectedPool?.borrowAPY}% APY`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Amount</label>
              <Input placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-border bg-secondary" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Health Factor Impact</span>
                <HealthGauge value={amount ? 2.1 : 2.45} size="sm" />
              </div>
              <PrivacyBadge />
            </div>
            <Button className="w-full glow-purple" disabled={!amount}>
              {modalType === "supply" ? "Confirm Supply" : "Confirm Borrow"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
