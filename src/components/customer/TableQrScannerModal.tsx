import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ImageUp,
  Loader2,
  QrCode,
  RefreshCw,
  Utensils,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface TableQrScannerModalProps {
  open: boolean;
  onClose: () => void;
  onTableLinked?: (table: { tableId: string; tableNumber: string; tableName: string }) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const TableQrScannerModal: React.FC<TableQrScannerModalProps> = ({
  open,
  onClose,
  onTableLinked,
}) => {
  const { t, assignTableFromQr, detectedTableId, detectedTableNumber, detectedTableName } =
    useStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDecodedRef = useRef<string>('');
  const verifyingRef = useRef<boolean>(false);

  const [cameraState, setCameraState] = useState<
    'starting' | 'active' | 'denied' | 'unavailable'
  >('starting');
  const [manualInput, setManualInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [linkedTable, setLinkedTable] = useState<{
    tableId: string;
    tableNumber: string;
    tableName: string;
  } | null>(null);
  const [cameraAttempt, setCameraAttempt] = useState(0);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleDecodedPayload = useCallback(
    async (rawText: string) => {
      if (verifyingRef.current) return;
      const trimmed = rawText.trim();
      if (!trimmed || trimmed === lastDecodedRef.current) return;

      lastDecodedRef.current = trimmed;
      verifyingRef.current = true;
      setVerifying(true);
      setErrorMsg(null);

      try {
        const res = await assignTableFromQr(trimmed);
        if (res.ok && res.tableId && res.tableNumber) {
          stopCamera();
          const linked = {
            tableId: res.tableId,
            tableNumber: res.tableNumber,
            tableName: res.tableName || `Table ${res.tableNumber}`,
          };
          setLinkedTable(linked);
          if (onTableLinked) {
            onTableLinked(linked);
          }
        } else {
          setErrorMsg(res.error || t.qrScanner.invalidQr);
          window.setTimeout(() => {
            lastDecodedRef.current = '';
          }, 1600);
        }
      } finally {
        verifyingRef.current = false;
        setVerifying(false);
      }
    },
    [assignTableFromQr, onTableLinked, stopCamera, t.qrScanner.invalidQr]
  );

  useEffect(() => {
    if (!open) {
      stopCamera();
      lastDecodedRef.current = '';
      verifyingRef.current = false;
      setErrorMsg(null);
      setLinkedTable(null);
      setManualInput('');
      return;
    }
    setLinkedTable(null);
    setErrorMsg(null);
    lastDecodedRef.current = '';
  }, [open, stopCamera]);

  useEffect(() => {
    if (!open || linkedTable) {
      stopCamera();
      return;
    }

    let cancelled = false;
    setCameraState('starting');

    async function startCamera() {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.getUserMedia !== 'function'
      ) {
        if (!cancelled) setCameraState('unavailable');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        if (cancelled) return;

        setCameraState('active');

        const NativeBarcodeDetector = (
          window as unknown as {
            BarcodeDetector?: new (opts?: { formats?: string[] }) => {
              detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
            };
          }
        ).BarcodeDetector;

        const detector = NativeBarcodeDetector
          ? new NativeBarcodeDetector({ formats: ['qr_code'] })
          : null;

        let lastScanTs = 0;

        const scanFrame = async (now: number) => {
          if (cancelled || !videoRef.current) return;

          if (
            now - lastScanTs >= 150 &&
            video.readyState >= video.HAVE_CURRENT_DATA &&
            video.videoWidth > 0 &&
            video.videoHeight > 0 &&
            !verifyingRef.current
          ) {
            lastScanTs = now;

            if (detector) {
              try {
                const hits = await detector.detect(video);
                const firstVal = hits?.[0]?.rawValue;
                if (firstVal) {
                  void handleDecodedPayload(firstVal);
                }
              } catch {
                // Fall through to canvas jsQR decoder
              }
            }

            if (!verifyingRef.current) {
              const canvas = canvasRef.current;
              if (canvas) {
                const maxDim = 640;
                const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
                const w = Math.max(1, Math.floor(video.videoWidth * scale));
                const h = Math.max(1, Math.floor(video.videoHeight * scale));
                if (canvas.width !== w) canvas.width = w;
                if (canvas.height !== h) canvas.height = h;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                  ctx.drawImage(video, 0, 0, w, h);
                  const imageData = ctx.getImageData(0, 0, w, h);
                  const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                  });
                  if (decoded?.data) {
                    void handleDecodedPayload(decoded.data);
                  }
                }
              }
            }
          }

          if (!cancelled) {
            rafRef.current = requestAnimationFrame((ts) => {
              void scanFrame(ts);
            });
          }
        };

        rafRef.current = requestAnimationFrame((ts) => {
          void scanFrame(ts);
        });
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : '';
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setCameraState('denied');
        } else {
          setCameraState('unavailable');
        }
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [cameraAttempt, handleDecodedPayload, linkedTable, open, stopCamera]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setErrorMsg(null);
    setVerifying(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Invalid image'));
        el.src = dataUrl;
      });

      const canvas = document.createElement('canvas');
      const maxDim = 960;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.floor(img.width * scale));
      canvas.height = Math.max(1, Math.floor(img.height * scale));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setVerifying(false);
        setErrorMsg(t.qrScanner.invalidQr);
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      setVerifying(false);
      if (decoded?.data) {
        lastDecodedRef.current = '';
        await handleDecodedPayload(decoded.data);
      } else {
        setErrorMsg(t.qrScanner.invalidQr);
      }
    } catch {
      setVerifying(false);
      setErrorMsg(t.qrScanner.invalidQr);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = manualInput.trim();
    if (!cleaned) return;
    lastDecodedRef.current = '';
    await handleDecodedPayload(cleaned);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-scanner-title"
        >
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
            className="relative z-10 w-full sm:max-w-md bg-[#F3EBDD] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#101B17]/15 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Dark Luxury Header */}
            <div className="px-5 py-4 bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <QrCode className="w-5 h-5 text-[#D7A65A] shrink-0" />
                <div className="min-w-0">
                  <h2
                    id="qr-scanner-title"
                    className="font-display text-lg font-bold text-white truncate"
                  >
                    {t.qrScanner.title}
                  </h2>
                  {detectedTableNumber && !linkedTable && (
                    <p className="text-[11px] font-mono-tabular text-[#D7A65A] truncate">
                      {detectedTableName || `Table ${detectedTableNumber}`} ({detectedTableId})
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {linkedTable ? (
                <div className="py-6 text-center space-y-5">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#101B17] text-[#D7A65A] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-xl font-bold text-[#101210]">
                      {t.qrScanner.verifiedTitle}
                    </h3>
                    <p className="text-sm text-[#5B564E] max-w-xs mx-auto leading-relaxed">
                      {t.qrScanner.verifiedBody.replace('{table}', linkedTable.tableName)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-[#101B17]/15 p-3.5 inline-flex items-center gap-3 text-start">
                    <Utensils className="w-4 h-4 text-[#101B17] shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-[#101210]">{linkedTable.tableName}</p>
                      <p className="text-xs font-mono-tabular text-[#5B564E]">
                        {t.qrScanner.tableIdLabel}: {linkedTable.tableId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 px-6 rounded-xl bg-[#101B17] text-[#F3EBDD] text-sm font-semibold hover:bg-[#1D2922] transition-colors min-h-[46px] cursor-pointer"
                    >
                      {t.qrScanner.doneBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs sm:text-sm text-[#5B564E] leading-relaxed">
                    {t.qrScanner.subtitle}
                  </p>

                  {/* Camera Viewfinder */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#101210] border border-[#101B17]/20 aspect-[4/3] flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover transition-opacity duration-200 ${
                        cameraState === 'active' ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Viewfinder Brackets Overlay */}
                    {cameraState === 'active' && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6"
                      >
                        <div className="relative w-48 h-48 sm:w-52 sm:h-52">
                          <span className="absolute top-0 start-0 w-7 h-7 border-t-3 border-s-3 border-[#D7A65A] rounded-tl-lg" />
                          <span className="absolute top-0 end-0 w-7 h-7 border-t-3 border-e-3 border-[#D7A65A] rounded-tr-lg" />
                          <span className="absolute bottom-0 start-0 w-7 h-7 border-b-3 border-s-3 border-[#D7A65A] rounded-bl-lg" />
                          <span className="absolute bottom-0 end-0 w-7 h-7 border-b-3 border-e-3 border-[#D7A65A] rounded-br-lg" />
                          <motion.div
                            animate={{ y: [8, 176, 8] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full h-0.5 bg-[#D7A65A]/90"
                          />
                        </div>
                        <span className="mt-3 px-3 py-1 rounded-lg bg-black/65 text-[#F3EBDD] text-[11px] font-medium">
                          {t.qrScanner.cameraLiveHint}
                        </span>
                      </div>
                    )}

                    {/* Starting / Verifying / Fallback Overlay */}
                    {cameraState === 'starting' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-[#F3EBDD]/85 p-5 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#D7A65A]" />
                        <span className="text-xs font-medium">{t.qrScanner.startingCamera}</span>
                      </div>
                    )}

                    {(cameraState === 'denied' || cameraState === 'unavailable') && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#F3EBDD] p-5 text-center bg-[#101B17]">
                        <Camera className="w-7 h-7 text-[#D7A65A]" />
                        <p className="text-xs text-[#F3EBDD]/85 leading-relaxed max-w-xs">
                          {cameraState === 'denied'
                            ? t.qrScanner.cameraDenied
                            : t.qrScanner.cameraUnavailable}
                        </p>
                        <button
                          type="button"
                          onClick={() => setCameraAttempt((n) => n + 1)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-xs font-semibold text-[#F3EBDD] transition-colors min-h-[38px] cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#D7A65A]" />
                          <span>{t.qrScanner.retryCameraBtn}</span>
                        </button>
                      </div>
                    )}

                    {verifying && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-[#F3EBDD]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#D7A65A]" />
                        <span className="text-xs font-semibold">{t.qrScanner.verifying}</span>
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Upload QR Image Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={verifying}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#101B17]/18 text-xs font-semibold text-[#101B17] hover:bg-[#E7DFD0] transition-colors min-h-[44px] cursor-pointer disabled:opacity-50"
                    >
                      <ImageUp className="w-4 h-4 text-[#D7A65A]" />
                      <span>{t.qrScanner.uploadQrBtn}</span>
                    </button>
                  </div>

                  {/* Manual Table Number / URL Fallback */}
                  <form
                    onSubmit={handleManualSubmit}
                    className="pt-4 border-t border-[#101B17]/12 space-y-2"
                  >
                    <label
                      htmlFor="qr-manual-table"
                      className="block text-xs font-semibold text-[#101210]"
                    >
                      {t.qrScanner.manualLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="qr-manual-table"
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder={t.qrScanner.manualPlaceholder}
                        className="flex-1 rounded-xl border border-[#101B17]/18 bg-white px-3.5 py-2 text-sm text-[#101210] placeholder:text-[#5B564E]/75 focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[42px]"
                      />
                      <button
                        type="submit"
                        disabled={!manualInput.trim() || verifying}
                        className="px-4 py-2 rounded-xl bg-[#101B17] text-[#F3EBDD] text-xs font-semibold hover:bg-[#1D2922] disabled:opacity-45 transition-colors whitespace-nowrap min-h-[42px] cursor-pointer"
                      >
                        {t.qrScanner.applyCodeBtn}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
