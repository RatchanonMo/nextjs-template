# TaskFlow Mobile (Expo + TypeScript)

React Native client for TaskFlow web parity (admin excluded), built with Expo and pnpm.

## Stack

- Expo SDK 54
- React Native + TypeScript
- React Navigation (stack + tabs)
- TanStack Query with AsyncStorage persistence
- Offline mutation queue with automatic sync on reconnect
- Zustand for auth and app network state

## Run (Android)

1. Install dependencies

```bash
pnpm install
```

2. Start Expo for Android

```bash
pnpm android
```

## API configuration

Set `EXPO_PUBLIC_API_BASE_URL` in your shell or `.env` if you are not using local defaults.

Examples:

- Android emulator: `http://10.0.2.2:5001/api`
- iOS simulator: `http://localhost:5001/api`
- Real device: your machine LAN IP, for example `http://192.168.1.10:5001/api`

If the variable is not set, the app defaults to Android emulator localhost mapping on Android and regular localhost on other platforms.

## Architecture

- `app/`: Expo Router entry that mounts the app shell
- `src/navigation/`: Auth and tab navigation
- `src/features/`: Domain screens (tasks, projects, analytics, settings, auth)
- `src/providers/`: Query cache and network lifecycle orchestration
- `src/offline/`: queue persistence and sync manager
- `src/api/`: typed API clients
