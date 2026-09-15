# The print as a development plugin

For a seat where the Figma MCP server is not available. The plugin is the generated script
in a manifest; nothing else.

```
npm run figma:print > scripts/figma/plugin/code.js
```

Then in the Figma desktop app: Plugins, Development, Import plugin from manifest, and pick
`scripts/figma/plugin/manifest.json`. Run it in the file where okchroma's extended plugin
has written the variables. The plugin closes with a summary of what it created, updated,
skipped and could not find. `code.js` is generated and not committed.
