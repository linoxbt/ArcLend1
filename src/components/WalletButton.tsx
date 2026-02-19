import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function WalletButton() {
  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
      accountStatus="avatar"
    />
  );
}

export function useWalletState() {
  const { address, isConnected, isConnecting } = useAccount();
  return {
    address,
    connected: isConnected,
    connecting: isConnecting,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
  };
}
