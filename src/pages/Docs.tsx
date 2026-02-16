import { motion } from "framer-motion";
import { BookOpen, Terminal, Code, Shield, Layers, Zap, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    id: "overview",
    icon: BookOpen,
    title: "1. Overview — What is ArcLend?",
    content: `ArcLend is a private lending and borrowing protocol built on Solana, powered by Arcium's Multi-Party Computation (MPC) network. Unlike traditional DeFi lending protocols (Aave, Compound, Solend), ArcLend keeps your financial data encrypted:

• **Collateral amounts** — Hidden from all other participants
• **Health factors** — Computed in encrypted state, invisible to liquidation bots
• **Liquidation thresholds** — Private, preventing front-running attacks
• **Position sizes** — Encrypted end-to-end via Arcium's MPC

This is achieved using Arcium's MXE (MPC eXecution Environment), which allows computations to run on fully encrypted data without ever decrypting it.`,
  },
  {
    id: "architecture",
    icon: Layers,
    title: "2. Architecture & How It Works",
    content: `ArcLend's architecture has four key components:

**Frontend (This Website)**
• React + TypeScript SPA with Solana wallet adapter integration
• Connects to Solana devnet via @solana/web3.js
• Sends encrypted transactions using @arcium-hq/client SDK

**Solana Smart Contracts (MXE Program)**
• Written in Rust using Anchor framework + Arcium SDK
• Defines lending pool state, user positions, and interest rate models
• Submits encrypted computations to Arcium's network via CPI (Cross-Program Invocation)

**Arcium MPC Network**
• Decentralized cluster of MPC nodes that process encrypted computations
• Computes health factors, liquidation checks, and interest accruals without seeing plaintext data
• Returns encrypted results back to the on-chain program via callbacks

**Computation Lifecycle**
1. Client encrypts data using \`@arcium-hq/client\` → sends to MXE program
2. MXE program formats computation → submits to Arcium Program via CPI
3. Arcium Program assigns computation to MPC cluster
4. MPC nodes compute on secret shares → return signed result
5. Callback instruction receives and verifies the output on-chain`,
  },
  {
    id: "prerequisites",
    icon: Terminal,
    title: "3. Prerequisites & Installation",
    content: `Before deploying ArcLend contracts, you need:

**System Requirements**
\`\`\`bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --force
avm install latest && avm use latest

# Install Arcium CLI (wraps Anchor CLI)
cargo install --git https://github.com/arcium-hq/arcium-cli
\`\`\`

**Node.js Dependencies**
\`\`\`bash
npm install @arcium-hq/client @arcium-hq/reader @solana/web3.js @coral-xyz/anchor
\`\`\`

**Configure Solana for Devnet**
\`\`\`bash
solana config set --url https://api.devnet.solana.com
solana-keygen new  # Generate a new keypair
solana airdrop 2   # Get devnet SOL
\`\`\``,
  },
  {
    id: "contracts",
    icon: Code,
    title: "4. Smart Contract Development",
    content: `**Step 1: Initialize the Arcium Project**
\`\`\`bash
arcium init arclend
cd arclend
\`\`\`

**Step 2: Define Encrypted Instructions (Arcis)**

Arcis is a Rust-based framework for writing MPC circuits. Create your lending logic in \`circuits/src/lib.rs\`:

\`\`\`rust
use arcis::*;

#[encrypted]
mod lending_circuits {
    use arcis::*;

    pub struct HealthFactorInput {
        collateral_value: u64,  // in lamports
        debt_value: u64,
        liquidation_threshold: u64, // basis points (e.g., 8000 = 80%)
    }

    // Compute health factor privately
    #[instruction]
    pub fn compute_health_factor(
        input: Enc<Shared, HealthFactorInput>
    ) -> Enc<Shared, u64> {
        let data = input.to_arcis();
        let hf = (data.collateral_value * data.liquidation_threshold) 
                 / (data.debt_value * 10000);
        input.owner.from_arcis(hf)
    }

    pub struct LiquidationCheck {
        health_factor: u64,
        threshold: u64, // typically 10000 = 1.0
    }

    // Check if position should be liquidated (returns 1 or 0)
    #[instruction]
    pub fn check_liquidation(
        input: Enc<Shared, LiquidationCheck>
    ) -> Enc<Shared, u64> {
        let data = input.to_arcis();
        let should_liquidate = if data.health_factor < data.threshold { 1u64 } else { 0u64 };
        input.owner.from_arcis(should_liquidate)
    }
}
\`\`\`

**Step 3: Write the MXE Program (Anchor)**

In \`programs/arclend/src/lib.rs\`:

\`\`\`rust
use anchor_lang::prelude::*;
use arcium_anchor::*;

declare_id!("YOUR_PROGRAM_ID");

#[program]
mod arclend {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        token_mint: Pubkey,
        liquidation_threshold: u64,
        ltv: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.token_mint = token_mint;
        pool.liquidation_threshold = liquidation_threshold;
        pool.ltv = ltv;
        pool.total_supplied = 0;
        pool.total_borrowed = 0;
        Ok(())
    }

    pub fn supply(
        ctx: Context<Supply>,
        amount: u64,
    ) -> Result<()> {
        // Transfer tokens to pool vault
        // Update user position (encrypted via Arcium)
        Ok(())
    }

    pub fn compute_health_factor(
        ctx: Context<ComputeHealthFactor>,
        computation_offset: u64,
        encrypted_collateral: [u8; 32],
        encrypted_debt: [u8; 32],
        encrypted_threshold: [u8; 32],
        pub_key: [u8; 32],
        nonce: u128,
    ) -> Result<()> {
        let args = ArgBuilder::new()
            .x25519_pubkey(pub_key)
            .plaintext_u128(nonce)
            .encrypted_u64(encrypted_collateral)
            .encrypted_u64(encrypted_debt)
            .encrypted_u64(encrypted_threshold)
            .build();

        ctx.accounts.sign_pda_account.bump = ctx.bumps.sign_pda_account;

        queue_computation(
            ctx.accounts,
            computation_offset,
            args,
            vec![ComputeHealthFactorCallback::callback_ix(
                computation_offset,
                &ctx.accounts.mxe_account,
                &[],
            )?],
            1,
            0,
        )?;
        Ok(())
    }

    #[arcium_callback(encrypted_ix = "compute_health_factor")]
    pub fn compute_health_factor_callback(
        ctx: Context<ComputeHealthFactorCallback>,
        output: SignedComputationOutputs<ComputeHealthFactorOutput>,
    ) -> Result<()> {
        let result = output.verify_output(
            &ctx.accounts.cluster_account,
            &ctx.accounts.computation_account,
        )?;
        // Store encrypted health factor on-chain
        // Emit event with encrypted result
        Ok(())
    }
}
\`\`\`

**Step 4: Build & Deploy**
\`\`\`bash
# Build the program
arcium build

# Deploy to devnet
arcium deploy --provider.cluster devnet

# Initialize the MXE
arcium init-mxe --cluster-id <CLUSTER_ID>
\`\`\``,
  },
  {
    id: "client-integration",
    icon: Zap,
    title: "5. Frontend Integration (TypeScript)",
    content: `**Connecting the Frontend to Your Deployed Contracts**

**Step 1: Configure the Arcium Client**
\`\`\`typescript
import { ArciumClient } from "@arcium-hq/client";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID");

const arciumClient = new ArciumClient({
  connection,
  programId: PROGRAM_ID,
});
\`\`\`

**Step 2: Encrypt Data Before Sending**
\`\`\`typescript
import { encrypt } from "@arcium-hq/client";

async function supplyCollateral(amount: number) {
  const wallet = useWallet(); // from @solana/wallet-adapter-react
  
  // Encrypt the collateral amount using Arcium
  const { ciphertext, nonce, pubKey } = await encrypt(
    arciumClient,
    BigInt(amount * 1e9), // Convert to lamports
    wallet.publicKey!,
  );

  // Build and send the transaction
  const tx = await program.methods
    .supply(ciphertext, nonce, pubKey)
    .accounts({ /* ... pool accounts ... */ })
    .transaction();
    
  await wallet.sendTransaction(tx, connection);
}
\`\`\`

**Step 3: Read Encrypted Results**
\`\`\`typescript
import { ArciumReader } from "@arcium-hq/reader";

const reader = new ArciumReader({ connection });

// Subscribe to computation results
reader.onComputationComplete(computationId, async (result) => {
  // Decrypt the result client-side
  const healthFactor = await decrypt(
    arciumClient,
    result.output,
    wallet, // Only the position owner can decrypt
  );
  console.log("Health Factor:", healthFactor);
});
\`\`\`

**Step 4: Update Environment Variables**

In your \`.env\` file:
\`\`\`
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID
VITE_MXE_ACCOUNT=YOUR_MXE_ACCOUNT_ADDRESS
\`\`\``,
  },
  {
    id: "features",
    icon: Shield,
    title: "6. ArcLend Features — Detailed Breakdown",
    content: `**Dashboard Page (/dashboard)**
• Displays portfolio overview: total supplied, borrowed, net worth, net APY
• Shows overall health factor (computed via Arcium MPC — encrypted)
• Earnings chart tracking yield over time
• Recent activity feed showing all transactions
• 🔒 Privacy badges indicate which data fields are encrypted

**Markets Page (/markets)**
• Lists all available lending pools (SOL, USDC, mSOL, jitoSOL, BONK, RAY)
• Each pool shows: Supply APY, Borrow APY, Total Liquidity, Utilization Rate
• Sort by liquidity, supply APY, or borrow APY
• Supply/Borrow modals with real-time health factor impact preview
• All position data encrypted via Arcium before submission

**Positions Page (/positions)**
• "My Supplies" tab: View all supplied assets with amounts, APY earned
• "My Borrows" tab: View all borrowed assets with interest rates
• Withdraw modal: Preview health factor change before withdrawal
• Repay modal: Pay back borrowed assets
• All position sizes remain encrypted on-chain

**Health Monitor Page (/health)**
• Large visual health factor gauge per position
• Alert settings: Toggle notifications at HF ≤ 1.5, 1.2, 1.0
• Liquidation history showing past events
• Privacy callout: Health factors computed in encrypted state
• Warning banners when approaching danger zone

**What Needs Integration to Be Fully Functional:**
1. Deploy the Arcium-enabled Solana program (see Section 4)
2. Configure the program ID in environment variables
3. Connect the frontend supply/borrow actions to on-chain transactions
4. Implement encrypted health factor computation via Arcium CPI
5. Set up the computation callback to store results
6. Add price oracle integration (Pyth/Switchboard) for real-time pricing
7. Implement interest rate model in the smart contract
8. Add liquidation bot logic (that respects encrypted thresholds)`,
  },
  {
    id: "deployment-checklist",
    icon: CheckCircle,
    title: "7. Deployment Checklist",
    content: `**Smart Contract Deployment**
- [ ] Install Rust, Solana CLI, Anchor, and Arcium CLI
- [ ] Write Arcis circuits for health factor & liquidation checks
- [ ] Write Anchor program with Arcium CPI integration
- [ ] Build with \`arcium build\`
- [ ] Deploy to devnet with \`arcium deploy\`
- [ ] Initialize MXE with \`arcium init-mxe\`
- [ ] Verify computation definitions are registered

**Frontend Configuration**
- [ ] Set VITE_PROGRAM_ID to your deployed program
- [ ] Set VITE_SOLANA_RPC_URL (devnet or mainnet)
- [ ] Install @arcium-hq/client and @arcium-hq/reader
- [ ] Replace placeholder supply/borrow handlers with real transactions
- [ ] Implement client-side encryption before sending amounts
- [ ] Add computation result listeners for health factor updates

**Testing**
- [ ] Test supply flow end-to-end on devnet
- [ ] Test borrow flow with collateral requirements
- [ ] Verify health factor computation returns correct encrypted results
- [ ] Test liquidation check circuit
- [ ] Test wallet connect/disconnect flow
- [ ] Test on mobile (responsive layout)

**Production (Mainnet)**
- [ ] Audit smart contracts
- [ ] Switch RPC to mainnet-beta
- [ ] Configure production MPC cluster
- [ ] Set up monitoring for computation failures
- [ ] Implement proper error handling for failed MPC computations`,
  },
  {
    id: "resources",
    icon: ExternalLink,
    title: "8. External Resources",
    content: `**Arcium Documentation**
• [Arcium Developer Docs](https://docs.arcium.com/developers) — Full developer guide
• [Computation Lifecycle](https://docs.arcium.com/developers/computation-lifecycle) — How MPC computations work
• [Arcis Framework](https://docs.arcium.com/developers/arcis) — Writing MPC circuits in Rust
• [Program Integration](https://docs.arcium.com/developers/program) — Invoking computations from Solana
• [TypeScript SDK API](https://ts.arcium.com/api) — Client & Reader SDK reference
• [Hello World Tutorial](https://docs.arcium.com/developers/hello-world) — Your first Arcium computation
• [Installation Guide](https://docs.arcium.com/developers/installation) — Setup dev environment

**Arcium SDKs**
• [@arcium-hq/client](https://www.npmjs.com/package/@arcium-hq/client) — Encryption/decryption & computation tracking
• [@arcium-hq/reader](https://www.npmjs.com/package/@arcium-hq/reader) — On-chain data monitoring & subscriptions

**Solana Resources**
• [Solana Docs](https://docs.solana.com) — Solana developer documentation
• [Anchor Framework](https://www.anchor-lang.com) — Solana smart contract framework
• [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) — Wallet integration

**Community**
• [Arcium Discord](https://discord.com/invite/arcium) — Developer community
• [gMPC.xyz](https://gmpc.xyz) — Arcium ecosystem
• [GitHub Examples](https://github.com/arcium-hq/examples) — Real-world Arcium examples`,
  },
];

