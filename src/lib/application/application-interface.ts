import { AdrRepository } from '../domain/repositories/adr.repository';
import { CreateAdrCommand, CreateAdrUseCase } from './use-cases/create-adr.use-case';
import { ListAdrsUseCase } from './use-cases/list-adrs.use-case';

export class ApplicationInterface {
  private readonly createAdrUseCase: CreateAdrUseCase;
  private readonly listAdrsUseCase: ListAdrsUseCase;

  constructor(private readonly adrRepository: AdrRepository) {
    this.createAdrUseCase = new CreateAdrUseCase(this.adrRepository);
    this.listAdrsUseCase = new ListAdrsUseCase(this.adrRepository);
  }

  async createAdr(command: CreateAdrCommand) {
    const result = await this.createAdrUseCase.execute(command);
    return result;
  }

  async listAdrs() {
    const result = await this.listAdrsUseCase.execute();
    return result;
  }
}
