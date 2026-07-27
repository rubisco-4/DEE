import React from 'react';
import { Expression } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { Star, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface ExpressionCardProps {
  expression: Expression;
  onSelect: (expression: Expression) => void;
  onToggleMastered: (e: React.MouseEvent, id: string) => void;
  onToggleStarred: (e: React.MouseEvent, id: string) => void;
}

export const ExpressionCard: React.FC<ExpressionCardProps> = ({
  expression,
  onSelect,
  onToggleMastered,
  onToggleStarred,
}) => {
  const isEnriched = Boolean(
    expression.usageNuance ||
    expression.dialogue ||
    (expression.examples && expression.examples.length > 0 && expression.examples[0].situation)
  );

  return (
    <div
      onClick={() => onSelect(expression)}
      className={`group relative bg-white border border-[#1A1A1A] transition-all duration-200 p-5 hover:bg-[#FAF9F6] cursor-pointer flex flex-col justify-between shadow-[2px_2px_0px_#1A1A1A] ${
        expression.isMastered ? 'border-l-4 border-l-[#1A1A1A] bg-[#F9F8F3]' : ''
      }`}
    >
      <div>
        {/* Top Header: Episode # Badge, Category, AI Enriched, Star & Checkmark */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1A1A1A] text-white border border-[#1A1A1A]">
              #{(expression?.episodeNumber ?? 0).toString().padStart(3, '0')}
            </span>
            {expression.category && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F2F0EB] text-[#1A1A1A] border border-[#1A1A1A]">
                {expression.category}
              </span>
            )}
            {isEnriched && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFD700] text-[#1A1A1A] border border-[#1A1A1A] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI 深度</span>
              </span>
            )}
            {expression.isMastered && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#1A1A1A] text-emerald-300">
                MASTERED
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Favorite / Star Button */}
            <button
              type="button"
              onClick={(e) => onToggleStarred(e, expression.id)}
              className="p-1 text-[#1A1A1A] hover:bg-[#F2F0EB] transition-colors cursor-pointer border border-transparent hover:border-[#1A1A1A]"
              title={expression.isStarred ? '取消收藏' : '收藏此表达'}
            >
              <Star
                className={`w-4 h-4 ${
                  expression.isStarred ? 'text-[#1A1A1A] fill-[#FFD700]' : 'text-[#666]'
                }`}
              />
            </button>

            {/* Mastered / Checkmark Button */}
            <button
              type="button"
              onClick={(e) => onToggleMastered(e, expression.id)}
              className={`p-1 transition-colors cursor-pointer border ${
                expression.isMastered
                  ? 'bg-[#1A1A1A] text-emerald-400 border-[#1A1A1A]'
                  : 'text-[#666] border-transparent hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
              title={expression.isMastered ? '标记为待复习' : '标记为已掌握'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* English Phrase - Editorial Serif */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-serif font-black text-[#1A1A1A] group-hover:underline decoration-[#1A1A1A] underline-offset-4 leading-tight">
            {expression.phrase}
          </h3>

          <AudioPlayerButton
            textToSpeak={expression.phrase}
            audioUrl={expression.audioUrl}
            size="sm"
            variant="subtle"
          />
        </div>

        {/* Phonetic Pronunciation */}
        {expression.phonetic && (
          <p className="text-xs font-mono text-[#666] mb-3">
            {expression.phonetic}
          </p>
        )}

        {/* Core Chinese Translation */}
        <div className="text-sm font-medium text-[#1A1A1A] bg-[#F2F0EB] p-3 border border-[#1A1A1A] mb-3 leading-relaxed">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-0.5">CHINESE MEANING</span>
          {expression.meaningCn}
        </div>

        {/* Example Sentence Preview */}
        {expression.examples && expression.examples.length > 0 && (
          <div className="text-xs text-[#444] font-serif italic border-l-2 border-[#1A1A1A] pl-3 py-1 mb-2">
            <p className="line-clamp-2">
              "{expression.examples[0].english}"
            </p>
          </div>
        )}
      </div>

      {/* Footer: Learn Details link */}
      <div className="mt-4 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-xs text-[#1A1A1A] font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
        <span>DETAIL & EXAMPLES</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

