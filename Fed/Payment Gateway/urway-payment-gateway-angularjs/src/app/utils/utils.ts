import { sha256 } from 'js-sha256';

export class Utils {
  static generateHash(arg: string) {
    return sha256(arg);
  }
}
