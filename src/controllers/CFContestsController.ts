import express, { Request, Response, Router } from 'express';

import { IController } from './IController';
import { ICFContestRepository, CFContestRepository } from '../repositories/CFContestRepository';
import { validateCreateContestInput } from '../utils/validation';
import { ApiError } from '../utils/ApiError';
import { CodeforcesService } from '../services/onlinejudges/CodeforcesService';
import { CFContest } from '../models/CFContest/CFContest';
import { authorize } from '../utils/middleware/authHandler';
import { Role } from '../models/User/UserDTO';

export default class CFContestsController implements IController {
  private cotenstsRepository: ICFContestRepository = new CFContestRepository();
  private cfService: CodeforcesService = new CodeforcesService(
    process.env.CF_KEY as string,
    process.env.CF_SECRET as string
  );

  public register(app: express.Application): void {
    const router = Router();
    router.get('/', authorize(Role.Trainee), this.getContests.bind(this));
    router.post('/', authorize(Role.Admin), this.createContest.bind(this));
    router.delete('/', authorize(Role.Admin), this.deleteContest.bind(this));

    // attaching the router to the endpoint.
    app.use('/cfcontests', router);
  }

  /**
   * @route GET /cfcontests
   * @desc Gets all Codeforces Contests.
   * @access Private
   */
  private async getContests(req: Request, res: Response) {
    const contests = await this.cotenstsRepository.findAll();
    res.json(contests.sort((a, b) => +b._id - +a._id));
  }

  /**
   * @route POST /cfcontests
   * @desc Creates new Codeforces Contest.
   * @access Private
   */
  private async createContest(req: Request, res: Response) {
    // validate input
    const { errors } = validateCreateContestInput(req.body);
    if (errors) {
      throw new ApiError('Invalid Input', 400, errors);
    }

    // Checking existing contest
    if (await this.cotenstsRepository.findById(req.body.contestId)) {
      throw new ApiError('Invalid Input', 400, {
        contestId: 'Contest Already Exists',
      });
    }

    // Fetching contest name from Codeforces
    const contestName = (await this.cfService.getContestStandings(req.body.contestId)).contest.name;

    // Create new contest
    const contest = new CFContest(req.body.contestId, contestName);
    await this.cotenstsRepository.create(contest);
    res.status(201).json({ success: true, contest });
  }

  /**
   * @route DELETE /cfcontests
   * @desc Deletes an existing Codeforces Contest.
   * @access Private
   */
  private async deleteContest(req: Request, res: Response) {
    // validate input
    const { errors } = validateCreateContestInput(req.body);
    if (errors) {
      throw new ApiError('Invalid Input', 400, errors);
    }

    // Checking not existing contest
    if (!(await this.cotenstsRepository.findById(req.body.contestId))) {
      throw new ApiError('Invalid Input', 400, {
        contestId: 'Contest does not exist',
      });
    }

    // Delete the contest
    await this.cotenstsRepository.delete(req.body.contestId);
    res.json({ success: true });
  }
}
