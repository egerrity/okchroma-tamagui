// Tamagui reads its target from the environment; Expo Go has no build step to set it, so
// the value is inlined at transform time. The optimizing compiler is not used.
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [['transform-inline-environment-variables', { include: ['TAMAGUI_TARGET', 'EXPO_PUBLIC_THEME_SOURCE'] }]],
  }
}
