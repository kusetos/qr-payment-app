"use client";

interface WalletButtonProps {
  onClick: () => void;
  connected: boolean;
  address?: string | null;
}

export default function WalletButton({ onClick, connected, address }: WalletButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={connected} // отключаем кнопку, если уже подключены
      className={`px-4 py-2 rounded-lg transition ${
        connected
          ? "bg-green-600 text-white cursor-default"
          : "bg-purple-600 text-white hover:bg-purple-700"
      }`}
    >
      {connected
        ? `Connected: ${address?.slice(0, 4)}...${address?.slice(-4)}`
        : "Connect Phantom"}
    </button>
  );
}
