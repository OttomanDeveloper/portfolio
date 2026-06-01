// src/data/stack.ts
export const stack = [
  { category: 'Languages',  chips: ['Dart', 'Swift', 'Kotlin', 'PHP', 'JavaScript', 'Java', 'SQL'] },
  { category: 'Frameworks', chips: ['Flutter (Android, iOS, Web, Desktop)', 'Laravel', 'Node.js'] },
  { category: 'State Mgmt', chips: ['BLoC / Cubit', 'GetX', 'Provider', 'ValueNotifier'] },
  { category: 'Backend',    chips: ['Firebase', 'Supabase', 'PostgreSQL', 'MySQL', 'Hive', 'Isar', 'SQLite'] },
  { category: 'APIs',       chips: ['REST', 'FCM HTTP v1', 'OpenCart', 'YouTube V3', 'Google Maps'] },
  { category: 'Hardware',   chips: ['Bluetooth Low Energy (BLE)', 'Health Device Sync'] },
  { category: 'AI/ML',      chips: ['Gemini AI', 'MediaPipe', 'Google ML Kit', 'TFLite', 'On-Device Inference'] },
  { category: 'Vision',     chips: ['Hand Gesture Recognition', 'Facial Emotion Detection', 'Face Contours'] },
  { category: 'Tools',      chips: ['Figma', 'Postman', 'Google Cloud', 'Git', 'Bitbucket'] },
] as const;
