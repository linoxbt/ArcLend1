import { motion } from "framer-motion";
import { BookOpen, Terminal, Code, Layers, Zap, ExternalLink, AlertTriangle, CheckCircle, FileCode, Rocket } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    id: "overview",
    icon: BookOpen,
    title: "1. Overview — What is ArcLend?",
    content: `ArcLend is a complete DeFi protocol deployed on Base Sepolia and Rialo Network Testnet. It provides:

• **Lending & Borrowing** — Supply assets to earn yield, borrow against collateral with dynamic interest rates
• **Token Swaps** — Instant swaps between supported tokens via AMM pools
• **Liquidity Provision** — Provide liquidity to earn 0.3% trading fees on every swap
• **Testnet Faucet** — Claim free tokens to experiment with the protocol
• **Health Monitoring** — Track collateral ratios and set up email/Telegram liquidation alerts
• **Contract Deployment** — Deploy ERC-20, NFT, staking, and custom contracts directly from the browser

**Supported Networks & Assets:**
• **Base Sepolia** — ETH (gas), WETH (protocol token), USDT (protocol token)
• **Rialo Testnet** — RIA (native gas token), WETH (protocol token), USDT (protocol token)

**Important:** ETH is the only "real" token on Base Sepolia. WETH and USDT are custom ERC-20 tokens deployed specifically for testing ArcLend. You must deploy them using the contracts below.`,
  },
  {
    id: "architecture",
    icon: Layers,
    title: "2. Architecture & Smart Contracts",
    content: `ArcLend requires these contracts deployed on **Base Sepolia** (trial network):

**Core Contracts:**
1. **LendingPool.sol** — Main lending/borrowing logic, interest accrual, health factor computation
2. **AToken.sol** — Interest-bearing ERC-20 tokens minted to suppliers
3. **DebtToken.sol** — Debt tracking ERC-20 tokens for borrowers
4. **PriceOracle.sol** — Asset price feeds for collateral valuation

**Token Contracts (Protocol-only, for testing):**
5. **MockUSDT.sol** — ERC-20 mock USDT (6 decimals, mintable)
6. **MockWETH.sol** — ERC-20 mock WETH (18 decimals, mintable)
7. **Faucet.sol** — Distributes test tokens to users with 24h cooldown

**DEX Contracts:**
8. **SwapRouter.sol** — AMM swap router
9. **LiquidityPool.sol** — AMM liquidity pool (constant product x*y=k)`,
  },
  {
    id: "mockusdt",
    icon: FileCode,
    title: "3. MockUSDT.sol — Deploy First",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("ArcLend USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
\`\`\`

**Remix Deployment Steps:**
1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file \`MockUSDT.sol\` and paste the code above
3. In the Solidity Compiler tab, select compiler version \`0.8.20\`
4. Click "Compile MockUSDT.sol"
5. Go to "Deploy & Run Transactions" tab
6. Set Environment to "Injected Provider - MetaMask"
7. Make sure MetaMask is connected to **Base Sepolia** (Chain ID: 84532)
8. Click "Deploy" and confirm in MetaMask
9. Copy the deployed contract address — you'll need it for the Faucet and LendingPool`,
  },
  {
    id: "mockweth",
    icon: FileCode,
    title: "4. MockWETH.sol",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockWETH is ERC20, Ownable {
    constructor() ERC20("ArcLend WETH", "WETH") Ownable(msg.sender) {
        _mint(msg.sender, 10_000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
\`\`\`

**Deploy using the same Remix steps as MockUSDT.** Save the deployed address.`,
  },
  {
    id: "priceoracle",
    icon: FileCode,
    title: "5. PriceOracle.sol",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
    mapping(address => uint256) public prices; // price in USD with 8 decimals

    constructor() Ownable(msg.sender) {}

    function setPrice(address asset, uint256 price) external onlyOwner {
        prices[asset] = price;
    }

    function getPrice(address asset) external view returns (uint256) {
        require(prices[asset] > 0, "Price not set");
        return prices[asset];
    }
}
\`\`\`

**After deploying:**
1. Call \`setPrice(USDT_ADDRESS, 100000000)\` — sets USDT = $1.00
2. Call \`setPrice(WETH_ADDRESS, 225374000000)\` — sets WETH = $2253.74`,
  },
  {
    id: "lendingpool",
    icon: FileCode,
    title: "6. LendingPool.sol — Core Contract",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LendingPool is Ownable, ReentrancyGuard {
    struct Reserve {
        address aTokenAddress;
        address debtTokenAddress;
        uint256 liquidationThreshold;
        uint256 ltv;
        uint256 totalSupplied;
        uint256 totalBorrowed;
        uint256 supplyRate;
        uint256 borrowRate;
        bool isActive;
    }

    struct UserPosition {
        uint256 supplied;
        uint256 borrowed;
    }

    mapping(address => Reserve) public reserves;
    mapping(address => mapping(address => UserPosition)) public userPositions;
    address[] public reservesList;
    address public priceOracle;

    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);

    constructor(address _priceOracle) Ownable(msg.sender) {
        priceOracle = _priceOracle;
    }

    function initReserve(
        address asset,
        address aToken,
        address debtToken,
        uint256 liquidationThreshold,
        uint256 ltv
    ) external onlyOwner {
        reserves[asset] = Reserve({
            aTokenAddress: aToken,
            debtTokenAddress: debtToken,
            liquidationThreshold: liquidationThreshold,
            ltv: ltv,
            totalSupplied: 0,
            totalBorrowed: 0,
            supplyRate: 300,
            borrowRate: 500,
            isActive: true
        });
        reservesList.push(asset);
    }

    function supply(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        userPositions[asset][msg.sender].supplied += amount;
        reserves[asset].totalSupplied += amount;
        emit Supply(msg.sender, asset, amount);
    }

    function borrow(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        userPositions[asset][msg.sender].borrowed += amount;
        reserves[asset].totalBorrowed += amount;
        IERC20(asset).transfer(msg.sender, amount);
        emit Borrow(msg.sender, asset, amount);
    }

    function repay(address asset, uint256 amount) external nonReentrant {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        userPositions[asset][msg.sender].borrowed -= amount;
        reserves[asset].totalBorrowed -= amount;
        emit Repay(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external nonReentrant {
        userPositions[asset][msg.sender].supplied -= amount;
        reserves[asset].totalSupplied -= amount;
        IERC20(asset).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, asset, amount);
    }

    function getHealthFactor(address user) external view returns (uint256) {
        uint256 totalCollateralETH = 0;
        uint256 totalDebtETH = 0;
        for (uint i = 0; i < reservesList.length; i++) {
            address asset = reservesList[i];
            UserPosition memory pos = userPositions[asset][user];
            totalCollateralETH += pos.supplied;
            totalDebtETH += pos.borrowed;
        }
        if (totalDebtETH == 0) return type(uint256).max;
        return (totalCollateralETH * 10000) / totalDebtETH;
    }
}
\`\`\`

**Deploy with constructor argument:** Pass the PriceOracle contract address.

**After deploying, initialize reserves:**
1. Call \`initReserve(USDT_ADDRESS, aTokenAddr, debtTokenAddr, 8000, 7500)\`
2. Call \`initReserve(WETH_ADDRESS, aTokenAddr, debtTokenAddr, 8200, 7800)\``,
  },
  {
    id: "faucet",
    icon: FileCode,
    title: "7. Faucet.sol",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    mapping(address => mapping(address => uint256)) public lastClaim;
    uint256 public cooldown = 24 hours;
    mapping(address => uint256) public claimAmounts;

    constructor() Ownable(msg.sender) {}

    function setClaimAmount(address token, uint256 amount) external onlyOwner {
        claimAmounts[token] = amount;
    }

    function claim(address token) external {
        require(
            block.timestamp - lastClaim[msg.sender][token] >= cooldown,
            "Cooldown active"
        );
        uint256 amount = claimAmounts[token];
        require(amount > 0, "Token not configured");
        lastClaim[msg.sender][token] = block.timestamp;
        IERC20(token).transfer(msg.sender, amount);
    }

    function claimAll(address[] calldata tokens) external {
        for (uint i = 0; i < tokens.length; i++) {
            if (block.timestamp - lastClaim[msg.sender][tokens[i]] >= cooldown) {
                uint256 amount = claimAmounts[tokens[i]];
                if (amount > 0) {
                    lastClaim[msg.sender][tokens[i]] = block.timestamp;
                    IERC20(tokens[i]).transfer(msg.sender, amount);
                }
            }
        }
    }
}
\`\`\`

**After deploying:**
1. Call \`setClaimAmount(USDT_ADDRESS, 1000000)\` — 1 USDT (6 decimals)
2. Call \`setClaimAmount(WETH_ADDRESS, 1000000000000000000)\` — 1 WETH (18 decimals)
3. Mint tokens to the Faucet contract:
   - Call \`MockUSDT.mint(FAUCET_ADDRESS, 1000000000000)\` — 1M USDT
   - Call \`MockWETH.mint(FAUCET_ADDRESS, 10000000000000000000000)\` — 10K WETH`,
  },
  {
    id: "liquiditypool",
    icon: FileCode,
    title: "8. LiquidityPool.sol & SwapRouter",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPool is ERC20 {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) ERC20("ArcLend LP", "ARC-LP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 liquidity) {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        liquidity = amountA + amountB;
        _mint(msg.sender, liquidity);
        reserveA += amountA;
        reserveB += amountB;
    }

    function removeLiquidity(uint256 liquidity) external {
        uint256 totalSupply_ = totalSupply();
        uint256 amountA = (liquidity * reserveA) / totalSupply_;
        uint256 amountB = (liquidity * reserveB) / totalSupply_;
        _burn(msg.sender, liquidity);
        reserveA -= amountA;
        reserveB -= amountB;
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }

    function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid");
        bool isA = tokenIn == address(tokenA);
        (uint256 resIn, uint256 resOut) = isA ? (reserveA, reserveB) : (reserveB, reserveA);
        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * resOut) / (resIn * 1000 + amountInWithFee);
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        if (isA) {
            reserveA += amountIn;
            reserveB -= amountOut;
            tokenB.transfer(msg.sender, amountOut);
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
            tokenA.transfer(msg.sender, amountOut);
        }
    }
}
\`\`\`

**Deploy one LiquidityPool per pair:**
1. Deploy \`LiquidityPool(WETH_ADDRESS, USDT_ADDRESS)\` for WETH/USDT pool
2. After deploying, seed with initial liquidity by calling \`addLiquidity\``,
  },
  {
    id: "checklist",
    icon: CheckCircle,
    title: "9. Full Deployment Checklist (Base Sepolia)",
    content: `**Step-by-step deployment order using Remix:**

1. Deploy \`MockUSDT\` → save address
2. Deploy \`MockWETH\` → save address
3. Deploy \`PriceOracle\` → set prices for USDT and WETH
4. Deploy \`LendingPool(oracleAddress)\` → initialize reserves
5. Deploy \`Faucet\` → set claim amounts, mint tokens to faucet
6. Deploy \`LiquidityPool(WETH, USDT)\` → seed with liquidity

**Frontend Integration:**
- [ ] Add all deployed contract addresses to \`src/lib/contracts.ts\`
- [ ] Create ABIs from Remix artifacts (copy from Compilation Details)
- [ ] Replace toast-based handlers with real \`useWriteContract\` calls
- [ ] Add ERC-20 approval flows before supply/swap
- [ ] Connect balance reading using \`useReadContract\`
- [ ] Test full supply → borrow → repay → withdraw flow
- [ ] Test swap functionality
- [ ] Test faucet claims`,
  },
  {
    id: "resources",
    icon: ExternalLink,
    title: "10. External Resources",
    content: `**Development Tools:**
• [Remix IDE](https://remix.ethereum.org) — Browser-based Solidity compiler & deployer
• [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts) — Audited Solidity libraries
• [wagmi Documentation](https://wagmi.sh) — React hooks for Ethereum
• [RainbowKit](https://www.rainbowkit.com/docs) — Wallet connection UI

**Base Sepolia:**
• [Base Documentation](https://docs.base.org) — Base chain developer docs
• [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia) — Get testnet ETH
• [BaseScan Sepolia](https://sepolia.basescan.org) — Block explorer

**DeFi References:**
• [Aave V3 Protocol](https://docs.aave.com) — Lending protocol reference
• [Uniswap V2](https://docs.uniswap.org/contracts/v2/overview) — AMM reference implementation`,
  },
];

export default function Docs() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">ArcLend Documentation</h1>
          <p className="text-muted-foreground">
            Complete guide to deploy and integrate ArcLend on Base Sepolia. All contracts, source code, and step-by-step Remix deployment instructions.
          </p>
        </motion.div>

        <Card className="mb-8 border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="mb-1 font-semibold text-foreground">Base Sepolia Trial Deployment</p>
              <p className="text-muted-foreground">
                Deploy all contracts on Base Sepolia first as a trial. ETH is the only real token — WETH and USDT are protocol-created ERC-20 tokens for testing purposes only. Deploy them using the source code below.
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
