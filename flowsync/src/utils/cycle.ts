import { differenceInCalendarDays } from "date-fns";
import type { CyclePhase, CycleStatus } from "../types";

/**
 * CANONICAL cycle math. Mirrors calculate_cycle_day / calculate_cycle_phase
 * in src/supabase/ (002 fixed the day function to wrap — keep these in step).
 *
 * Phase boundaries are proportional to the user's own cycle length, not
 * hard-coded to 28 days: a 35-day cycle stretches every phase.
 */

/** Fractions of the cycle, derived from the canonical 28-day boundaries. */
const MENSTRUAL_END = 5 / 28;
const FOLLICULAR_END = 13 / 28;
const OVULATION_END = 16 / 28;

export const DEFAULT_CYCLE_LENGTH = 28;
export const MIN_CYCLE_LENGTH = 15;
export const MAX_CYCLE_LENGTH = 60;

export function isValidCycleLength(length: number): boolean {
  return Number.isInteger(length) && length >= MIN_CYCLE_LENGTH && length <= MAX_CYCLE_LENGTH;
}

/** 1-indexed and wrapped: the first day of the period is Day 1. */
export function cycleDay(today: Date, lastPeriod: Date, cycleLength: number): number {
  const elapsed = differenceInCalendarDays(today, lastPeriod);
  const offset = ((elapsed % cycleLength) + cycleLength) % cycleLength; // handles future/negative dates
  return offset + 1;
}

export function cyclePhase(today: Date, lastPeriod: Date, cycleLength: number): CyclePhase {
  const position = (cycleDay(today, lastPeriod, cycleLength) - 1) / cycleLength;
  if (position < MENSTRUAL_END) return "Menstrual";
  if (position < FOLLICULAR_END) return "Follicular";
  if (position < OVULATION_END) return "Ovulation";
  return "Luteal";
}

export function cycleStatus(today: Date, lastPeriod: Date, cycleLength: number): CycleStatus {
  return {
    cycleDay: cycleDay(today, lastPeriod, cycleLength),
    cycleLength,
    phase: cyclePhase(today, lastPeriod, cycleLength),
  };
}

export const PHASE_EMOJI: Record<CyclePhase, string> = {
  Menstrual: "🌙",
  Follicular: "🌱",
  Ovulation: "☀️",
  Luteal: "🍂",
};
