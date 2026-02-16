import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  return (
    <WalletMultiButton
      style={{
        backgroundColor: "hsl(263, 70%, 58%)",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        height: "2.5rem",
        padding: "0 1rem",
      }}
    />
  );
}

export function useWalletState() {
  const { publicKey, connected, connecting } = useWallet();
  return {
    publicKey,
    connected,
    connecting,
    shortAddress: publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : null,
  };
}
