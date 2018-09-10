import axios from 'axios';
import CryptoJS from 'crypto-js';
import { sortObjectKeys } from '../../utils/sortObjectKeys';

export class CodeforcesService {
  private baseUrl: string;

  constructor(private key: string, private secret: string) {
    this.baseUrl = 'http://codeforces.com/api';
  }

  public async getUser(handle: string): Promise<any> {
    const url = this.generateMethodUrl('user.info', { handles: handle });
    const users = await axios.get(url);
    return users.data.result[0];
  }

  private generateMethodUrl(methodName: string, params: object): string {
    const randomStart = this.generateRandomStart();
    const time = Math.round(Date.now() / 1000);
    const apiSigParamsObject = sortObjectKeys({ ...params, apiKey: this.key, time });
    const apiSig = this.generateApiSig(randomStart, methodName, apiSigParamsObject);
    return `${this.baseUrl}/${methodName}?${this.toParamsString(params)}&apiKey=${
      this.key
    }&time=${time}&apiSig=${randomStart}${apiSig}`;
  }

  private generateRandomStart(): string {
    return Math.random()
      .toString(36)
      .substring(2, 8);
  }

  private generateApiSig(randomStart: string, methodName: string, params: object): string {
    return CryptoJS.SHA512(
      `${randomStart}/${methodName}?${this.toParamsString(params)}#${this.secret}`
    ).toString();
  }

  private toParamsString(params: any): string {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  }
}
