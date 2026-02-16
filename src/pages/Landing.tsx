import { motion } from "framer-motion";
import { Shield, Eye, Lock, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { useWalletState } from "@/components/WalletButton";
import { Footer } from "@/components/Footer";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Shield,
    title: "Encrypted Collateral",
    desc: "Your collateral amounts remain hidden from other participants using Arcium's MPC network.",
  },
  {
    icon: Eye,
    title: "Hidden Health Factors",
    desc: "Health factors computed in encrypted state — invisible to liquidation bots and MEV extractors.",
  },
  {
    icon: Lock,
    title: "Confidential Liquidations",
    desc: "Liquidation thresholds stay private, preventing front-running attacks on vulnerable positions.",
  },
  {
    icon: Zap,
    title: "Solana Speed",
    desc: "Sub-second finality with Solana's high-performance runtime. DeFi privacy without compromising speed.",
  },
];

const stats = [
  { label: "Privacy Protocol", value: "Arcium MPC" },
  { label: "Network", value: "Solana" },
  { label: "Status", value: "Testnet" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { connected } = useWalletState();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ArcLend" className="h-8 w-8" />
            <span className="text-lg font-bold text-foreground">ArcLend</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <button onClick={() => navigate("/docs")} className="text-sm text-muted-foreground hover:text-foreground">
              Docs
            </button>
            <a href="https://docs.arcium.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              Arcium <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <WalletButton />
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <section className="dot-grid flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live on Solana Devnet
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Private Lending
              <br />
              <span className="text-gradient-purple">Powered by Arcium</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The first lending protocol where your positions, health factors, and liquidation thresholds are encrypted end-to-end using multi-party computation.
            </p>

            <div className="mb-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {connected ? (
                <Button
                  size="lg"
                  className="glow-purple bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate("/dashboard")}
                >
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <WalletButton />
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/docs")}
                className="border-border text-foreground hover:bg-secondary"
              >
                Read the Docs
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-16 flex flex-wrap justify-center gap-6 sm:gap-12"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto grid w-full max-w-5xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-card/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">How ArcLend Works</h2>
            <p className="mb-12 text-muted-foreground">Privacy-preserving DeFi in three steps</p>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "01", title: "Connect Wallet", desc: "Connect your Phantom or Solflare wallet to the Solana devnet." },
                { step: "02", title: "Encrypt & Supply", desc: "Your collateral amounts are encrypted via Arcium's MPC before submission." },
                { step: "03", title: "Private Positions", desc: "Health factors and liquidation thresholds remain hidden from all other parties." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <span className="mb-3 inline-block text-3xl font-bold text-primary/30">{item.step}</span>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
