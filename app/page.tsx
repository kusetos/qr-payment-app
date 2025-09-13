"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";
import WalletButton from "@/components/WalletButton";
import WalletInfo from "@/components/WalletInfo";
import TransferForm from "@/components/TransferSol";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Wallet, LogOut, QrCode, Zap } from 'lucide-react';
import { QRCodeSVG } from "qrcode.react";
import ScanQR from "@/components/ScanQR";
import GenerateQR from "@/components/GenerateQR";


export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [provider, setProvider] = useState<any>(null);
  const [action, setAction] = useState<"generate" | "pay" | null>(null)

  // ✅ инициализация провайдера
  useEffect(() => {
    const { solana } = window as any;
    if (solana?.isPhantom) {
      setProvider(solana);

      solana.on("connect", (publicKey: PublicKey) => {
        const address = publicKey.toString();
        setWalletAddress(address);
        toast.success("Wallet connected", { description: address });
      });

      solana.on("disconnect", () => {
        setWalletAddress(null);
        setProvider(null);
        toast("Wallet disconnected");
      });
    }
  }, []);

  // ✅ функция подключения
  const connectWallet = async () => {
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      toast.error("Phantom wallet not found", {
        description: "Please install Phantom extension",
        action: {
          label: "Download",
          onClick: () => window.open("https://phantom.app/", "_blank"),
        },
      });
      return;
    }
  
    try {
      console.log("Trying to connect...");
      const resp = await solana.connect({ onlyIfTrusted: false });
      console.log("Connected:", resp.publicKey.toString());
      console.log("Connect response:", resp);
  
      const address = resp.publicKey.toString();
      setWalletAddress(address);
      setProvider(solana);
  
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const balanceLamports = await connection.getBalance(new PublicKey(address));
      setBalance(balanceLamports / 1e9);
  
      toast.success("Wallet connected", {
        description: `Address: ${address.slice(0, 4)}...${address.slice(-4)} | Balance: ${(balanceLamports / 1e9).toFixed(2)} SOL`,
      });
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      toast.error("Failed to connect wallet", {
        description: err.message ?? "Unknown error",
      });
    }
  };  

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-md flex items-center justify-center shadow-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">Q-PAY</h1>
        </div>
        <div className="flex items-center gap-2 pb-6">
          <ModeToggle />
          {walletAddress && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => provider?.disconnect()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Wallet connect */}
      {!walletAddress ? (
        <Card className="w-full max-w-md p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Welcome to Solana Payments</h2>
            <p className="text-muted-foreground">Fast, secure, and decentralized transactions on the Solana blockchain.</p>
          </div>
          <WalletButton
            onClick={connectWallet}
            connected={!!walletAddress}
            address={walletAddress}
          />
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-lg rounded-2xl mt-6">
          <CardContent className="flex flex-col gap-6">
            {/* Инфо о кошельке */}
            <div className="flex items-center justify-between">
              <WalletInfo address={walletAddress} balance={balance} />
            </div>

            {/* QR действия */}
            {!action ? (
              <div className="flex flex-col gap-4">
                <Button className="w-full" onClick={() => setAction("generate")}>
                  Сгенерировать QR
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setAction("pay")}
                >
                  Оплатить QR
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Результат выбора */}
                {action === "generate" && (
                  <GenerateQR walletAddress={walletAddress} />
                )}

                {action === "pay" && <ScanQR provider={provider} />}

                {/* Кнопка назад */}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setAction(null)}
                >
                  ← Назад
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
