"use client";

import { useState, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import WalletInfo from "@/components/WalletInfo";
import TransferForm from "@/components/TransferSol";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [provider, setProvider] = useState<any>(null);

  // connect wallet
  const connectWallet = async () => {
    const { solana } = window as any;
    if (solana?.isPhantom) {
      try {
        const resp = await solana.connect();
        setWalletAddress(resp.publicKey.toString());
        setProvider(solana); // ✅ store provider
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("Phantom wallet not found! Please install it.");
    }
  };

  return (
    <main className="p-4">
      {walletAddress ? (
        <>
          <WalletInfo address={walletAddress} balance={balance} />
          <TransferForm provider={provider} /> {/* ✅ provider now defined */}
        </>
      ) : (
        <WalletButton onClick={connectWallet} />
      )}
    </main>
  );
}
