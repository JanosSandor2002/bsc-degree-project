import { Router } from 'express';
import {
  fetchRepoNames,
  fetchIssues,
  fetchSelectedRepoIssues,
} from '../controllers/githubController';
import protect from '../middleware/auth';

const router = Router();

// GET repository-k nevei
router.get('/:owner/repos/names', fetchRepoNames);

// GET issues egy repo-hoz
router.get('/:owner/:repo/issues', fetchIssues);

// POST: kiválasztott repo issue-jai
router.post('/issues', fetchSelectedRepoIssues);

export default router;
