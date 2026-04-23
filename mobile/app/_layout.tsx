import { Stack } from 'expo-router';
import { GlobalProvider } from '../context/GlobalContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GlobalProvider>
      <StatusBar style='light' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='sign' />
        <Stack.Screen
          name='create-project'
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </GlobalProvider>
  );
}
