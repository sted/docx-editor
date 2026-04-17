import { defineConfig } from 'tsup';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig([
  {
    entry: {
      core: 'src/core.ts',
      headless: 'src/headless.ts',
      'core-plugins': 'src/core-plugins/index.ts',
      mcp: 'src/mcp/index.ts',
      // Subpath entries — stable public surface at directory-boundary
      // granularity, so framework adapters outside packages/{react,vue}
      // can consume internals without reaching into src/.
      'prosemirror/index': 'src/prosemirror/index.ts',
      'prosemirror/extensions/index': 'src/prosemirror/extensions/index.ts',
      'layout-engine/index': 'src/layout-engine/index.ts',
      'layout-painter/index': 'src/layout-painter/index.ts',
      'layout-bridge/toFlowBlocks': 'src/layout-bridge/toFlowBlocks.ts',
      'layout-bridge/measuring/index': 'src/layout-bridge/measuring/index.ts',
      'layout-bridge/clickToPositionDom': 'src/layout-bridge/clickToPositionDom.ts',
      'layout-bridge/selectionRects': 'src/layout-bridge/selectionRects.ts',
      'managers/index': 'src/managers/index.ts',
      'plugin-api/index': 'src/plugin-api/index.ts',
      'types/index': 'src/types/index.ts',
      'utils/textSelection': 'src/utils/textSelection.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: !isProd,
    clean: true,
    treeshake: true,
    minify: true,
    external: [
      'prosemirror-commands',
      'prosemirror-dropcursor',
      'prosemirror-history',
      'prosemirror-keymap',
      'prosemirror-model',
      'prosemirror-state',
      'prosemirror-tables',
      'prosemirror-transform',
      'prosemirror-view',
    ],
    injectStyle: false,
  },
  // CLI build (with shebang) - bundles all deps for standalone use
  {
    entry: {
      'mcp-cli': 'src/mcp/cli.ts',
    },
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: !isProd,
    clean: false,
    treeshake: true,
    minify: true,
    injectStyle: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
