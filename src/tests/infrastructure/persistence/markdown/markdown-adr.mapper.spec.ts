import { Adr, AdrStatus, AdrTimestamp, NumericId } from '~lib/domain/entities/adr.entity';

import { MarkdownAdrMapper } from '../../../../lib/infrastructure/persistence/file/mappers/markdown/adr/markdown-adr.mapper';

const targetAdr = Adr.builder(NumericId.fromString('0001'), AdrStatus.proposed())
  .timestamp(AdrTimestamp.create(new Date('2025-09-06')))
  .build();

const expectedMarkdown = `
# TITLE

## Created at

2025-09-06

## Status

Proposed

## Context

CONTEXT

## Decisions

DECISIONS

## Consequences

CONSEQUENCES
`;

describe('Mapping ADR to markdown', () => {
  it('should map ADR to markdown', () => {
    expect(new MarkdownAdrMapper().toPersistence(targetAdr)).toEqual(expectedMarkdown);
  });
});

describe('Mapping markdown to ADR', () => {
  it('should map markdown to ADR', () => {
    expect(new MarkdownAdrMapper().toDomain(expectedMarkdown, NumericId.fromString('0001'))).toEqual(targetAdr);
  });
});
