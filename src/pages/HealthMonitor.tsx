import { useState, useEffect } from "react";
import { Bell, ShieldCheck, Wallet, Mail, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkBadge } from "@/components/NetworkBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";

export default function HealthMonitor() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState({ at15: true, at12: true, at10: false });
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved settings
  useEffect(() => {
    if (!address) return;
    setLoading(true);
    supabase
      .from("alert_settings")
      .select("*")
      .eq("wallet_address", address.toLowerCase())
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setEmail(data.email || "");
          setTelegram(data.telegram || "");
          setAlerts({
            at15: data.alert_at_15,
            at12: data.alert_at_12,
            at10: data.alert_at_10,
          });
        }
        setLoading(false);
      });
  }, [address]);

  const handleSaveNotifications = async () => {
    if (!address) return;
    setSaving(true);
    const payload = {
      wallet_address: address.toLowerCase(),
      email: email || null,
      telegram: telegram || null,
      alert_at_15: alerts.at15,
      alert_at_12: alerts.at12,
      alert_at_10: alerts.at10,
    };

    const { error } = await supabase
      .from("alert_settings")
      .upsert(payload, { onConflict: "wallet_address" });

    setSaving(false);
    if (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Settings saved",
        description: "You'll receive alerts at the configured thresholds.",
      });
    }
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Connect your wallet to monitor your health factors and liquidation risks.
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Health & Liquidation Monitor</h1>
        <NetworkBadge />
      </div>

      <Card className="mb-6 glow-purple border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-primary">Monitor your health factors and set up alerts across your positions.</p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-sm text-foreground">Overall Health</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-muted/30 bg-muted/5">
              <span className="text-4xl font-bold text-muted-foreground">—</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">No active positions to monitor</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Bell className="h-4 w-4" /> Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "at15" as const, label: "Alert at HF ≤ 1.5", desc: "Early warning" },
              { key: "at12" as const, label: "Alert at HF ≤ 1.2", desc: "Caution zone" },
              { key: "at10" as const, label: "Alert at HF ≤ 1.0", desc: "Liquidation risk" },
            ].map((a) => (
              <div key={a.key} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <Switch checked={alerts[a.key]} onCheckedChange={(v) => setAlerts({ ...alerts, [a.key]: v })} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notification Channels */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Email Address</label>
              <Input
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-secondary"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Telegram Username</label>
              <Input
                placeholder="@username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="border-border bg-secondary"
              />
            </div>
          </div>
          <Button onClick={handleSaveNotifications} className="w-full" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Notification Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Positions Health</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No positions to display</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Liquidation History</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No liquidation events</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
