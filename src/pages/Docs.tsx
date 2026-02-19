import { motion } from "framer-motion";
import { BookOpen, Terminal, Code, Layers, Zap, ExternalLink, AlertTriangle, CheckCircle, ArrowLeftRight, Droplets, Coins } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    id: "overview",
    icon: BookOpen,
    title: "1. Overview — What is ArcLend?",
    content: `ArcLend is a multi-chain DeFi lending and borrowing protocol deployed on Base Sepolia and Rialo Network Testnet. It provides a complete DeFi suite:

• **Lending & Borrowing** — Supply assets to earn yield, borrow against collateral
• **Token Swaps** — Instant swaps between supported tokens via AMM pools
• **Liquidity Provision** — Provide liquidity to earn trading fees
• **Testnet Faucet** — Claim free tokens to experiment with the protocol
• **Health Monitoring** — Track collateral ratios and liquidation risks

**Supported Networks & Assets:**
• **Base Sepolia** — ETH (gas), WETH, USDT
• **Rialo Testnet** — RIA (gas/native token), WETH, USDT`,
  },
  {
    id: "architecture",
    icon: Layers,
    title: "2. Architecture & How It Works",
    content: `ArcLend's architecture has three key components:

**Frontend (This Website)**
• React + TypeScript SPA with RainbowKit wallet integration
• Connects to Base Sepolia and Rialo Testnet via wagmi + viem
• Supports MetaMask, Coinbase Wallet, WalletConnect, and more

**Smart Contracts (Solidity)**
• LendingPool — Core supply/borrow/repay/withdraw logic with health factor computation
• AToken & DebtToken — ERC-20 tokens tracking supplied and borrowed positions
• SwapRouter & LiquidityPool — AMM-based token swaps with constant product formula (x*y=k)
• Faucet — Distributes testnet tokens with 24-hour cooldown
• PriceOracle — Asset price feeds for collateral valuation
• MockUSDT & MockWETH — Mintable ERC-20 test tokens

**How It Works:**
1. User connects EVM wallet (MetaMask, Coinbase, etc.)
2. Selects network (Base Sepolia or Rialo Testnet)
3. Claims testnet tokens from the Faucet
4. Supplies assets to earn yield or borrows against collateral
5. Swaps tokens or provides liquidity to earn fees`,
  },
  {
    id: "features",
    icon: Zap,
    title: "3. Features — Detailed Breakdown",
    content: `**Dashboard Page (/dashboard)**
• Portfolio overview: total supplied, borrowed, net worth, net APY
• Health factor gauge showing overall position health
• Earnings chart tracking yield over time
• Recent activity feed showing all transactions

**Markets Page (/markets)**
• Lists all lending pools across both networks
• Filter by network: All / Base Sepolia / Rialo
• Each pool shows: Supply APY, Borrow APY, Total Liquidity, Utilization Rate
• Supply/Borrow modals with health factor impact preview

**Swap Page (/swap)**
• Select network and token pair
• Enter amount to see estimated output
• Slippage tolerance configuration
• Flip tokens with one click
• Shows rate, fees, and network cost

**Liquidity Page (/liquidity)**
• View all liquidity pools across both networks
• Add/remove liquidity with proportional token deposits
• Track TVL, APR, and 24h volume per pool
• Earn 0.3% trading fees from swaps

**Positions Page (/positions)**
• "My Supplies" tab: view supplied assets with amounts and APY
• "My Borrows" tab: view borrowed assets with interest rates
• Withdraw and repay actions

**Faucet Page (/faucet)**
• Claim testnet tokens for both networks
• Base Sepolia: 0.1 ETH, 1.0 WETH, 1000 USDT per claim
• Rialo: 10 RIA, 1.0 WETH, 1000 USDT per claim
• 24-hour cooldown between claims

**Health Monitor (/health)**
• Visual health factor gauge per position
• Configurable alert thresholds (HF ≤ 1.5, 1.2, 1.0)
• Liquidation history table

**Deploy Guide (/deploy)**
• Complete Solidity contracts for all protocol components
• Hardhat deployment scripts for both networks
• Step-by-step deployment checklist`,
  },
  {
    id: "contracts",
    icon: Code,
    title: "4. Smart Contract Details",
    content: `**LendingPool.sol**
The core contract handling all lending operations:
• \`supply(asset, amount)\` — Deposit tokens to earn yield
• \`borrow(asset, amount)\` — Borrow tokens against collateral
• \`repay(asset, amount)\` — Repay borrowed tokens
• \`withdraw(asset, amount)\` — Withdraw supplied tokens
• \`getHealthFactor(user)\` — Compute user's collateral health
• Interest rates: 3% supply APY, 5% borrow APY (configurable)
• Liquidation threshold: 80% (configurable per asset)

**LiquidityPool.sol**
AMM pool using constant product formula (x*y=k):
• \`addLiquidity(amountA, amountB)\` — Provide token pair, receive LP tokens
• \`removeLiquidity(liquidity)\` — Burn LP tokens, receive proportional tokens
• \`swap(tokenIn, amountIn)\` — Swap with 0.3% fee
• LP tokens are standard ERC-20 (transferable)

**Faucet.sol**
Token distribution for testing:
• \`claim(token)\` — Claim configured amount of testnet tokens
• 24-hour cooldown per token per address
• Owner configures claim amounts per token

**MockUSDT.sol & MockWETH.sol**
• Standard ERC-20 with public \`mint()\` function
• USDT uses 6 decimals, WETH uses 18 decimals
• Pre-minted supply for faucet and liquidity seeding`,
  },
  {
    id: "integration",
    icon: Terminal,
    title: "5. Frontend Integration Steps",
    content: `**To make this website fully functional, you need to:**

1. **Deploy Smart Contracts** — Follow the Deploy page (/deploy) for complete contracts and scripts
2. **Add Contract Addresses** — After deployment, add the deployed addresses to your environment config
3. **Create Contract Hooks** — Use wagmi's \`useReadContract\` and \`useWriteContract\` hooks:

\`\`\`typescript
import { useReadContract, useWriteContract } from "wagmi";
import { lendingPoolABI } from "./abis";

// Read user's health factor
const { data: healthFactor } = useReadContract({
  address: LENDING_POOL_ADDRESS,
  abi: lendingPoolABI,
  functionName: "getHealthFactor",
  args: [userAddress],
});

// Supply assets
const { writeContract } = useWriteContract();
await writeContract({
  address: LENDING_POOL_ADDRESS,
  abi: lendingPoolABI,
  functionName: "supply",
  args: [tokenAddress, amount],
});
\`\`\`

4. **Connect Supply/Borrow/Swap Buttons** — Replace toast notifications with actual contract calls
5. **Add Price Oracle** — Deploy Chainlink price feeds or a custom oracle for accurate valuations
6. **Implement Interest Accrual** — Add time-based interest computation in the LendingPool contract
7. **Add Event Listeners** — Use wagmi's \`useWatchContractEvent\` to update UI in real-time
8. **Handle Multi-Chain** — Use wagmi's \`useSwitchChain\` to prompt network switching when needed`,
  },
  {
    id: "networks",
    icon: Layers,
    title: "6. Network Configuration",
    content: `**Base Sepolia (Chain ID: 84532)**
• RPC URL: https://sepolia.base.org
• Block Explorer: https://sepolia.basescan.org
• Native Token: ETH (for gas fees)
• Supported Assets: ETH, WETH, USDT
• Faucet: https://www.alchemy.com/faucets/base-sepolia

**Rialo Testnet (Chain ID: 9876)**
• RPC URL: https://testnet-rpc.rialo.network
• Block Explorer: https://testnet-explorer.rialo.network
• Native Token: RIA (for gas fees)
• Supported Assets: RIA, WETH, USDT

**RainbowKit Configuration:**
The app uses RainbowKit with wagmi for wallet connectivity. Both chains are pre-configured. Users can switch networks from the wallet button. Supported wallets include MetaMask, Coinbase Wallet, WalletConnect, Rainbow, and more.`,
  },
  {
    id: "checklist",
    icon: CheckCircle,
    title: "7. Full Deployment Checklist",
    content: `**Smart Contract Deployment (per network):**
- [ ] Deploy MockUSDT and MockWETH token contracts
- [ ] Deploy PriceOracle contract
- [ ] Deploy LendingPool with oracle address
- [ ] Deploy AToken and DebtToken contracts
- [ ] Initialize reserves in LendingPool (USDT, WETH + native if applicable)
- [ ] Deploy Faucet and configure claim amounts
- [ ] Fund Faucet with test tokens
- [ ] Deploy LiquidityPool contracts for each token pair
- [ ] Seed liquidity pools with initial liquidity
- [ ] Verify all contracts on block explorer

**Frontend Integration:**
- [ ] Export contract ABIs from Hardhat artifacts
- [ ] Create wagmi contract config with addresses and ABIs
- [ ] Replace all toast-based handlers with real contract calls
- [ ] Add token approval flows (ERC-20 approve before supply/swap)
- [ ] Implement balance reading using useReadContract
- [ ] Add transaction status tracking (pending/confirmed/failed)
- [ ] Test full flow on both networks
- [ ] Test wallet switching between networks
- [ ] Test on mobile browsers`,
  },
  {
    id: "resources",
    icon: ExternalLink,
    title: "8. External Resources",
    content: `**EVM Development:**
• [Hardhat Documentation](https://hardhat.org/docs) — Smart contract development framework
• [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts) — Audited Solidity libraries
• [wagmi Documentation](https://wagmi.sh) — React hooks for Ethereum
• [viem Documentation](https://viem.sh) — TypeScript Ethereum library
• [RainbowKit](https://www.rainbowkit.com/docs) — Wallet connection UI

**Base Network:**
• [Base Documentation](https://docs.base.org) — Base chain developer docs
• [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia) — Get testnet ETH
• [BaseScan](https://sepolia.basescan.org) — Block explorer

**DeFi References:**
• [Aave V3 Protocol](https://docs.aave.com) — Lending protocol reference
• [Uniswap V2](https://docs.uniswap.org/contracts/v2/overview) — AMM reference implementation
• [Chainlink Price Feeds](https://docs.chain.link/data-feeds) — Oracle integration`,
  },
];

