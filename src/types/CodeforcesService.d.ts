// import { Verdict } from '../services/onlinejudges/Verdict.enum';

declare namespace Codeforces {
  interface User {
    handle: string;
    email: string;
    contribution: number;
    rank: string;
    rating: number;
    maxRank: string;
    maxRating: number;
    lastOnlineTimeSeconds: number;
    registrationTimeSeconds: number;
  }

  interface Problem {
    contestId: number;
    problemsetName: string;
    name: string;
    tags: string[];
  }

  enum Verdict {
    FAILED = 'FAILED',
    OK = 'OK',
    PARTIAL = 'PARTIAL',
    COMPILATION_ERROR = 'COMPILATION_ERROR',
    RUNTIME_ERROR = 'RUNTIME_ERROR',
    WRONG_ANSWER = 'WRONG_ANSWER',
    PRESENTATION_ERROR = 'PRESENTATION_ERROR',
    TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
    MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
    IDLENESS_LIMIT_EXCEEDED = 'IDLENESS_LIMIT_EXCEEDED',
    SECURITY_VIOLATED = 'SECURITY_VIOLATED',
    CRASHED = 'CRASHED',
    INPUT_PREPARATION_CRASHED = 'INPUT_PREPARATION_CRASHED',
    CHALLENGED = 'CHALLENGED',
    SKIPPED = 'SKIPPED',
    TESTING = 'TESTING',
    REJECTED = 'REJECTED'
  }

  interface Submission {
    id: number;
    contestId: number;
    creationTimeSeconds: number;
    relativeTimeSeconds: number;
    problem: Problem;
    programmingLanguage: string;
    verdict: Verdict;
  }

  interface RatingChange {
    contestId: number;
    contestName: string;
    handle: string;
    rank: number;
    ratingUpdateTimeSeconds: number;
    oldRating: number;
    newRating: number;
  }
}
