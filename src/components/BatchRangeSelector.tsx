import React, { useState } from 'react';
import { generateBatchRanges } from '../data/preseededExpressions';
import { Filter, ArrowUpDown, ChevronDown, ChevronUp, Target } from 'lucide-react';

interface BatchRangeSelectorProps {
  activeRangeStart: number | null;
  activeRangeEnd: number | null;
  onSelectRange: (startNum: number | null, endNum: number | null, label: string) => void;
  maxEpisodeNum: number;
  activeFilter: 'all' | 'unmastered' | 'starred' | 'mastered';
  onChangeFilter: (filter: 'all' | 'unmastered' | 'starred' | 'mastered') => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
}

export const BatchRangeSelector: React.FC<BatchRangeSelectorProps> = ({
  activeRangeStart,
  activeRangeEnd,
  onSelectRange,
  maxEpisodeNum,
  activeFilter,
  onChangeFilter,
  sortOrder,
  onToggleSortOrder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customEpInput, setCustomEpInput] = useState('');

  const batchRanges = generateBatchRanges(maxEpisodeNum);

  const handleCustomJump = (e: React.FormEvent) => {
    e.preventDefault();
    const ep = parseInt(customEpInput.trim(), 10);
    if (!isNaN(ep) && ep > 0) {
      const batchSize = 20;
      const startNum = Math.floor((ep - 1) / batchSize) * batchSize + 1;
      const endNum = startNum + batchSize - 1;
      onSelectRange(startNum, endNum, `${startNum}-${endNum}`);
      setCustomEpInput('');
    }
  };

  const isAllActive = activeRangeStart === null && activeRangeEnd === null;

  return (
    <div className="bg-[#F2F0EB] border border-[#1A1A1A] p-4 space-y-4">
      
      {/* Top Controls: Filter tabs & Sort Order in Editorial Style */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 border border-[#1A1A1A]">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
              activeFilter === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#E8E6E1]'
            }`}
          >
            全部表达
          </button>
          <button
            onClick={() => onChangeFilter('unmastered')}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
              activeFilter === 'unmastered'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#E8E6E1]'
            }`}
          >
            待复习
          </button>
          <button
            onClick={() => onChangeFilter('starred')}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
              activeFilter === 'starred'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#E8E6E1]'
            }`}
          >
            ★ 收藏
          </button>
          <button
            onClick={() => onChangeFilter('mastered')}
            className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
              activeFilter === 'mastered'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#E8E6E1]'
            }`}
          >
            ✓ 已掌握
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Jump Input */}
          <form onSubmit={handleCustomJump} className="flex items-center gap-1">
            <div className="relative flex items-center">
              <Target className="w-3.5 h-3.5 absolute left-2 text-[#1A1A1A]" />
              <input
                type="number"
                value={customEpInput}
                onChange={(e) => setCustomEpInput(e.target.value)}
                placeholder="直达期数(如 820)"
                className="w-32 pl-7 pr-2 py-1 text-xs bg-[#FAF9F6] border border-[#1A1A1A] font-mono focus:outline-none focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-bold bg-[#1A1A1A] text-white border border-[#1A1A1A] hover:bg-[#333] transition-colors cursor-pointer uppercase tracking-wider"
            >
              定位
            </button>
          </form>

          {/* Chronological Order Toggle */}
          <button
            onClick={onToggleSortOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1A1A1A] bg-[#FAF9F6] hover:bg-[#E8E6E1] border border-[#1A1A1A] transition-colors cursor-pointer uppercase tracking-wider"
            title="按序号1-N顺序或倒序排列"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'asc' ? '顺序 (1 → N)' : '倒序 (N → 1)'}</span>
          </button>
        </div>
      </div>

      {/* Range Batch Group Selector Header */}
      <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
          <Filter className="w-3.5 h-3.5" />
          <span>按 20 词为分组定位:</span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs text-[#1A1A1A] hover:underline font-bold uppercase tracking-wider cursor-pointer"
        >
          <span>{isExpanded ? '收起分组' : '展开全部分组'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Batch Buttons Horizontal Scroll / Grid */}
      <div
        className={`transition-all duration-300 ${
          isExpanded
            ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 max-h-72 overflow-y-auto p-1'
            : 'flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin'
        }`}
      >
        {/* All option */}
        <button
          onClick={() => onSelectRange(null, null, '全部 (1-N)')}
          className={`px-3 py-1.5 text-xs font-bold font-mono shrink-0 transition-all border cursor-pointer ${
            isAllActive
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-[#FAF9F6] hover:bg-[#E8E6E1] text-[#1A1A1A] border-[#1A1A1A]'
          }`}
        >
          ALL (1-{maxEpisodeNum})
        </button>

        {batchRanges.map((range) => {
          const isActive =
            activeRangeStart === range.startNum && activeRangeEnd === range.endNum;

          return (
            <button
              key={range.label}
              onClick={() => onSelectRange(range.startNum, range.endNum, range.label)}
              className={`px-2.5 py-1 text-xs font-bold font-mono shrink-0 transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#FAF9F6] hover:bg-[#E8E6E1] text-[#1A1A1A] border-[#1A1A1A]'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

