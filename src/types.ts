export interface Expression {
  id: string; // e.g. "dee-1", "dee-1120"
  episodeNumber: number; // e.g. 1, 20, 800, 1120
  title: string; // Original title e.g. "EE 1120: Piece of cake" or "Piece of cake"
  phrase: string; // English expression e.g. "Piece of cake"
  phonetic?: string; // e.g. "/piːs əv keɪk/"
  meaningCn: string; // Core Chinese translation e.g. "小菜一碟，非常容易的事"
  definitionEn?: string; // English definition e.g. "Something that is very easy to do"
  category?: string; // e.g. "Idioms", "Daily Life", "Workplace", "Emotions"
  tags?: string[];
  audioUrl?: string; // Libsyn podcast episode MP3 enclosure URL
  pubDate?: string;
  description?: string; // Original podcast description text
  usageNuance?: string; // Usage notes & tone context
  examples: ExampleSentence[];
  dialogue?: DialogueScene;
  quiz?: QuizQuestion;
  userNotes?: string;
  isMastered?: boolean;
  isStarred?: boolean;
  lastReviewedAt?: string;
  reviewDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface ExampleSentence {
  english: string;
  chinese: string;
  situation?: string;
}

export interface DialogueScene {
  speakerA: string;
  speakerA_cn: string;
  speakerB: string;
  speakerB_cn: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BatchRange {
  startNum: number;
  endNum: number;
  label: string;
  count: number;
}

export interface FlashcardStats {
  totalReviewed: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}
