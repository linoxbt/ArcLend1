import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, BarChart3, ArrowLeftRight, Droplets, Coins, Shield, Rocket,
  Activity, Users, Gavel, Clock, ChevronRight, ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  comingSoon?: boolean;
  content: React.ReactNode;
}

const sections: DocSection[] = [
  {
    id: "overview",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Overview",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">ArcLend</strong> is a full-featured decentralized finance protocol built for EVM-compatible chains. 
          It enables users to lend, borrow, swap tokens, provide liquidity, deploy smart contracts, and monitor portfolio health — all from one unified interface.
        </p>
        <p>ArcLend is currently deployed on <strong className="text-foreground">Base Sepolia</strong> (testnet) with <strong className="text-foreground">Rialo Network</strong> support coming soon.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="mb-2 font-semibold text-foreground">Supported Assets</p>
          <div className="space-y-1.5">
            <p>⟠ <strong className="text-foreground">ETH</strong> — Native gas token on Base Sepolia</p>
            <p>⟠ <strong className="text-foreground">WETH</strong> — Wrapped Ether (protocol test token)</p>
            <p>💵 <strong className="text-foreground">USDT</strong> — Tether USD (protocol test token)</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "lending",
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Lending & Borrowing",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>ArcLend's lending protocol allows users to supply assets to earn interest and borrow against their collateral, inspired by Aave's proven model.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Supplying</p>
            <p>Deposit supported assets into the protocol to earn variable interest. Supplied assets can be used as collateral for borrowing. Each asset has a Collateral Factor (LTV) that determines how much you can borrow against it.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Borrowing</p>
            <p>Borrow assets against your supplied collateral. Interest accrues at a variable rate based on utilization. Monitor your Health Factor — if it drops below 1.0, your position may be liquidated.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Key Parameters</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Supply APY — Interest earned on deposits</li>
              <li>Borrow APY — Interest paid on loans</li>
              <li>Collateral Factor (LTV) — Max borrow ratio against collateral</li>
              <li>Liquidation Threshold — Point at which positions become liquidatable</li>
              <li>Liquidation Penalty — Fee applied during liquidation (5%)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "swap",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    title: "Token Swap",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>ArcLend's swap interface allows instant token exchanges using an Automated Market Maker (AMM) model, inspired by Jupiter and Uniswap.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">How It Works</p>
            <p>Swaps are executed through on-chain liquidity pools using the constant product formula (x × y = k). A 0.3% fee is charged on each swap, distributed to liquidity providers.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Features</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Real-time price feeds via CoinGecko</li>
              <li>Configurable slippage tolerance (0.1% – custom)</li>
              <li>Live exchange rate display</li>
              <li>Estimated output calculation</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "liquidity",
    icon: <Droplets className="h-4 w-4" />,
    title: "Liquidity Pools",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Provide liquidity to ArcLend's AMM pools and earn a share of trading fees on every swap.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Adding Liquidity</p>
            <p>Deposit equal value of two tokens into a pool. You receive LP tokens representing your share of the pool. Earn 0.3% of all trading fees proportional to your share.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Removing Liquidity</p>
            <p>Burn your LP tokens to withdraw your proportional share of both tokens plus accumulated fees.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Available Pools</p>
            <ul className="list-inside list-disc space-y-1">
              <li>WETH / USDT</li>
              <li>ETH / USDT</li>
              <li>ETH / WETH</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "faucet",
    icon: <Coins className="h-4 w-4" />,
    title: "Testnet Faucet",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>The faucet distributes free testnet tokens so users can experiment with the protocol without needing real assets.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Available Tokens</p>
            <ul className="list-inside list-disc space-y-1">
              <li>USDT — 1 USDT per claim</li>
              <li>WETH — 1 WETH per claim</li>
              <li>ALND — 1 ALND per claim (governance token)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Rules</p>
            <p>Each token can be claimed once every 24 hours. Use "Claim All Tokens" to claim everything at once. Native gas tokens (ETH) must be obtained from the network's official faucet.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "health",
    icon: <Activity className="h-4 w-4" />,
    title: "Health Monitor & Alerts",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Monitor your collateral health factor in real-time and set up automated alerts to prevent liquidation.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Health Factor</p>
            <p>Your health factor represents the safety of your borrowed position relative to your collateral. A health factor below 1.0 means your position is eligible for liquidation.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Alert Thresholds</p>
            <ul className="list-inside list-disc space-y-1">
              <li>HF ≤ 1.5 — Early warning</li>
              <li>HF ≤ 1.2 — Caution zone</li>
              <li>HF ≤ 1.0 — Liquidation risk</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Notification Channels</p>
            <p>Configure email and Telegram alerts. Settings are saved to your wallet and persist across sessions.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "deploy",
    icon: <Rocket className="h-4 w-4" />,
    title: "Contract Deployment",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Deploy smart contracts directly from ArcLend's interface — no CLI or development environment required.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Available Templates</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>ERC-20 Token</strong> — Standard fungible token</li>
              <li><strong>ERC-721 NFT</strong> — Non-fungible token for unique assets</li>
              <li><strong>ERC-1155 Multi Token</strong> — Multi-token standard</li>
              <li><strong>Staking Contract</strong> — Stake tokens and earn rewards</li>
              <li><strong>Multi-Sig Wallet</strong> — Multi-signature approval wallet</li>
              <li><strong>Token Vesting</strong> — Time-locked token release</li>
              <li><strong>Custom Contract</strong> — Deploy any compiled bytecode</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "community",
    icon: <Users className="h-4 w-4" />,
    title: "Community Hub",
    comingSoon: true,
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>A dedicated space for the ArcLend community to connect, discuss proposals, share strategies, and stay updated on protocol developments.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="font-semibold text-foreground">Planned Features</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Discussion forums and proposal threads</li>
            <li>Community-driven analytics and dashboards</li>
            <li>Ambassador and contributor programs</li>
            <li>Integration with Discord and Telegram</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "liquidation",
    icon: <Shield className="h-4 w-4" />,
    title: "Liquidation",
    comingSoon: true,
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>ArcLend's liquidation engine ensures protocol solvency by allowing anyone to repay undercollateralized positions and receive a bonus.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="font-semibold text-foreground">Planned Features</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Public liquidation dashboard with at-risk positions</li>
            <li>Bot-friendly liquidation API</li>
            <li>5% liquidation bonus for liquidators</li>
            <li>Partial and full liquidation support</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "governance",
    icon: <Gavel className="h-4 w-4" />,
    title: "Governance",
    comingSoon: true,
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>ALND token holders will govern the protocol through on-chain proposals and voting, shaping the future of ArcLend.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="font-semibold text-foreground">Planned Features</p>
          <ul className="list-inside list-disc space-y-1">
            <li>On-chain proposal creation and voting</li>
            <li>Token-weighted governance (1 ALND = 1 vote)</li>
            <li>Parameter adjustment proposals (interest rates, LTV ratios)</li>
            <li>Treasury management and grant programs</li>
          </ul>
        </div>
      </div>
    ),
  },
];

const resources = [
  { label: "Base Documentation", url: "https://docs.base.org", desc: "Base chain developer docs" },
  { label: "Aave V3 Protocol", url: "https://docs.aave.com", desc: "Lending protocol reference" },
  { label: "Uniswap V2 Docs", url: "https://docs.uniswap.org/contracts/v2/overview", desc: "AMM reference" },
  { label: "wagmi Documentation", url: "https://wagmi.sh", desc: "React hooks for Ethereum" },
  { label: "RainbowKit", url: "https://www.rainbowkit.com/docs", desc: "Wallet connection UI" },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");

  const current = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to know about ArcLend.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="shrink-0 lg:w-56">
          <div className="sticky top-4 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="text-primary">{s.icon}</span>
                <span className="flex-1">{s.title}</span>
                {s.comingSoon && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Soon</Badge>
                )}
              </button>
            ))}

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Resources</p>
              {resources.map((r) => (
                <a
                  key={r.label}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>{r.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {current.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
                    {current.comingSoon && (
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                        <Clock className="mr-1 h-3 w-3" /> Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                {current.content}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
