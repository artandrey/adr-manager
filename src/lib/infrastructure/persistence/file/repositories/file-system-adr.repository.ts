import { mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

import { Adr, NumericId } from '../../../../domain/entities/adr.entity';
import { AdrRepository } from '../../../../domain/repositories/adr.repository';
import { FileSystemMapper } from '../mappers/file-system.mapper';

export class FileSystemAdrRepository implements AdrRepository {
  constructor(
    private readonly fileSystemMapper: FileSystemMapper,
    private readonly directoryPath: string,
  ) {}

  private async buildAdrToFilenameMap(): Promise<Map<number, string>> {
    const map = new Map<number, string>();
    const files = await readdir(this.directoryPath);
    files.forEach((file) => {
      const id = NumericId.fromString(file.split('-')[0]);
      map.set(id.toInt(), file);
    });
    return map;
  }

  private async getNextIncrementingId(): Promise<NumericId> {
    const map = await this.buildAdrToFilenameMap();
    const ids = Array.from(map.keys()).map((id) => id);
    return NumericId.fromInt((ids.sort().pop() ?? 0) + 1);
  }

  async generateId(): Promise<NumericId> {
    await this.ensureDirectoryExists();
    return await this.getNextIncrementingId();
  }

  async save(adr: Adr): Promise<NumericId> {
    await this.ensureDirectoryExists();
    const map = await this.buildAdrToFilenameMap();

    if (map.has(adr.id.toInt())) {
      return this.update(adr, map);
    } else {
      return this.create(adr);
    }
  }

  private async ensureDirectoryExists(): Promise<void> {
    await stat(this.directoryPath).catch(() => {
      return mkdir(this.directoryPath, { recursive: true });
    });
  }

  private async create(adr: Adr): Promise<NumericId> {
    const id = await this.getNextIncrementingId();
    const filename = this.convertAdrTitleToFilename(adr);
    await writeFile(path.join(this.directoryPath, filename), this.fileSystemMapper.toPersistence(adr));
    return id;
  }

  private async update(adr: Adr, map: Map<number, string>): Promise<NumericId> {
    const filename = map.get(adr.id.toInt());
    if (!filename) {
      throw new Error(`ADR with id ${adr.id} not found`);
    }
    await writeFile(path.join(this.directoryPath, filename), this.fileSystemMapper.toPersistence(adr));
    return adr.id;
  }

  async findById(id: NumericId): Promise<Adr | null> {
    const map = await this.buildAdrToFilenameMap();
    const filename = map.get(id.toInt());

    if (!filename) {
      return null;
    }
    const persistence = await readFile(path.join(this.directoryPath, filename), 'utf8');
    return this.fileSystemMapper.toDomain(persistence, id);
  }

  async findAll(): Promise<Adr[]> {
    const map = await this.buildAdrToFilenameMap();
    const files = Array.from(map.values());
    return await Promise.all(
      files.map(async (file) => {
        const id = NumericId.fromString(file.split('-')[0]);
        const persistence = await readFile(path.join(this.directoryPath, file), 'utf8');
        return this.fileSystemMapper.toDomain(persistence, id);
      }),
    );
  }

  private convertAdrTitleToFilename(adr: Adr): string {
    return `${adr.id.toString()}-${adr.title.toLowerCase().replace(/ /g, '-')}.${this.fileSystemMapper.extension}`;
  }
}
