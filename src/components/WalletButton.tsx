import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const [connected, setConnected] = useState(false);
  const address = "8xK9...m3Fq";

  if (connected) {
    return (
      <Button variant="outline" size="sm" className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setConnected(false)}>
        <Wallet className="mr-2 h-4 w-4" />
        {address}
      </Button>
    );
  }

  return (
    <Button className="glow-purple bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setConnected(true)}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
