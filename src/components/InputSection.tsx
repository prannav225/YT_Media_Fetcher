import React from "react";
import { Search } from "lucide-react";

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  url,
  setUrl,
  onSearch,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 animate-fadeInUp">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-white/10 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative flex items-center glass-input rounded-[2rem] p-2 bg-black/20">
          <div className="pl-6 text-white/40">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube Link here..."
            className="w-full bg-transparent text-white placeholder-white/30 px-4 py-4 outline-none font-medium text-lg"
          />
          <button
            onClick={onSearch}
            disabled={isLoading || !url}
            className={`bg-white text-black hover:bg-white/90 px-8 py-4 rounded-[1.5rem] font-bold transition-all shadow-lg shadow-white/5 flex items-center gap-2 transform active:scale-[0.98] mr-1 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <span className="text-black">Fetch</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
