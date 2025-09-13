"use client";
import { useState } from "react";
import { connection } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";

export function usePhantom() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const connectWallet = async () => {
    const provider = (window as any).solana;

    if (provider?.isPhantom) {
      try {
        const resp = await provider.connect();
        const pubKey = resp.publicKey.toString();
        setWalletAddress(pubKey);

        const balanceLamports = await connection.getBalance(new PublicKey(pubKey));
        setBalance(balanceLamports / 1e9);
      } catch (err) {
        console.error("Connection error:", err);
      }
    } else {
      alert("Phantom Wallet not found! Install it first.");
    }
  };

  return { walletAddress, balance, connectWallet };
}
