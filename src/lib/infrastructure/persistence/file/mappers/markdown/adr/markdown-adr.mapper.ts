import { Adr, AdrStatus, AdrTimestamp, NumericId } from '../../../../../../domain/entities/adr.entity';
import { FileSystemMapper } from '../../file-system.mapper';
import { PlaceholderExtractor } from './placeholder-extractor';

const template = `
# {{title}}

## Created at

{{timestamp}}

## Status

{{statusAndRelations}}

## Context

{{context}}

## Decisions

{{decisions}}

## Consequences

{{consequences}}
`;

export class MarkdownAdrMapper implements FileSystemMapper {
  private _adrIdToFilenameMap: Map<number, string> = new Map();
  readonly extension: string = 'md';

  public setAdrIdToFilenameMap(map: Map<number, string>): void {
    this._adrIdToFilenameMap = map;
  }

  public toDomain(persistence: string, id: NumericId): Adr {
    const values = PlaceholderExtractor.extract(persistence, template);
    const status = AdrStatus.createStatusFromLabel(values.statusAndRelations);
    const timestamp = AdrTimestamp.create(new Date(values.timestamp));
    const title = values.title;
    const context = values.context;
    const decisions = values.decisions;
    const consequences = values.consequences;
    return Adr.builder(id, status)
      .timestamp(timestamp)
      .title(title)
      .context(context)
      .decisions(decisions)
      .consequences(consequences)
      .build();
  }

  public toPersistence(domain: Adr): string {
    return template
      .replace('{{title}}', domain.title)
      .replace('{{statusAndRelations}}', this.mapStatusAndRelationsToPersistence(domain))
      .replace('{{timestamp}}', this.formatTimestamp(domain.timestamp))
      .replace('{{context}}', domain.context)
      .replace('{{decisions}}', domain.decisions)
      .replace('{{consequences}}', domain.consequences);
  }

  private formatTimestamp(timestamp: AdrTimestamp): string {
    return `${timestamp.value.getFullYear()}-${(timestamp.value.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.value.getDate().toString().padStart(2, '0')}`;
  }

  private mapStatusAndRelationsToPersistence(domain: Adr): string {
    if (domain.relations.length === 0) {
      return domain.status.label;
    } else {
      throw new Error('Relations are not supported yet');
    }
  }
}
