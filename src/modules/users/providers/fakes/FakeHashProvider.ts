import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async hashGenerate(payload: string): Promise<string> {
    return payload;
  }

  public async hashCompare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default FakeHashProvider;
