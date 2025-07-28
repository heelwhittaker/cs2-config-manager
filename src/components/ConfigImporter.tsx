import { useState } from 'react';
import { parseCfg } from '../utils/cfgParser';
import type { ParsedLine } from '../utils/cfgParser';
import { fetchLatestCommands } from '../utils/fetchLatestCommands';
import commandDBRaw from '../data/commands.json';
const commandDB = commandDBRaw as CommandEntry[];

type CommandEntry = {
  name: string;
  type: 'command' | 'cvar';
  description: string;
  default?: string;
  flags?: string[];
};

function getCommandDescription(name: string): string | undefined {
  const entry = commandDB.find((cmd) => cmd.name === name);
  return entry?.description;
}

function ConfigImporter() {
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([]);

  const handleFileImport = async () => {
    const result = await window.api.openFile();
    if (result) {
      const lines = parseCfg(result.content);
      setParsedLines(lines);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📂 Import Config File</h2>
      <button onClick={handleFileImport}>Choose .cfg File</button>

      <div style={{ marginTop: '2rem' }}>
        {parsedLines.length === 0 && <p>No file imported yet.</p>}

        {parsedLines.map((line, idx) => {
          const description = line.command ? getCommandDescription(line.command) : undefined;

          return (
            <div key={idx} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'monospace' }}>
                <strong>{line.command}</strong> {line.args?.join(' ')}{' '}
                {line.comment && <em>// {line.comment}</em>}
              </div>
              {description && (
                <div style={{ fontSize: '0.85em', color: '#888' }}>
                  ↪ {description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConfigImporter;
