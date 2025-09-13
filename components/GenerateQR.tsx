"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function GenerateQR({ walletAddress }: { walletAddress: string }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("SOL");
  const [qrData, setQrData] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!walletAddress || !amount) return;

    const payload = {
      to: walletAddress,
      amount: parseFloat(amount),
      currency,
    };

    setQrData(JSON.stringify(payload));
  };

  // ❌ Сброс QR если меняется поле
  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setter(e.target.value);
    setQrData(null);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="font-semibold text-lg">Сгенерировать QR</h2>

      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={handleChange(setAmount)}
        className="w-full border rounded p-2"
      />

      <select
        value={currency}
        onChange={handleChange(setCurrency)}
        className="w-full border rounded p-2"
      >
        <option value="SOL">SOL</option>
        <option value="USDC">USDC</option>
        <option value="USDT">USDT</option>
      </select>

      <button
        onClick={handleGenerate}
        className="w-full px-4 py-2 rounded bg-blue-600 text-white"
      >
        Сгенерировать QR
      </button>

      {qrData && (
        <div className="flex flex-col items-center gap-2">
          <QRCodeSVG value={qrData} size={128} />
          <p className="text-xs text-muted-foreground">QR готов для сканирования</p>
        </div>
      )}
    </div>
  );
}
