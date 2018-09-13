import dotenv from 'dotenv';
import { CodeforcesService } from '../src/services/onlinejudges/CodeforcesService';

describe('Getting User Info', () => {
  let codeforcesService: CodeforcesService;

  beforeAll(() => {
    dotenv.load();
    codeforcesService = new CodeforcesService(process.env.CF_KEY, process.env.CF_SECRET);
  });

  it('should get the user info correctly', async () => {
    const user = await codeforcesService.getUser('acmAscis');
    expect(user).toMatchObject({
      handle: 'acmASCIS',
      rating: 1963,
      maxRating: 1963,
      maxRank: 'candidate master'
    });
  });

  it('should fail to get the user info', async () => {
    const user = await codeforcesService.getUser('non-existing-user');
    expect(user).toBe(undefined);
  });
});
