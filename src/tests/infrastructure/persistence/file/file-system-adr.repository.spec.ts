import { memfs } from 'memfs';

import { Adr, AdrStatus, NumericId } from '~lib/domain/entities/adr.entity';
import { FileSystemMapper } from '~lib/infrastructure/persistence/file/markdown/mappers/file-system.mapper';
import { FileSystemAdrRepository } from '~lib/infrastructure/persistence/file/repositories/file-system-adr.repository';

let memFs: ReturnType<typeof memfs>;
vi.mock('fs/promises', async () => {
  memFs = memfs();
  return { default: memFs['fs']['promises'], ...memFs['fs']['promises'] };
});

const DIRECTORY_PATH = '/test';

const mockMapper = vi.mockObject<FileSystemMapper>({
  toDomain: vi.fn(),
  toPersistence: vi.fn(),
  setAdrIdToFilenameMap: vi.fn(),
  extension: 'md',
});

describe('File system ADR repository', () => {
  beforeEach(() => {
    memFs.fs.mkdirSync(DIRECTORY_PATH);
  });

  afterEach(() => {
    memFs.vol.reset();
    vi.clearAllMocks();
  });

  it('should generate first record id as 0001', async () => {
    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    const id = await repository.generateId();
    expect(id).toEqual(NumericId.fromString('0001'));
  });

  it('should generate next incrementing id based on existing records', async () => {
    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    memFs.vol.writeFileSync(DIRECTORY_PATH + '/0001-title.md', 'content');
    const id2 = await repository.generateId();
    expect(id2).toEqual(NumericId.fromString('0002'));
  });

  it('should create new file if record does not exist', async () => {
    mockMapper.toPersistence.mockReturnValue('content');
    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    const adr = Adr.builder(await repository.generateId(), AdrStatus.proposed()).build();
    const id = await repository.save(adr);
    expect(id).toEqual(NumericId.fromString('0001'));

    expect(memFs.vol.readFileSync(DIRECTORY_PATH + '/0001-title.md', { encoding: 'utf8' })).toEqual('content');
  });

  it('should find existing record by id', async () => {
    const adr = Adr.builder(NumericId.fromString('0001'), AdrStatus.proposed()).build();
    mockMapper.toPersistence.mockReturnValue('content');
    mockMapper.toDomain.mockReturnValue(adr);
    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    const id = await repository.save(adr);

    const savedAdr = await repository.findById(id);
    expect(savedAdr).toEqual(adr);
  });

  it('should update existing file if record exists', async () => {
    const adr = Adr.builder(NumericId.fromString('0001'), AdrStatus.proposed()).build();
    mockMapper.toPersistence.mockReturnValue('content');
    mockMapper.toDomain.mockReturnValue(adr);

    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    const id = await repository.save(adr);

    const createdAdr = await repository.findById(id);
    mockMapper.toPersistence.mockReturnValue('updated content');

    await repository.save(createdAdr);

    expect(memFs.vol.readFileSync(DIRECTORY_PATH + '/0001-title.md', { encoding: 'utf8' })).toEqual('updated content');
  });

  it('should list all records', async () => {
    const repository = new FileSystemAdrRepository(mockMapper, DIRECTORY_PATH);
    const adr1 = Adr.builder(await repository.generateId(), AdrStatus.proposed()).build();
    mockMapper.toPersistence.mockReturnValue('content');
    await repository.save(adr1);
    const adr2 = Adr.builder(await repository.generateId(), AdrStatus.proposed()).build();
    await repository.save(adr2);

    const records = await repository.findAll();
    expect(records).toHaveLength(2);
  });
});
