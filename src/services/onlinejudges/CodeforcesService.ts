import axios from 'axios';
import CryptoJS from 'crypto-js';
import { sortObjectKeys } from '../../utils/sortObjectKeys';

export class CodeforcesService {
  private baseUrl: string;

  constructor(private key: string, private secret: string) {
    this.baseUrl = 'http://codeforces.com/api';
  }

  /**
   * Get User Info from user.info CF API Method
   *
   * @param {string} handle
   * @returns {(Codeforces.User | undefined)} The Codeforces User info or undefined if not found
   */
  public async getUser(handle: string): Promise<Codeforces.User | undefined> {
    const url = this.generateMethodUrl('user.info', { handles: handle });
    try {
      const users = await axios.get(url);
      return users.data.result[0];
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get User Submissions from user.status CF API Method
   *
   * @param {string} handle
   * @returns {Codeforces.Submission[]} The Codeforces User Submission array
   */
  public async getUserSubmissions(handle: string): Promise<Codeforces.Submission[]> {
    const url = this.generateMethodUrl('user.status', { handle });
    try {
      const submissions = await axios.get(url);
      return submissions.data.result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get User Submissions from user.status CF API Method
   *
   * @param {string} handle
   * @returns {Codeforces.RatingChange[]} The Codeforces User Rating Change array
   */
  public async getUserRatingChanges(handle: string): Promise<Codeforces.RatingChange[]> {
    const url = this.generateMethodUrl('user.rating', { handle });
    try {
      const submissions = await axios.get(url);
      return submissions.data.result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get Contest Standings from contest.standings CF API Method
   *
   * @param {string} contestId
   * @returns {any} The Codeforces Standings object
   */
  public async getContestStandings(contestId: string): Promise<any> {
    const url = this.generateMethodUrl('contest.standings', { contestId });
    try {
      const submissions = await axios.get(url);
      return submissions.data.result;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Generate the URL required for a specific method
   *
   * @param {string} methodName - The name of the method in CF API
   * @param {object} params - The parameters object
   */
  private generateMethodUrl(methodName: string, params: object): string {
    const randomStart = this.generateRandomStart();
    const time = Math.round(Date.now() / 1000);
    const apiSigParamsObject = sortObjectKeys({ ...params, apiKey: this.key, time });
    const apiSig = this.generateApiSig(randomStart, methodName, apiSigParamsObject);
    return `${this.baseUrl}/${methodName}?${this.toParamsString(params)}&apiKey=${
      this.key
    }&time=${time}&apiSig=${randomStart}${apiSig}`;
  }

  /**
   * Generate random string of size 6 as the apiSig start
   */
  private generateRandomStart(): string {
    return Math.random()
      .toString(36)
      .substring(2, 8);
  }

  /**
   * Generate the apiSig required by the private CF API methods.
   * Uses CryptoJS to hash the input with a SHA512 algorithm.
   *
   * @param {string} randomStart - A random string of size 6
   * @param {string} methodName - The name of the method in CF API
   * @param {object} params - The parameters object
   */
  private generateApiSig(randomStart: string, methodName: string, params: object): string {
    return CryptoJS.SHA512(
      `${randomStart}/${methodName}?${this.toParamsString(params)}#${this.secret}`
    ).toString();
  }

  /**
   * Convert the parameters object to parameter string
   *
   * @param {object} params - The parameters object
   */
  private toParamsString(params: any): string {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  }
}
