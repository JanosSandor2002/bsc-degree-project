import { Router } from 'express';
import {
  fetchRepoNames,
  fetchIssues,
  fetchSelectedRepoIssues,
} from '../controllers/githubController';
import { getRepoNames } from '../services/githubService';
import protect from '../middleware/auth';

const router = Router();

router.get('/user/repos/names', async (req, res) => {
  const githubToken = req.headers.authorization?.split(' ')[1];
  if (!githubToken) return res.status(401).json({ message: 'No GitHub token' });

  try {
    const names = await getRepoNames(githubToken);
    res.status(200).json(names);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'GitHub fetch error', error: error.message });
  }
});
// GET repository-k nevei (nem kell owner, token alapján)
//router.get('/repos/names', fetchRepoNames);

// GET issues egy repo-hoz
router.get('/:owner/:repo/issues', fetchIssues);

// POST: kiválasztott repo issue-jai
router.post('/issues', fetchSelectedRepoIssues);

export default router;
