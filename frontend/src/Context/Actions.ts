import axios from 'axios';
import type { Dispatch } from 'react';

const API_URL = 'http://localhost:5000/api';

// AUTH ACTIONS

export const registerUser = async (dispatch: Dispatch<any>, data: any) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    dispatch({ type: 'SET_USER', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const loginUser = async (dispatch: Dispatch<any>, data: any) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    dispatch({ type: 'SET_USER', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

// PROJECT ACTIONS

export const fetchProjects = async (dispatch: Dispatch<any>, token: string) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'SET_PROJECTS', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
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
    const res = await axios.post(`${API_URL}/projects`, project, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'ADD_PROJECT', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// TASK ACTIONS

export const fetchTasks = async (
  dispatch: Dispatch<any>,
  token: string,
  projectId: string,
) => {
  try {
    const res = await axios.get(`${API_URL}/tasks/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'SET_TASKS', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const addTask = async (
  dispatch: Dispatch<any>,
  token: string,
  task: any,
) => {
  try {
    const res = await axios.post(`${API_URL}/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'ADD_TASK', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

// SUBTASK ACTIONS

export const fetchSubtasks = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
) => {
  try {
    const res = await axios.get(`${API_URL}/subtasks/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'SET_SUBTASKS', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const addSubtask = async (
  dispatch: Dispatch<any>,
  token: string,
  subtask: any,
) => {
  try {
    const res = await axios.post(`${API_URL}/subtasks`, subtask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'ADD_SUBTASK', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};
