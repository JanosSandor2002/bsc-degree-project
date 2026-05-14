/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import { RequestHandler } from 'express';
import { getRepoNames, getRepoIssues } from '../services/githubService';

export const fetchRepoNames: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No GitHub token' });

    const names = await getRepoNames(token);
    res.status(200).json(names);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error (repo names)',
      error: error.message,
    });
  }
};

export const fetchIssues: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No GitHub token' });

    const owner = req.params.owner as string;
    const repo = req.params.repo as string;
    const issues = await getRepoIssues(owner, repo, token);
    res.status(200).json(issues);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'GitHub fetch error (issues)', error: error.message });
  }
};

export const fetchSelectedRepoIssues: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No GitHub token' });

    const owner = req.body.owner;
    const repo = req.body.repo;
    if (!owner || !repo)
      return res
        .status(400)
        .json({ message: 'Owner és repo mezők kötelezőek' });

    const issues = await getRepoIssues(owner, repo, token);
    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json({
      message: 'GitHub fetch error (selected repo issues)',
      error: error.message,
    });
  }
};
