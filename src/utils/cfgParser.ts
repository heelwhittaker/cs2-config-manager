// src/utils/cfgParser.ts

export interface ParsedLine {
  raw: string;
  command?: string;
  args?: string[];
  comment?: string;
}

const commentPattern = /\/\/(.*)$/;

export function parseCfg(content: string): ParsedLine[] {
  return content.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return { raw: line };

    const commentMatch = trimmed.match(commentPattern);
    const comment = commentMatch ? commentMatch[1].trim() : undefined;
    const lineWithoutComment = trimmed.replace(commentPattern, '').trim();
    if (!lineWithoutComment) return { raw: line, comment };

    const parts = lineWithoutComment.split(/\s+/);

    return {
      raw: line,
      command: parts[0],
      args: parts.slice(1),
      comment,
    };
  });
}
