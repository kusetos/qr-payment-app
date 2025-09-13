"use client";

interface WalletButtonProps {
  onClick: () => void;
}

export default function WalletButton({ onClick }: WalletButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg"
    >
      Connect Phantom
    </button>
  );
}
