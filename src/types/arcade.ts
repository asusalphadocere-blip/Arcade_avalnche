export type GameEngineId = 
  | 'catch-collect'
  | 'speed-run'
  | 'brand-quiz'
  | 'reaction-test'
  | 'community-challenge';

export type GameDifficulty = 'easy' | 'normal' | 'hard';
export type AccessMode = 'open' | 'event_code' | 'accredited';
export type TargetDevice = 'mobile-web' | 'arcade-kiosk' | 'desktop';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface VersionedGameConfig {
  schemaVersion: string;
  project: {
    id: string;
    name: string;
    status: 'draft' | 'published' | 'archived';
    updatedAt: string;
  };
  event: {
    name: string;
    startAt: string | null;
    endAt: string | null;
    timezone: string;
    accessMode: AccessMode;
    eventCode?: string;
    accreditationList?: string[];
    maxAttemptsPerPlayer: number;
    lumaUrl?: string;
  };
  game: {
    engineId: GameEngineId;
    engineVersion: string;
    durationSeconds: number;
    difficulty: GameDifficulty;
    controls: ('touch' | 'keyboard')[];
    scoring: {
      collectItem?: number;
      avoidObstacle?: boolean;
      penaltyObstacle?: number;
      bonusMultiplier?: number;
      correctAnswerPoints?: number;
      speedBonus?: boolean;
      reactionAccuracyWeight?: number;
    };
    assets: {
      player: string;
      collectibles: string;
      obstacles: string;
      background: string;
    };
    quizQuestions?: QuizQuestion[];
  };
  brand: {
    logoText: string;
    logoIcon: string; // e.g. "Flame", "Zap", "Layers", "Rocket", "Trophy"
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
    fontFamily: string;
    title: string;
    tagline?: string;
    startButton: string;
    endMessage: string;
  };
  leaderboard: {
    enabled: boolean;
    scope: 'event' | 'global';
    displayNameMode: 'nickname' | 'company' | 'wallet';
  };
  deployment: {
    targets: TargetDevice[];
    publishedVersion: string | null;
    slug: string;
  };
  integrations: {
    avalanche: {
      enabled: boolean;
      network: 'avalanche-fuji' | 'avalanche-mainnet' | 'custom-subnet' | null;
      digitalBadge: boolean;
      badgeName?: string;
      onchainLeaderboard: boolean;
      gaslessRelay: boolean;
    };
  };
}

export interface LeaderboardEntry {
  id: string;
  projectId: string;
  nickname: string;
  score: number;
  accuracy?: number;
  timestamp: number;
  targetDevice: TargetDevice;
  verifiedOnchain?: boolean;
  txHash?: string;
}

export interface EngineInfo {
  id: GameEngineId;
  name: string;
  tagline: string;
  description: string;
  priority: 'P0 (MVP Ready)' | 'P1 (Listo)' | 'P2 (Roadmap)';
  supportedControls: string[];
  idealUseCases: string[];
  icon: string;
  isPlayableInDemo: boolean;
}

export interface AttendeeRecord {
  id: string;
  ticketNumber: number; // Correlative number e.g. 1, 2, 3...
  ticketCode: string; // e.g. "TICK-001"
  name: string;
  email: string;
  checkInTime: string; // ISO string
  hasPlayed: boolean;
  bestScore: number;
  attemptsCount: number;
  wonPrizes: string[];
}

export type RaffleCriteria = 
  | 'all_attendees'     // Todos los que hicieron check-in
  | 'min_score'         // Jugaron y sacaron >= X puntos
  | 'top_players'       // Top 10 del leaderboard
  | 'weighted_score';   // Boletos ponderados según puntos

export interface RafflePrize {
  id: string;
  title: string;
  criteria: RaffleCriteria;
  minScoreRequired?: number;
  winner?: AttendeeRecord;
  drawnAt?: string;
}

export interface EventHistoryEntry {
  projectId: string;
  eventName: string;
  date: string;
  brandTitle: string;
  gameEngine: string;
  totalAttendees: number;
  totalGamesPlayed: number;
  highestScore: number;
  lumaUrl?: string;
  attendees: AttendeeRecord[];
  raffleHistory: RafflePrize[];
  configSnapshot: VersionedGameConfig;
}

export interface EventsHistoryFile {
  formatVersion: '1.0.0';
  exportedAt: string;
  platform: 'Arcade Studio';
  events: EventHistoryEntry[];
}

