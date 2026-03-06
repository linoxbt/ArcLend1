import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Wallet, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface FaucetToken {
  symbol: string;
  name: string;
  icon: string;
  description: string;
  amount: string;
  network: "base-sepolia" | "rialo";
}

const baseSepoliaTokens: FaucetToken[] = [
  { symbol: "USDT", name: "Tether USD", icon: "💵", description: "Stablecoin pegged to USD", amount: "1 USDT", network: "base-sepolia" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠", description: "Wrapped version of Ethereum", amount: "1 WETH", network: "base-sepolia" },
];

const rialoTokens: FaucetToken[] = [
  { symbol: "USDT", name: "Tether USD", icon: "💵", description: "Stablecoin pegged to USD", amount: "1 USDT", network: "rialo" },
  { symbol: "WETH", name: "Wrapped Ether", icon: "⟠", description: "Wrapped version of Ethereum", amount: "1 WETH", network: "rialo" },
  { symbol: "ALND", name: "ArcLend Token", icon: "🔮", description: "Governance token for ArcLend", amount: "1 ALND", network: "rialo" },
];

const steps = [
  "Connect your wallet to the correct network",
  'Click "Claim" on each token or use "Claim All Tokens" button',
  "Wait for the transaction to confirm",
  "Start using ArcLend to supply and borrow!",
];

export default function Faucet() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<"base-sepolia" | "rialo">("base-sepolia");

  const tokens = activeNetwork === "base-sepolia" ? baseSepoliaTokens : rialoTokens;

  const handleClaim = async (token: FaucetToken) => {
    setClaiming(token.symbol + token.network);
    await new Promise(r => setTimeout(r, 1500));
    toast({
      title: "Faucet Not Deployed",
      description: `Deploy the faucet contract on ${token.network === "base-sepolia" ? "Base Sepolia" : "Rialo Testnet"} to claim ${token.symbol}. See the Docs page.`,
    });
    setClaiming(null);
  };

  const handleClaimAll = async () => {
    setClaimingAll(true);
    await new Promise(r => setTimeout(r, 2000));
    toast({
      title: "Faucet Not Deployed",
      description: `Deploy the faucet contract to claim all tokens. See the Docs page.`,
    });
    setClaimingAll(false);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Testnet Faucet</h1>
            <p className="mt-1 text-sm text-muted-foreground">Claim free testnet tokens to try out ArcLend. Each token can be claimed once every 24 hours.</p>
          </div>

          {!connected && (
            <Card className="mb-6 border-border bg-card">
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <Wallet className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Connect your wallet to claim testnet tokens</p>
                <WalletButton />
              </CardContent>
            </Card>
          )}

          {/* Network switcher */}
          <div className="mb-6 flex gap-2">
            <Button variant={activeNetwork === "base-sepolia" ? "default" : "outline"} size="sm" onClick={() => setActiveNetwork("base-sepolia")}>Base Sepolia</Button>
            <Button variant={activeNetwork === "rialo" ? "default" : "outline"} size="sm" onClick={() => setActiveNetwork("rialo")}>Rialo</Button>
          </div>

          {/* Native token notice */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-4">
              <span className="text-xl">{activeNetwork === "base-sepolia" ? "⟠" : "💎"}</span>
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  Need {activeNetwork === "base-sepolia" ? "ETH" : "RIA"} for gas?
                </p>
                <p className="text-muted-foreground">
                  {activeNetwork === "base-sepolia"
                    ? "ETH is required for transaction fees on Base Sepolia. Get testnet ETH from the official Base Sepolia faucet."
                    : "RIA is the native token for Rialo Network. Get testnet RIA from the official Rialo faucet to pay for transaction fees."}
                </p>
                <a
                  href={activeNetwork === "base-sepolia" ? "https://www.alchemy.com/faucets/base-sepolia" : "https://testnet-explorer.rialo.network"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Get {activeNetwork === "base-sepolia" ? "ETH" : "RIA"} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Claim All */}
          {connected && (
            <Button className="mb-6 w-full glow-purple" disabled={claimingAll} onClick={handleClaimAll}>
              {claimingAll ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Claiming All...</> : <><Coins className="mr-2 h-4 w-4" /> Claim All Tokens</>}
            </Button>
          )}

          {/* Token list */}
          <div className="space-y-4">
            {tokens.map((token) => (
              <Card key={token.symbol + token.network} className="border-border bg-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                      <p className="text-xs text-muted-foreground">{token.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-bold text-foreground">{token.amount}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={!connected || claiming === token.symbol + token.network}
                      onClick={() => handleClaim(token)}
                    >
                      {claiming === token.symbol + token.network ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to use */}
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">How to use the faucet</p>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
