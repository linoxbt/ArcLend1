import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { HealthGauge } from "@/components/HealthGauge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface Pool {
  id: string;
  token: Token;
  supplyAPY: number;
  borrowAPY: number;
  totalLiquidity: string;
  utilization: number;
}

// Pool configuration — these would be fetched from on-chain state when contracts are deployed
const pools: Pool[] = [
  { id: "1", token: { symbol: "SOL", name: "Solana", icon: "◎" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "2", token: { symbol: "USDC", name: "USD Coin", icon: "$" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "3", token: { symbol: "mSOL", name: "Marinade SOL", icon: "🌊" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "4", token: { symbol: "jitoSOL", name: "Jito SOL", icon: "⚡" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "5", token: { symbol: "BONK", name: "Bonk", icon: "🐕" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "6", token: { symbol: "RAY", name: "Raydium", icon: "☀" }, supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
];

export default function Markets() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [modalType, setModalType] = useState<"supply" | "borrow">("supply");
  const [amount, setAmount] = useState("");

  const openModal = (pool: Pool, type: "supply" | "borrow") => {
    if (!connected) {
      toast({ title: "Connect wallet first", description: "Please connect your Solana wallet to supply or borrow.", variant: "destructive" });
      return;
    }
    setSelectedPool(pool);
    setModalType(type);
    setAmount("");
  };

  const handleConfirm = () => {
    toast({
      title: "Contract Not Deployed",
      description: "Deploy the ArcLend smart contracts to enable this action. See the Docs page for instructions.",
    });
    setSelectedPool(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Lending Markets</h1>
        <PrivacyBadge />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pools.map((pool, i) => (
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
                    <p className="text-lg font-bold text-muted-foreground">{pool.supplyAPY ? `${pool.supplyAPY}%` : "—"}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Borrow APY</p>
                    <p className="text-lg font-bold text-muted-foreground">{pool.borrowAPY ? `${pool.borrowAPY}%` : "—"}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Liquidity</span>
                    <span className="text-foreground">{pool.totalLiquidity}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Utilization</span>
                    <span className="text-foreground">{pool.utilization ? `${pool.utilization}%` : "—"}</span>
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
              {modalType === "supply" ? "Supply assets to the lending pool" : "Borrow assets from the pool"}
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
                <span className="text-foreground">—</span>
              </div>
              <PrivacyBadge />
            </div>
            <Button className="w-full glow-purple" disabled={!amount} onClick={handleConfirm}>
              {modalType === "supply" ? "Confirm Supply" : "Confirm Borrow"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
