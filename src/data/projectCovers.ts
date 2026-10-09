// Editorial cover copy is derived from the researched showcase entries.
// Scenes are shared by domain; headlines, screens, accents and proof are project-specific.
export type ProjectCover = {
  scene: string;
  headline: string;
  summary: string;
  proof: string;
  accent: string;
  screen?: string;
  layout?: 'single' | 'duo' | 'flat' | 'web';
};

export const projectCovers: Record<string, ProjectCover> = {
  'legend-tv': { scene: 'cinema', headline: 'Stories in your language.', summary: 'Turkish series and films. An Urdu-first streaming experience.', proof: '600K peak users · Built solo', accent: '#efc477', screen: 'legend_home.avif', layout: 'duo' },
  lifelink: { scene: 'wellness', headline: 'Support within reach.', summary: 'Find crisis support, track your wellbeing, and make room for reflection.', proof: 'Crisis directory · Gemini poetry', accent: '#a2dfd9', screen: 'lifelink_support.avif' },
  icare: { scene: 'wellness', headline: 'A little space for yourself.', summary: 'Breathe, journal, and check in with your mood. In private.', proof: 'Meditation · Mood · Private diary', accent: '#bce1c0', screen: 'icare_home.avif', layout: 'duo' },
  alcopass: { scene: 'breathalyzer', headline: 'From breath to insight.', summary: 'A guided Bluetooth breathalyzer experience with clear results.', proof: 'AlcoPass C1 · BLE connection', accent: '#c8df8b', screen: 'alcopass_result.avif' },
  udownload: { scene: 'creator', headline: 'Watch now. Keep for later.', summary: 'Browse videos, choose your quality, and take your library offline.', proof: 'Open source · Native playback', accent: '#a9dcdc', screen: 'udownload_home.avif', layout: 'duo' },
  chronos: { scene: 'chronos', headline: 'The universe, one scroll away.', summary: 'Journey through nine cosmic eras, painted entirely in Flutter.', proof: '30+ CustomPainters · 60 fps', accent: '#d1c3ff', layout: 'web' },
  babypig: { scene: 'babypig', headline: 'A community brought to life.', summary: 'An animated token landing page built entirely in Flutter Web.', proof: '9 sections · Custom animation', accent: '#ffbfd0', layout: 'web' },
  homy: { scene: 'services', headline: 'A helping hand for home.', summary: 'Book home-service professionals across Saudi Arabia and follow your job live.', proof: 'Live tracking · English / Arabic', accent: '#ecc49d', screen: 'homy_services.avif' },
  grouper: { scene: 'social', headline: 'Find your people.', summary: 'Discover WhatsApp groups by interest, with community scam reporting.', proof: 'Discover · Join · Report', accent: '#a2dfd9', screen: 'grouper_home.avif', layout: 'duo' },
  'bill-checker': { scene: 'utility', headline: 'Every bill. One place.', summary: 'Electricity, gas, phone, and water portals across Pakistan.', proof: 'Regional providers · Dual theme', accent: '#b9d7ee', screen: 'billchecker_home.avif', layout: 'flat' },
  'status-saver': { scene: 'creator', headline: 'Keep the moments you love.', summary: 'Save WhatsApp statuses or download a video from its link.', proof: 'Android SAF · Quality selection', accent: '#b6e2b4', screen: 'statussaver_grid.avif', layout: 'duo' },
  wisbig: { scene: 'rewards', headline: 'Engagement meets rewards.', summary: 'A social app with a WIS token wallet, referrals, and activity rewards.', proof: 'Social feed · Wallet · Admin app', accent: '#e4c292', screen: 'wisbig_home.avif' },
  'football-wallpaper': { scene: 'football', headline: 'Your club. Your screen.', summary: 'Browse football stars and give your phone a new match-day look.', proof: 'Browse · Download · Set wallpaper', accent: '#b7dc9a', screen: 'football_wp_grid.avif', layout: 'flat' },
  rewardpay: { scene: 'rewards', headline: 'An economy of everyday tasks.', summary: 'Daily activity targets, a Power wallet, and multiple exchange options.', proof: 'Daily progress · Currency exchange', accent: '#e5c181', screen: 'rewardpay_dashboard.avif' },
  'egg-network': { scene: 'rewards', headline: 'Tap. Mine. Explore.', summary: 'Passive coin sessions with spin, scratch, and visit tasks.', proof: 'Mining sessions · Local payouts', accent: '#f0d588', screen: 'eggnetwork_home.avif', layout: 'duo' },
  saveit: { scene: 'creator', headline: 'One link. Your next download.', summary: 'Save video or audio from more than fifteen supported networks.', proof: 'HD / SD video · MP3 audio', accent: '#e9b988', screen: 'saveit_home.avif' },
  tfpdl: { scene: 'cinema', headline: 'Find your next watch.', summary: 'Explore movie and TV releases, with search and subtitle downloads.', proof: 'Release feed · Movies · TV shows', accent: '#e8b29b', screen: 'tfpdl_movies.avif', layout: 'duo' },
  'allinone-game': { scene: 'games', headline: 'Many games. One playground.', summary: 'Explore a collection of casual HTML5 games in a single app.', proof: 'Game catalogue · WebView play', accent: '#c2bdff', screen: 'allinone_game_grid.avif', layout: 'flat' },
  'movo-downloader': { scene: 'creator', headline: 'Your videos, saved your way.', summary: 'A multi-platform downloader with language and theme choices.', proof: 'English / Hindi · Light / dark', accent: '#b5c6f0', screen: 'movo_home.avif' },
  'hostel-finder': { scene: 'hostel', headline: 'Find a place to settle in.', summary: 'A searchable hostel directory with a companion app for listing management.', proof: 'Hostel listings · Admin workflow', accent: '#efd2a6', screen: 'hostel_finder_listings.avif', layout: 'flat' },
  meetbook: { scene: 'social', headline: 'Start with a connection.', summary: 'Browse profiles, choose your visibility, and meet new people.', proof: 'Profiles · Privacy · Moderation', accent: '#edb5ce', screen: 'meetbook_home.avif', layout: 'duo' },
  'yt-master': { scene: 'creator', headline: 'A marketplace for creators.', summary: 'YouTube campaigns and an API-verified coin economy in one app.', proof: 'Verified tasks · Campaign settlement', accent: '#efb7ac', screen: 'yt_master_home.avif', layout: 'duo' },
  'trust-earning': { scene: 'rewards', headline: 'A complete account journey.', summary: 'Investment-package browsing, payment receipts, and OTP onboarding.', proof: 'Packages · Receipts · Account security', accent: '#d6c49b', screen: 'trust_earning_home.avif' },
  'quiz-news-rewards': { scene: 'rewards', headline: 'Read. Think. Collect points.', summary: 'News and quizzes come together in a points-based rewards app.', proof: 'News feed · Quizzes · Points wallet', accent: '#d8cf9b', screen: 'quiz_news_home.avif', layout: 'flat' },
  couriergo: { scene: 'logistics', headline: 'Across borders. In your hands.', summary: 'Book parcels and follow their journey across Southeast Asia.', proof: 'International addresses · Parcel tracking', accent: '#f0bc8c', screen: 'couriergo_home.avif', layout: 'duo' },
  youshopper: { scene: 'commerce', headline: 'Shop. Sell. Deliver.', summary: 'A multi-vendor marketplace connecting customers, sellers, and delivery teams.', proof: '3 connected apps · Multiple gateways', accent: '#eebcbe', screen: 'youshopper_home.avif', layout: 'duo' },
  nakoda: { scene: 'services', headline: 'Home care, a tap away.', summary: 'Book cleaning, AC, and pest-control services across India.', proof: 'Service discovery · Booking flow', accent: '#e8cd95', screen: 'nakoda_home.avif' },
  daghta: { scene: 'creator', headline: 'Download. Organize. Enjoy.', summary: 'An Arabic-first media downloader with a built-in file manager.', proof: 'Arabic interface · In-app browser', accent: '#a8d9df', screen: 'daghta_home.avif', layout: 'flat' },
  puzzleur: { scene: 'games', headline: 'A quick break. A new game.', summary: 'Discover and play a changing catalogue of instant HTML5 games.', proof: 'Instant play · Dynamic catalogue', accent: '#c9bcf2', screen: 'puzzleur_home.avif', layout: 'duo' },
  'blood-donors': { scene: 'donors', headline: 'A donor closer to you.', summary: 'Find nearby blood donors in rural Pakistan, even with limited connectivity.', proof: 'Offline-first · One-tap contact', accent: '#f2b8b3', screen: 'blooddonors_home.avif' },
  snaptok: { scene: 'creator', headline: 'Paste a link. Keep a video.', summary: 'Download without watermarks, preview, and organize your saved media.', proof: 'Clipboard detection · Video preview', accent: '#b5d4ed', screen: 'snaptok_home.avif', layout: 'duo' },
  'asan-digital': { scene: 'rewards', headline: 'Wallet, tasks, and packages.', summary: 'An account dashboard with earning activities and admin-managed payment methods.', proof: 'PKR wallet · Tasks · Admin panel', accent: '#b3dcba', screen: 'asandigital_home.avif' },
  calculator: { scene: 'utility', headline: 'Everyday math. Extra precision.', summary: 'A Material You calculator with scientific mode and persistent history.', proof: 'Open source · Cross-platform', accent: '#c5d6f1', screen: 'calc_main_dark.avif', layout: 'flat' },
  'meesho-clone': { scene: 'commerce', headline: 'From discovery to delivery.', summary: 'A multi-store shopping experience with product reviews, cart, and checkout.', proof: 'Supabase · Marketplace + admin', accent: '#e9b6d3', screen: 'meesho_home.avif', layout: 'duo' },
};
