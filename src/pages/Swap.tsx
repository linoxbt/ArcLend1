import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Wallet, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

const baseTokens = [
  { symbol: "ETH", name: "Ether", icon: "Ξ" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "Ξ" },
  { symbol: "USDT", name: "Tether USD", icon: "₮" },
];

const rialoTokens = [
  { symbol: "RIA", name: "Rialo", icon: "◆" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "Ξ" },
  { symbol: "USDT", name: "Tether USD", icon: "₮" },
];

export default function Swap() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [network, setNetwork] = useState<"base-sepolia" | "rialo">("base-sepolia");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  const tokens = network === "base-sepolia" ? baseTokens : rialoTokens;

  const handleSwap = () => {
    toast({
      title: "Contracts Not Deployed",
      description: "Deploy the ArcLend swap contracts first. See the Deploy page for instructions.",
    });
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to swap tokens.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glow-purple border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span>Swap</span>
                <div className="flex items-center gap-2">
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
            </CardHeader>
            <CardContent className="space-y-3">
              {/* From */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-xs text-muted-foreground">Balance: —</span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="border-0 bg-transparent p-0 text-2xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="h-10 w-28 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== toToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Flip button */}
              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border" onClick={flipTokens}>
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">To</span>
                  <span className="text-xs text-muted-foreground">Balance: —</span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="0.00"
                    disabled
                    className="border-0 bg-transparent p-0 text-2xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="h-10 w-28 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== fromToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Rate</span><span className="text-foreground">—</span></div>
                <div className="flex justify-between"><span>Slippage</span><span className="text-foreground">{slippage}%</span></div>
                <div className="flex justify-between"><span>Network Fee</span><span className="text-foreground">—</span></div>
              </div>

              <Button className="w-full glow-purple" disabled={!fromAmount} onClick={handleSwap}>
                Swap
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
