import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { XMLParser } from 'fast-xml-parser';
import { PRESEEDED_EXPRESSIONS } from './src/data/preseededExpressions';
import { Expression } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to extract episode number from titles like "EE 1120: Piece of cake", "1120: Piece of cake", "E3M 800: ..."
function parseEpisodeNumber(title: string): number {
  const match = title.match(/(?:E3M|EE|Episode|E)?\s*#?(\d+)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 9999;
}

// Helper to extract clean expression phrase from title string
function cleanPhraseString(str: string): string {
  if (!str) return '';
  let s = str.trim();
  s = s.replace(/<[^>]*>?/gm, '');

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 10) {
    iterations++;
    const prev = s;

    // Strip status tags like "RE-UP!", "FIXED", "UPDATE!", "RE-AUDIO", "NEW", "FINAL"
    s = s.replace(/^(?:RE-?UP!?|FIXED|UPDATE!?|RE-?POST!?|AUDIO\s+FIXED|RE-?AUDIO|FINAL)\s*/i, '');

    // Remove brand/series/podcast/lesson/pidcast/podcast- prefixes (case insensitive)
    s = s.replace(/^(?:Coach\s+Shane'?s\s+)?(?:Daily\s+Easy\s+English(?:\s+Expression|\s+Podcast|\s+Lesson)?|D\.?E\.?E\.?E?\.?)\s*/i, '');
    s = s.replace(/^(?:Lesson|Lessons|Podcast|Podcasts|Pidcast|Pidcasts|Episode|EP|Ep\.|EE|E3M|E|PIDO?CAST)[\s:_–—\-\.~]*/i, '');
    s = s.replace(/^#?\d+[\s:_–—\-\.~]*/, '');
    s = s.replace(/^(?:Lesson|Lessons|Podcast|Podcasts|Pidcast|Pidcasts|Episode|EP|Ep\.|EE|E3M|E|PIDO?CAST)[\s:_–—\-\.~]*/i, '');

    // Remove "Learn how to use..." or "Learn..."
    s = s.replace(/^Learn\s+(?:how\s+to\s+use\s+)?["'“‘]?/i, '');
    s = s.replace(/["'”’]?\s*(?:with\s+Coach\s+Shane|\(?four\s+meanings!\)?|\(?PLUS\s+one\s+more!\)?).*$/i, '');

    // Remove leading/trailing symbols & whitespace
    s = s.replace(/^[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+/g, '');
    s = s.replace(/[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+$/g, '');

    changed = prev !== s;
  }

  // Final pass cleanup of any leftover prefix like "PIDCAST-" or "Lesson-"
  s = s.replace(/^(?:Lesson|Lessons|Podcast|Podcasts|Pidcast|Pidcasts|PIDO?CAST)[\s:_–—\-\.~]*/i, '');
  s = s.replace(/^[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+/g, '');
  s = s.replace(/[:：_–—\-\.\~\s"'\u201c\u201d\u2018\u2019]+$/g, '');

  return s.trim();
}

// Helper to extract phrase from RSS item description when title is empty/generic
function extractPhraseFromDesc(desc: string): string {
  if (!desc) return '';
  const clean = desc.replace(/<[^>]*>?/gm, '').trim();

  // Pattern 1: "Today's (English) expression (and dialog)?: <phrase>"
  const matchExpr = clean.match(/(?:Today'?s\s+)?(?:English\s+)?expression(?:\s+and\s+dialog)?\s*[:：]\s*([^\n\r~～\.\!]+)/i);
  if (matchExpr && matchExpr[1]) {
    let rawCandidate = matchExpr[1].trim();
    // Stop before sentence/dialog start or ALL CAPS words e.g. "a stroke of luck HOW did you get..."
    const capMatch = rawCandidate.match(/^([a-z0-9\s'’-]+?)\s+([A-Z]{2,}\b.*)/);
    if (capMatch && capMatch[1] && capMatch[1].trim().length >= 2) {
      rawCandidate = capMatch[1];
    }
    const candidate = cleanPhraseString(rawCandidate);
    if (candidate && candidate.length >= 2 && candidate.length <= 80) return candidate;
  }

  // Pattern 2: Quotes in description e.g. "Beggars can't be choosers"
  const quotes = clean.match(/["“'‘]([A-Za-z0-9\s,'’!\?\-]+)["”'’]/g);
  if (quotes) {
    for (const q of quotes) {
      const candidate = cleanPhraseString(q);
      if (candidate.length >= 2 && candidate.length <= 60 && !/^(Coach Shane|Daily Easy English|Podcast|Lesson|Listen|Download|http)/i.test(candidate)) {
        return candidate;
      }
    }
  }

  return '';
}

// Master phrase parser from title + description fallback
function parsePhrase(title: string, desc?: string): string {
  let phrase = cleanPhraseString(title);
  if (!phrase || phrase.length < 2 || phrase.startsWith('Expression #')) {
    if (desc) {
      const descPhrase = extractPhraseFromDesc(desc);
      if (descPhrase) {
        phrase = descPhrase;
      }
    }
  }
  return phrase;
}

// In-memory expression store initialized with seed data
let expressionsStore: Expression[] = PRESEEDED_EXPRESSIONS.map((exp) => {
  const cleanTitle = parsePhrase(exp.phrase || exp.title, exp.description) || exp.phrase;
  return {
    ...exp,
    title: cleanTitle,
    phrase: cleanTitle,
  };
});

// 1. GET /api/expressions - Query expressions with sorting (1 to N chronological), range filter, search keyword
app.get('/api/expressions', (req, res) => {
  try {
    const sort = (req.query.sort as string) || 'asc'; // 'asc' means Episode 1, 2, 3... N
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    const rangeStart = req.query.rangeStart ? parseInt(req.query.rangeStart as string, 10) : null;
    const rangeEnd = req.query.rangeEnd ? parseInt(req.query.rangeEnd as string, 10) : null;
    const filter = (req.query.filter as string) || 'all'; // 'all', 'mastered', 'unmastered', 'starred'

    let list = [...expressionsStore];

    // Filter by search query
    if (q) {
      list = list.filter((exp) => {
        if (!exp) return false;
        const epStr = exp.episodeNumber != null ? exp.episodeNumber.toString() : '';
        const phraseStr = (exp.phrase || '').toLowerCase();
        const meaningStr = (exp.meaningCn || '').toLowerCase();
        const tagsStr = (exp.tags || []).join(' ').toLowerCase();
        return (
          epStr.includes(q) ||
          phraseStr.includes(q) ||
          meaningStr.includes(q) ||
          tagsStr.includes(q)
        );
      });
    }

    // Filter by Range (e.g. 1-20, 21-40)
    if (rangeStart !== null && rangeEnd !== null) {
      list = list.filter(
        (exp) => exp?.episodeNumber != null && exp.episodeNumber >= rangeStart && exp.episodeNumber <= rangeEnd
      );
    }

    // Filter by status
    if (filter === 'starred') {
      list = list.filter((exp) => exp.isStarred);
    } else if (filter === 'mastered') {
      list = list.filter((exp) => exp.isMastered);
    } else if (filter === 'unmastered') {
      list = list.filter((exp) => !exp.isMastered);
    }

    // Sorting: Prompt requirement #1: "按照序号顺序排列（而这个网站的英语表达从上到下是从大到小，所以你需要把他倒过来）"
    list.sort((a, b) => {
      const aEp = a?.episodeNumber ?? 0;
      const bEp = b?.episodeNumber ?? 0;
      if (sort === 'desc') {
        return bEp - aEp;
      }
      return aEp - bEp; // asc = 1, 2, 3...
    });

    const maxEpisode = Math.max(...expressionsStore.map((e) => e?.episodeNumber ?? 0), 1120);

    res.json({
      success: true,
      totalCount: expressionsStore.length,
      filteredCount: list.length,
      maxEpisodeNumber: maxEpisode,
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /api/expressions/sync-rss - Fetch latest Daily Easy English Podcast RSS and merge new episodes
app.get('/api/expressions/sync-rss', async (req, res) => {
  try {
    const rssUrls = [
      'https://rss.libsyn.com/shows/54133/destinations/197908.xml',
      'http://feeds.libsyn.com/54133/rss',
    ];

    let xmlText = '';
    for (const url of rssUrls) {
      try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (response.ok) {
          xmlText = await response.text();
          if (xmlText && xmlText.includes('<item>')) break;
        }
      } catch (e) {
        console.warn(`Failed fetching RSS from ${url}:`, e);
      }
    }

    if (!xmlText) {
      return res.json({
        success: true,
        message: 'Could not reach live RSS feed; using pre-seeded local database.',
        addedCount: 0,
        totalCount: expressionsStore.length,
      });
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const jsonObj = parser.parse(xmlText);
    const channel = jsonObj?.rss?.channel;
    const rawItems = channel?.item || [];
    const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    let newItemsCount = 0;
    const existingEpNumbers = new Set(expressionsStore.map((e) => e.episodeNumber));

    for (const item of itemsArray) {
      const titleStr = String(item.title || '');
      const epNum = parseEpisodeNumber(titleStr);
      if (!epNum || epNum === 9999) continue;

      const desc = String(item.description || item['itunes:summary'] || '').replace(/<[^>]*>?/gm, '');
      const cleanPhrase = parsePhrase(titleStr, desc) || `Expression #${epNum}`;

      if (!existingEpNumbers.has(epNum)) {
        const enclosure = item.enclosure;
        const mp3Url = enclosure?.['@_url'] || enclosure?.url || '';
        const pubDate = String(item.pubDate || '');

        const newExp: Expression = {
          id: `dee-${epNum}`,
          episodeNumber: epNum,
          title: cleanPhrase,
          phrase: cleanPhrase,
          meaningCn: '可点击“AI深度解析”实时生成地道中文释义与例句',
          category: 'Daily Life',
          audioUrl: mp3Url,
          pubDate: pubDate,
          description: desc,
          examples: [
            {
              english: `Example sentence for "${cleanPhrase}" in Episode ${epNum}.`,
              chinese: `第${epNum}期表达“${cleanPhrase}”的应用例句。`,
            },
          ],
        };

        expressionsStore.push(newExp);
        existingEpNumbers.add(epNum);
        newItemsCount++;
      } else {
        // Update audio URL or clean existing entry phrase/title
        const existingIndex = expressionsStore.findIndex((e) => e.episodeNumber === epNum);
        if (existingIndex !== -1) {
          if (cleanPhrase && !cleanPhrase.startsWith('Expression #')) {
            expressionsStore[existingIndex].title = cleanPhrase;
            expressionsStore[existingIndex].phrase = cleanPhrase;
          }
          const enclosure = item.enclosure;
          const mp3Url = enclosure?.['@_url'] || enclosure?.url || '';
          if (mp3Url && !expressionsStore[existingIndex].audioUrl) {
            expressionsStore[existingIndex].audioUrl = mp3Url;
          }
        }
      }
    }

    // Re-sort store
    expressionsStore.sort((a, b) => a.episodeNumber - b.episodeNumber);

    res.json({
      success: true,
      message: `RSS Sync completed! Merged ${newItemsCount} new expression episodes.`,
      addedCount: newItemsCount,
      totalCount: expressionsStore.length,
    });
  } catch (err: any) {
    console.error('RSS Sync error:', err);
    res.json({
      success: true,
      message: 'Using offline preloaded expression database.',
      addedCount: 0,
      totalCount: expressionsStore.length,
    });
  }
});

// 3. POST /api/expressions/enrich - Use Gemini 3.6 Flash to dynamically enrich an expression page
app.get('/api/expressions/:id', (req, res) => {
  const exp = expressionsStore.find((e) => e.id === req.params.id || e.episodeNumber === parseInt(req.params.id, 10));
  if (!exp) {
    return res.status(404).json({ success: false, error: 'Expression not found' });
  }
  res.json({ success: true, data: exp });
});

app.post('/api/expressions/enrich', async (req, res) => {
  try {
    const { episodeNumber, phrase, context } = req.body;

    if (!phrase) {
      return res.status(400).json({ success: false, error: 'Phrase is required' });
    }

    const promptText = `You are a native English teacher and creator of the Daily Easy English Expression podcast.
Please provide a comprehensive study breakdown in JSON format for the English expression: "${phrase}" (Episode #${episodeNumber || 'N/A'}).
Extra Podcast context: ${context || 'Daily Easy English Expression'}.

Output strictly valid JSON adhering to this structure:
{
  "phrase": "${phrase}",
  "phonetic": "International Phonetic Alphabet e.g. /.../",
  "meaningCn": "Concise, precise Chinese translation of the phrase",
  "definitionEn": "Clear English definition",
  "category": "e.g. Idioms / Workplace / Social / Emotions / Slang",
  "tags": ["Tag1", "Tag2"],
  "usageNuance": "Detailed explanation in Chinese about when and how native speakers use this, tone nuances, common mistakes to avoid",
  "examples": [
    {
      "english": "Vivid, natural English sentence 1 using the phrase",
      "chinese": "Accurate Chinese translation of sentence 1",
      "situation": "Occasion / context e.g. 办公室内 / 朋友聊天"
    },
    {
      "english": "Natural English sentence 2",
      "chinese": "Chinese translation 2",
      "situation": "Occasion / context"
    },
    {
      "english": "Natural English sentence 3",
      "chinese": "Chinese translation 3",
      "situation": "Occasion / context"
    }
  ],
  "dialogue": {
    "speakerA": "English line by Speaker A",
    "speakerA_cn": "Chinese line by Speaker A",
    "speakerB": "English line by Speaker B with the expression",
    "speakerB_cn": "Chinese line by Speaker B"
  },
  "quiz": {
    "question": "Multiple choice test question about the meaning or usage of '${phrase}'",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation in Chinese why Option A is correct"
  }
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            meaningCn: { type: Type.STRING },
            definitionEn: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            usageNuance: { type: Type.STRING },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  chinese: { type: Type.STRING },
                  situation: { type: Type.STRING },
                },
                required: ['english', 'chinese'],
              },
            },
            dialogue: {
              type: Type.OBJECT,
              properties: {
                speakerA: { type: Type.STRING },
                speakerA_cn: { type: Type.STRING },
                speakerB: { type: Type.STRING },
                speakerB_cn: { type: Type.STRING },
              },
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
            },
          },
          required: ['phrase', 'meaningCn', 'examples', 'usageNuance'],
        },
      },
    });

    const parsedData = JSON.parse(geminiRes.text || '{}');

    // Update expression in memory store if found
    const targetIdx = expressionsStore.findIndex(
      (e) => e.episodeNumber === episodeNumber || e.phrase.toLowerCase() === phrase.toLowerCase()
    );

    if (targetIdx !== -1) {
      expressionsStore[targetIdx] = {
        ...expressionsStore[targetIdx],
        ...parsedData,
        meaningCn: parsedData.meaningCn || expressionsStore[targetIdx].meaningCn,
        phonetic: parsedData.phonetic || expressionsStore[targetIdx].phonetic,
        definitionEn: parsedData.definitionEn || expressionsStore[targetIdx].definitionEn,
        usageNuance: parsedData.usageNuance || expressionsStore[targetIdx].usageNuance,
        examples: parsedData.examples || expressionsStore[targetIdx].examples,
        dialogue: parsedData.dialogue || expressionsStore[targetIdx].dialogue,
        quiz: parsedData.quiz || expressionsStore[targetIdx].quiz,
      };
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Enrichment error:', error);
    const isQuota = error?.status === 'RESOURCE_EXHAUSTED' || (error?.message && error.message.includes('429')) || (error?.message && error.message.includes('Quota exceeded'));
    const friendlyMsg = isQuota
      ? 'Gemini API 免费额度已达上限 (429 Quota Exceeded)，请稍后再试或查看预载例句。'
      : (error.message || 'Failed to enrich expression');
    res.status(isQuota ? 429 : 500).json({ success: false, isQuotaExceeded: isQuota, error: friendlyMsg });
  }
});

// 4. POST /api/tts - Audio speech generation using Gemini TTS
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text parameter required' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ success: true, audioBase64: base64Audio });
    } else {
      res.status(500).json({ success: false, error: 'No audio returned' });
    }
  } catch (err: any) {
    console.error('TTS error:', err);
    const isQuota = err?.status === 'RESOURCE_EXHAUSTED' || (err?.message && err.message.includes('429')) || (err?.message && err.message.includes('Quota exceeded'));
    const friendlyMsg = isQuota
      ? '语音生成 API 额度已达上限 (429 Quota Exceeded)，请稍后再试。'
      : (err.message || 'TTS request failed');
    res.status(isQuota ? 429 : 500).json({ success: false, isQuotaExceeded: isQuota, error: friendlyMsg });
  }
});

// 5. POST /api/expressions/immersive-context - Real-time AI context generation for immersive review
app.post('/api/expressions/immersive-context', async (req, res) => {
  try {
    const { phrase, meaningCn, episodeNumber } = req.body;
    if (!phrase) {
      return res.status(400).json({ success: false, error: 'Phrase parameter is required' });
    }

    const prompt = `你是一位精通英语地道口语与场景教学的权威语言专家。
请针对目标英文表达短语：“${phrase}”${meaningCn ? `（中文释义: ${meaningCn}）` : ''}，当场即兴生成一段最真实、自然、贴切的地道应用语境对话（Speaker A 与 Speaker B 交流）。

要求：
1. 对话必须自然融入目标表达“${phrase}”（支持时态或单复数变体，如 going cold turkey / went cold turkey）。
2. 在对话中，将包含目标表达的那一句，生成两个版本：
   - 完整原句 (speakerB)
   - 挖空遮挡版 (maskedSpeakerB)，将出现的表达短语（或变体）替换为 "【 _____ 】" 供用户猜词。
3. 必须输出 JSON 格式，结构如下：
{
  "scenario": "场景名称（如：职场沟通 / 朋友日常吐槽 / 社交寒暄 等）",
  "speakerA": "Speaker A 的英文原句",
  "speakerA_cn": "Speaker A 的中文翻译",
  "speakerB": "Speaker B 的英文原句（包含目标表达）",
  "speakerB_cn": "Speaker B 的中文翻译",
  "maskedSpeakerB": "Speaker B 的英文挖空句（把目标表达替换为 【 _____ 】）",
  "targetPhraseInContext": "对话中实际出现的短语变体（如 went cold turkey）"
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            speakerA: { type: Type.STRING },
            speakerA_cn: { type: Type.STRING },
            speakerB: { type: Type.STRING },
            speakerB_cn: { type: Type.STRING },
            maskedSpeakerB: { type: Type.STRING },
            targetPhraseInContext: { type: Type.STRING },
          },
          required: ['scenario', 'speakerA', 'speakerA_cn', 'speakerB', 'speakerB_cn', 'maskedSpeakerB'],
        },
      },
    });

    const parsedData = JSON.parse(geminiRes.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Immersive context generation error:', error);
    const isQuota =
      error?.status === 'RESOURCE_EXHAUSTED' ||
      (error?.message && error.message.includes('429')) ||
      (error?.message && error.message.includes('Quota exceeded'));
    const friendlyMsg = isQuota
      ? 'Gemini API 免费额度已达上限 (429 Quota Exceeded)，请稍后再试。'
      : error.message || 'AI 当场生成语境失败';

    res.status(isQuota ? 429 : 500).json({ success: false, isQuotaExceeded: isQuota, error: friendlyMsg });
  }
});

// Setup Vite Development Middleware or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
