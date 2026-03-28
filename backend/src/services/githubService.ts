import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

export const getRepoNames = async (token: string) => {
  try {
    const response = await axios.get(`${GITHUB_API}/user/repos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      params: { visibility: 'all', affiliation: 'owner,collaborator' },
    });
    return response.data.map((repo: any) => repo.name);
  } catch (error: any) {
    console.error(
      'GitHub API error (repo names):',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getRepoIssues = async (
  owner: string,
  repo: string,
  token: string,
) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );
    return response.data.map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      creator: issue.user.login,
      url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));
  } catch (error: any) {
    console.error(
      'GitHub API error (issues):',
      error.response?.data || error.message,
    );
    throw error;
  }
};
