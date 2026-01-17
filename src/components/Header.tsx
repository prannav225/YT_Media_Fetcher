export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
        <img
          src="/yt_media_fetcher_logo.png"
          alt="YT Media Fetcher Logo"
          className="w-8 h-8 rounded-lg shadow-sm"
        />
        <span className="text-white font-semibold text-sm tracking-wide">
          YT Media Fetcher
        </span>
      </div>
    </header>
  );
};
