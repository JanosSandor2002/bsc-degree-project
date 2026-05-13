import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { fetchProjectContributors } from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, EmptyState } from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';

const xpRequired = (level: number, prestige: number) =>
  20 + (level + 1) * 10 + prestige * level * 10;
const BADGE_LEVELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const getPrestigeLabel = (prestige: number) => {
  if (prestige === 0) return null;
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return roman[prestige - 1] ?? `${prestige}`;
};

type ContributorUser = {
  _id: string;
  username: string;
  xp: number;
  level: number;
  prestige: number;
};

export default function GamificationScreen() {
  const { state } = useGlobalContext();
  const router = useRouter();
  const [contributors, setContributors] = useState<ContributorUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    if (!state.token || !state.selectedProject?._id) {
      setContributors([]);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const project = await fetchProjectContributors(
          state.token!,
          state.selectedProject._id,
        );
        const all: ContributorUser[] = [];
        const seen = new Set<string>();
        [...(project.contributors ?? []), project.admin].forEach((u: any) => {
          if (u && u._id && !seen.has(u._id)) {
            seen.add(u._id);
            all.push(u);
          }
        });
        setContributors(all);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [state.selectedProject?._id, state.token]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to view Gamification</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const sorted = [...contributors].sort(
    (a, b) => b.level * 10000 + b.xp - (a.level * 10000 + a.xp),
  );
  const topId = sorted[0]?._id;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Gamification</Text>
          </View>
          <Text style={styles.heroTitle}>Level up your team</Text>
          <Text style={styles.heroSub}>
            Earn XP by completing tasks and subtasks, level up through prestige
            tiers.
          </Text>
          <View style={styles.rewardRow}>
            {[
              { label: 'Task done', xp: '+5 XP' },
              { label: 'Subtask done', xp: '+3 XP' },
              { label: 'Sprint closed', xp: '+30 XP' },
            ].map((r) => (
              <View key={r.label} style={styles.rewardPill}>
                <Text style={styles.rewardXp}>{r.xp}</Text>
                <Text style={styles.rewardLabel}>{r.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* hogyna mukodik rész */}
        <View style={styles.accordion}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setOpenInfo(!openInfo)}
          >
            <Text style={styles.accordionTitle}>
              How the XP & leveling system works
            </Text>
            <Text style={styles.accordionChevron}>{openInfo ? '−' : '+'}</Text>
          </TouchableOpacity>
          {openInfo && (
            <View style={styles.accordionBody}>
              <Text style={styles.accordionSubtitle}>XP Formula</Text>
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  XP = 20 + (next_level × 10) + (prestige × level × 10)
                </Text>
              </View>
              <Text style={styles.accordionSubtitle}>Prestige System</Text>
              <Text style={styles.accordionText}>
                Every time you reach level 50, you can prestige. Your level
                resets to 1 but prestige increases — raising the XP cost for
                every future level.
              </Text>
              <Text style={styles.accordionSubtitle}>Class Badges</Text>
              <Text style={styles.accordionText}>
                At levels 5, 10, 15 … 50 you unlock a class badge.
              </Text>
              <View style={styles.badgeLevelRow}>
                {BADGE_LEVELS.map((lvl) => (
                  <View key={lvl} style={styles.badgePill}>
                    <Text style={styles.badgePillText}>Lv {lvl}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Leaderboard */}
        <View style={styles.pickerRow}>
          <ProjectPicker />
        </View>
        <Text style={styles.sectionLabel}>PROJECT LEADERBOARD</Text>
        <Text style={styles.sectionTitle}>
          {state.selectedProject
            ? state.selectedProject.name
            : 'No project selected'}
        </Text>
        {!state.selectedProject && (
          <EmptyState
            icon='✦'
            title='Select a project'
            subtitle='Choose a project to see contributor stats'
          />
        )}
        {loading && (
          <Text style={styles.loadingText}>Loading contributors...</Text>
        )}

        {sorted.map((user, idx) => {
          const xpNeeded = xpRequired(user.level, user.prestige);
          const progress = Math.min(
            100,
            Math.round((user.xp / xpNeeded) * 100),
          );
          const isTop = user._id === topId && sorted.length > 1;
          const prestigeLabel = getPrestigeLabel(user.prestige);
          const earnedBadges = BADGE_LEVELS.filter((b) => b <= user.level);
          const progColor =
            progress === 100
              ? '#22c55e'
              : progress >= 60
                ? Colors.accent
                : progress >= 30
                  ? '#f59e0b'
                  : Colors.error;

          return (
            <View key={user._id} style={[styles.card, isTop && styles.cardTop]}>
              <View style={styles.cardRow}>
                {/* Rank */}
                <View
                  style={[
                    styles.rank,
                    idx === 0 && styles.rank1,
                    idx === 1 && styles.rank2,
                    idx === 2 && styles.rank3,
                  ]}
                >
                  <Text style={styles.rankText}>{idx + 1}</Text>
                </View>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.username?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.username}</Text>
                    {isTop && (
                      <View style={styles.topBadge}>
                        <Text style={styles.topBadgeText}>★ Top</Text>
                      </View>
                    )}
                    {prestigeLabel && (
                      <View style={styles.prestigeBadge}>
                        <Text style={styles.prestigeText}>
                          P{prestigeLabel}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.levelText}>
                    Level {user.level} · {user.xp}/{xpNeeded} XP
                  </Text>
                </View>
                {/* Level number */}
                <View style={styles.levelBig}>
                  <Text style={styles.levelBigNum}>{user.level}</Text>
                  <Text style={styles.levelBigLabel}>lv</Text>
                </View>
              </View>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%` as any,
                      backgroundColor: progColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPct}>{progress}%</Text>
              {/* Badges */}
              {earnedBadges.length > 0 && (
                <View style={styles.badgeRow}>
                  {earnedBadges.map((b) => (
                    <View key={b} style={styles.earnedBadge}>
                      <Text style={styles.earnedBadgeText}>Lv {b}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Keep shipping, keep leveling.</Text>
          <Text style={styles.footerSub}>
            Complete tasks to earn XP and climb the leaderboard.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centeredText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 14,
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: { color: '#93c5fd', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  rewardRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  rewardPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rewardXp: { color: '#4ade80', fontSize: 12, fontWeight: '700' },
  rewardLabel: { color: '#93c5fd', fontSize: 11 },
  accordion: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  accordionChevron: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  accordionSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  accordionText: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
  formula: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  badgeLevelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  badgePill: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgePillText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  pickerRow: { marginBottom: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardTop: { borderColor: '#fde68a' },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank1: { backgroundColor: '#fef9c3' },
  rank2: { backgroundColor: '#f1f5f9' },
  rank3: { backgroundColor: '#ffedd5' },
  rankText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  topBadge: {
    backgroundColor: '#fef9c3',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  topBadgeText: { color: '#a16207', fontSize: 10, fontWeight: '700' },
  prestigeBadge: {
    backgroundColor: '#f3e8ff',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  prestigeText: { color: '#7c3aed', fontSize: 10, fontWeight: '700' },
  levelText: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  levelBig: { alignItems: 'center' },
  levelBigNum: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryLight,
    lineHeight: 26,
  },
  levelBigLabel: { fontSize: 10, color: Colors.textMuted },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: 8,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  earnedBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  earnedBadgeText: {
    color: Colors.primaryLight,
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
  },
  footerTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  footerSub: { color: '#60a5fa', fontSize: 12, marginTop: 3 },
});
