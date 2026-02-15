import { motion } from "framer-motion";
import { Shield, Eye, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WalletButton } from "@/components/WalletButton";
import logo from "@/assets/logo.png";

const features = [
  { icon: Shield, title: "Encrypted Collateral", desc: "Your collateral amounts remain hidden from other participants using Arcium's MPC." },
  { icon: Eye, title: "Hidden Health Factors", desc: "Health factors computed in encrypted state — invisible to liquidation bots." },
  { icon: Lock, title: "Confidential Liquidations", desc: "Liquidation thresholds stay private, preventing front-running attacks." },
  { icon: Zap, title: "Solana Speed", desc: "Sub-second finality with Solana's high-performance runtime." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="dot-grid flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
        <img src={logo} alt="ArcLend" className="mx-auto mb-6 h-20 w-20" />
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
          <span className="text-gradient-purple">ArcLend</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Private lending & borrowing powered by <span className="text-primary">Arcium</span> on Solana. Your positions, encrypted.
        </p>

        <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <WalletButton />
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-primary/30 text-primary hover:bg-primary/10">
            Explore Demo
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Card key={i} className="glow-purple border-border bg-card">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <f.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
