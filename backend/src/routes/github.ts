import { Router } from 'express';
import { fetchIssues } from '../controllers/githubController';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/github/:owner/:repo/issues
router.get('/:owner/:repo/issues', fetchIssues);

export default router;
