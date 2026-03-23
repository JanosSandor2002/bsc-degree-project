import { RequestHandler } from 'express';
import { getRepoNames, getRepoIssues } from '../services/githubService';

// Repository-k neveinek lekérése (GET)
export const fetchRepoNames: RequestHandler = async (req, res) => {
  try {
    const owner = req.params.owner as string;
    const names = await getRepoNames(owner);
    res.status(200).json(names);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error (repo names)',
      error: error.message,
    });
  }
};

// Egy repository issue-jainak lekérése (GET)
export const fetchIssues: RequestHandler = async (req, res) => {
  try {
    const owner = req.params.owner as string;
    const repo = req.params.repo as string;
    const issues = await getRepoIssues(owner, repo);
    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error (issues)',
      error: error.message,
    });
  }
};

// Kiválasztott repository issue-jainak lekérése POST-tal
export const fetchSelectedRepoIssues: RequestHandler = async (req, res) => {
  try {
    const owner = req.body.owner as string;
    const repo = req.body.repo as string;

    if (!owner || !repo) {
      return res
        .status(400)
        .json({ message: 'Owner és repo mezők kötelezőek' });
    }

    const issues = await getRepoIssues(owner, repo);
    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error (selected repo issues)',
      error: error.message,
    });
  }
};
