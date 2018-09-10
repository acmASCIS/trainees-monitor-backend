import dotenv from 'dotenv';
import { CodeforcesService } from './../src/services/onlinejudges/CodeforcesService';

describe('Getting User Data', () => {
  let codeforcesService: CodeforcesService;

  beforeAll(() => {
    dotenv.load();
    codeforcesService = new CodeforcesService(process.env.CF_KEY, process.env.CF_SECRET);
  });

  it('should get the user data', async () => {
    const user: any = await codeforcesService.getUser('acmAscis');
    expect(user.handle).toBe('acmASCIS');
    expect(user.rating).toBe(1963);
    expect(user.maxRating).toBe(1963);
    expect(user.maxRank).toBe('candidate master');
  });
});
