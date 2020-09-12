import IMailProvider from '../models/IMailProvider';
import ISendEmailDTO from '../dtos/ISendEmailDTO';

class FakeMailProvider implements IMailProvider {
  private messages: ISendEmailDTO[] = [];

  public async sendMail(data: ISendEmailDTO): Promise<void> {
    this.messages.push(data);
  }
}

export default FakeMailProvider;
