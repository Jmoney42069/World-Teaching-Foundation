export interface MedalMilestone {
  key: "firstDay" | "sevenDay" | "thirtyDay" | "yearDay";
  days: number;
  emoji: string;
  tier: string;
  label: string;
  description: string;
}

export const MEDAL_MILESTONES: MedalMilestone[] = [
  { key: "firstDay", days: 1, emoji: "🥉", tier: "Bronze", label: "First Step", description: "Complete your first day of habits" },
  { key: "sevenDay", days: 7, emoji: "🥈", tier: "Silver", label: "Week Warrior", description: "7-day habit streak achieved" },
  { key: "thirtyDay", days: 30, emoji: "🥇", tier: "Gold", label: "Month Master", description: "30-day habit streak achieved" },
  { key: "yearDay", days: 365, emoji: "💎", tier: "Diamond", label: "Year Legend", description: "365-day habit streak — legendary" },
];
