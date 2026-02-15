import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { HealthGauge } from "@/components/HealthGauge";
import { mySupplies, myBorrows, formatCurrency, type Position } from "@/lib/mock-data";

export default function Positions() {
  const [modal, setModal] = useState<{ type: "withdraw" | "repay"; position: Position } | null>(null);
  const [amount, setAmount] = useState("");

  const PositionRow = ({ pos, actionLabel, onAction }: { pos: Position; actionLabel: string; onAction: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{pos.token.icon}</span>
        <div>
          <p className="font-medium text-foreground">{pos.token.symbol}</p>
          <p className="text-xs text-muted-foreground">{pos.token.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-foreground">{pos.amount.toLocaleString()} {pos.token.symbol}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(pos.value)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-success">{pos.apy}%</p>
        <p className="text-xs text-muted-foreground">APY</p>
      </div>
      <Button size="sm" variant="outline" onClick={onAction} className="border-primary/30 text-primary">{actionLabel}</Button>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Positions</h1>
        <PrivacyBadge />
      </div>

      <Tabs defaultValue="supplies">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="supplies">My Supplies ({mySupplies.length})</TabsTrigger>
          <TabsTrigger value="borrows">My Borrows ({myBorrows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="supplies">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Supplied Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mySupplies.map((pos) => (
                <PositionRow key={pos.id} pos={pos} actionLabel="Withdraw" onAction={() => { setModal({ type: "withdraw", position: pos }); setAmount(""); }} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrows">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Borrowed Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myBorrows.map((pos) => (
                <PositionRow key={pos.id} pos={pos} actionLabel="Repay" onAction={() => { setModal({ type: "repay", position: pos }); setAmount(""); }} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">{modal?.position.token.icon}</span>
              {modal?.type === "withdraw" ? "Withdraw" : "Repay"} {modal?.position.token.symbol}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Balance: {modal?.position.amount.toLocaleString()} {modal?.position.token.symbol}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-border bg-secondary" />
            <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Health Factor Impact</span>
                <HealthGauge value={amount ? 2.8 : 2.45} size="sm" />
              </div>
              <PrivacyBadge />
            </div>
            <Button className="w-full glow-purple" disabled={!amount}>
              {modal?.type === "withdraw" ? "Confirm Withdraw" : "Confirm Repay"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
