import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface FaucetToken {
  symbol: string;
  name: string;
  icon: string;
  amount: string;
  network: "base-sepolia" | "rialo";
}

const faucetTokens: FaucetToken[] = [
  { symbol: "ETH", name: "Ether (for gas)", icon: "Ξ", amount: "0.1 ETH", network: "base-sepolia" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "Ξ", amount: "1.0 WETH", network: "base-sepolia" },
  { symbol: "USDT", name: "Tether USD", icon: "₮", amount: "1000 USDT", network: "base-sepolia" },
  { symbol: "RIA", name: "Rialo (for gas)", icon: "◆", amount: "10 RIA", network: "rialo" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "Ξ", amount: "1.0 WETH", network: "rialo" },
  { symbol: "USDT", name: "Tether USD", icon: "₮", amount: "1000 USDT", network: "rialo" },
];

export default function Faucet() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState("all");

  const filtered = activeNetwork === "all" ? faucetTokens : faucetTokens.filter(t => t.network === activeNetwork);

  const handleClaim = async (token: FaucetToken) => {
    setClaiming(token.symbol + token.network);
    // Simulate claim — will connect to real faucet contract once deployed
    await new Promise(r => setTimeout(r, 1500));
    toast({
      title: "Faucet Not Deployed",
      description: `Deploy the faucet contract on ${token.network === "base-sepolia" ? "Base Sepolia" : "Rialo Testnet"} to claim ${token.symbol}. See the Deploy page.`,
    });
    setClaiming(null);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to claim testnet tokens.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Testnet Faucet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Claim free tokens to test ArcLend on both networks</p>
      </div>

      <Tabs value={activeNetwork} onValueChange={setActiveNetwork} className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Networks</TabsTrigger>
          <TabsTrigger value="base-sepolia">Base Sepolia</TabsTrigger>
          <TabsTrigger value="rialo">Rialo</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((token, i) => (
          <motion.div key={token.symbol + token.network} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border bg-card transition-all hover:border-primary/30">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
                      {token.icon}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {token.network === "base-sepolia" ? "Base" : "Rialo"}
                  </span>
                </div>
                <div className="mb-4 rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Amount per claim</p>
                  <p className="text-lg font-bold text-foreground">{token.amount}</p>
                </div>
                <Button
                  className="w-full"
                  disabled={claiming === token.symbol + token.network}
                  onClick={() => handleClaim(token)}
                >
                  {claiming === token.symbol + token.network ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Claiming...</>
                  ) : (
                    <><Coins className="mr-2 h-4 w-4" /> Claim {token.symbol}</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
