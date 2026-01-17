import React, { useState } from "react";
import { Download, Music, Video, ChevronDown } from "lucide-react";

interface DownloadOptionsProps {
  onDownload: (format: "video" | "audio", quality: string) => void;
  isDownloading: boolean;
}

const VIDEO_QUALITIES = [
  { label: "1080p", value: "1080" },
  { label: "720p", value: "720" },
  { label: "4K", value: "2160" },
];

const AUDIO_QUALITIES = [
  { label: "320 kbps (High)", value: "320" },
  { label: "128 kbps (Medium)", value: "128" },
  { label: "64 kbps (Low)", value: "64" },
];

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  onDownload,
  isDownloading,
}) => {
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [videoQuality, setVideoQuality] = useState("1080");
  const [audioQuality, setAudioQuality] = useState("128");

  const currentQualities =
    activeTab === "video" ? VIDEO_QUALITIES : AUDIO_QUALITIES;
  const currentQuality = activeTab === "video" ? videoQuality : audioQuality;
  const setQuality = activeTab === "video" ? setVideoQuality : setAudioQuality;

  return (
    <div className="mt-8 w-full max-w-sm mx-auto animate-fadeInUp delay-100">
      <div className="glass-panel p-1 flex mb-6 rounded-full relative">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === "video"
              ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md"
              : "text-white/40 hover:text-white hover:bg-white/5"
          }`}
        >
          <Video
            size={18}
            className={activeTab === "video" ? "text-white" : ""}
          />
          Video
        </button>
        <button
          onClick={() => setActiveTab("audio")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === "audio"
              ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md"
              : "text-white/40 hover:text-white hover:bg-white/5"
          }`}
        >
          <Music
            size={18}
            className={activeTab === "audio" ? "text-white" : ""}
          />
          Audio
        </button>
      </div>

      <div className="mb-6 space-y-3">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-widest ml-1">
          Quality
        </label>
        <div className="relative group">
          <select
            value={currentQuality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full appearance-none glass-input text-white rounded-[2rem] px-6 py-4 pr-12 focus:outline-none focus:ring-0 font-medium transition-all cursor-pointer text-base bg-transparent"
          >
            {currentQualities.map((q) => (
              <option
                key={q.value}
                value={q.value}
                className="bg-black text-white"
              >
                {q.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none text-white/30 group-hover:text-white/60 transition-colors">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <button
        onClick={() => onDownload(activeTab, currentQuality)}
        disabled={isDownloading}
        className="w-full py-4 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-pointer shadow-lg shadow-white/5"
      >
        <Download size={20} className="text-black" />
        <span>Download</span>
      </button>
    </div>
  );
};
