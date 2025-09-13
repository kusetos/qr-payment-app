"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { sendSol, sendSplToken } from "@/lib/sendTx";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PhantomProvider } from "@/types/phantom";

interface ParsedQR {
  to: string;
  amount: number;
  currency: string;
}

type TxStatus = "idle" | "loading" | "success" | "error";

export default function ScanQR({ provider }: { provider: PhantomProvider | null }) {
const [showFullAddress, setShowFullAddress] = useState(false);
  const [parsedQR, setParsedQR] = useState<ParsedQR | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [openDialog, setOpenDialog] = useState(false);

  const qrRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const divId = "qr-reader";

  const startScanner = async () => {
    if (!qrRef.current) return;

    try {
      await qrRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText: string) => {
          try { await qrRef.current?.stop(); } catch {}
          try {
            const parsed: ParsedQR = JSON.parse(decodedText);
            setParsedQR(parsed);
            setTxStatus("idle");
            setOpenDialog(true);
          } catch {
            setParsedQR(null);
          }
        },
        (errorMessage: string) => {
          // Можно игнорировать или логировать ошибки сканирования
          console.warn("QR scan error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Не удалось запустить сканер:", err);
    }
  };

  useEffect(() => {
    if (!document.getElementById(divId) || startedRef.current) return;
    startedRef.current = true;

    qrRef.current = new Html5Qrcode(divId);
    startScanner();

    return () => {
      if (qrRef.current && qrRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        qrRef.current.stop().catch(() => {});
      }
      startedRef.current = false;
    };
  }, []);

  const handleConfirm = async () => {
    if (!provider || !parsedQR) return;
    setTxStatus("loading");

    try {
      let sig;
      if (parsedQR.currency === "SOL") {
        sig = await sendSol(provider, parsedQR.to, parsedQR.amount);
      } else {
        sig = await sendSplToken(provider, parsedQR.to, parsedQR.amount, parsedQR.currency);
      }
      console.log("Tx sig:", sig);
      setTxStatus("success");
    } catch (err) {
      console.error(err);
      setTxStatus("error");
    }
  };

  const handleRetry = async () => {
    setTxStatus("idle");
    setOpenDialog(false);
    setParsedQR(null);

    // Перезапускаем сканер
    startScanner();
  };

  return (
    <div className="w-full mx-auto">
        <div
        id={divId}
        className={`border rounded w-full h-[300px] mb-4 ${openDialog ? "hidden" : "block"}`}
        />

      {openDialog && parsedQR && (
        <Card className="w-full max-w-sm mx-auto bg-background border-border shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Подтверждение платежа
            </h3>

            {txStatus !== "idle" && (
              <div className="flex flex-col items-center justify-center py-8 mb-6">
                {txStatus === "loading" && <Loader2 className="animate-spin w-8 h-8 text-blue-600" />}
                {txStatus === "success" && <CheckCircle className="w-8 h-8 text-green-600" />}
                {txStatus === "error" && <XCircle className="w-8 h-8 text-red-600" />}

                {txStatus === "loading" && (
                  <p className="mt-4 text-sm text-muted-foreground text-center font-medium">
                    Отправка транзакции...
                  </p>
                )}
                {txStatus === "success" && (
                  <p className="mt-4 text-sm text-muted-foreground text-center font-medium">
                    Транзакция успешно отправлена!
                  </p>
                )}
                {txStatus === "error" && (
                  <p className="mt-4 text-sm text-muted-foreground text-center font-medium">
                    Ошибка транзакции. Попробуйте снова.
                  </p>
                )}
              </div>
            )}

            {txStatus === "idle" && (
              <div className="space-y-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                {/* Получатель */}
                    <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start flex-wrap">
                        <span className="text-sm font-medium text-muted-foreground">Получатель:</span>
                        {parsedQR && (
                        <button
                            className="text-sm font-semibold text-blue-600 hover:underline break-words text-right"
                            onClick={() => setShowFullAddress((prev) => !prev)}
                        >
                            {showFullAddress
                            ? parsedQR.to
                            : `${parsedQR.to.slice(0, 4)}...${parsedQR.to.slice(-4)}`}
                        </button>
                        )}
                    </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Сумма:</span>
                        <span className="text-lg font-bold text-foreground">{parsedQR.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Валюта:</span>
                        <span className="text-sm font-semibold text-foreground">{parsedQR.currency}</span>
                    </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {txStatus === "idle" && (
                <>
                  <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                    Отмена
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1">
                    Подтвердить
                  </Button>
                </>
              )}

              {txStatus === "success" && (
                <Button onClick={() => setOpenDialog(false)} className="w-full">
                  Закрыть
                </Button>
              )}

              {txStatus === "error" && (
                <>
                  <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                    Отмена
                  </Button>
                  <Button onClick={handleRetry} className="flex-1">
                    Повторить
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
