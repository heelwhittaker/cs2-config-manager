import { useState } from 'react'
import { parseCfg } from '../utils/cfgParser'
import type { ParsedLine } from '../utils/cfgParser'
import { useConfig } from '../context/ConfigContext'
import commandDBRaw from '../data/commands.json'
import type { Config } from '../lib/configModel'

type CommandEntry = {
  name: string
  type: 'command' | 'cvar'
  description: string
  default?: string
  flags?: string[]
}

const commandDB = commandDBRaw as CommandEntry[]

function getCommandDescription(name: string): string | undefined {
  const entry = commandDB.find((cmd) => cmd.name === name)
  return entry?.description
}

function ConfigImporter() {
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([])
  const { setConfig } = useConfig()

  const handleFileImport = async () => {
    const result = await window.api.openFile()
    if (!result) return

    const content = result.content
    const lines = parseCfg(content)
    setParsedLines(lines)

    // Map parsed lines to structured config state
    const cfg: Config = {
      binds: [],
      cvars: [],
      aliases: []
    }

    for (const line of lines) {
      if (!line.command || !line.args?.length) continue

      const cmd = line.command
      const args = line.args

      if (cmd === 'bind' && args.length >= 2) {
        const [key, ...cmdParts] = args
        cfg.binds.push({ key, command: cmdParts.join(' ') })
      } else if (cmd === 'alias' && args.length >= 2) {
        const [name, ...cmdParts] = args
        cfg.aliases.push({ name, command: cmdParts.join(' ') })
      } else {
        cfg.cvars.push({ name: cmd, value: args.join(' ') })
      }
    }

    setConfig(cfg)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📂 Import Config File</h2>
      <button onClick={handleFileImport}>Choose .cfg File</button>

      <div style={{ marginTop: '2rem' }}>
        {parsedLines.length === 0 && <p>No file imported yet.</p>}

        {parsedLines.map((line, idx) => {
          const description = line.command ? getCommandDescription(line.command) : undefined

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
          )
        })}
      </div>
    </div>
  )
}

export default ConfigImporter
