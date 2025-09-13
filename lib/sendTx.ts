import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// -------- Send Native SOL --------
export async function sendSol(
  provider: any,
  toAddress: string,
  amountSol: number
) {
  if (!provider?.publicKey) throw new Error("Wallet not connected");

  const fromPubkey = provider.publicKey;
  const toPubkey = new PublicKey(toAddress);
  const lamports = amountSol * 1_000_000_000;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  transaction.feePayer = fromPubkey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const signed = await provider.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");

  return txid;
}

// -------- Send SPL Token (USDC, USDT, etc.) --------
export async function sendSplToken(
  provider: any,
  toAddress: string,
  amount: number,
  symbol: string
) {
  if (!provider?.publicKey) throw new Error("Wallet not connected");

  const fromPubkey = provider.publicKey;
  const toPubkey = new PublicKey(toAddress);

  // For devnet: example mints (replace with mainnet if needed)
  const tokenMints: Record<string, string> = {
    USDC: "Es9vMFrzaCERH1fDdb2k9GBEi5dzQNRDASTyC1b7zjfm", // mainnet USDC
    USDT: "Es9vMFrzaCERH1fDdb2k9GBEi5dzQNRDASTyC1b7zjfm", // replace with correct devnet mint
  };

  const mint = new PublicKey(tokenMints[symbol]);
  const fromTokenAccount = await getAssociatedTokenAddressSync(mint, fromPubkey);
  const toTokenAccount = await getAssociatedTokenAddressSync(mint, toPubkey);

  // Check if recipient ATA exists (for real apps, you'd need to create if missing)
  try {
    await getAccount(connection, toTokenAccount);
  } catch {
    throw new Error("Recipient does not have a token account for " + symbol);
  }

  const transaction = new Transaction().add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPubkey,
      amount * 1_000_000 // USDC/USDT usually 6 decimals
    )
  );

  transaction.feePayer = fromPubkey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const signed = await provider.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");

  return txid;
}
