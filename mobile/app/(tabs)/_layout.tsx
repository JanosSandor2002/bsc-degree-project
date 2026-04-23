import { Tabs, useRouter, useSegments } from 'expo-router';
import { Colors } from '../../constants/Colors';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

// ── Tab definitions ────────────────────────────────────────────────────────────

const TABS = [
  { name: 'index', label: 'Home', icon: '⌂' },
  { name: 'tasks', label: 'Tasks', icon: '✓' },
  { name: 'subtasks', label: 'Subtasks', icon: '❐' },
  { name: 'kanban', label: 'Kanban', icon: '⊞' },
  { name: 'scrum', label: 'Scrum', icon: '⟳' },
  { name: 'plan', label: 'Plan', icon: '▦' },
  { name: 'gamification', label: 'XP', icon: '✦' },
  { name: 'mails', label: 'Mails', icon: '✉' },
  { name: 'log', label: 'Log', icon: '◎' },
  { name: 'account', label: 'Account', icon: '◯' },
] as const;

// ── Custom scrollable tab bar ──────────────────────────────────────────────────

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  return (
    <View style={styles.tabBarWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContent}
        style={styles.tabBarScroll}
        bounces={false}
      >
        {TABS.map((tab, index) => {
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabItem, focused && styles.tabItemActive]}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='index' />
      <Tabs.Screen name='tasks' />
      <Tabs.Screen name='subtasks' />
      <Tabs.Screen name='kanban' />
      <Tabs.Screen name='scrum' />
      <Tabs.Screen name='plan' />
      <Tabs.Screen name='gamification' />
      <Tabs.Screen name='mails' />
      <Tabs.Screen name='log' />
      <Tabs.Screen name='account' />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: Colors.primary,
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  tabBarScroll: {
    flexGrow: 0,
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    minWidth: 64,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabIcon: {
    fontSize: 24,
    color: '#4e78a8',
    lineHeight: 28,
  },
  tabIconActive: {
    color: '#ffffff',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4e78a8',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#93c5fd',
  },
});
