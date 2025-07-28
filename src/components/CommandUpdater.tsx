import { useState } from 'react';
import localCommandsRaw from '../data/commands.json';
import { fetchLatestCommands } from '../utils/fetchLatestCommands';

type CommandEntry = {
  name: string;
  type: 'command' | 'cvar';
  description: string;
  default?: string;
  flags?: string[];
};

const localCommands = localCommandsRaw as CommandEntry[];

function diffCommands(
  local: CommandEntry[],
  remote: CommandEntry[]
): { added: CommandEntry[]; removed: CommandEntry[]; changed: CommandEntry[] } {
  const added: CommandEntry[] = [];
  const removed: CommandEntry[] = [];
  const changed: CommandEntry[] = [];

  const localMap = new Map(local.map((cmd) => [cmd.name, cmd]));
  const remoteMap = new Map(remote.map((cmd) => [cmd.name, cmd]));

  // Added or changed
  for (const [name, remoteCmd] of remoteMap.entries()) {
    if (!localMap.has(name)) {
      added.push(remoteCmd);
    } else {
      const localCmd = localMap.get(name)!;
      if (
        remoteCmd.description !== localCmd.description ||
        remoteCmd.default !== localCmd.default
      ) {
        changed.push(remoteCmd);
      }
    }
  }

  // Removed
  for (const name of localMap.keys()) {
    if (!remoteMap.has(name)) {
      removed.push(localMap.get(name)!);
    }
  }

  return { added, removed, changed };
}

function CommandUpdater() {
  const [diffResult, setDiffResult] = useState<{
    added: CommandEntry[];
    removed: CommandEntry[];
    changed: CommandEntry[];
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleCheckForUpdates = async () => {
    setLoading(true);
    const remoteCommands = await fetchLatestCommands();
    const diff = diffCommands(localCommands, remoteCommands);
    setDiffResult(diff);
    setLoading(false);
  };

  const handleDownloadUpdatedJson = async () => {
    const remoteCommands = await fetchLatestCommands();
    const blob = new Blob([JSON.stringify(remoteCommands, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'commands.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔄 Command Library Update</h2>
      <button onClick={handleCheckForUpdates} disabled={loading}>
        {loading ? 'Checking...' : 'Check for Updates from Wiki'}
      </button>

      {diffResult && (
        <div style={{ marginTop: '1rem' }}>
          <h3>✅ New Commands: {diffResult.added.length}</h3>
          <ul>
            {diffResult.added.map((cmd) => (
              <li key={cmd.name}>
                <strong>{cmd.name}</strong>: {cmd.description}
              </li>
            ))}
          </ul>

          <h3>📝 Changed Descriptions: {diffResult.changed.length}</h3>
          <ul>
            {diffResult.changed.map((cmd) => (
              <li key={cmd.name}>
                <strong>{cmd.name}</strong>: {cmd.description}
              </li>
            ))}
          </ul>

          <h3>❌ Removed Commands: {diffResult.removed.length}</h3>
          <ul>
            {diffResult.removed.map((cmd) => (
              <li key={cmd.name}>
                <strong>{cmd.name}</strong>: {cmd.description}
              </li>
            ))}
          </ul>

          <button onClick={handleDownloadUpdatedJson} style={{ marginTop: '1rem' }}>
            💾 Download Updated commands.json
          </button>
        </div>
      )}
    </div>
  );
}

export default CommandUpdater;