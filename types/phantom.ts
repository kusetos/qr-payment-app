import { PublicKey, Transaction, TransactionSignature } from "@solana/web3.js";

export interface PhantomProvider {
  isPhantom: true;
  publicKey?: PublicKey;
  connect: (opts?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: "connect" | "disconnect", handler: (key: PublicKey) => void) => void;

  // --- добавляем методы для подписи транзакций ---
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
}
