import axios from 'axios';
import type { Dispatch } from 'react';

const API_URL = 'http://localhost:5000/api';

// AUTH

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

//PROJECTS

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

//TASKS

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

//SUBTASKS

export const fetchSubtasks = async (
  dispatch: Dispatch<any>,
  token: string,
  taskId: string,
) => {
  try {
    const res = await axios.get(`${API_URL}/subtasks/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Use APPEND_SUBTASKS so multiple task fetches don't overwrite each other
    dispatch({ type: 'APPEND_SUBTASKS', payload: res.data });
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

//SPRINTS

export const fetchSprints = async (
  dispatch: Dispatch<any>,
  token: string,
  projectId: string,
) => {
  try {
    const res = await axios.get(`${API_URL}/sprints/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'SET_SPRINTS', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const createSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprint: {
    name: string;
    projectId: string;
    startDate: string;
    endDate: string;
  },
) => {
  try {
    const res = await axios.post(
      `${API_URL}/sprints`,
      {
        name: sprint.name,
        project: sprint.projectId,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch({ type: 'ADD_SPRINT', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const assignTaskToSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprintId: string,
  taskId: string,
) => {
  try {
    const res = await axios.post(
      `${API_URL}/sprints/${sprintId}/tasks/${taskId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    dispatch({ type: 'UPDATE_TASK', payload: res.data });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const deleteSprint = async (
  dispatch: Dispatch<any>,
  token: string,
  sprintId: string,
) => {
  try {
    await axios.delete(`${API_URL}/sprints/${sprintId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'DELETE_SPRINT', payload: sprintId });
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
  }
};

//USER

export const updateUser = async (
  dispatch: Dispatch<any>,
  token: string,
  data: { username?: string; email?: string; password?: string },
) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const res = await axios.put(`${API_URL}/users/me`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'UPDATE_USER', payload: res.data });
    return { success: true };
  } catch (err: any) {
    dispatch({
      type: 'SET_ERROR',
      payload: err.response?.data?.message || err.message,
    });
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};