export default function Docs() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">ArcLend Documentation</h1>
          <p className="text-muted-foreground">
            Complete guide to ArcLend — multi-chain lending protocol on Base Sepolia & Rialo Testnet.
          </p>
        </motion.div>

        <Card className="mb-8 border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="mb-1 font-semibold text-foreground">Testnet Only</p>
              <p className="text-muted-foreground">
                ArcLend is currently deployed on Base Sepolia and Rialo Testnet. Smart contracts must be deployed before full functionality is active. Follow the Deploy page for instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <s.icon className="h-4 w-4 text-primary" />
                  {s.title}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((s) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <s.icon className="h-5 w-5 text-primary" />
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-muted-foreground">
                    <FormattedContent content={s.content} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function FormattedContent({ content }: { content: string }) {
  const parts: JSX.Element[] = [];
  const lines = content.split("\n");
  let inCode = false;
  let codeLines: string[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("```") && !inCode) {
      inCode = true;
      codeLines = [];
    } else if (line.startsWith("```") && inCode) {
      inCode = false;
      parts.push(
        <pre key={`code-${i}`} className="my-3 overflow-x-auto rounded-lg border border-border bg-secondary/50 p-4 text-xs">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith("- [")) {
      const checked = line.includes("[x]");
      const text = line.replace(/- \[[ x]\] /, "");
      parts.push(
        <div key={`check-${i}`} className="flex items-center gap-2 py-0.5">
          <span className={`inline-block h-3.5 w-3.5 rounded border ${checked ? "border-primary bg-primary" : "border-border"}`} />
          <span>{text}</span>
        </div>
      );
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      parts.push(
        <div key={`li-${i}`} className="flex gap-2 py-0.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
        </div>
      );
    } else if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      parts.push(
        <div key={`ol-${i}`} className="flex gap-2 py-0.5">
          <span className="shrink-0 text-primary">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\. /, "")) }} />
        </div>
      );
    } else if (line.trim() === "") {
      parts.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      parts.push(<p key={`p-${i}`} className="py-0.5" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />);
    }
  });

  return <div>{parts}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-secondary px-1.5 py-0.5 text-xs text-primary">$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80">$1</a>'
    );
}
