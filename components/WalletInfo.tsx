"use client";

import { useState } from "react";

interface WalletInfoProps {
  address: string | null;
  balance: number;
}

export default function WalletInfo({ address, balance }: WalletInfoProps) {
  const [showFull, setShowFull] = useState(false);

  if (!address) return null;

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">
        Адрес:{" "}
        <button
          onClick={() => setShowFull((prev) => !prev)}
          className="text-blue-600 hover:underline"
        >
          {showFull ? address : shortAddress}
        </button>
      </p>
      <p className="text-sm text-muted-foreground">
        Баланс: {balance.toFixed(2)} SOL
      </p>
    </div>
  );
}