export default function Docs() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">ArcLend Documentation</h1>
          <p className="text-muted-foreground">
            Complete guide to deploying, integrating, and using ArcLend with Arcium on Solana.
          </p>
        </motion.div>

        {/* Warning banner */}
        <Card className="mb-8 border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="mb-1 font-semibold text-foreground">Testnet Only</p>
              <p className="text-muted-foreground">
                ArcLend is currently designed for Solana devnet. The Arcium network is in Public Testnet.
                Smart contracts must be deployed before the full lending functionality is active.
                This frontend serves as the interface layer — follow the steps below to make it fully functional.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Table of contents */}
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

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s, i) => (
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
                    {s.content.split("\n").map((line, j) => {
                      if (line.startsWith("```")) {
                        return null; // handled below
                      }
                      return null;
                    })}
                    {/* Render with code blocks */}
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
  let codeLang = "";

  lines.forEach((line, i) => {
    if (line.startsWith("```") && !inCode) {
      inCode = true;
      codeLang = line.slice(3).trim();
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
    } else if (line.startsWith("- [") && line.includes("]")) {
      // Checklist items
      const checked = line.includes("[x]");
      const text = line.replace(/- \[[ x]\] /, "");
      parts.push(
        <div key={`check-${i}`} className="flex items-center gap-2 py-0.5">
          <span className={`inline-block h-3.5 w-3.5 rounded border ${checked ? "border-primary bg-primary" : "border-border"}`} />
          <span>{text}</span>
        </div>
      );
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      const text = line.slice(2);
      parts.push(
        <div key={`li-${i}`} className="flex gap-2 py-0.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
          <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </div>
      );
    } else if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      const text = line.replace(/^\d+\. /, "");
      parts.push(
        <div key={`ol-${i}`} className="flex gap-2 py-0.5">
          <span className="shrink-0 text-primary">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </div>
      );
    } else if (line.trim() === "") {
      parts.push(<div key={`br-${i}`} className="h-2" />);
    } else {
      parts.push(
        <p key={`p-${i}`} className="py-0.5" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
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
