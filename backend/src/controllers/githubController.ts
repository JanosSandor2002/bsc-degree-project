import { RequestHandler } from 'express';
import { getRepoIssues } from '../services/githubService';

export const fetchIssues: RequestHandler = async (req, res) => {
  try {
    const owner = req.params.owner as string;
    const repo = req.params.repo as string;

    const issues = await getRepoIssues(owner, repo);

    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error',
      error: error.message,
    });
  }
};
