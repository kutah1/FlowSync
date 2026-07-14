import type { CapacityResult, CheckIn, CyclePhase, EnergyCategory, Difficulty, Task } from "../types";

/**
 * CANONICAL capacity math. This is the single definition — it mirrors
 * calculate_capacity_score / _percentage / _energy_category in
 * src/supabase/backend.sql. If you change one, change the other.
 *
 * Deliberately rules-based and deterministic: the score must be
 * reproducible and explainable to the user. AI is used only to ORDER
 * tasks (see services/ai.ts), never to compute capacity.
 */

/** Raw score, −1..19. Stress is the only negative term. */
export function capacityScore({ energy, focus, mood, sleepQuality, stress }: CheckIn): number {
  return energy + focus + mood + sleepQuality - stress;
}

/** Normalise the −1..19 raw score onto 0..100. */
export function capacityPercentage(score: number): number {
  return Math.round(((score + 1) / 20) * 100);
}

export function energyCategory(percentage: number): EnergyCategory {
  if (percentage < 40) return "LOW";
  if (percentage < 70) return "MEDIUM";
  return "HIGH";
}

export function computeCapacity(checkIn: CheckIn): CapacityResult {
  const score = capacityScore(checkIn);
  const percentage = capacityPercentage(score);
  return { score, percentage, category: energyCategory(percentage) };
}

/** The label shown on the dashboard. */
export function dayTypeLabel(category: EnergyCategory): string {
  switch (category) {
    case "HIGH":
      return "High Energy Day";
    case "MEDIUM":
      return "Balanced Day";
    case "LOW":
      return "Low Energy Day";
  }
}

/**
 * The cycle modifier — a nudge, not a score. Phase never changes the
 * capacity number; it only changes what we suggest doing with it.
 */
export function phaseNudge(phase: CyclePhase): string {
  switch (phase) {
    case "Follicular":
      return "a great time to start new projects and think creatively";
    case "Ovulation":
      return "a great time for communication and collaboration";
    case "Luteal":
      return "a great time to finish things and do detail work";
    case "Menstrual":
      return "a good time for reflection, planning, and lighter tasks";
  }
}

/** MiniMe's recommendation string — day type + phase, rules-based. */
export function recommendation(category: EnergyCategory, phase: CyclePhase): string {
  const lead =
    category === "HIGH"
      ? "You seem energised today. Consider tackling your most demanding tasks first."
      : category === "MEDIUM"
        ? "You have steady capacity today. Medium-effort work and planning will land well."
        : "Your capacity is low today. Be kind to yourself — admin and easy wins are enough.";

  return `${lead} You're in your ${phase} phase — ${phaseNudge(phase)}.`;
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };

/**
 * Rules-based task ordering: hardest first on a high-capacity day, easiest
 * first on a low one. On a balanced day, keep the user's own manual order.
 *
 * This ALWAYS produces a valid ordering. The AI ordering (services/ai.ts)
 * is advisory and layered on top — if it fails, times out, or is rejected,
 * this is what the user sees.
 */
export function orderTasks(tasks: Task[], category: EnergyCategory): Task[] {
  const open = [...tasks].sort((a, b) => a.position - b.position);
  if (category === "MEDIUM") return open;

  const direction = category === "HIGH" ? -1 : 1;
  return open.sort((a, b) => {
    const delta = DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty];
    if (delta !== 0) return delta * direction;
    return a.position - b.position;
  });
}
