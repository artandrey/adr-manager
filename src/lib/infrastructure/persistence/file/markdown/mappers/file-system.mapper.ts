import { Adr, NumericId } from '../../../../../domain/entities/adr.entity';

export interface FileSystemMapper {
  toDomain(persistence: string, id: NumericId): Adr;
  toPersistence(domain: Adr): string;
  setAdrIdToFilenameMap(map: Map<number, string>): void;
  readonly extension: string;
}
