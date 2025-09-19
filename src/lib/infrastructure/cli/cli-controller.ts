import { Command } from 'commander';

import { ApplicationInterface } from '../../application/application-interface';

export class CliController {
  private readonly _program: Command;

  constructor(private readonly _applicationInterface: ApplicationInterface) {
    this._program = new Command();
  }

  public createCommand() {
    this._program
      .command('create')
      .description('Create a new ADR')
      .argument('<title>', 'The title of the ADR')
      .option('-a, --accept', 'Accept the ADR immediately')
      .action(async (title, option) => {
        const { stringifiedId } = await this._applicationInterface.createAdr({
          title,
          accepted: option.accept,
        });

        console.log(`ADR ${stringifiedId} created`);
      });
  }

  public listCommand() {
    this._program
      .command('list')
      .description('List all ADRs')
      .action(async () => {
        const { adrs } = await this._applicationInterface.listAdrs();
        adrs.forEach((adr) => {
          console.log(`- [${adr.id}] ${adr.title} (${adr.status.label})`);
        });
      });
  }

  public bootstrap() {
    this.createCommand();
    this.listCommand();
    this._program.parse(process.argv);
  }
}
