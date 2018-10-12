import _ from 'lodash';
import { CodeforcesService } from './onlinejudges/CodeforcesService';
import { Verdict } from './onlinejudges/Verdict.enum';
import { secondsToDuration } from '../utils/secondsToDuration';
import { ICFContestRepository, CFContestRepository } from '../repositories/CFContestRepository';

export default class AnalysisService {
  private cfContestsRepository: ICFContestRepository = new CFContestRepository();
  private cfService: CodeforcesService = new CodeforcesService(
    process.env.CF_KEY as string,
    process.env.CF_SECRET as string
  );

  public async analyseProfile(codeforcesHandle: string) {
    // TODO: run API calls in parallel
    const submissions = await this.cfService.getUserSubmissions(codeforcesHandle);
    const ratingChanges = await this.cfService.getUserRatingChanges(codeforcesHandle);
    return {
      sheetsParticipation: await this.analyseSheets(codeforcesHandle),
      pastRounds: this.analysePastRounds(ratingChanges),
      tags: this.analyseProblemsTags(submissions),
      solvingRate: this.analyseSolvingRate(submissions)
    };
  }

  public analysePastRounds(ratingChanges: Codeforces.RatingChange[], limit: number = 5) {
    let averageRank = 0;
    let averageRatingChange = 0;
    const summary = ratingChanges
      .reverse()
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
      })
      .slice(0, limit);

    return {
      averageRank: Math.floor(averageRank / ratingChanges.length),
      averageRatingChange: Math.floor(averageRatingChange / ratingChanges.length),
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

  public analyseSolvingRate(submissions: Codeforces.Submission[]) {
    const acceptedSubmissions = submissions.filter(submission => submission.verdict === Verdict.OK);

    // Getting the months, weeks, days count from the first submission of the user
    const firstSubmissionDuration = secondsToDuration(
      submissions[submissions.length - 1].creationTimeSeconds
    );
    const monthsCount = Math.ceil(firstSubmissionDuration.asMonths());
    const weeksCount = Math.ceil(firstSubmissionDuration.asWeeks());
    const daysCount = Math.ceil(firstSubmissionDuration.asDays());

    // Calculating past Month, Week, Day Accepted Submissions
    const pastMonth = acceptedSubmissions.filter(submission => {
      const duration = secondsToDuration(submission.creationTimeSeconds);
      return duration.asMonths() <= 1;
    }).length;
    const pastWeek = acceptedSubmissions.filter(submission => {
      const duration = secondsToDuration(submission.creationTimeSeconds);
      return duration.asWeeks() <= 1;
    }).length;
    const pastDay = acceptedSubmissions.filter(submission => {
      const duration = secondsToDuration(submission.creationTimeSeconds);
      return duration.asDays() <= 1;
    }).length;

    // Average calculation: rounding to the nearest tenths
    // formula: Math.round(number * 10) / 10
    return {
      monthlyAverage: Math.round((acceptedSubmissions.length / monthsCount) * 10) / 10,
      weeklyAverage: Math.round((acceptedSubmissions.length / weeksCount) * 10) / 10,
      dailyAverage: Math.round((acceptedSubmissions.length / daysCount) * 10) / 10,
      pastMonth,
      pastWeek,
      pastDay
    };
  }

  public async analyseSheets(codeforcesHandle: string) {
    // Fetching all contests
    const contests = (await this.cfContestsRepository.findAll())
      .sort((a, b) => +b._id - +a._id)
      .slice(0, 5);
    return await Promise.all(
      contests.map(async contest => {
        // Fetching contest Standings, Submissions
        const standings = await this.cfService.getContestStandings(contest._id, codeforcesHandle);
        let submissions = await this.cfService.getContestSubmissions(contest._id, codeforcesHandle);
        submissions = submissions.filter(submission => submission.verdict === Verdict.OK);
        submissions = _.uniqBy(submissions, 'problem.name');

        return {
          contestName: contest.name,
          rank: standings.rows[0] ? standings.rows[0].rank : 0,
          solvedCount: submissions.length,
          solvedProblems: submissions.map(submission => submission.problem.index)
        };
      })
    );
  }
}
