// src/data/openSource.ts
export const openSource = [
  {
    name: 'firebase_admin_sdk',
    href: 'https://pub.dev/packages/firebase_admin_sdk',
    desc: 'Comprehensive Firebase Admin SDK for Dart — Firestore, Auth, FCM, Cloud Storage, Security Rules.',
    highlight: 'Later officially taken over by the Google Dart & Flutter team.',
    badge: '★ ADOPTED BY GOOGLE',
    featured: true,
    stats: null as null | { likes: number; downloads: string },
  },
  {
    name: 'firebase_cloud_messaging_dart',
    href: 'https://pub.dev/packages/firebase_cloud_messaging_dart',
    desc: 'Zero-dependency FCM HTTP v1 sender — works in Flutter, Serverpod, CLI, Cloud Run with ADC, structured errors, retries.',
    highlight: null,
    badge: null,
    featured: false,
    stats: { likes: 17, downloads: '371+' },
  },
] as const;
