export class PlaceholderExtractor {
  public static extract(string: string, template: string): Record<string, string> {
    function escapeStringRegexp(str: string): string {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const trimmedTemplate = template.trim();
    const trimmedString = string.trim();

    const placeholders: string[] = [];
    const regexParts: string[] = [];
    let lastIndex = 0;
    const placeholderRegex = /{{(\w+)}}/g;
    let match;
    while ((match = placeholderRegex.exec(trimmedTemplate)) !== null) {
      const fixed = trimmedTemplate.slice(lastIndex, match.index);
      regexParts.push(escapeStringRegexp(fixed));
      regexParts.push('([\\s\\S]*?)');
      placeholders.push(match[1]);
      lastIndex = placeholderRegex.lastIndex;
    }
    const fixedEnd = trimmedTemplate.slice(lastIndex);
    regexParts.push(escapeStringRegexp(fixedEnd));

    const regexStr = '^' + regexParts.join('') + '$';
    const regex = new RegExp(regexStr);

    const exec = regex.exec(trimmedString);
    if (!exec) {
      return {};
    }

    const result: Record<string, string> = {};
    for (let i = 0; i < placeholders.length; i++) {
      result[placeholders[i]] = exec[i + 1];
    }
    return result;
  }
}
