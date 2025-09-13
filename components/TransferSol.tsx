"use client";

import { useState } from "react";
import { sendSol, sendSplToken } from "@/lib/sendTx";

export default function TransferForm({ provider }: { provider: any }) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("SOL");
  const [txid, setTxid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return alert("Wallet not connected");

    setLoading(true);
    setTxid(null);

    try {
      let sig;
      if (currency === "SOL") {
        sig = await sendSol(provider, toAddress, parseFloat(amount));
      } else {
        sig = await sendSplToken(
          provider,
          toAddress,
          parseFloat(amount),
          currency
        );
      }
      setTxid(sig);
    } catch (err) {
      console.error(err);
      alert("Transaction failed: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Recipient Pubkey"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded p-2"
        required
      />

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="SOL">SOL</option>
        <option value="USDC">USDC</option>
        <option value="USDT">USDT</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {txid && (
        <p>
          ✅ Sent!{" "}
          <a
            href={`https://explorer.solana.com/tx/${txid}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View Transaction
          </a>
        </p>
      )}
    </form>
  );
}
