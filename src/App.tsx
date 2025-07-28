import CommandUpdater from './components/CommandUpdater'
import ConfigImporter from './components/ConfigImporter'
import { ConfigBuilder } from './components/ConfigBuilder'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>CS2 Config Manager</h1>

      <section>
        <h2>🧩 Command Updater</h2>
        <CommandUpdater />
      </section>

      <section>
        <h2>📥 Config Importer</h2>
        <ConfigImporter />
      </section>

      <section>
        <h2>🛠️ Config Builder</h2>
        <ConfigBuilder />
      </section>
    </div>
  )
}

export default App
