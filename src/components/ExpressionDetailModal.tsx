import React, { useState } from 'react';
import { Expression } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import {
  X,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Star,
  MessageSquare,
  HelpCircle,
  FileText,
  Share2,
  Check,
  Loader2,
  Lightbulb,
} from 'lucide-react';

interface ExpressionDetailModalProps {
  expression: Expression | null;
  allExpressions?: Expression[];
  onClose: () => void;
  onSelectExpression?: (exp: Expression) => void;
  onToggleMastered: (id: string) => void;
  onToggleStarred: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onEnrichExpression: (exp: Expression) => Promise<void>;
  isEnriching: boolean;
}

export const ExpressionDetailModal: React.FC<ExpressionDetailModalProps> = ({
  expression,
  allExpressions = [],
  onClose,
  onSelectExpression,
  onToggleMastered,
  onToggleStarred,
  onUpdateNotes,
  onEnrichExpression,
  isEnriching,
}) => {
  if (!expression) return null;

  const [userNotes, setUserNotes] = useState(expression.userNotes || '');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(expression.id, userNotes);
  };

  const handleCopy = () => {
    const text = `${expression.phrase} (Daily Easy English EP #${expression.episodeNumber})\n释义: ${expression.meaningCn}\n例句: ${expression.examples?.[0]?.english || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectQuiz = (idx: number) => {
    setSelectedQuizOption(idx);
    setShowQuizExplanation(true);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono font-bold bg-[#FFD700] text-[#1A1A1A] border border-[#1A1A1A]">
              EP #{(expression?.episodeNumber ?? 0).toString().padStart(3, '0')}
            </span>
            <span className="text-xs font-serif italic text-white/80">Daily Easy English Archive</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 bg-[#333] hover:bg-[#444] text-white border border-white/20 transition-colors cursor-pointer text-xs flex items-center gap-1 uppercase font-mono"
              title="复制表达与例句"
            >
              {copied ? <Check className="w-4 h-4 text-[#FFD700]" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'COPIED' : 'SHARE'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleStarred(expression.id)}
              className={`p-1.5 border transition-colors cursor-pointer ${
                expression.isStarred ? 'bg-[#FFD700] text-[#1A1A1A] border-[#FFD700]' : 'bg-[#333] text-white border-white/20 hover:bg-[#444]'
              }`}
            >
              <Star className={`w-4 h-4 ${expression.isStarred ? 'fill-[#1A1A1A]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onToggleMastered(expression.id)}
              className={`p-1.5 border transition-colors cursor-pointer ${
                expression.isMastered ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-[#333] text-white border-white/20 hover:bg-[#444]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-[#333] hover:bg-[#555] text-white transition-colors cursor-pointer border border-white/20 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* Main Phrase Card & Draggable Audio Player */}
          <div className="bg-[#F2F0EB] p-6 border border-[#1A1A1A] relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] block mb-1">
                  IDIOM / PHRASE
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1A1A1A] tracking-tight">
                  {expression.phrase}
                </h2>
                {expression.phonetic && (
                  <p className="text-sm font-mono text-[#444] font-bold mt-1">
                    {expression.phonetic}
                  </p>
                )}
              </div>
            </div>

            {/* Draggable Audio Player with Seek Bar */}
            <AudioPlayerButton
              textToSpeak={expression.phrase}
              audioUrl={expression.audioUrl}
              showSeekBar={true}
              className="w-full mt-2"
            />

            {/* Core Chinese Meaning */}
            <div className="pt-4 border-t border-[#1A1A1A]">
              <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest block mb-1">
                CHINESE DEFINITION
              </span>
              <p className="text-xl font-serif font-bold text-[#1A1A1A]">
                {expression.meaningCn}
              </p>
              {expression.definitionEn && (
                <p className="text-xs text-[#555] mt-1.5 italic font-serif">
                  English Def: "{expression.definitionEn}"
                </p>
              )}
            </div>
          </div>

          {/* AI Enrichment Trigger Banner - Editorial Gold Banner */}
          <div className="bg-[#FFD700] text-[#1A1A1A] p-4 border border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Gemini AI Deep Learning Expansion</h4>
                <p className="text-xs font-serif italic text-[#333]">
                  Auto-generate native nuances, workplace examples, and practice quiz
                </p>
              </div>
            </div>

            <button
              onClick={() => onEnrichExpression(expression)}
              disabled={isEnriching}
              className="px-4 py-2 text-xs font-bold bg-[#1A1A1A] text-white hover:bg-[#333] border border-[#1A1A1A] uppercase tracking-widest disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isEnriching ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> GENERATING...
                </span>
              ) : (
                'GENERATE WITH GEMINI'
              )}
            </button>
          </div>

          {/* Usage Nuance & Cultural Context */}
          {expression.usageNuance && (
            <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-4">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-[#1A1A1A] mb-2 border-b border-[#1A1A1A] pb-1">
                <Lightbulb className="w-4 h-4" />
                <span>Usage & Nuances (地道用法提示)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#333] leading-relaxed font-sans">
                {expression.usageNuance}
              </p>
            </div>
          )}

          {/* Example Sentences Section */}
          <div>
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-3 border-b border-[#1A1A1A] pb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Example Phrases ({expression.examples?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {expression.examples?.map((eg, index) => (
                <div
                  key={index}
                  className="bg-white p-4 border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-serif italic font-bold text-[#1A1A1A] leading-snug">
                        "{eg.english}"
                      </p>
                      <p className="text-xs sm:text-sm text-[#444] font-medium">
                        {eg.chinese}
                      </p>
                      {eg.situation && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold bg-[#F2F0EB] text-[#1A1A1A] border border-[#1A1A1A]">
                          SCENARIO: {eg.situation}
                        </span>
                      )}
                    </div>

                    <AudioPlayerButton
                      textToSpeak={eg.english}
                      size="sm"
                      variant="subtle"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Dialogue Scene */}
          {expression.dialogue && (
            <div className="bg-[#1A1A1A] text-white p-5 border border-[#1A1A1A]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD700] mb-3 flex items-center gap-2 border-b border-slate-700 pb-2">
                <MessageSquare className="w-4 h-4 text-[#FFD700]" />
                <span>Conversation Dialogue (原生对话)</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="bg-[#2A2A2A] p-3 border border-slate-700">
                  <span className="font-bold text-[#FFD700] font-mono block mb-0.5">A: {expression.dialogue.speakerA}</span>
                  <span className="text-slate-300 font-serif italic">{expression.dialogue.speakerA_cn}</span>
                </div>
                <div className="bg-[#2A2A2A] p-3 border border-slate-700">
                  <span className="font-bold text-[#FFD700] font-mono block mb-0.5">B: {expression.dialogue.speakerB}</span>
                  <span className="text-slate-300 font-serif italic">{expression.dialogue.speakerB_cn}</span>
                </div>
              </div>
            </div>
          )}

          {/* Multiple Choice Quiz Question */}
          {expression.quiz && Array.isArray(expression.quiz.options) && expression.quiz.options.length > 0 && (
            <div className="bg-[#F2F0EB] p-5 border border-[#1A1A1A]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-2 border-b border-[#1A1A1A] pb-1 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>Practice Quiz (巩固测试)</span>
              </h3>

              <p className="text-sm font-bold text-[#1A1A1A] mb-3">
                {expression.quiz.question}
              </p>

              <div className="space-y-2 mb-3">
                {expression.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === expression.quiz?.correctIndex;

                  let optStyle = 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#FAF9F6]';
                  if (showQuizExplanation) {
                    if (isCorrect) {
                      optStyle = 'bg-[#1A1A1A] text-[#FFD700] border-[#1A1A1A] font-bold';
                    } else if (isSelected) {
                      optStyle = 'bg-rose-700 text-white border-[#1A1A1A]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuiz(idx)}
                      className={`w-full text-left p-3 text-xs sm:text-sm transition-all border font-bold flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {showQuizExplanation && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />}
                    </button>
                  );
                })}
              </div>

              {showQuizExplanation && (
                <div className="mt-2 p-3 bg-white border border-[#1A1A1A] text-xs text-[#333]">
                  <span className="font-bold uppercase tracking-wider block mb-1">Explanation:</span>
                  {expression.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Personal User Study Notes */}
          <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 flex items-center gap-2 border-b border-[#1A1A1A] pb-1">
              <FileText className="w-4 h-4" />
              <span>Personal Study Notes (个人复习笔记)</span>
            </h3>

            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="在这里记录联想记忆法、搭配词或个人造句笔记..."
              className="w-full h-24 p-3 text-xs sm:text-sm bg-white border border-[#1A1A1A] focus:outline-none font-serif"
            />

            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-[#333] border border-[#1A1A1A] uppercase tracking-wider cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F2F0EB] border-t border-[#1A1A1A] flex items-center justify-between shrink-0 font-mono text-xs">
          <div className="text-[#666]">
            SOURCE: DAILY EASY ENGLISH PODCAST
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-[#1A1A1A] text-white hover:bg-[#333] border border-[#1A1A1A] uppercase tracking-widest cursor-pointer"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
