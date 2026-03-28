import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

// Lekéri a felhasználó repository-jait (publikus + privát)
export const getRepoNames = async () => {
  try {
    const response = await axios.get(`${GITHUB_API}/user/repos`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Personal token
        Accept: 'application/vnd.github+json',
      },
      params: {
        visibility: 'all', // all = public + private
        affiliation: 'owner,collaborator', // repo-k amikben tulaj vagy kollaborátor vagy
      },
    });

    // Csak a repository nevek
    return response.data.map((repo: any) => repo.name);
  } catch (error: any) {
    console.error(
      'GitHub API error (repo names):',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Lekéri egy repository issue-jait, szűrt JSON-ban
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

    // Szűrés: csak a fontos mezők
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
