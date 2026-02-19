import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Wallet, Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useTokenPrices } from "@/hooks/use-token-prices";

const baseTokens = [
  { symbol: "ETH", name: "Ether", icon: "⟠" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠" },
  { symbol: "USDT", name: "Tether USD", icon: "💵" },
];

const rialoTokens = [
  { symbol: "RIA", name: "Rialo Token", icon: "💎" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠" },
  { symbol: "USDT", name: "Tether USD", icon: "💵" },
];

export default function Swap() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const { prices: tokenPrices, refresh: refreshPrices } = useTokenPrices();
  const [network, setNetwork] = useState<"base-sepolia" | "rialo">("base-sepolia");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tokens = network === "base-sepolia" ? baseTokens : rialoTokens;

  const handleSwap = () => {
    toast({
      title: "Contracts Not Deployed",
      description: "Deploy the SwapRouter contract first. See the Docs page for instructions.",
    });
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPrices();
    await new Promise(r => setTimeout(r, 400));
    setRefreshing(false);
  };

  const estimatedOutput = fromAmount && tokenPrices[fromToken] && tokenPrices[toToken]
    ? ((parseFloat(fromAmount) * tokenPrices[fromToken]) / tokenPrices[toToken]).toFixed(4)
    : "";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glow-purple border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span>Swap</span>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Select value={network} onValueChange={(v) => { setNetwork(v as any); setFromToken(v === "base-sepolia" ? "ETH" : "RIA"); setToToken("USDT"); }}>
                    <SelectTrigger className="h-8 w-32 border-border bg-secondary text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
                      <SelectItem value="rialo">Rialo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Exchange tokens instantly on {network === "base-sepolia" ? "Base Sepolia" : "Rialo testnet"}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* From */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-xs text-muted-foreground">Balance: 0.0000 {fromToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="h-10 w-32 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== toToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="border-0 bg-transparent text-right text-xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                  <Button variant="ghost" size="sm" className="shrink-0 text-xs text-primary" onClick={() => setFromAmount("0")}>MAX</Button>
                </div>
              </div>

              {/* Flip */}
              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border" onClick={flipTokens}>
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">To</span>
                  <span className="text-xs text-muted-foreground">Balance: 0.0000 {toToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="h-10 w-32 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== fromToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="0.0"
                    value={estimatedOutput}
                    disabled
                    className="border-0 bg-transparent text-right text-xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Rate</span><span className="text-foreground">1 {fromToken} = {(tokenPrices[fromToken] / tokenPrices[toToken]).toFixed(4)} {toToken}</span></div>
                <div className="flex justify-between"><span>Slippage Tolerance</span><span className="text-foreground">{slippage}%</span></div>
                <div className="flex justify-between"><span>Network Fee</span><span className="text-foreground">~$0.01</span></div>
              </div>

              {connected ? (
                <Button className="w-full glow-purple" disabled={!fromAmount} onClick={handleSwap}>
                  Swap
                </Button>
              ) : (
                <div className="flex justify-center">
                  <WalletButton />
                </div>
              )}

              <p className="text-center text-[10px] text-muted-foreground">
                Swaps are executed on {network === "base-sepolia" ? "Base Sepolia" : "Rialo testnet"}. Deploy the SwapRouter contract and update the address in the config to enable real swaps.
              </p>
            </CardContent>
          </Card>

          {/* Token Prices */}
          <Card className="mt-4 border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">Token Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tokens.map((t) => (
                <div key={t.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.symbol}</p>
                      <p className="text-xs text-muted-foreground">{t.name}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground">${tokenPrices[t.symbol]?.toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="border-border bg-card sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Swap Settings</DialogTitle>
            <DialogDescription className="text-muted-foreground">Configure slippage tolerance for your swaps</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-2 block text-xs text-muted-foreground">Slippage Tolerance</label>
              <div className="flex gap-2">
                {["0.1", "0.5", "1.0"].map(v => (
                  <Button key={v} variant={slippage === v ? "default" : "outline"} size="sm" onClick={() => setSlippage(v)}>
                    {v}%
                  </Button>
                ))}
                <Input
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-20 border-border bg-secondary text-center text-sm"
                  placeholder="%"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
