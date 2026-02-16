import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Positions() {
  const { connected } = useWalletState();
  const navigate = useNavigate();

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Connect your Solana wallet to view and manage your lending positions.
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">My Positions</h1>
        <PrivacyBadge />
      </div>

      <Tabs defaultValue="supplies">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="supplies">My Supplies (0)</TabsTrigger>
          <TabsTrigger value="borrows">My Borrows (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="supplies">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Supplied Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No supplied assets</p>
                <p className="mt-1 text-xs text-muted-foreground">Supply assets in the Markets page to get started</p>
                <Button size="sm" className="mt-4" onClick={() => navigate("/markets")}>
                  Browse Markets
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrows">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Borrowed Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No borrowed assets</p>
                <p className="mt-1 text-xs text-muted-foreground">You need to supply collateral before borrowing</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
