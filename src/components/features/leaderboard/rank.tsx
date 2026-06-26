import { Trophy } from "lucide-react";

export function getRankLabel(rank: number) {
  if (rank === 1) return "Top tracker";
  if (rank === 2) return "Second place";
  if (rank === 3) return "Third place";
  return `Rank #${rank}`;
}

export function getRankClassName(rank: number) {
  if (rank === 1) return "font-black text-primary";
  return "font-semibold";
}

export function RankIcon({ rank }: { rank: number }) {
  if (rank !== 1) {
    return null;
  }

  return <Trophy className="h-4 w-4 text-primary" />;
}

