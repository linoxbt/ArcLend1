import { motion } from "framer-motion";
import { Rocket, Terminal, FileCode, CheckCircle, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    icon: Terminal,
    title: "1. Prerequisites",
    content: `Before deploying ArcLend contracts, install the required tools:

\`\`\`bash
# Install Node.js (v18+)
# https://nodejs.org

# Install Hardhat
npm install -g hardhat

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts

# Install ethers.js
npm install ethers
\`\`\`

**Required Accounts & Keys:**
- MetaMask or another EVM wallet
- Base Sepolia ETH (from https://www.alchemy.com/faucets/base-sepolia)
- Rialo testnet RIA tokens (from Rialo faucet)
- Alchemy or Infura RPC endpoint for Base Sepolia`,
  },
  {
    icon: FileCode,
    title: "2. Smart Contracts Overview",
    content: `ArcLend requires the following contracts deployed on **both** Base Sepolia and Rialo Testnet:

**Core Contracts:**
1. **LendingPool.sol** — Main lending/borrowing logic, interest accrual, health factor computation
2. **LendingPoolAddressesProvider.sol** — Registry for all protocol contract addresses
3. **AToken.sol** — Interest-bearing tokens minted to suppliers (ERC-20)
4. **DebtToken.sol** — Debt tracking tokens for borrowers (ERC-20)

**Token Contracts:**
5. **MockUSDT.sol** — ERC-20 mock USDT for testnet (mintable)
6. **MockWETH.sol** — ERC-20 mock WETH for testnet (mintable)
7. **Faucet.sol** — Distributes test tokens to users

**DEX Contracts:**
8. **SwapRouter.sol** — AMM swap router for token swaps
9. **LiquidityPool.sol** — AMM liquidity pool factory
10. **PriceOracle.sol** — Price feed oracle for asset valuations`,
  },
  {
    icon: FileCode,
    title: "3. LendingPool Contract",
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
        uint256 liquidationThreshold; // basis points (e.g., 8000 = 80%)
        uint256 ltv;                  // max loan-to-value in basis points
        uint256 totalSupplied;
        uint256 totalBorrowed;
        uint256 supplyRate;           // annualized, in basis points
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
    event Liquidation(address indexed user, address indexed collateral, address indexed debt, uint256 amount);

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
            supplyRate: 300,  // 3% default
            borrowRate: 500,  // 5% default
            isActive: true
        });
        reservesList.push(asset);
    }

    function supply(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        userPositions[asset][msg.sender].supplied += amount;
        reserves[asset].totalSupplied += amount;
        // Mint aTokens to user
        emit Supply(msg.sender, asset, amount);
    }

    function borrow(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        // Check health factor
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
        // Simplified: iterate reserves, sum collateral * LT / debt
        uint256 totalCollateralETH = 0;
        uint256 totalDebtETH = 0;
        for (uint i = 0; i < reservesList.length; i++) {
            address asset = reservesList[i];
            UserPosition memory pos = userPositions[asset][user];
            // Use oracle for price conversion
            totalCollateralETH += pos.supplied; // simplified
            totalDebtETH += pos.borrowed;
        }
        if (totalDebtETH == 0) return type(uint256).max;
        return (totalCollateralETH * 10000) / totalDebtETH;
    }
}
\`\`\``,
  },
  {
    icon: FileCode,
    title: "4. Mock Token & Faucet Contracts",
    content: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) { return 6; }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockWETH is ERC20, Ownable {
    constructor() ERC20("Mock WETH", "WETH") Ownable(msg.sender) {
        _mint(msg.sender, 10_000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

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
        // Assumes this contract has mint permission or holds tokens
        IERC20(token).transfer(msg.sender, amount);
    }
}
\`\`\``,
  },
  {
    icon: FileCode,
    title: "5. SwapRouter & LiquidityPool",
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

    constructor(
        address _tokenA,
        address _tokenB
    ) ERC20("ArcLend LP", "ARC-LP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 liquidity) {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        // Simplified: mint LP tokens proportionally
        liquidity = amountA + amountB; // simplified
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
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");
        bool isA = tokenIn == address(tokenA);
        (uint256 resIn, uint256 resOut) = isA ? (reserveA, reserveB) : (reserveB, reserveA);
        // x * y = k formula with 0.3% fee
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
\`\`\``,
  },
  {
    icon: Rocket,
    title: "6. Deployment Script (Hardhat)",
    content: `Create \`scripts/deploy.ts\`:

\`\`\`typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy Mock Tokens
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  console.log("USDT deployed:", await usdt.getAddress());

  const MockWETH = await ethers.getContractFactory("MockWETH");
  const weth = await MockWETH.deploy();
  console.log("WETH deployed:", await weth.getAddress());

  // 2. Deploy Price Oracle (simplified)
  // For production, use Chainlink price feeds
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await PriceOracle.deploy();
  console.log("Oracle deployed:", await oracle.getAddress());

  // 3. Deploy LendingPool
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const pool = await LendingPool.deploy(await oracle.getAddress());
  console.log("LendingPool deployed:", await pool.getAddress());

  // 4. Deploy Faucet
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();
  console.log("Faucet deployed:", await faucet.getAddress());

  // 5. Deploy Liquidity Pools
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const ethUsdtPool = await LiquidityPool.deploy(
    await weth.getAddress(),
    await usdt.getAddress()
  );
  console.log("ETH/USDT LP deployed:", await ethUsdtPool.getAddress());

  // 6. Configure Faucet
  await faucet.setClaimAmount(await usdt.getAddress(), ethers.parseUnits("1000", 6));
  await faucet.setClaimAmount(await weth.getAddress(), ethers.parseEther("1"));

  // 7. Fund faucet with tokens
  await usdt.mint(await faucet.getAddress(), ethers.parseUnits("1000000", 6));
  await weth.mint(await faucet.getAddress(), ethers.parseEther("10000"));

  console.log("\\n✅ Deployment complete!");
  console.log("\\nAdd these addresses to your .env:");
  console.log(\`VITE_USDT_ADDRESS=\${await usdt.getAddress()}\`);
  console.log(\`VITE_WETH_ADDRESS=\${await weth.getAddress()}\`);
  console.log(\`VITE_LENDING_POOL_ADDRESS=\${await pool.getAddress()}\`);
  console.log(\`VITE_FAUCET_ADDRESS=\${await faucet.getAddress()}\`);
  console.log(\`VITE_LP_ETH_USDT=\${await ethUsdtPool.getAddress()}\`);
}

main().catch(console.error);
\`\`\`

**Hardhat config (\`hardhat.config.ts\`):**
\`\`\`typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 84532,
    },
    rialoTestnet: {
      url: "https://testnet-rpc.rialo.network",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 9876,
    },
  },
};

export default config;
\`\`\`

**Deploy commands:**
\`\`\`bash
# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Deploy to Rialo Testnet
npx hardhat run scripts/deploy.ts --network rialoTestnet
\`\`\``,
  },
  {
    icon: CheckCircle,
    title: "7. Deployment Checklist",
    content: `**Base Sepolia Deployment:**
- [ ] Get Base Sepolia ETH from faucet
- [ ] Deploy MockUSDT contract
- [ ] Deploy MockWETH contract
- [ ] Deploy PriceOracle contract
- [ ] Deploy LendingPool contract
- [ ] Deploy AToken & DebtToken contracts
- [ ] Initialize reserves in LendingPool
- [ ] Deploy Faucet and fund with tokens
- [ ] Deploy LiquidityPool (ETH/USDT, WETH/USDT)
- [ ] Verify all contracts on BaseScan

**Rialo Testnet Deployment:**
- [ ] Get RIA testnet tokens
- [ ] Deploy MockUSDT contract
- [ ] Deploy MockWETH contract
- [ ] Deploy PriceOracle contract
- [ ] Deploy LendingPool contract
- [ ] Deploy Faucet and fund with tokens
- [ ] Deploy LiquidityPool (RIA/USDT, WETH/USDT, RIA/WETH)
- [ ] Verify contracts on Rialo Explorer

**Frontend Integration:**
- [ ] Add deployed contract addresses to environment config
- [ ] Update wagmi contract hooks with ABIs
- [ ] Test supply/borrow flow on both networks
- [ ] Test swap functionality
- [ ] Test faucet claims
- [ ] Test liquidity provision
- [ ] Verify health factor computation
- [ ] Test on mobile devices`,
  },
];

export default function DeployGuide() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Deployment Guide</h1>
          <p className="text-muted-foreground">
            Step-by-step guide to deploy all required smart contracts on Base Sepolia and Rialo Testnet.
          </p>
        </motion.div>

        <Card className="mb-8 border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="mb-1 font-semibold text-foreground">Testnet Only</p>
              <p className="text-muted-foreground">
                These contracts are for testnet deployment. Audit thoroughly before any mainnet deployment.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={i}
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
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
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
    .replace(/`([^`]+)`/g, '<code class="rounded bg-secondary px-1.5 py-0.5 text-xs text-primary">$1</code>');
}
