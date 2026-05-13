import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];

const BASE = debuggerHost
  ? `http://${debuggerHost}:5000/api`
  : 'http://localhost:5000/api';

export const API_URL = BASE;
