import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics";
import { PriceAlerts } from "@/components/PriceAlerts";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { Wallet, BarChart3 } from "lucide-react";
import { NetworkBadge } from "@/components/NetworkBadge";

export default function Analytics() {
  const { t } = useTranslation();
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { state, prices } = useVirtualState(address);

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">{t("connectWallet")}</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {t("connectWalletDesc")}
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {t("portfolioAnalytics")}
          </h1>
        </div>
        <NetworkBadge />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioAnalytics state={state} prices={prices} />
        </div>
        <div>
          <PriceAlerts prices={prices} walletAddress={address} />
        </div>
      </div>
    </DashboardLayout>
  );
}
