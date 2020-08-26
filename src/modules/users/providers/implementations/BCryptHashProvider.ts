import { compare, hash } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async hashGenerate(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async hashCompare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
