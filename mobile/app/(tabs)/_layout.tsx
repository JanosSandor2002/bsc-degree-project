import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';

//Tab definitions

// Ikonok
// AiFillHome       → Ionicons home
// BsFillKanbanFill → MaterialCommunityIcons view-column
// PiProjectorScreen→ Ionicons stats-chart
// FaGamepad        → MaterialCommunityIcons gamepad-variant
// TbBrandWikipedia → FontAwesome5 wikipedia-w

type TabDef = {
  name: string;
  label: string;
  icon: (focused: boolean) => React.ReactNode;
};

const TABS: TabDef[] = [
  {
    name: 'index',
    label: 'Home',
    icon: (focused) => (
      <Ionicons name='home' size={26} color={focused ? '#ffffff' : '#4e78a8'} />
    ),
  },
  {
    name: 'tasks',
    label: 'Tasks',
    icon: (focused) => (
      <Ionicons
        name='checkmark-circle-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'subtasks',
    label: 'Subtasks',
    icon: (focused) => (
      <MaterialCommunityIcons
        name='checkbox-multiple-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'kanban',
    label: 'Kanban',
    icon: (focused) => (
      <MaterialCommunityIcons
        name='view-column-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'scrum',
    label: 'Scrum',
    icon: (focused) => (
      <Ionicons
        name='stats-chart-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'plan',
    label: 'Plan',
    icon: (focused) => (
      <Ionicons
        name='grid-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'gamification',
    label: 'XP',
    icon: (focused) => (
      <MaterialCommunityIcons
        name='gamepad-variant-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'mails',
    label: 'Mails',
    icon: (focused) => (
      <Ionicons
        name='mail-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'log',
    label: 'Log',
    icon: (focused) => (
      <Ionicons
        name='time-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
  {
    name: 'account',
    label: 'Account',
    icon: (focused) => (
      <Ionicons
        name='person-outline'
        size={26}
        color={focused ? '#ffffff' : '#4e78a8'}
      />
    ),
  },
];

//Custom scrollable tab bar

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
              {tab.icon(focused)}
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

// Layout

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

//Styles

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
