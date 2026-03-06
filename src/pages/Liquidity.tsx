import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface Pool {
  tokenA: { symbol: string; icon: string };
  tokenB: { symbol: string; icon: string };
  tvl: string;
  volume24h: string;
  apr: string;
  userPosition: string | null;
  userShare: string | null;
}

const pools: Pool[] = [
  { tokenA: { symbol: "RIA", icon: "💎" }, tokenB: { symbol: "USDT", icon: "💵" }, tvl: "$245,000", volume24h: "$12,500", apr: "24.5%", userPosition: "$1,250", userShare: "0.51%" },
  { tokenA: { symbol: "RIA", icon: "💎" }, tokenB: { symbol: "WETH", icon: "⟠" }, tvl: "$180,000", volume24h: "$8,200", apr: "18.2%", userPosition: null, userShare: null },
  { tokenA: { symbol: "USDT", icon: "💵" }, tokenB: { symbol: "WETH", icon: "⟠" }, tvl: "$320,000", volume24h: "$15,800", apr: "15.8%", userPosition: "$500", userShare: "0.16%" },
];

export default function Liquidity() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [tab, setTab] = useState("pools");
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");

  const handleAdd = () => {
    toast({ title: "Contracts Not Deployed", description: "Deploy the LiquidityPool contracts first. See the Docs page." });
    setAddOpen(false);
  };

  const handleRemove = () => {
    toast({ title: "Contracts Not Deployed", description: "Deploy the LiquidityPool contracts first. See the Docs page." });
    setRemoveOpen(false);
  };

  const totalTVL = "$745,000";
  const volume24h = "$36,500";
  const userPositions = "$1,750";

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to provide liquidity and earn swap fees.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Liquidity Pools</h1>
          <p className="mt-1 text-sm text-muted-foreground">Provide liquidity to earn swap fees on Rialo Network</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="add">Add</TabsTrigger>
          <TabsTrigger value="remove">Remove</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats */}
      <div className="mb-6 grid gap-4 grid-cols-3">
        {[
          { label: "Total TVL", value: totalTVL },
          { label: "24h Volume", value: volume24h },
          { label: "Your Positions", value: userPositions },
        ].map((s, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pools Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Available Pools</CardTitle>
          <p className="text-xs text-muted-foreground">Provide liquidity to earn 0.3% on each swap</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead className="text-right">TVL</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">24h Volume</TableHead>
                  <TableHead className="text-right">APR</TableHead>
                  <TableHead className="hidden text-right md:table-cell">Your Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span>{pool.tokenA.icon}</span>
                        <span>{pool.tokenB.icon}</span>
                        <span className="ml-1 text-sm font-medium text-foreground">{pool.tokenA.symbol}/{pool.tokenB.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-foreground">{pool.tvl}</TableCell>
                    <TableCell className="hidden text-right text-sm text-foreground sm:table-cell">{pool.volume24h}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-green-500">{pool.apr}</TableCell>
                    <TableCell className="hidden text-right md:table-cell">
                      {pool.userPosition ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">{pool.userPosition}</p>
                          <p className="text-xs text-muted-foreground">{pool.userShare}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => { setSelectedPool(pool); setAmountA(""); setAmountB(""); setAddOpen(true); }}>Add</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Liquidity Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Liquidity — {selectedPool?.tokenA.symbol}/{selectedPool?.tokenB.symbol}</DialogTitle>
            <DialogDescription className="text-muted-foreground">Provide tokens to earn trading fees</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">{selectedPool?.tokenA.icon} {selectedPool?.tokenA.symbol} Amount</label>
              <Input placeholder="0.00" value={amountA} onChange={(e) => setAmountA(e.target.value)} className="border-border bg-secondary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">{selectedPool?.tokenB.icon} {selectedPool?.tokenB.symbol} Amount</label>
              <Input placeholder="0.00" value={amountB} onChange={(e) => setAmountB(e.target.value)} className="border-border bg-secondary" />
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Pool Share</span><span className="text-foreground">~0.00%</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>LP Tokens</span><span className="text-foreground">0.00</span>
              </div>
            </div>
            <Button className="w-full glow-purple" disabled={!amountA || !amountB} onClick={handleAdd}>
              Add Liquidity
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Liquidity Dialog */}
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Remove Liquidity</DialogTitle>
            <DialogDescription className="text-muted-foreground">Withdraw your LP position</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">LP Token Amount</label>
              <Input placeholder="0.00" value={removeAmount} onChange={(e) => setRemoveAmount(e.target.value)} className="border-border bg-secondary" />
            </div>
            <Button className="w-full" disabled={!removeAmount} onClick={handleRemove}>Remove Liquidity</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
