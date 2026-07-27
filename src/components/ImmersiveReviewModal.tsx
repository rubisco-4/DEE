import React, { useState, useMemo, useEffect } from 'react';
import { Expression } from '../types';
import {
  X,
  Target,
  Eye,
  CheckCircle2,
  Star,
  ChevronRight,
  ChevronLeft,
  Sliders,
  HelpCircle,
  Loader2,
  RefreshCw,
  Cpu,
  ExternalLink,
} from 'lucide-react';

interface AIContextData {
  scenario: string;
  speakerA: string;
  speakerA_cn: string;
  speakerB: string;
  speakerB_cn: string;
  maskedSpeakerB: string;
  targetPhraseInContext?: string;
}

interface ImmersiveReviewModalProps {
  expressions: Expression[];
  onClose: () => void;
  onToggleMastered: (id: string) => void;
  onToggleStarred: (id: string) => void;
  onSelectExpression?: (exp: Expression) => void;
  maxEpisodeNum?: number;
}

export const ImmersiveReviewModal: React.FC<ImmersiveReviewModalProps> = ({
  expressions,
  onClose,
  onToggleMastered,
  onToggleStarred,
  onSelectExpression,
  maxEpisodeNum = 1120,
}) => {
  // Scope / Filter Configurations
  const [startEp, setStartEp] = useState<number>(1);
  const [endEp, setEndEp] = useState<number>(20); // Default to 20 episodes per group (1-20)
  const [filterType, setFilterType] = useState<'all' | 'unmastered' | 'starred'>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(true);

  // Deck State
  const [deck, setDeck] = useState<Expression[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userAttempt, setUserAttempt] = useState<string>('');
  const [isAttemptChecked, setIsAttemptChecked] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // AI Context State (Gemini 3.1 Flash Lite)
  const [aiContext, setAiContext] = useState<AIContextData | null>(null);
  const [isLoadingAiContext, setIsLoadingAiContext] = useState<boolean>(false);
  const [aiContextError, setAiContextError] = useState<string | null>(null);

  // Build deck when filters or expressions change
  useEffect(() => {
    let filtered = expressions.filter((exp) => {
      if (!exp) return false;
      const epNum = exp.episodeNumber ?? 0;
      if (epNum < startEp || epNum > endEp) return false;

      if (filterType === 'unmastered') return !exp.isMastered;
      if (filterType === 'starred') return !!exp.isStarred;
      return true;
    });

    if (isShuffle) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    } else {
      filtered = [...filtered].sort((a, b) => a.episodeNumber - b.episodeNumber);
    }

    setDeck(filtered);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setUserAttempt('');
    setIsAttemptChecked(false);
  }, [expressions, startEp, endEp, filterType, isShuffle]);

  const currentExp = deck[currentIndex] || null;

  // On demand AI Context generation using Gemini 3.1 Flash Lite
  const fetchAiContext = async (exp: Expression) => {
    if (!exp) return;
    setIsLoadingAiContext(true);
    setAiContextError(null);
    setAiContext(null);

    try {
      const res = await fetch('/api/expressions/immersive-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phrase: exp.phrase || exp.title,
          meaningCn: exp.meaningCn,
          episodeNumber: exp.episodeNumber,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiContext(json.data);
      } else {
        setAiContextError(json.error || 'AI 当场生成语境失败');
      }
    } catch (err: any) {
      console.error('Error fetching AI context:', err);
      setAiContextError('网络连接异常，无法实时生成 AI 语境');
    } finally {
      setIsLoadingAiContext(false);
    }
  };

  // Trigger AI context generation when currentExp changes
  useEffect(() => {
    if (currentExp) {
      setIsAnswerRevealed(false);
      setUserAttempt('');
      setIsAttemptChecked(false);
      fetchAiContext(currentExp);
    } else {
      setAiContext(null);
    }
  }, [currentExp?.id]);

  // Prepare clear context with target expression masked out
  const contextData = useMemo(() => {
    if (!currentExp) return null;

    const targetPhrase = currentExp.phrase || currentExp.title;
    // Create regex to match target phrase case-insensitively
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const phraseRegex = new RegExp(`\\b${escapeRegex(targetPhrase)}\\b`, 'gi');

    // Priority 1: Dialogue scene
    if (currentExp.dialogue && currentExp.dialogue.speakerA && currentExp.dialogue.speakerB) {
      const { speakerA, speakerA_cn, speakerB, speakerB_cn } = currentExp.dialogue;
      const maskedA = speakerA.replace(phraseRegex, '【 _____ ? _____ 】');
      const maskedB = speakerB.replace(phraseRegex, '【 _____ ? _____ 】');

      return {
        type: 'dialogue',
        maskedTextA: maskedA,
        originalTextA: speakerA,
        textA_cn: speakerA_cn,
        maskedTextB: maskedB,
        originalTextB: speakerB,
        textB_cn: speakerB_cn,
        scenario: '原生情景对话复习',
      };
    }

    // Priority 2: Example sentence
    if (currentExp.examples && currentExp.examples.length > 0) {
      const eg = currentExp.examples[0];
      const maskedEg = eg.english.replace(phraseRegex, '【 _____ ? _____ 】');
      return {
        type: 'example',
        maskedEnglish: maskedEg,
        originalEnglish: eg.english,
        chinese: eg.chinese,
        scenario: eg.situation || '例句造句语境',
      };
    }

    // Priority 3: Podcast description or fallback
    const rawDesc = (currentExp.description || currentExp.title).replace(/<[^>]*>?/gm, '');
    const maskedDesc = rawDesc.replace(phraseRegex, '【 _____ ? _____ 】');
    return {
      type: 'description',
      maskedEnglish: maskedDesc,
      originalEnglish: rawDesc,
      chinese: currentExp.meaningCn,
      scenario: 'Podcast 节目深度例句语境',
    };
  }, [currentExp]);

  // Handle Reveal / Check Answer
  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleCheckAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAttemptChecked(true);
    setIsAnswerRevealed(true);
  };

  // Next / Previous Navigation
  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
      setUserAttempt('');
      setIsAttemptChecked(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsAnswerRevealed(false);
      setUserAttempt('');
      setIsAttemptChecked(false);
    }
  };

  const handleGradeMastered = () => {
    if (currentExp) {
      onToggleMastered(currentExp.id);
      handleNext();
    }
  };

  const handleGradeStarred = () => {
    if (currentExp) {
      onToggleStarred(currentExp.id);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (!isAnswerRevealed) {
          e.preventDefault();
          handleRevealAnswer();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerRevealed, currentIndex, deck.length]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD700] text-[#1A1A1A] flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                IMMERSIVE CONTEXT REVIEW · 沉浸式语境复习
              </h2>
              <p className="text-[11px] font-mono text-slate-300">
                遮挡关键表达，在真地道场景中逆向回想与强化记忆
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase ${
                showSettings ? 'bg-[#FFD700] text-[#1A1A1A] border-[#FFD700]' : 'bg-[#333] text-white border-white/20 hover:bg-[#444]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>设置范围</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#333] hover:bg-[#555] text-white transition-colors cursor-pointer border border-white/20 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Scope / Settings Drawer Panel */}
        {showSettings && (
          <div className="bg-[#FFD700] p-4 border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-mono text-xs animate-in slide-in-from-top duration-150">
            <h3 className="font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> 自定义沉浸复习范围
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 border border-[#1A1A1A]">
              {/* Episode Start & End */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#666] mb-1">
                  期数范围 (20期/组)
                </label>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="number"
                    min={1}
                    max={maxEpisodeNum}
                    value={startEp}
                    onChange={(e) => setStartEp(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 p-1 bg-[#FAF9F6] border border-[#1A1A1A] font-bold text-center"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    min={1}
                    max={maxEpisodeNum}
                    value={endEp}
                    onChange={(e) => setEndEp(Math.min(maxEpisodeNum, parseInt(e.target.value) || maxEpisodeNum))}
                    className="w-16 p-1 bg-[#FAF9F6] border border-[#1A1A1A] font-bold text-center"
                  />
                </div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => { setStartEp(1); setEndEp(20); }}
                    className={`px-1.5 py-0.5 border cursor-pointer ${startEp === 1 && endEp === 20 ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAF9F6] hover:bg-[#E8E6E1]'}`}
                  >
                    1-20
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStartEp(21); setEndEp(40); }}
                    className={`px-1.5 py-0.5 border cursor-pointer ${startEp === 21 && endEp === 40 ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAF9F6] hover:bg-[#E8E6E1]'}`}
                  >
                    21-40
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStartEp(41); setEndEp(60); }}
                    className={`px-1.5 py-0.5 border cursor-pointer ${startEp === 41 && endEp === 60 ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAF9F6] hover:bg-[#E8E6E1]'}`}
                  >
                    41-60
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStartEp(Math.max(1, maxEpisodeNum - 19)); setEndEp(maxEpisodeNum); }}
                    className={`px-1.5 py-0.5 border cursor-pointer ${endEp === maxEpisodeNum && startEp === maxEpisodeNum - 19 ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAF9F6] hover:bg-[#E8E6E1]'}`}
                  >
                    最新20期
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStartEp(1); setEndEp(maxEpisodeNum); }}
                    className={`px-1.5 py-0.5 border cursor-pointer ${startEp === 1 && endEp === maxEpisodeNum ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAF9F6] hover:bg-[#E8E6E1]'}`}
                  >
                    全部 (1-{maxEpisodeNum})
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#666] mb-1">
                  学习状态筛选 (STATUS)
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full p-1 bg-[#FAF9F6] border border-[#1A1A1A] font-bold"
                >
                  <option value="all">全部表达 (All)</option>
                  <option value="unmastered">仅未掌握 (Unmastered)</option>
                  <option value="starred">仅已收藏 (Starred)</option>
                </select>
              </div>

              {/* Order Shuffle */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#666] mb-1">
                  出题顺序 (ORDER)
                </label>
                <button
                  type="button"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className="w-full p-1 bg-[#FAF9F6] border border-[#1A1A1A] font-bold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>{isShuffle ? '🔀 随机抽取' : '🔢 按期数顺序'}</span>
                </button>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-[#444] font-serif italic text-right">
              已选中 <strong className="text-black font-extrabold">{deck.length}</strong> 个符合条件的表达进行沉浸复习
            </div>
          </div>
        )}

        {/* Deck Progress Bar */}
        <div className="bg-[#F2F0EB] px-6 py-2 border-b border-[#1A1A1A] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-[#1A1A1A] text-white px-2 py-0.5">
              CARD {deck.length > 0 ? currentIndex + 1 : 0} / {deck.length}
            </span>
            {currentExp && (
              <span className="font-bold text-[#1A1A1A]">
                EP #{currentExp.episodeNumber}
              </span>
            )}
          </div>

          <div className="w-36 bg-slate-300 h-2 border border-[#1A1A1A] overflow-hidden hidden sm:block">
            <div
              className="bg-[#1A1A1A] h-full transition-all duration-300"
              style={{
                width: `${deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Main Content Card Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!currentExp ? (
            <div className="py-16 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-[#666] mx-auto" />
              <h3 className="text-lg font-bold font-serif">所选范围暂无相关表达</h3>
              <p className="text-xs text-[#666] font-mono">
                请在右上角“设置范围”中调整期数区间或更改状态筛选条件。
              </p>
              <button
                onClick={() => {
                  setStartEp(1);
                  setEndEp(1120);
                  setFilterType('all');
                }}
                className="px-4 py-2 bg-[#1A1A1A] text-white font-bold text-xs uppercase cursor-pointer"
              >
                重置为全部表达
              </button>
            </div>
          ) : (
            <>
              {/* Context Scenario Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#FFD700] text-[#1A1A1A] border border-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>AI 实时语境: {aiContext?.scenario || (isLoadingAiContext ? '生成中...' : '普通情境')}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentExp && fetchAiContext(currentExp)}
                    disabled={isLoadingAiContext}
                    className="p-1 px-2.5 bg-white hover:bg-slate-100 border border-[#1A1A1A] text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 shadow-[2px_2px_0px_#1A1A1A]"
                    title="点击由 Gemini 3.1 Flash Lite 换一个全新真实场景"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAiContext ? 'animate-spin' : ''}`} />
                    <span>AI 换个新语境</span>
                  </button>

                  <button
                    onClick={handleGradeStarred}
                    className={`p-1 px-2 border text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-[2px_2px_0px_#1A1A1A] ${
                      currentExp.isStarred ? 'bg-[#FFD700] text-[#1A1A1A] border-[#1A1A1A]' : 'bg-white border-[#1A1A1A]'
                    }`}
                    title="收藏"
                  >
                    <Star className={`w-3.5 h-3.5 ${currentExp.isStarred ? 'fill-[#1A1A1A]' : ''}`} />
                    <span>{currentExp.isStarred ? 'STARRED' : 'STAR'}</span>
                  </button>
                </div>
              </div>

              {/* Main AI Masked Context Box */}
              <div className="bg-white p-6 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-4 relative">
                {isLoadingAiContext ? (
                  <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-[#FFD700] border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#1A1A1A]" />
                    </div>
                    <p className="text-sm font-serif font-bold text-[#1A1A1A]">
                      Gemini 3.1 Flash Lite 正在即时构建真实应用语境对话...
                    </p>
                    <p className="text-xs text-[#666] font-mono">
                      AI 当场根据实际口语与职场应用即兴出题，抛弃数据库固定模板
                    </p>
                  </div>
                ) : aiContextError ? (
                  <div className="p-4 bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-2">
                    <p className="font-serif">{aiContextError}</p>
                    <button
                      onClick={() => currentExp && fetchAiContext(currentExp)}
                      className="px-3 py-1 bg-[#1A1A1A] text-white font-bold cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" /> 重试生成
                    </button>
                  </div>
                ) : aiContext ? (
                  <div className="space-y-3">
                    {/* Speaker A */}
                    {aiContext.speakerA && (
                      <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]">
                        <p className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] leading-relaxed">
                          <strong className="font-mono text-[#666] mr-2">Speaker A:</strong>
                          {aiContext.speakerA}
                        </p>
                        {aiContext.speakerA_cn && (
                          <p className="text-xs text-[#666] font-serif italic mt-1 border-t border-dashed border-[#1A1A1A]/20 pt-1">
                            {aiContext.speakerA_cn}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Speaker B (Target Phrase) */}
                    <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]">
                      <p className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] leading-relaxed">
                        <strong className="font-mono text-[#666] mr-2">Speaker B:</strong>
                        {isAnswerRevealed ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: (aiContext.speakerB || '').replace(
                                new RegExp(
                                  `(${
                                    aiContext.targetPhraseInContext || currentExp.phrase
                                  }|${currentExp.phrase})`,
                                  'gi'
                                ),
                                '<mark class="bg-[#FFD700] text-[#1A1A1A] px-1 font-black">$1</mark>'
                              ),
                            }}
                          />
                        ) : (
                          <span>{aiContext.maskedSpeakerB || aiContext.speakerB.replace(new RegExp(`(${currentExp.phrase})`, 'gi'), '【 _____ 】')}</span>
                        )}
                      </p>
                      {aiContext.speakerB_cn && (
                        <p className="text-xs text-[#666] font-serif italic mt-1 border-t border-dashed border-[#1A1A1A]/20 pt-1">
                          {aiContext.speakerB_cn}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback to database context if no AI context */
                  contextData?.type === 'dialogue' ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#FAF9F6] border border-[#1A1A1A]">
                        <p className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] leading-relaxed">
                          <strong className="font-mono text-[#666] mr-2">Speaker A:</strong>
                          {isAnswerRevealed ? (
                            <span dangerouslySetInnerHTML={{
                              __html: contextData.originalTextA.replace(
                                new RegExp(`(${currentExp.phrase})`, 'gi'),
                                '<mark class="bg-[#FFD700] text-[#1A1A1A] px-1 font-black">$1</mark>'
                              )
                            }} />
                          ) : (
                            <span>{contextData.maskedTextA}</span>
                          )}
                        </p>
                        <p className="text-xs text-[#666] font-serif italic mt-1 border-t border-dashed border-[#1A1A1A]/20 pt-1">
                          {contextData.textA_cn}
                        </p>
                      </div>

                      <div className="p-3 bg-[#FAF9F6] border border-[#1A1A1A]">
                        <p className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] leading-relaxed">
                          <strong className="font-mono text-[#666] mr-2">Speaker B:</strong>
                          {isAnswerRevealed ? (
                            <span dangerouslySetInnerHTML={{
                              __html: contextData.originalTextB.replace(
                                new RegExp(`(${currentExp.phrase})`, 'gi'),
                                '<mark class="bg-[#FFD700] text-[#1A1A1A] px-1 font-black">$1</mark>'
                              )
                            }} />
                          ) : (
                            <span>{contextData.maskedTextB}</span>
                          )}
                        </p>
                        <p className="text-xs text-[#666] font-serif italic mt-1 border-t border-dashed border-[#1A1A1A]/20 pt-1">
                          {contextData.textB_cn}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#FAF9F6] border border-[#1A1A1A] space-y-2">
                      <p className="text-base sm:text-lg font-serif italic font-bold text-[#1A1A1A] leading-relaxed">
                        {isAnswerRevealed ? (
                          <span dangerouslySetInnerHTML={{
                            __html: (contextData?.originalEnglish || '').replace(
                              new RegExp(`(${currentExp.phrase})`, 'gi'),
                              '<mark class="bg-[#FFD700] text-[#1A1A1A] px-1 font-black">$1</mark>'
                            )
                          }} />
                        ) : (
                          <span>{contextData?.maskedEnglish}</span>
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Reveal Trigger */}
              {!isAnswerRevealed ? (
                <div className="bg-[#F2F0EB] p-4 border border-[#1A1A1A] text-center space-y-2">
                  <button
                    onClick={handleRevealAnswer}
                    className="w-full py-3 bg-[#1A1A1A] text-white hover:bg-[#333] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1A1A1A] transition-all"
                  >
                    <Eye className="w-4 h-4 text-[#FFD700]" />
                    <span>点击揭晓答案 (Reveal Answer)</span>
                  </button>
                  <p className="text-[11px] text-[#666] font-mono">
                    快捷键：按下 <kbd className="px-1.5 py-0.5 bg-white border border-[#1A1A1A] font-bold text-[#1A1A1A]">Space</kbd> 或 <kbd className="px-1.5 py-0.5 bg-white border border-[#1A1A1A] font-bold text-[#1A1A1A]">Enter</kbd> 直接显示答案
                  </p>
                </div>
              ) : (
                /* Revealed Answer & Detailed Analysis */
                <div className="bg-[#FFD700] p-6 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/70 block">
                        ANSWER REVEALED · 考察表达
                      </span>
                      <h3 className="text-3xl font-serif font-black text-[#1A1A1A]">
                        {currentExp.phrase}
                      </h3>
                      <p className="text-sm font-serif font-bold text-[#1A1A1A] mt-1">
                        释义：{currentExp.meaningCn}
                      </p>
                      {currentExp.phonetic && (
                        <p className="text-xs font-mono text-[#1A1A1A]/80 mt-0.5">
                          {currentExp.phonetic}
                        </p>
                      )}
                    </div>

                    {onSelectExpression && (
                      <button
                        onClick={() => onSelectExpression(currentExp)}
                        className="px-3.5 py-2 bg-[#1A1A1A] text-white hover:bg-[#333] text-xs font-bold font-mono border border-[#1A1A1A] flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1A1A1A] shrink-0 self-start sm:self-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>查看单词完整详情</span>
                      </button>
                    )}
                  </div>

                  {currentExp.usageNuance && (
                    <div className="bg-white/80 p-3 border border-[#1A1A1A] text-xs text-[#1A1A1A]">
                      <span className="font-bold uppercase tracking-wider block mb-0.5 font-mono">
                        Usage Nuance (用法要点):
                      </span>
                      <p className="font-sans leading-relaxed">{currentExp.usageNuance}</p>
                    </div>
                  )}

                  {/* Self Grading Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#1A1A1A]">
                    <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                      复习自测评级：
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-white text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#FAF9F6] text-xs font-bold font-mono uppercase cursor-pointer"
                      >
                        仍需巩固 (Next)
                      </button>

                      <button
                        onClick={handleGradeMastered}
                        className="px-4 py-2 bg-[#1A1A1A] text-white border border-[#1A1A1A] hover:bg-[#333] text-xs font-bold font-mono uppercase cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                        <span>已掌握 (Mastered)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3.5 bg-[#F2F0EB] border-t border-[#1A1A1A] flex items-center justify-between shrink-0 font-mono text-xs">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 bg-white border border-[#1A1A1A] disabled:opacity-40 text-xs font-bold uppercase cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> PREV
          </button>

          <span className="text-[#666] hidden sm:inline">
            PRESS ← / → KEYS TO SWITCH CARDS
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex >= deck.length - 1}
            className="px-4 py-1.5 bg-[#1A1A1A] text-white border border-[#1A1A1A] disabled:opacity-40 text-xs font-bold uppercase cursor-pointer flex items-center gap-1"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
