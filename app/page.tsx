"use client";
import WalletButton from "@/components/WalletButton";
import WalletInfo from "@/components/WalletInfo";
import { usePhantom } from "@/hooks/usePhantom";

export default function Home() {
  const { walletAddress, balance, connectWallet } = usePhantom();

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Solana Phantom Demo</h1>

      {walletAddress ? (
        <WalletInfo address={walletAddress} balance={balance} />
      ) : (
        <WalletButton onClick={connectWallet} />
      )}
    </main>
  );
}
