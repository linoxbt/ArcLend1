import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, BellRing, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TokenIcon } from "@/components/TokenIcon";
import { supabase } from "@/integrations/supabase/client";

interface PriceAlert {
  id: string;
  token: string;
  condition: "above" | "below";
  targetPrice: number;
  createdAt: number;
  triggered: boolean;
}

const TOKENS = ["RIA", "WETH", "USDT", "ALND"];

interface PriceAlertsProps {
  prices: Record<string, number>;
  walletAddress?: string;
}

export function PriceAlerts({ prices, walletAddress }: PriceAlertsProps) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    token: "WETH",
    condition: "above" as "above" | "below",
    targetPrice: "",
  });

  // Load alerts from localStorage
  useEffect(() => {
    if (!walletAddress) return;
    const key = `arclend_alerts_${walletAddress.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch {}
    }
  }, [walletAddress]);

  // Save alerts to localStorage
  useEffect(() => {
    if (!walletAddress) return;
    const key = `arclend_alerts_${walletAddress.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(alerts));
  }, [alerts, walletAddress]);

  // Check alerts against current prices
  useEffect(() => {
    alerts.forEach((alert) => {
      if (alert.triggered) return;
      const currentPrice = prices[alert.token] || 0;
      const shouldTrigger =
        (alert.condition === "above" && currentPrice >= alert.targetPrice) ||
        (alert.condition === "below" && currentPrice <= alert.targetPrice);

      if (shouldTrigger) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, triggered: true } : a))
        );
        toast.success(t("alertTriggered"), {
          description: `${alert.token} ${t("currentPrice")}: $${currentPrice.toFixed(2)} (${t("targetPrice")}: $${alert.targetPrice})`,
          icon: <BellRing className="h-4 w-4" />,
        });
      }
    });
  }, [prices, alerts, t]);

  const handleCreateAlert = () => {
    const targetPrice = parseFloat(newAlert.targetPrice);
    if (isNaN(targetPrice) || targetPrice <= 0) return;

    const alert: PriceAlert = {
      id: crypto.randomUUID(),
      token: newAlert.token,
      condition: newAlert.condition,
      targetPrice,
      createdAt: Date.now(),
      triggered: false,
    };

    setAlerts((prev) => [...prev, alert]);
    setDialogOpen(false);
    setNewAlert({ token: "WETH", condition: "above", targetPrice: "" });
    toast.success(t("alertCreated"), {
      description: `${alert.token} ${alert.condition === "above" ? t("priceAbove") : t("priceBelow")} $${targetPrice}`,
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />
          {t("priceAlerts")}
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              {t("setAlert")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("setAlert")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Select
                  value={newAlert.token}
                  onValueChange={(v) => setNewAlert((p) => ({ ...p, token: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TOKENS.map((token) => (
                      <SelectItem key={token} value={token}>
                        <div className="flex items-center gap-2">
                          <TokenIcon symbol={token} size="sm" />
                          {token}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("alertWhen")}</Label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(v) =>
                    setNewAlert((p) => ({ ...p, condition: v as "above" | "below" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">{t("priceAbove")}</SelectItem>
                    <SelectItem value="below">{t("priceBelow")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("targetPrice")} ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice}
                  onChange={(e) =>
                    setNewAlert((p) => ({ ...p, targetPrice: e.target.value }))
                  }
                  placeholder={`${t("currentPrice")}: $${(prices[newAlert.token] || 0).toFixed(2)}`}
                />
              </div>
              <Button onClick={handleCreateAlert} className="w-full">
                {t("setAlert")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {activeAlerts.length === 0 && triggeredAlerts.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center py-4"
            >
              No active alerts
            </motion.p>
          )}
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
            >
              <div className="flex items-center gap-2">
                <TokenIcon symbol={alert.token} size="sm" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {alert.token} {alert.condition === "above" ? "↑" : "↓"} $
                    {alert.targetPrice.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("currentPrice")}: ${(prices[alert.token] || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleDeleteAlert(alert.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </motion.div>
          ))}
          {triggeredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-3"
            >
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {alert.token} {alert.condition === "above" ? "↑" : "↓"} $
                    {alert.targetPrice.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-primary">{t("alertTriggered")}</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleDeleteAlert(alert.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
