import { useState } from 'react';
import CommandUpdater from './components/CommandUpdater';
import ConfigImporter from './components/ConfigImporter';

function App() {
  return (
    <div>
      <h1>CS2 Config Manager</h1>
      <CommandUpdater />
      <ConfigImporter />
    </div>
  );
}

export default App;
