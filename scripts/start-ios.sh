#!/bin/sh
# Starts the Expo dev server for the native app. Opening the app in the iOS
# simulator is a separate step (Expo Go, `xcrun simctl openurl booted
# exp://127.0.0.1:8081`), so a slow simulator boot cannot take the server down.
# Points the toolchain at Xcode when the command-line tools selection still
# names the standalone tools, so no sudo is needed.
set -e
if [ "$(xcode-select -p 2>/dev/null)" = "/Library/Developer/CommandLineTools" ] && [ -d /Applications/Xcode.app/Contents/Developer ]; then
  export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
fi
cd "$(dirname "$0")/../apps/native"
export TAMAGUI_TARGET=native
exec npx expo start --port 8081
