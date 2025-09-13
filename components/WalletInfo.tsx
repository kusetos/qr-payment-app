"use client";

interface WalletInfoProps {
  address: string;
  balance: number | null;
}

export default function WalletInfo({ address, balance }: WalletInfoProps) {
  return (
    <div className="space-y-2">
      <p><strong>Wallet:</strong> {address}</p>
      <p><strong>Balance:</strong> {balance} SOL</p>
    </div>
  );
}
