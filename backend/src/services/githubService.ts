import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

export const getRepoIssues = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('GitHub API error:', error.response?.data || error.message);
    throw error;
  }
};
