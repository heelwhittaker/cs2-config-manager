import { JSDOM } from 'jsdom';

export type CommandEntry = {
  name: string;
  type: 'command' | 'cvar';
  description: string;
  default?: string;
  flags?: string[];
};

export async function fetchLatestCommands(): Promise<CommandEntry[]> {
  const res = await fetch('https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_commands_and_variables');
  const html = await res.text();
  const dom = new JSDOM(html);

  const result: CommandEntry[] = [];
  const rows = dom.window.document.querySelectorAll('table.wikitable tr');

  rows.forEach((tr) => {
    const cells = tr.querySelectorAll('td');
    if (cells.length >= 4) {
      const name = cells[0].textContent?.trim();
      const defaultVal = cells[1].textContent?.trim();
      const flagText = cells[2].textContent?.trim();
      const description = cells[3].textContent?.trim();

      if (!name) return;

      const flags = flagText?.split(',').map((s) => s.trim()) ?? [];
      const type = defaultVal ? 'cvar' : 'command';

      result.push({
        name,
        type,
        default: defaultVal || undefined,
        flags: flags.length ? flags : undefined,
        description: description || ''
      });
    }
  });

  return result;
}
