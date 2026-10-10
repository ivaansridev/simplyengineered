import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The library is a workspace dependency consumed from its built `dist`, so edits
// to its source don't reach the browser until it is rebuilt. The website's dev
// script keeps `svelte-package --watch` running alongside Vite; this plugin makes
// Vite watch the rebuilt output and reload the page when it changes.
const libDist = path.resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  '../simplyengineered/dist'
);

function watchLibraryDist(): Plugin {
  return {
    name: 'spe-watch-library',
    configureServer(server) {
      server.watcher.add(libDist);
      server.watcher.on('change', (file) => {
        if (file.startsWith(libDist)) server.ws.send({ type: 'full-reload' });
      });
    }
  };
}

export default defineConfig({
  plugins: [sveltekit(), watchLibraryDist()]
});
