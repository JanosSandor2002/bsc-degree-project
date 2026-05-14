/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: a tesztesetek kidolgozásához, hibakereséshez
 * és javításhoz Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import axios from 'axios';
import { getRepoNames, getRepoIssues } from '../../services/githubService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('githubService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // getRepoNames

  describe('getRepoNames', () => {
    it('visszaadja a repository neveket a válaszból', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          { name: 'acxor-frontend', private: false },
          { name: 'acxor-backend', private: true },
          { name: 'bsc-thesis', private: false },
        ],
      });

      const names = await getRepoNames('fake-token');

      expect(names).toEqual(['acxor-frontend', 'acxor-backend', 'bsc-thesis']);
    });

    it('a helyes GitHub API URL-t hívja meg', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await getRepoNames('fake-token');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/user/repos',
        expect.objectContaining({
          params: { visibility: 'all', affiliation: 'owner,collaborator' },
        }),
      );
    });

    it('az Authorization headert helyesen állítja be', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await getRepoNames('my-secret-token');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-secret-token',
          }),
        }),
      );
    });

    it('üres tömböt ad vissza, ha nincs egyetlen repo sem', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const names = await getRepoNames('fake-token');

      expect(names).toEqual([]);
    });

    it('hibát dob, ha a GitHub API nem elérhető', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(getRepoNames('fake-token')).rejects.toThrow('Network Error');
    });

    it('csak a repo neveket adja vissza, más mezőket nem', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            name: 'only-name',
            id: 12345,
            full_name: 'user/only-name',
            private: false,
          },
        ],
      });

      const names = await getRepoNames('fake-token');

      expect(names).toEqual(['only-name']);
      expect(names[0]).not.toHaveProperty('id');
      expect(names[0]).not.toHaveProperty('full_name');
    });
  });

  // getRepoIssues

  describe('getRepoIssues', () => {
    const mockIssues = [
      {
        number: 1,
        title: 'Bejelentkezési hiba javítása',
        body: 'A felhasználó nem tud bejelentkezni.',
        state: 'open',
        user: { login: 'sando' },
        html_url: 'https://github.com/sando/repo/issues/1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      {
        number: 2,
        title: 'Kanban nézet fejlesztése',
        body: null,
        state: 'open',
        user: { login: 'sando' },
        html_url: 'https://github.com/sando/repo/issues/2',
        created_at: '2025-01-03T00:00:00Z',
        updated_at: '2025-01-03T00:00:00Z',
      },
    ];

    it('visszaadja a szűrt issue mezőket', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getRepoIssues(
        'sando',
        'acxor-backend',
        'fake-token',
      );

      expect(issues).toHaveLength(2);
      expect(issues[0]).toEqual({
        number: 1,
        title: 'Bejelentkezési hiba javítása',
        body: 'A felhasználó nem tud bejelentkezni.',
        state: 'open',
        creator: 'sando',
        url: 'https://github.com/sando/repo/issues/1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      });
    });

    it('nem tartalmaz nyers GitHub mezőket (user, html_url)', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getRepoIssues(
        'sando',
        'acxor-backend',
        'fake-token',
      );

      expect(issues[0]).not.toHaveProperty('user');
      expect(issues[0]).not.toHaveProperty('html_url');
    });

    it('a helyes repo URL-t hívja meg', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await getRepoIssues('sando', 'acxor-backend', 'fake-token');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/sando/acxor-backend/issues',
        expect.any(Object),
      );
    });

    it('null body-t is helyesen kezeli', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getRepoIssues(
        'sando',
        'acxor-backend',
        'fake-token',
      );

      expect(issues[1].body).toBeNull();
    });

    it('üres tömböt ad vissza, ha nincs issue', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const issues = await getRepoIssues('sando', 'empty-repo', 'fake-token');

      expect(issues).toEqual([]);
    });

    it('hibát dob 401-es GitHub válasz esetén', async () => {
      const authError = {
        response: { status: 401, data: { message: 'Bad credentials' } },
      };
      mockedAxios.get.mockRejectedValueOnce(authError);

      await expect(
        getRepoIssues('sando', 'private-repo', 'bad-token'),
      ).rejects.toMatchObject({ response: { status: 401 } });
    });
  });
});
