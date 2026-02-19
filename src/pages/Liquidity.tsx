import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Wallet, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  network: "base-sepolia" | "rialo";
  tvl: string;
  apr: string;
  volume24h: string;
}

const liquidityPools: LiquidityPool[] = [
  { id: "b-1", tokenA: "ETH", tokenB: "USDT", network: "base-sepolia", tvl: "—", apr: "—", volume24h: "—" },
  { id: "b-2", tokenA: "WETH", tokenB: "USDT", network: "base-sepolia", tvl: "—", apr: "—", volume24h: "—" },
  { id: "r-1", tokenA: "RIA", tokenB: "USDT", network: "rialo", tvl: "—", apr: "—", volume24h: "—" },
  { id: "r-2", tokenA: "WETH", tokenB: "USDT", network: "rialo", tvl: "—", apr: "—", volume24h: "—" },
  { id: "r-3", tokenA: "RIA", tokenB: "WETH", network: "rialo", tvl: "—", apr: "—", volume24h: "—" },
];

export default function Liquidity() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [activeNetwork, setActiveNetwork] = useState("all");

  const filtered = activeNetwork === "all" ? liquidityPools : liquidityPools.filter(p => p.network === activeNetwork);

  const handleAdd = () => {
    toast({
      title: "Contracts Not Deployed",
      description: "Deploy the ArcLend liquidity contracts first. See the Deploy page.",
    });
    setAddOpen(false);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to provide liquidity.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Liquidity Pools</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Liquidity
        </Button>
      </div>

      <Tabs value={activeNetwork} onValueChange={setActiveNetwork} className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="base-sepolia">Base Sepolia</TabsTrigger>
          <TabsTrigger value="rialo">Rialo</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pool, i) => (
          <motion.div key={pool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border bg-card transition-all hover:border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <span className="text-base font-bold text-foreground">{pool.tokenA}/{pool.tokenB}</span>
                  </div>
                  <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {pool.network === "base-sepolia" ? "Base" : "Rialo"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>TVL</span><span className="text-foreground">{pool.tvl}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>APR</span><span className="text-foreground">{pool.apr}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>24h Volume</span><span className="text-foreground">{pool.volume24h}</span>
                </div>
                <Button size="sm" className="mt-2 w-full" onClick={() => setAddOpen(true)}>Add Liquidity</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Liquidity</DialogTitle>
            <DialogDescription className="text-muted-foreground">Provide liquidity to earn trading fees</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Token A Amount</label>
              <Input placeholder="0.00" value={amountA} onChange={(e) => setAmountA(e.target.value)} className="border-border bg-secondary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Token B Amount</label>
              <Input placeholder="0.00" value={amountB} onChange={(e) => setAmountB(e.target.value)} className="border-border bg-secondary" />
            </div>
            <Button className="w-full glow-purple" disabled={!amountA || !amountB} onClick={handleAdd}>
              Add Liquidity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
