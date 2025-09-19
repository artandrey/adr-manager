import { Adr, NumericId } from '../entities/adr.entity';

export interface AdrRepository {
  save(adr: Adr): Promise<NumericId>;
  findById(id: NumericId): Promise<Adr | null>;
  findAll(): Promise<Adr[]>;
  generateId(): Promise<NumericId>;
}
