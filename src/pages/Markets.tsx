import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkBadge } from "@/components/NetworkBadge";
import { useWalletState } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface Pool {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  network: "base-sepolia" | "rialo";
  supplyAPY: number;
  borrowAPY: number;
  totalLiquidity: string;
  utilization: number;
}

const pools: Pool[] = [
  { id: "b-eth", symbol: "ETH", name: "Ether", icon: "Ξ", network: "base-sepolia", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "b-weth", symbol: "WETH", name: "Wrapped Ether", icon: "Ξ", network: "base-sepolia", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "b-usdt", symbol: "USDT", name: "Tether USD", icon: "₮", network: "base-sepolia", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "r-ria", symbol: "RIA", name: "Rialo", icon: "◆", network: "rialo", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "r-weth", symbol: "WETH", name: "Wrapped Ether", icon: "Ξ", network: "rialo", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
  { id: "r-usdt", symbol: "USDT", name: "Tether USD", icon: "₮", network: "rialo", supplyAPY: 0, borrowAPY: 0, totalLiquidity: "—", utilization: 0 },
];

export default function Markets() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [modalType, setModalType] = useState<"supply" | "borrow">("supply");
  const [amount, setAmount] = useState("");
  const [activeNetwork, setActiveNetwork] = useState("all");

  const filteredPools = activeNetwork === "all" ? pools : pools.filter(p => p.network === activeNetwork);

  const openModal = (pool: Pool, type: "supply" | "borrow") => {
    if (!connected) {
      toast({ title: "Connect wallet first", description: "Please connect your EVM wallet to supply or borrow.", variant: "destructive" });
      return;
    }
    setSelectedPool(pool);
    setModalType(type);
    setAmount("");
  };

  const handleConfirm = () => {
    toast({
      title: "Contracts Not Deployed",
      description: "Deploy the ArcLend smart contracts first. See the Deploy page for instructions.",
    });
    setSelectedPool(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Lending Markets</h1>
        <NetworkBadge />
      </div>

      <Tabs value={activeNetwork} onValueChange={setActiveNetwork} className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Networks</TabsTrigger>
          <TabsTrigger value="base-sepolia">Base Sepolia</TabsTrigger>
          <TabsTrigger value="rialo">Rialo</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPools.map((pool, i) => (
          <motion.div key={pool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glow-purple border-border bg-card transition-all hover:border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pool.icon}</span>
                    <div>
                      <p className="text-base font-bold text-foreground">{pool.symbol}</p>
                      <p className="text-xs text-muted-foreground">{pool.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {pool.network === "base-sepolia" ? "Base" : "Rialo"}
                  </span>
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
              <span className="text-2xl">{selectedPool?.icon}</span>
              {modalType === "supply" ? "Supply" : "Borrow"} {selectedPool?.symbol}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {modalType === "supply" ? "Supply assets to the lending pool" : "Borrow assets from the pool"} on {selectedPool?.network === "base-sepolia" ? "Base Sepolia" : "Rialo Testnet"}
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
