import React, { useEffect, useRef, useState } from "react";
import { FileDown, Clock } from "lucide-react";

interface ProgressModalProps {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  isProcessing: boolean;
  onCancel?: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  progress,
  downloadedBytes,
  totalBytes,
  isProcessing,
  onCancel,
}) => {
  const startTimeRef = useRef<number | null>(null);
  const [eta, setEta] = useState<string>("--:--");

  // Initialize start time once download begins using a ref to prevent re-renders
  useEffect(() => {
    if (!isProcessing && downloadedBytes > 0 && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    // If download restarts (progress back to 0), reset only if needed
    if (downloadedBytes === 0 && startTimeRef.current !== null) {
      startTimeRef.current = null;
    }
  }, [isProcessing, downloadedBytes]);

  // Calculated ETA in useEffect to keep render function pure
  useEffect(() => {
    if (!startTimeRef.current || downloadedBytes === 0 || totalBytes === 0) {
      return;
    }

    // Using Date.now() inside useEffect for purity
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    if (elapsed <= 0) return;

    const speed = downloadedBytes / elapsed;
    const remainingBytes = totalBytes - downloadedBytes;

    if (speed <= 0) return;

    const remainingSeconds = remainingBytes / speed;
    if (remainingSeconds < 60) {
      setEta(`${Math.ceil(remainingSeconds)}s`);
    } else {
      setEta(`${Math.ceil(remainingSeconds / 60)}m`);
    }
  }, [downloadedBytes, totalBytes]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Safe progress calculation
  const currentProgress = Math.max(0, Math.min(progress, 100));
  const progressPercent = isProcessing ? 100 : currentProgress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-transparent">
      {/* Darker, blurred backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl transition-all duration-500"></div>

      {/* Modal Card - Glassmorphism */}
      <div className="relative w-full max-w-sm bg-white/5 backdrop-filter backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 animate-fadeInUp overflow-hidden">
        {/* Decorative inner glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10 w-full">
          <div className="mb-8 relative">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner group">
              {isProcessing ? (
                <div className="w-8 h-8 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FileDown size={32} className="text-white drop-shadow-lg" />
              )}
            </div>
            {/* Pulse ring */}
            {isProcessing && (
              <div className="absolute inset-0 rounded-[2rem] border border-white/20 animate-ping opacity-20"></div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-tight">
            {isProcessing ? "Processing..." : "Downloading"}
          </h3>

          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-white/50 backdrop-blur-sm">
              {isProcessing
                ? "Preparing Stream"
                : `${Math.round(currentProgress)}% Complete`}
            </span>
          </div>

          <div className="w-full space-y-4">
            {/* Progress Bar Track */}
            <div className="h-4 bg-white/10 rounded-full overflow-hidden w-full backdrop-blur-md border border-white/5 shadow-inner p-0.5 relative flex items-center justify-start">
              {/* Progress Bar Fill */}
              <div
                className={`h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] ${
                  isProcessing ? "bg-white/20 animate-pulse" : "bg-white"
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {!isProcessing && (
              <div className="flex justify-between items-center text-xs font-semibold text-white/50 px-2 font-mono tracking-tight">
                <span>
                  {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
                </span>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Clock size={12} />
                  <span>ETA: {eta}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="mt-8 px-6 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all text-sm font-semibold tracking-wide"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
