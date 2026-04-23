import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Text, View } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 9,
        backgroundColor: focused ? 'rgba(255,255,255,0.18)' : 'transparent',
      }}
    >
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.accentLight,
        tabBarInactiveTintColor: '#4e78a8',
        tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji='🏠' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='tasks'
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => <TabIcon emoji='✓' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='subtasks'
        options={{
          title: 'Subtasks',
          tabBarIcon: ({ focused }) => <TabIcon emoji='❐' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='kanban'
        options={{
          title: 'Kanban',
          tabBarIcon: ({ focused }) => <TabIcon emoji='⠿' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='scrum'
        options={{
          title: 'Scrum',
          tabBarIcon: ({ focused }) => <TabIcon emoji='⟳' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='plan'
        options={{
          title: 'Plan',
          tabBarIcon: ({ focused }) => <TabIcon emoji='▦' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='gamification'
        options={{
          title: 'XP',
          tabBarIcon: ({ focused }) => <TabIcon emoji='✦' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='mails'
        options={{
          title: 'Mails',
          tabBarIcon: ({ focused }) => <TabIcon emoji='✉' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='log'
        options={{
          title: 'Log',
          tabBarIcon: ({ focused }) => <TabIcon emoji='◎' focused={focused} />,
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon emoji='👤' focused={focused} />,
        }}
      />
    </Tabs>
  );
}
