import { AdrRepository } from '../domain/repositories/adr.repository';
import { CreateAdrCommand, CreateAdrUseCase } from './use-cases/create-adr.use-case';

export class ApplicationInterface {
  private readonly createAdrUseCase: CreateAdrUseCase;

  constructor(private readonly adrRepository: AdrRepository) {
    this.createAdrUseCase = new CreateAdrUseCase(this.adrRepository);
  }

  async createAdr(command: CreateAdrCommand) {
    const result = await this.createAdrUseCase.execute(command);
    return result;
  }
}
