import { Adr } from '../../domain/entities/adr.entity';
import { AdrRepository } from '../../domain/repositories/adr.repository';

export interface ListAdrsResult {
  adrs: Adr[];
}

export class ListAdrsUseCase {
  constructor(private readonly adrRepository: AdrRepository) {}

  async execute(): Promise<ListAdrsResult> {
    const adrs = await this.adrRepository.findAll();
    return { adrs };
  }
}
