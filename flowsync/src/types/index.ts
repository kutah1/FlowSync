/** Domain types. Mirror the schema in src/supabase/ — change both together. */

export type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

/** LOW < 40 <= MEDIUM < 70 <= HIGH. Canonical thresholds live in 002_schema_alignment.sql. */
export type EnergyCategory = "LOW" | "MEDIUM" | "HIGH";

export type Difficulty = "Easy" | "Medium" | "Hard";

/** Cumulative: a "day" task also shows under week/month/year. */
export type TimeBucket = "day" | "week" | "month" | "year";

/** Every field is 1–5. Stress inverts: higher stress lowers capacity. */
export interface CheckIn {
  energy: number;
  focus: number;
  mood: number;
  sleepQuality: number;
  stress: number;
}

export interface CapacityResult {
  /** Raw sum, −1..19. */
  score: number;
  /** Normalised 0..100. */
  percentage: number;
  category: EnergyCategory;
}

export interface CycleStatus {
  /** 1-indexed, wrapped within the cycle length. */
  cycleDay: number;
  cycleLength: number;
  phase: CyclePhase;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  category?: string;
  timeBucket: TimeBucket;
  dueDate?: string;
  estimatedDuration?: number;
  isCompleted: boolean;
  /** Manual drag-and-drop order. Lower sorts first. */
  position: number;
}

export type DayRating = "better" | "as_expected" | "harder";

export type SuggestionSurface =
  | "task_title"
  | "task_category"
  | "task_difficulty"
  | "reflection";

export interface AiSuggestion {
  id: string;
  surface: SuggestionSurface;
  suggestion: string;
  rank: number;
  accepted: boolean | null;
}
