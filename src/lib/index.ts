import { ApplicationInterface } from './application/application-interface';
import { CliController } from './infrastructure/cli/cli-controller';
import { MarkdownAdrMapper } from './infrastructure/persistence/file/mappers/markdown/adr/markdown-adr.mapper';
import { FileSystemAdrRepository } from './infrastructure/persistence/file/repositories/file-system-adr.repository';

const fileAdrRepository = new FileSystemAdrRepository(new MarkdownAdrMapper(), 'adr');
const applicationInterface = new ApplicationInterface(fileAdrRepository);

const cliController = new CliController(applicationInterface);
cliController.bootstrap();
