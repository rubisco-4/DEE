import React, { useState, useEffect, useMemo } from 'react';
import { Expression } from './types';
import { Header } from './components/Header';
import { BatchRangeSelector } from './components/BatchRangeSelector';
import { ExpressionCard } from './components/ExpressionCard';
import { ExpressionDetailModal } from './components/ExpressionDetailModal';
import { ImmersiveReviewModal } from './components/ImmersiveReviewModal';
import { PRESEEDED_EXPRESSIONS } from './data/preseededExpressions';
import {
  Loader2,
  Sparkles,
  BookOpen,
  Filter,
  RefreshCw,
  SearchX,
  Radio,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function App() {
  const [expressions, setExpressions] = useState<Expression[]>(() => {
    return PRESEEDED_EXPRESSIONS.map((exp) => ({
      ...exp,
      title: exp.phrase || exp.title,
      phrase: exp.phrase || exp.title,
    }));
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRangeStart, setActiveRangeStart] = useState<number | null>(1);
  const [activeRangeEnd, setActiveRangeEnd] = useState<number | null>(20); // Default to first 20 batch (1-20)
  const [activeBatchLabel, setActiveBatchLabel] = useState('1-20');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unmastered' | 'starred' | 'mastered'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default chronological 1 -> N
  const [maxEpisodeNum, setMaxEpisodeNum] = useState(1120);

  // Selected Expression for Detail Modal
  const [selectedExpression, setSelectedExpression] = useState<Expression | null>(null);

  // Immersive Review Mode State
  const [isImmersiveReviewOpen, setIsImmersiveReviewOpen] = useState(false);

  // RSS Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // AI Enrichment State
  const [isEnriching, setIsEnriching] = useState(false);

  // Local storage state for mastered, starred, notes
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dee_mastered_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dee_starred_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [userNotesMap, setUserNotesMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dee_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('dee_mastered_ids', JSON.stringify(Array.from(masteredIds)));
  }, [masteredIds]);

  useEffect(() => {
    localStorage.setItem('dee_starred_ids', JSON.stringify(Array.from(starredIds)));
  }, [starredIds]);

  useEffect(() => {
    localStorage.setItem('dee_user_notes', JSON.stringify(userNotesMap));
  }, [userNotesMap]);

  // Fetch expression list from backend
  const fetchExpressions = async () => {
    try {
      const params = new URLSearchParams();
      params.set('sort', sortOrder);

      const res = await fetch(`/api/expressions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setExpressions(data.data);
          if (data.maxEpisodeNumber) {
            setMaxEpisodeNum(data.maxEpisodeNumber);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load expressions from server, using preloaded data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpressions();
  }, [sortOrder]);

  // Sync RSS endpoint call with client-side CORS fallback
  const fallbackClientSyncRss = async () => {
    const urls = [
      'https://api.allorigins.win/raw?url=https://rss.libsyn.com/shows/54133/destinations/197908.xml',
      'https://corsproxy.io/?https://rss.libsyn.com/shows/54133/destinations/197908.xml',
      'https://rss.libsyn.com/shows/54133/destinations/197908.xml',
    ];

    let xmlText = '';
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok) {
          const txt = await res.text();
          if (txt && txt.includes('<item>')) {
            xmlText = txt;
            break;
          }
        }
      } catch (e) {
        console.warn('Client RSS fetch error on ' + url, e);
      }
    }

    if (!xmlText) {
      setSyncToast('RSS 节点响应超时，已维持现有数据库');
      return;
    }

    try {
      const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
      const items = Array.from(doc.querySelectorAll('item'));
      let newCount = 0;

      setExpressions((prev) => {
        const existingEpNumbers = new Set(prev.map((e) => e.episodeNumber));
        const updated = [...prev];

        for (const item of items) {
          const titleStr = item.querySelector('title')?.textContent || '';
          const epMatch = titleStr.match(/\b(?:EE|EP|Episode|E)?\s*#?\s*(\d{1,4})\b/i);
          const epNum = epMatch ? parseInt(epMatch[1], 10) : 0;
          if (!epNum || epNum > 9000) continue;

          let cleanPhrase = titleStr
            .replace(/^(?:RE-?UP!?|FIXED|UPDATE!?|RE-?POST!?)\s*/i, '')
            .replace(/^(?:Coach\s+Shane'?s\s+)?(?:Daily\s+Easy\s+English(?:\s+Expression|\s+Podcast)?|D\.?E\.?E\.?E?\.?)\s*/i, '')
            .replace(/^(?:Lesson|Podcast|Episode|EP|EE|E)[\s:_–—\-\.~]*/i, '')
            .replace(/^#?\d+[\s:_–—\-\.~]*/, '')
            .replace(/^[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+/g, '')
            .replace(/[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+$/g, '')
            .trim();

          if (!cleanPhrase || cleanPhrase.length < 2) {
            cleanPhrase = `Expression #${epNum}`;
          }

          const desc = item.querySelector('description')?.textContent?.replace(/<[^>]*>?/gm, '') || '';
          const enclosure = item.querySelector('enclosure');
          const audioUrl = enclosure?.getAttribute('url') || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';

          if (!existingEpNumbers.has(epNum)) {
            newCount++;
            existingEpNumbers.add(epNum);
            updated.push({
              id: `dee-${epNum}`,
              episodeNumber: epNum,
              title: cleanPhrase,
              phrase: cleanPhrase,
              meaningCn: '可点击“AI深度解析”实时生成地道中文释义与例句',
              category: 'Daily Life',
              audioUrl,
              pubDate,
              description: desc,
              examples: [
                {
                  english: `Example sentence for "${cleanPhrase}" in Episode ${epNum}.`,
                  chinese: `第${epNum}期表达“${cleanPhrase}”的应用例句。`,
                },
              ],
            });
          } else {
            const idx = updated.findIndex((e) => e.episodeNumber === epNum);
            if (idx !== -1) {
              if (cleanPhrase && !cleanPhrase.startsWith('Expression #')) {
                updated[idx].title = cleanPhrase;
                updated[idx].phrase = cleanPhrase;
              }
              if (audioUrl && !updated[idx].audioUrl) {
                updated[idx].audioUrl = audioUrl;
              }
            }
          }
        }

        updated.sort((a, b) => a.episodeNumber - b.episodeNumber);
        return updated;
      });

      setMaxEpisodeNum((prevMax) => {
        let max = prevMax;
        for (const item of items) {
          const t = item.querySelector('title')?.textContent || '';
          const m = t.match(/\b(?:EE|EP|Episode|E)?\s*#?\s*(\d{1,4})\b/i);
          const num = m ? parseInt(m[1], 10) : 0;
          if (num > max && num < 9000) max = num;
        }
        return max;
      });

      setSyncToast(`🎉 官方 RSS 同步成功！${newCount > 0 ? `增量获取 ${newCount} 期最新表达` : '所有表达已是最新状态'}`);
    } catch (e) {
      console.error('Failed to parse client RSS XML:', e);
      setSyncToast('RSS 解析失败，已维持现有数据库');
    }
  };

  const handleSyncRss = async () => {
    setIsSyncing(true);
    setSyncToast('正在与 Daily Easy English 官方 RSS 节点同步...');
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/expressions/sync-rss', { signal: controller.signal });
      clearTimeout(tid);

      if (res.ok) {
        const data = await res.json();
        if (data.message && !data.message.includes('Could not reach')) {
          setSyncToast(data.message);
          await fetchExpressions();
        } else {
          // Fallback to client-side CORS fetch if backend could not reach RSS
          await fallbackClientSyncRss();
        }
      } else {
        await fallbackClientSyncRss();
      }
    } catch (e) {
      console.warn('Backend RSS sync timed out or failed, running client fallback...', e);
      await fallbackClientSyncRss();
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 5000);
    }
  };

  // AI Enrich Expression call
  const handleEnrichExpression = async (exp: Expression) => {
    setIsEnriching(true);
    try {
      const res = await fetch('/api/expressions/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeNumber: exp.episodeNumber,
          phrase: exp.phrase,
          context: exp.description || exp.title,
        }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        const enrichedData = data.data;
        // Update state in memory
        setExpressions((prev) =>
          prev.map((item) =>
            item.id === exp.id || (item?.episodeNumber != null && item.episodeNumber === exp?.episodeNumber)
              ? { ...item, ...enrichedData }
              : item
          )
        );

        if (selectedExpression && selectedExpression.id === exp.id) {
          setSelectedExpression((prev) => (prev ? { ...prev, ...enrichedData } : null));
        }

        setSyncToast(`已成功使用 Gemini 智能生成【${exp.phrase}】详细例句与试题！`);
        setTimeout(() => setSyncToast(null), 3000);
      } else {
        setSyncToast(data.error || 'AI 解析生成暂不可用，请稍后再试');
        setTimeout(() => setSyncToast(null), 4000);
      }
    } catch (e) {
      console.error('Enrichment failed:', e);
      setSyncToast('请求失败，请检查网络后重试');
      setTimeout(() => setSyncToast(null), 3000);
    } finally {
      setIsEnriching(false);
    }
  };

  // Merge user state (mastered, starred, notes) into expressions
  const processedExpressions = useMemo(() => {
    return expressions.map((exp) => ({
      ...exp,
      isMastered: masteredIds.has(exp.id),
      isStarred: starredIds.has(exp.id),
      userNotes: userNotesMap[exp.id] || '',
    }));
  }, [expressions, masteredIds, starredIds, userNotesMap]);

  // Filtered Expressions for display on Homepage
  const displayedExpressions = useMemo(() => {
    return processedExpressions.filter((exp) => {
      if (!exp) return false;
      const epNum = exp.episodeNumber ?? 0;

      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchEp = epNum > 0 ? epNum.toString().includes(q) : false;
        const matchPhrase = (exp.phrase || '').toLowerCase().includes(q);
        const matchMeaning = (exp.meaningCn || '').toLowerCase().includes(q);
        const matchTags = (exp.tags || []).join(' ').toLowerCase().includes(q);
        if (!matchEp && !matchPhrase && !matchMeaning && !matchTags) return false;
      }

      // 2. Batch Range Filter (e.g. 1-20, 21-40) - Skip range if searching
      if (!searchQuery.trim() && activeRangeStart !== null && activeRangeEnd !== null) {
        if (epNum < activeRangeStart || epNum > activeRangeEnd) {
          return false;
        }
      }

      // 3. Status Filter (mastered / unmastered / starred)
      if (activeFilter === 'starred') return !!exp.isStarred;
      if (activeFilter === 'mastered') return !!exp.isMastered;
      if (activeFilter === 'unmastered') return !exp.isMastered;

      return true;
    });
  }, [processedExpressions, searchQuery, activeRangeStart, activeRangeEnd, activeFilter]);

  // Batch AI Enrich State
  const [isBatchEnriching, setIsBatchEnriching] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Calculate how many expressions in displayedExpressions are already enriched
  const enrichedCountInCurrentGroup = useMemo(() => {
    return displayedExpressions.filter(
      (exp) =>
        exp.usageNuance ||
        exp.dialogue ||
        (exp.examples && exp.examples.length > 0 && exp.examples[0].situation)
    ).length;
  }, [displayedExpressions]);

  // One-click batch AI enrich handler for the current group
  const handleBatchEnrichCurrentGroup = async () => {
    if (displayedExpressions.length === 0 || isBatchEnriching) return;

    // Target expressions that need AI enrichment first
    const targets = displayedExpressions.filter(
      (exp) =>
        !exp.usageNuance &&
        !exp.dialogue &&
        !(exp.examples && exp.examples.length > 0 && exp.examples[0].situation)
    );

    const itemsToProcess = targets.length > 0 ? targets : displayedExpressions;

    setIsBatchEnriching(true);
    setBatchProgress({ current: 0, total: itemsToProcess.length });
    setSyncToast(`正在批量请求 Gemini AI 对 【${activeBatchLabel}】分组进行深度解析...`);

    let successCount = 0;
    let quotaHit = false;

    for (let i = 0; i < itemsToProcess.length; i++) {
      const exp = itemsToProcess[i];
      setBatchProgress({ current: i + 1, total: itemsToProcess.length });

      try {
        const res = await fetch('/api/expressions/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeNumber: exp.episodeNumber,
            phrase: exp.phrase,
            context: exp.description || exp.title,
          }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          successCount++;
          const enrichedData = data.data;

          setExpressions((prev) =>
            prev.map((item) =>
              item.id === exp.id || (item?.episodeNumber != null && item.episodeNumber === exp?.episodeNumber)
                ? { ...item, ...enrichedData }
                : item
            )
          );
        } else {
          if (data.error && (data.error.includes('429') || data.error.includes('Quota'))) {
            quotaHit = true;
            break;
          }
        }
      } catch (err) {
        console.error(`Batch enrich error on ${exp.phrase}:`, err);
      }
    }

    setIsBatchEnriching(false);

    if (quotaHit) {
      setSyncToast(`API 额度受限，已完成 ${successCount}/${itemsToProcess.length} 个表达的 AI 深度解析`);
    } else {
      setSyncToast(`🎉 成功完成【${activeBatchLabel}】分组共 ${successCount} 个表达的 AI 深度解析！`);
    }
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Toggle Handlers
  const handleToggleMastered = (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleStarred = (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setUserNotesMap((prev) => ({ ...prev, [id]: notes }));
  };

  const handleSelectRange = (startNum: number | null, endNum: number | null, label: string) => {
    setActiveRangeStart(startNum);
    setActiveRangeEnd(endNum);
    setActiveBatchLabel(label);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Banner for Sync / AI messages */}
      {syncToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenImmersiveReview={() => setIsImmersiveReviewOpen(true)}
        onSyncRss={handleSyncRss}
        isSyncing={isSyncing}
        totalCount={processedExpressions.length}
        masteredCount={masteredIds.size}
        starredCount={starredIds.size}
        activeBatchLabel={activeBatchLabel}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Batch Range Filter */}
        <BatchRangeSelector
          activeRangeStart={activeRangeStart}
          activeRangeEnd={activeRangeEnd}
          onSelectRange={handleSelectRange}
          maxEpisodeNum={maxEpisodeNum}
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        />

        {/* Results Banner Header & One-Click AI Batch Enrich Bar */}
        <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif font-black text-base sm:text-lg text-[#1A1A1A]">
                {searchQuery ? `搜索关键词: “${searchQuery}”` : `当前分组 【${activeBatchLabel}】`}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#1A1A1A] text-white">
                共 {displayedExpressions.length} 个表达
              </span>
            </div>
            <p className="text-xs text-[#666] font-serif flex items-center gap-1.5">
              {enrichedCountInCurrentGroup === displayedExpressions.length && displayedExpressions.length > 0 ? (
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>当前分组所有表达均已完成 AI 深度解析！</span>
                </span>
              ) : (
                <span>
                  AI 深度解析进度：<strong className="text-[#1A1A1A] font-bold">{enrichedCountInCurrentGroup} / {displayedExpressions.length}</strong>
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleBatchEnrichCurrentGroup}
            disabled={isBatchEnriching || displayedExpressions.length === 0}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#FFD700] hover:bg-[#f0c800] disabled:opacity-60 text-[#1A1A1A] font-bold text-xs font-mono border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 uppercase tracking-wider active:translate-y-0.5"
            title="一键调用 Gemini AI 对当前分组全部词汇生成详细用法、深度对话与试题"
          >
            {isBatchEnriching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                <span>批量 AI 解析中 ({batchProgress.current}/{batchProgress.total})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                <span>一键完成当下分组 AI 深度解析</span>
              </>
            )}
          </button>
        </div>

        {/* Expressions Grid List */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">正在加载 Daily Easy English 表达库...</p>
          </div>
        ) : displayedExpressions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-8 space-y-4">
            <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-800">未找到相关表达</h3>
              <p className="text-xs text-slate-500 mt-1">
                在该筛选条件或【{activeBatchLabel}】范围内暂无匹配结果。
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveRangeStart(null);
                setActiveRangeEnd(null);
                setActiveBatchLabel('全部 (1-N)');
                setActiveFilter('all');
              }}
              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              重置筛选条件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedExpressions.map((exp) => (
              <ExpressionCard
                key={exp.id}
                expression={exp}
                onSelect={(selected) => setSelectedExpression(selected)}
                onToggleMastered={(e, id) => handleToggleMastered(e, id)}
                onToggleStarred={(e, id) => handleToggleStarred(e, id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Daily Easy English Expression 复习助手 · 基于 Libsyn Podcast 官方音频制作
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>支持 1-20 分组定位</span>
            <span>•</span>
            <span>支持 Gemini AI 智能例句解构</span>
            <span>•</span>
            <span>支持 Immersive 沉浸式语境复习</span>
          </div>
        </div>
      </footer>

      {/* Immersive Context Review Modal */}
      {isImmersiveReviewOpen && (
        <ImmersiveReviewModal
          expressions={processedExpressions}
          onClose={() => setIsImmersiveReviewOpen(false)}
          onToggleMastered={(id) => handleToggleMastered(null, id)}
          onToggleStarred={(id) => handleToggleStarred(null, id)}
          onSelectExpression={(exp) => setSelectedExpression(exp)}
          maxEpisodeNum={maxEpisodeNum}
        />
      )}

      {/* Expression Detail Study Modal (highest z-index layer: z-[70]) */}
      {selectedExpression && (
        <ExpressionDetailModal
          expression={selectedExpression}
          allExpressions={processedExpressions}
          onClose={() => setSelectedExpression(null)}
          onSelectExpression={(exp) => setSelectedExpression(exp)}
          onToggleMastered={(id) => handleToggleMastered(null, id)}
          onToggleStarred={(id) => handleToggleStarred(null, id)}
          onUpdateNotes={handleUpdateNotes}
          onEnrichExpression={handleEnrichExpression}
          isEnriching={isEnriching}
        />
      )}

    </div>
  );
}
