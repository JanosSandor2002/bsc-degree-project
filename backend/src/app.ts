import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import subtaskRoutes from './routes/subtasks';
import githubRoutes from './routes/github';
import sprintRoutes from './routes/sprints';
import logRoutes from './routes/logs';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/logs', logRoutes);

export default app;
