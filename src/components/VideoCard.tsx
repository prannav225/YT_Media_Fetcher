import React from "react";
import { Clock, User } from "lucide-react";

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number | string; // API might return formatted string or seconds
  uploader: string;
}

interface VideoCardProps {
  info: VideoInfo;
}

export const VideoCard: React.FC<VideoCardProps> = ({ info }) => {
  return (
    <div className="glass-panel rounded-[2.5rem] overflow-hidden max-w-2xl mx-auto animate-fadeInUp flex flex-col sm:flex-row p-4 gap-6 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="relative group sm:w-1/2 rounded-[2rem] overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
        <img
          src={info.thumbnail}
          alt={info.title}
          className="w-full h-full object-cover aspect-video sm:aspect-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-4 text-white">
            {/* Simple Play Arrow */}
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-grow py-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 line-clamp-2 font-display leading-tight tracking-tight">
          {info.title}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
            <div className="bg-white/5 p-2 rounded-full">
              <User size={14} className="text-white/80" />
            </div>
            <span>{info.uploader}</span>
          </div>

          <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
            <div className="bg-white/5 p-2 rounded-full">
              <Clock size={14} className="text-white/80" />
            </div>
            <span>{info.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
