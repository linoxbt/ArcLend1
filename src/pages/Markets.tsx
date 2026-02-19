import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  supplyAPY: number;
  borrowAPY: number;
  collateralFactor: number;
  liquidationThreshold: number;
  totalLiquidity: string;
  utilization: number;
}

const baseSepoliaAssets: Asset[] = [
  { symbol: "ETH", name: "Ether", icon: "⟠", supplyAPY: 2.8, borrowAPY: 4.5, collateralFactor: 80, liquidationThreshold: 85, totalLiquidity: "$125,000", utilization: 42 },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠", supplyAPY: 3.2, borrowAPY: 5.0, collateralFactor: 78, liquidationThreshold: 82, totalLiquidity: "$98,000", utilization: 38 },
  { symbol: "USDT", name: "Tether USD", icon: "💵", supplyAPY: 4.1, borrowAPY: 6.2, collateralFactor: 75, liquidationThreshold: 80, totalLiquidity: "$310,000", utilization: 55 },
];

const rialoAssets: Asset[] = [
  { symbol: "RIA", name: "Rialo", icon: "💎", supplyAPY: 3.5, borrowAPY: 5.2, collateralFactor: 75, liquidationThreshold: 80, totalLiquidity: "$85,000", utilization: 35 },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠", supplyAPY: 3.0, borrowAPY: 4.8, collateralFactor: 78, liquidationThreshold: 82, totalLiquidity: "$72,000", utilization: 40 },
  { symbol: "USDT", name: "Tether USD", icon: "💵", supplyAPY: 4.5, borrowAPY: 6.5, collateralFactor: 75, liquidationThreshold: 80, totalLiquidity: "$195,000", utilization: 52 },
];

export default function Markets() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [activeNetwork, setActiveNetwork] = useState("base-sepolia");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"supply" | "borrow">("supply");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [amount, setAmount] = useState("");

  const assets = activeNetwork === "base-sepolia" ? baseSepoliaAssets : rialoAssets;

  const openModal = (type: "supply" | "borrow") => {
    if (!connected) {
      toast({ title: "Connect wallet first", description: "Please connect your EVM wallet.", variant: "destructive" });
      return;
    }
    setModalType(type);
    setSelectedAsset(null);
    setAmount("");
    setModalOpen(true);
  };

  const handleConfirm = () => {
    toast({
      title: "Contracts Not Deployed",
      description: "Deploy the ArcLend smart contracts first. See the Docs page for instructions.",
    });
    setModalOpen(false);
  };

  const currentAssets = activeNetwork === "base-sepolia" ? baseSepoliaAssets : rialoAssets;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Lending Markets</h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => openModal("supply")}>Supply</Button>
          <Button size="sm" variant="outline" className="border-primary/30 text-primary" onClick={() => openModal("borrow")}>Borrow</Button>
        </div>
      </div>

      <Tabs value={activeNetwork} onValueChange={setActiveNetwork} className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="base-sepolia">Base Sepolia</TabsTrigger>
          <TabsTrigger value="rialo">Rialo</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset, i) => (
          <motion.div key={asset.symbol + activeNetwork} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glow-purple border-border bg-card transition-all hover:border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{asset.icon}</span>
                    <div>
                      <p className="text-base font-bold text-foreground">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Supply APY</p>
                    <p className="text-lg font-bold text-green-500">{asset.supplyAPY}%</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs text-muted-foreground">Borrow APY</p>
                    <p className="text-lg font-bold text-orange-500">{asset.borrowAPY}%</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Liquidity</span>
                    <span className="text-foreground">{asset.totalLiquidity}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Utilization</span>
                    <span className="text-foreground">{asset.utilization}%</span>
                  </div>
                  <Progress value={asset.utilization} className="h-1.5" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => { setModalType("supply"); setSelectedAsset(asset); setAmount(""); setModalOpen(true); }}>Supply</Button>
                  <Button size="sm" variant="outline" className="flex-1 border-primary/30 text-primary" onClick={() => { setModalType("borrow"); setSelectedAsset(asset); setAmount(""); setModalOpen(true); }}>Borrow</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Supply / Borrow Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {modalType === "supply" ? "Supply" : "Borrow"} {selectedAsset?.symbol || "Assets"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {modalType === "supply"
                ? "Deposit assets to earn interest and use as collateral"
                : "Borrow assets against your supplied collateral"}
            </DialogDescription>
          </DialogHeader>

          {modalType === "borrow" && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Borrowing requires collateral</p>
                  <p className="text-muted-foreground">You must supply assets as collateral before borrowing. Monitor your health factor to avoid liquidation.</p>
                </div>
              </div>
              {modalType === "borrow" && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Borrowing Power Used</span>
                    <span className="text-foreground">0.0%</span>
                  </div>
                  <Progress value={0} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground">Available: $0.00</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                {modalType === "supply" ? "Select Asset" : "Select Asset to Borrow"}
              </label>
              <div className="space-y-2">
                {currentAssets.map((a) => (
                  <button
                    key={a.symbol}
                    onClick={() => setSelectedAsset(a)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedAsset?.symbol === a.symbol
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary/30 hover:border-primary/30"
                    }`}
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-medium text-foreground">{a.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedAsset && (
              <>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Amount</label>
                    <span className="text-xs text-muted-foreground">
                      {modalType === "supply" ? "Balance" : "Available"}: 0.0000 {selectedAsset.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-border bg-secondary"
                    />
                    <Button variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => setAmount("0")}>
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
                  <p className="font-medium text-muted-foreground">Transaction Overview</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{modalType === "supply" ? "Supply APY" : "Borrow APY (Variable)"}</span>
                    <span className="text-foreground">{modalType === "supply" ? selectedAsset.supplyAPY : selectedAsset.borrowAPY}%</span>
                  </div>
                  {modalType === "supply" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collateral Factor (LTV)</span>
                        <span className="text-foreground">{selectedAsset.collateralFactor}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Liquidation Threshold</span>
                        <span className="text-foreground">{selectedAsset.liquidationThreshold}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Can be collateral</span>
                        <span className="text-green-500">✓</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Health Factor</span>
                        <span className="text-foreground">0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Liquidation Threshold</span>
                        <span className="text-foreground">{selectedAsset.liquidationThreshold}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Liquidation Penalty</span>
                        <span className="text-foreground">5%</span>
                      </div>
                    </>
                  )}
                </div>

                <Button className="w-full glow-purple" disabled={!amount} onClick={handleConfirm}>
                  {modalType === "supply" ? "Confirm Supply" : "Confirm Borrow"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
