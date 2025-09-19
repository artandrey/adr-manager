import { Adr, AdrStatus } from '../../domain/entities/adr.entity';
import { AdrRepository } from '../../domain/repositories/adr.repository';

export interface CreateAdrCommand {
  title: string;
  accepted?: boolean;
}

export interface CreateAdrResult {
  id: number;
  stringifiedId: string;
}

export class CreateAdrUseCase {
  constructor(private readonly adrRepository: AdrRepository) {}

  async execute(command: CreateAdrCommand): Promise<CreateAdrResult> {
    const adr = Adr.builder(
      await this.adrRepository.generateId(),
      command.accepted ? AdrStatus.accepted() : AdrStatus.proposed(),
    )
      .title(command.title)
      .build();
    const id = await this.adrRepository.save(adr);
    return { id: id.toInt(), stringifiedId: id.toString() };
  }
}
