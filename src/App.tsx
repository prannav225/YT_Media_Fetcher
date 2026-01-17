import { useState, useRef } from "react";
import { InputSection } from "./components/InputSection";
import { VideoCard, type VideoInfo } from "./components/VideoCard";
import { DownloadOptions } from "./components/DownloadOptions";
import { ProgressModal } from "./components/ProgressModal";

import { Header } from "./components/Header";

function App() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress State
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [isProcessingServer, setIsProcessingServer] = useState(false);

  // Abort Controller Ref
  const abortControllerRef = useRef<AbortController | null>(null);

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const fetchVideoInfo = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    setVideoInfo(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch video info");
      }
      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError("Could not fetch video details. Please check the URL.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleDownload = async (format: "video" | "audio", quality: string) => {
    if (!url) return;
    setIsDownloading(true);
    setIsProcessingServer(true);
    setDownloadProgress(0);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setError(null);

    // Create a new AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${API_BASE_URL}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, quality }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Download failed");
      }

      setIsProcessingServer(false); // Server done, now receiving stream

      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      setTotalBytes(total);

      const reader = response.body?.getReader();
      if (!reader)
        throw new Error("Readable stream not supported in this browser.");

      const chunks = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        setDownloadedBytes(receivedLength);

        if (total > 0) {
          setDownloadProgress((receivedLength / total) * 100);
        }
      }

      const blob = new Blob(chunks);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const ext = format === "audio" ? "mp3" : "mp4";
      a.download = videoInfo ? `${videoInfo.title}.${ext}` : `download.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.log("Download cancelled by user");
          // Do not verify error state for user cancellation, just reset
        } else {
          setError(err.message);
        }
      } else {
        setError("Download failed. Please try again.");
      }
      console.error(err);
    } finally {
      setIsDownloading(false);
      setIsProcessingServer(false);
      setDownloadProgress(0);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow for IOS feel */}
      <div className="fixed top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <Header />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fadeInUp">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/60 tracking-tight drop-shadow-sm pb-2">
            Download Anything.
          </h1>
          <p className="text-white/60 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
            Save high-quality videos and audio from YouTube instantly.
          </p>
        </div>

        <InputSection
          url={url}
          setUrl={setUrl}
          onSearch={fetchVideoInfo}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/20 text-red-100 px-6 py-4 rounded-2xl mb-8 animate-shake text-center font-medium">
            {error}
          </div>
        )}

        {videoInfo && !isLoading && !isDownloading && (
          <div className="w-full flex flex-col items-center animate-fadeInUp">
            <VideoCard info={videoInfo} />
            <DownloadOptions
              onDownload={handleDownload}
              isDownloading={isDownloading}
            />
          </div>
        )}

        {/* Modal Overlay */}
        {isDownloading && (
          <ProgressModal
            progress={downloadProgress}
            downloadedBytes={downloadedBytes}
            totalBytes={totalBytes}
            isProcessing={isProcessingServer}
            onCancel={handleCancelDownload}
          />
        )}
      </div>
    </div>
  );
}

export default App;
