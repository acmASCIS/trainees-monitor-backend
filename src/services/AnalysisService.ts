import { CodeforcesService } from './onlinejudges/CodeforcesService';
import { Verdict } from './onlinejudges/Verdict.enum';

export default class AnalysisService {
  private cfService: CodeforcesService = new CodeforcesService(
    process.env.CF_KEY as string,
    process.env.CF_SECRET as string
  );

  public async analyseProfile(codeforcesHandle: string) {
    const submissions = await this.cfService.getUserSubmissions(codeforcesHandle);
    const ratingChanges = await this.cfService.getUserRatingChanges(codeforcesHandle);
    return {
      pastRounds: this.analysePastRounds(ratingChanges),
      tags: this.analyseProblemsTags(submissions)
    };
  }

  public analysePastRounds(ratingChanges: Codeforces.RatingChange[], limit: number = 10) {
    let averageRank = 0;
    let averageRatingChange = 0;
    const summary = ratingChanges
      .reverse()
      .slice(0, limit)
      .map(ratingChange => {
        averageRank += ratingChange.rank;
        averageRatingChange += ratingChange.newRating - ratingChange.oldRating;
        return {
          contestName: ratingChange.contestName,
          rank: ratingChange.rank,
          ratingChange: ratingChange.newRating - ratingChange.oldRating,
          oldRating: ratingChange.oldRating,
          newRating: ratingChange.newRating
        };
      });

    return {
      averageRank: Math.floor(averageRank / summary.length),
      averageRatingChange: Math.floor(averageRatingChange / summary.length),
      summary
    };
  }

  public analyseProblemsTags(submissions: Codeforces.Submission[]) {
    const tagsFrequency: any = {};
    const marked: any = [];
    for (const submission of submissions) {
      if (submission.verdict === Verdict.OK && !marked[submission.problem.name]) {
        marked[submission.problem.name] = true;
        for (const tag of submission.problem.tags) {
          tagsFrequency[tag] ? tagsFrequency[tag]++ : (tagsFrequency[tag] = 1);
        }
      }
    }

    return tagsFrequency;
  }
}
