import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import subtaskRoutes from './routes/subtasks';
import githubRoutes from './routes/github';
import sprintRoutes from './routes/sprints';
import logRoutes from './routes/logs';
import userRoutes from './routes/users';
import mailRoutes from './routes/mails';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mails', mailRoutes);

export default app;
