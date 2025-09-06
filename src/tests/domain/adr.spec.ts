import { describe, expect, it } from 'vitest';

import { Adr, AdrLink, AdrStatus, LinkDirection, NumericId } from '../../lib/domain/entities/adr.entity';

describe('Adr', () => {
  it('should have default values for title, context, decisions, consequences', () => {
    const adr = Adr.builder(NumericId.fromString('0001'), AdrStatus.proposed()).build();
    expect(adr.id).toBeDefined();
    expect(adr.title).toBe('TITLE');
    expect(adr.context).toBe('CONTEXT');
    expect(adr.decisions).toBe('DECISIONS');
    expect(adr.consequences).toBe('CONSEQUENCES');
  });

  it('should create relations between ADRs', () => {
    const supersedeLink = AdrLink.create(
      'supersedes',
      'Supersedes',
      LinkDirection.create('Supersedes', 'accepted'),
      LinkDirection.create('Superseded by', 'superseded'),
    );
    const adr1 = Adr.builder(NumericId.fromString('0001'), AdrStatus.proposed()).build();
    const adr2 = Adr.builder(NumericId.fromString('0002'), AdrStatus.proposed()).build();
    adr1.associateWith(adr2, supersedeLink);
    expect(adr1.relations).toHaveLength(1);
    expect(adr2.relations).toHaveLength(1);
  });
});
