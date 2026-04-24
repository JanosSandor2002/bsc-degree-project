import type { Dispatch } from 'react';
import { API_URL } from '../constants/api';

// ── AUTH ──────────────────────────────────────────────────────────────────────

export const registerUser = async (dispatch: Dispatch<any>, data: any) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    dispatch({ type: 'SET_USER', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const loginUser = async (dispatch: Dispatch<any>, data: any) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    dispatch({ type: 'SET_USER', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
  /*const json2 = {
    user: {
      _id: '69c29478077cb7ef7c40963b',
      username: 'admin',
      email: 'admin@gmail.com',
      password: '$2b$10$9yCV2PHyFOItmbDJYuHu.eSGwB7/koU5lvATGpCOGv5Gy5XwqstbO',
      role: 'user',
      xp: 0,
      level: 1,
      prestige: 0,
      verified: false,
      avatar: '',
      createdAt: '2026-03-24T13:41:12.124Z',
      updatedAt: '2026-03-24T13:41:12.124Z',
      __v: 0,
    },
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzI5NDc4MDc3Y2I3ZWY3YzQwOTYzYiIsImlhdCI6MTc3NTQwMzM3MiwiZXhwIjoxNzc2MDA4MTcyfQ.UJk3JTYsGTSqh2k-RyveEA5_aiEo2QsyowmMpii3WME',
  };
  dispatch({ type: 'SET_USER', payload: json2 });
  dispatch({ type: 'SET_LOADING', payload: false });*/
};

// ── PROJECTS ──────────────────────────────────────────────────────────────────

export const fetchProjects = async (dispatch: Dispatch<any>, token: string) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'SET_PROJECTS', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const addProject = async (
  dispatch: Dispatch<any>,
  token: string,
  project: any,
) => {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'ADD_PROJECT', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const deleteProject = async (
  dispatch: Dispatch<any>,
  token: string,
  projectId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Delete failed');
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

// ── TASKS ─────────────────────────────────────────────────────────────────────

export const fetchTasks = async (
  dispatch: Dispatch<any>,
  token: string,
  projectId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/tasks/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'SET_TASKS', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const addTask = async (
  dispatch: Dispatch<any>,
  token: string,
  task: any,
) => {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'ADD_TASK', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const updateTask = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
  data: any,
) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_TASK', payload: json });
    return json;
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return null;
  }
};

export const completeTask = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
  data?: any,
) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data || {}),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_TASK', payload: json });
    return json;
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return null;
  }
};

export const deleteTask = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Delete failed');
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

// ── SUBTASKS ──────────────────────────────────────────────────────────────────

export const fetchSubtasks = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/subtasks/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'APPEND_SUBTASKS', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const addSubtask = async (
  dispatch: Dispatch<any>,
  token: string,
  subtask: any,
) => {
  try {
    const res = await fetch(`${API_URL}/subtasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subtask),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'ADD_SUBTASK', payload: json });
    return json;
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return null;
  }
};

export const updateSubtask = async (
  dispatch: Dispatch<any>,
  token: string,
  subtaskId: string,
  data: any,
) => {
  try {
    const res = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_SUBTASK', payload: json });
    return json;
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return null;
  }
};

export const completeSubtask = async (
  dispatch: Dispatch<any>,
  token: string,
  subtaskId: string,
  data?: any,
) => {
  try {
    const res = await fetch(`${API_URL}/subtasks/${subtaskId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data || {}),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_SUBTASK', payload: json });
    return json;
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return null;
  }
};

export const deleteSubtask = async (
  dispatch: Dispatch<any>,
  token: string,
  subtaskId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Delete failed');
    dispatch({ type: 'DELETE_SUBTASK', payload: subtaskId });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

// ── SPRINTS ───────────────────────────────────────────────────────────────────

export const fetchSprints = async (
  dispatch: Dispatch<any>,
  token: string,
  projectId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/sprints/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'SET_SPRINTS', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const createSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprint: any,
) => {
  try {
    const res = await fetch(`${API_URL}/sprints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: sprint.name,
        project: sprint.projectId,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'ADD_SPRINT', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const assignTaskToSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprintId: string,
  taskId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/sprints/${sprintId}/tasks/${taskId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_TASK', payload: json });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

export const deleteSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprintId: string,
) => {
  try {
    const res = await fetch(`${API_URL}/sprints/${sprintId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Delete failed');
    dispatch({ type: 'DELETE_SPRINT', payload: sprintId });
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
  }
};

// ── USER ──────────────────────────────────────────────────────────────────────

export const updateUser = async (
  dispatch: Dispatch<any>,
  token: string,
  data: any,
) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    dispatch({ type: 'UPDATE_USER', payload: json });
    return { success: true };
  } catch (err: any) {
    dispatch({ type: 'SET_ERROR', payload: err.message });
    return { success: false, message: err.message };
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

// ── MAILS ─────────────────────────────────────────────────────────────────────

export const fetchInbox = async (token: string) => {
  const res = await fetch(`${API_URL}/mails/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch inbox');
  return res.json();
};

export const fetchSent = async (token: string) => {
  const res = await fetch(`${API_URL}/mails/sent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch sent');
  return res.json();
};

export const sendMail = async (token: string, data: any) => {
  const res = await fetch(`${API_URL}/mails/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to send');
  return json;
};

export const markMailRead = async (token: string, mailId: string) => {
  await fetch(`${API_URL}/mails/${mailId}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMail = async (token: string, mailId: string) => {
  const res = await fetch(`${API_URL}/mails/${mailId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
};

// ── LOGS ──────────────────────────────────────────────────────────────────────

export const fetchLogs = async (token: string, projectId: string) => {
  const res = await fetch(`${API_URL}/logs/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
};

// ── GITHUB ────────────────────────────────────────────────────────────────────

export const fetchGithubRepos = async (githubToken: string) => {
  const res = await fetch(`${API_URL}/github/user/repos/names`, {
    headers: { Authorization: `Bearer ${githubToken}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch repos');
  return json;
};

export const fetchGithubIssues = async (
  githubToken: string,
  owner: string,
  repo: string,
) => {
  const res = await fetch(`${API_URL}/github/${owner}/${repo}/issues`, {
    headers: { Authorization: `Bearer ${githubToken}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch issues');
  return json;
};

// ── GAMIFICATION ──────────────────────────────────────────────────────────────

export const fetchProjectContributors = async (
  token: string,
  projectId: string,
) => {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};
