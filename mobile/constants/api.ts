import Constants from 'expo-constants';

// fizikai eszközön (Expo Go) a localhost nem éri el a gépet.
// A debuggerHost az Expo dev szerver IP-je — ebből vesszük a gép LAN IP-jét automatikusan.
const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];

const BASE = debuggerHost
  ? `http://${debuggerHost}:5000/api`
  : 'http://localhost:5000/api';

export const API_URL = BASE;
