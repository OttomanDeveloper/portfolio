// src/data/stack.ts
export const stack = [
  { category: 'core',         chips: ['Dart', 'Flutter', 'iOS', 'Android', 'Web', 'Desktop'] },
  { category: 'state-mgmt',   chips: ['BLoC / Cubit', 'GetX', 'Provider'] },
  { category: 'ai',           chips: ['Gemini', 'on-device LLM', 'LLM API integration'] },
  { category: 'backend',      chips: ['Firebase', 'Supabase', 'PostgreSQL', 'MySQL', 'Hive', 'Isar', 'SQLite'] },
  { category: 'integrations', chips: ['BLE (flutter_blue_plus)', 'FCM HTTP v1', 'OpenCart', 'YouTube v3', 'OneSignal', 'AdMob', 'AppLovin'] },
  { category: 'languages',    chips: ['Dart', 'Kotlin (basic)', 'JavaScript', 'PHP', 'SQL'] },
  { category: 'tools',        chips: ['Figma', 'Postman', 'Git/GitHub', 'Bitbucket', 'GCP', 'Play Store'] },
] as const;
