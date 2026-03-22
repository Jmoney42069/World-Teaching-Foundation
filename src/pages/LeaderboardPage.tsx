import { useState } from 'react';
import { Container, GlassCard, Badge } from '../components';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  isYou: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Chen', avatar: '👩‍💻', xp: 4820, level: 8, streak: 42, isYou: false },
  { rank: 2, name: 'Marcus Johnson', avatar: '👨‍🎓', xp: 4210, level: 7, streak: 28, isYou: false },
  { rank: 3, name: 'Aisha Patel', avatar: '👩‍🔬', xp: 3890, level: 7, streak: 35, isYou: false },
  { rank: 4, name: 'James Kim', avatar: '🧑‍💼', xp: 3450, level: 6, streak: 19, isYou: false },
  { rank: 5, name: 'Luna Rodriguez', avatar: '👩‍🎨', xp: 3120, level: 6, streak: 22, isYou: false },
  { rank: 6, name: 'Dev User', avatar: '🧑‍💻', xp: 250, level: 2, streak: 1, isYou: true },
  { rank: 7, name: 'Alex Thompson', avatar: '👨‍🏫', xp: 2890, level: 5, streak: 15, isYou: false },
  { rank: 8, name: 'Maria Santos', avatar: '👩‍⚕️', xp: 2650, level: 5, streak: 11, isYou: false },
  { rank: 9, name: 'David Lee', avatar: '👨‍🍳', xp: 2340, level: 4, streak: 8, isYou: false },
  { rank: 10, name: 'Priya Sharma', avatar: '👩‍🚀', xp: 2100, level: 4, streak: 14, isYou: false },
];

type Tab = 'weekly' | 'alltime';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('weekly');

  // For "weekly" just shuffle a bit
  const entries = tab === 'weekly'
    ? [...MOCK_LEADERBOARD].sort((a, b) => {
        if (a.isYou) return 0;
        if (b.isYou) return 0;
        return (b.xp * 0.3 + b.streak * 50) - (a.xp * 0.3 + a.streak * 50);
      }).map((e, i) => ({ ...e, rank: i + 1 }))
    : MOCK_LEADERBOARD;

  const you = entries.find((e) => e.isYou);

  return (
    <Container size="md">
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted mt-1">See how you stack up against other learners</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-surface p-1 border border-border-subtle">
          {(['weekly', 'alltime'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-muted hover:text-primary border border-transparent'
              }`}
            >
              {t === 'weekly' ? '🗓 This Week' : '🏆 All Time'}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-3 pt-4">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const podiumHeight = i === 1 ? 'h-28' : i === 0 ? 'h-20' : 'h-16';
            const medals = ['🥈', '🥇', '🥉'];
            return (
              <div key={entry.rank} className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                <div className={`relative ${entry.isYou ? 'ring-2 ring-accent rounded-full' : ''}`}>
                  <span className="text-3xl">{entry.avatar}</span>
                  <span className="absolute -top-1 -right-1 text-lg">{medals[i]}</span>
                </div>
                <p className={`text-xs font-semibold text-center leading-tight ${entry.isYou ? 'text-accent' : ''}`}>
                  {entry.name}{entry.isYou ? ' (You)' : ''}
                </p>
                <p className="text-[10px] text-muted font-bold">{entry.xp.toLocaleString()} XP</p>
                <div className={`w-full ${podiumHeight} rounded-t-xl bg-gradient-to-t ${
                  i === 1 ? 'from-accent/20 to-accent/5' : i === 0 ? 'from-violet/20 to-violet/5' : 'from-cyan/20 to-cyan/5'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <GlassCard padding="sm">
          <div className="divide-y divide-border-subtle">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 px-4 py-3 transition-all ${
                  entry.isYou ? 'bg-accent/5 border-l-2 border-accent' : ''
                }`}
              >
                <span className={`w-8 text-center text-sm font-bold ${
                  entry.rank <= 3 ? 'text-accent' : 'text-muted-soft'
                }`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </span>
                <span className="text-xl">{entry.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${entry.isYou ? 'text-accent' : ''}`}>
                    {entry.name} {entry.isYou && <Badge variant="success">You</Badge>}
                  </p>
                  <p className="text-xs text-muted">Level {entry.level} · 🔥 {entry.streak}d streak</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{entry.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-soft">XP</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Your position summary */}
        {you && (
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
            <p className="text-sm text-muted">Your Rank</p>
            <p className="text-3xl font-bold text-accent">#{you.rank}</p>
            <p className="text-xs text-muted mt-1">Keep learning to climb the ranks! 🚀</p>
          </div>
        )}
      </div>
    </Container>
  );
}
