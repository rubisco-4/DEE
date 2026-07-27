import React from 'react';
import { Search, Sparkles, RefreshCw, BookOpen, Layers, CheckCircle2, Star, Target } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenImmersiveReview: () => void;
  onSyncRss: () => void;
  isSyncing: boolean;
  totalCount: number;
  masteredCount: number;
  starredCount: number;
  activeBatchLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenImmersiveReview,
  onSyncRss,
  isSyncing,
  totalCount,
  masteredCount,
  starredCount,
  activeBatchLabel,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & App Title in Editorial Style */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 border border-[#1A1A1A]">
              <BookOpen className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                  ARCHIVE PROJECT · EPISODES 1 - 1120+
                </span>
                <h1 className="text-xl sm:text-2xl font-serif italic font-bold leading-tight uppercase tracking-tight text-[#1A1A1A]">
                  Daily Easy English <span className="not-italic font-sans text-xs bg-[#1A1A1A] text-white px-2 py-0.5 ml-1 tracking-wider uppercase font-bold">复习助手</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Search Bar - Editorial Underline Style */}
          <div className="flex-1 max-w-md relative">
            <div className="relative border-b-2 border-[#1A1A1A] pb-0.5">
              <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索表达、期数(如 1120)、中文释义..."
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-transparent text-[#1A1A1A] placeholder:italic placeholder:text-[#888] focus:outline-none font-serif"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-[#1A1A1A] hover:opacity-75 font-bold w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons in Editorial Aesthetic */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 justify-end">
            <button
              onClick={onSyncRss}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1A1A1A] bg-[#F2F0EB] hover:bg-[#E8E6E1] border border-[#1A1A1A] transition-colors disabled:opacity-50 cursor-pointer uppercase tracking-wider"
              title="拉取与同步官网最新Podcast RSS广播"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? '同步中...' : '同步RSS'}</span>
            </button>

            {/* Immersive Context Review Button */}
            <button
              onClick={onOpenImmersiveReview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-[#333] border border-[#1A1A1A] transition-all transform active:translate-y-0.5 cursor-pointer uppercase tracking-wider shadow-[2px_2px_0px_#FFD700]"
            >
              <Target className="w-4 h-4 text-[#FFD700]" />
              <span>Immersive 复习</span>
            </button>
          </div>

        </div>

        {/* Stats & Current Range bar in Editorial Grid Style */}
        <div className="mt-3 pt-2.5 border-t border-[#1A1A1A] flex flex-wrap items-center justify-between text-xs text-[#1A1A1A] gap-2 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5" />
              RANGE: <span className="bg-[#1A1A1A] text-white px-2 py-0.5 font-bold">{activeBatchLabel}</span>
            </span>
            <span className="flex items-center gap-1 text-[#333]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              MASTERED: <strong className="text-black font-extrabold">{masteredCount}</strong> / {totalCount}
            </span>
            <span className="flex items-center gap-1 text-[#333]">
              <Star className="w-3.5 h-3.5 fill-[#1A1A1A]" />
              STARRED: <strong className="text-black font-extrabold">{starredCount}</strong>
            </span>
          </div>

          <div className="text-[#666] italic text-[11px] font-serif hidden lg:block">
            "Repetition is the mother of learning" — Daily Easy English Archive
          </div>
        </div>
      </div>
    </header>
  );
};
