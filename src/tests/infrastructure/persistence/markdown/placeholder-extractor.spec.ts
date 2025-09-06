import { PlaceholderExtractor } from '../../../../lib/infrastructure/persistence/file/markdown/mappers/adr/placeholder-extractor';

const template = `
# {{title}}
## Context
{{context}}
## Decisions
{{decisions}}
## Consequences
{{consequences}}`;

const generateRandomOneLineString = () => {
  return Math.random().toString(36).substring(2, 15);
};

const generateRandomMultiLineString = () => {
  return Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => generateRandomOneLineString()).join('\n');
};

const generateTestString = (type: 'one-line' | 'multi-line') => {
  let generator: () => string;
  if (type === 'one-line') {
    generator = generateRandomOneLineString;
  }
  if (type === 'multi-line') {
    generator = generateRandomMultiLineString;
  }
  if (!generator) {
    throw new Error('Generator not found');
  }

  const title = generator();
  const context = generator();
  const decisions = generator();
  const consequences = generator();

  return {
    string: `
# ${title}
## Context
${context}
## Decisions
${decisions}
## Consequences
${consequences}
`,
    expected: {
      title,
      context,
      decisions,
      consequences,
    },
  };
};

describe('Extracting values from string based on template', () => {
  it('should extract one-line values from string based on template', () => {
    const { string, expected } = generateTestString('one-line');
    const values = PlaceholderExtractor.extract(string, template);
    expect(values).toEqual(expected);
  });

  it('should extract multi-line values from string based on template', () => {
    const { string, expected } = generateTestString('multi-line');
    const values = PlaceholderExtractor.extract(string, template);
    expect(values).toEqual(expected);
  });
});
