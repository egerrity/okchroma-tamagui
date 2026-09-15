// Metro in an npm workspace: watch the repository root so the theme package resolves, and
// look up modules from the root's node_modules, where npm hoists them.
const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

const root = path.resolve(__dirname, '../..')
const config = getDefaultConfig(__dirname)

config.watchFolders = [root]
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules'), path.resolve(root, 'node_modules')]
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs']

module.exports = config
