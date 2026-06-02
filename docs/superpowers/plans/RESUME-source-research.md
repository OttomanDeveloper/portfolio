# Resume: Source-code project research (deep enrichment + new projects)

Big multi-session task: research the user's actual Flutter source repos to (a) enrich existing
showcase entries with accurate data and (b) add new projects. Some tie to the Experience section.

## Decisions (locked by user)
- **Screenshots: real images only.** NEVER fabricate/generate app screenshots. Use real
  screenshots found in repos (often device-framed mockups in `assets/onboarding/` or
  `assets/screenshots/`, or resource repos). Projects with NO real images get a clean
  **no-screenshot card** (icon/gradient + rich text) — do not invent UI.
- **Full per-project**: complete each project (data + images) in batches of ~3-5 per session.
- Match existing AVIF sizes: phone screens **540px wide**, crop framed mockups to full-bleed first.
- Save accurate data in `src/data/showcase.ts` (we need the info later).

## Screenshot crop recipe (framed mockups)
Many repo images are device-framed phone mockups on a solid bg. Crop the frame/bg, then resize:
```js
import sharp from 'sharp';
// detect bg corner colour + scan for content bbox, OR reuse a known rect.
// Earlier green/teal mockups used rect {left:48, top:128, width:1190, height:2522} on 1284x2778.
// Homy/others differ (white bg) — measure per template.
await sharp(src).extract(rect).resize({width:540}).avif({quality:65,effort:6}).toFile(out);
```
Web (landscape) screens: resize width ~1280, no crop.

## Source path → showcase mapping

### Enrich EXISTING entries (already in showcase.ts)
| Source | Existing slug | Notes |
|---|---|---|
| D:/ClientProjects/icare | icare | label "iCare"; 39 asset imgs (mostly app assets) |
| D:/ClientProjects/fahad_hanif/udownload | udownload | |
| D:/ClientProjects/hostelfinder (+ adminhostelfinder) | hostel-finder | two-app: user + "Hostel Admin" |
| D:/ClientProjects/fahad_hanif/meetbook (dating_app + meetbook_admin) | meetbook | monorepo: dating_app/dating_app + meetbook_admin |
| D:/DemoProject/meetbook_admin/meetbook_admin | meetbook | admin companion |
| D:/ClientProjects/smriit_canada/lifelink | lifelink | already enriched; 8 imgs |
| D:/ClientProjects/tech_gayan_vishal_india/three_lucky_spin_mining | lucky-spin | **label "Egg Network"** + mining — verify/correct |
| D:/FlutterProject/bill_checker | bill-checker | |
| D:/FlutterProject/fbsaver | movo-downloader | pkg com.fbsaver.fbsaver = Movo |
| D:/FlutterProject/footballwallpaper (+ WallpaperAdmin) | football-wallpaper | + admin companion |
| D:/FlutterProject/grouper (+ grouper_admin) | grouper | label "Social Groups" + admin |
| D:/FlutterProject/probooster (+ adminpanelprobooster) | yt-master | label "YT Master" + "YT Master Admin" |
| D:/FlutterProject/saveit | saveit | **17 imgs** (likely real screenshots) |
| D:/FlutterProject/wish_coin (+ wishadmin) | wisbig | label "WisBig Reward" + "Wish Admin" |
| D:/statusgetter | status-saver | label "Status Getter" |
| D:/ClientProjects/safeandromeda | chronos | **Chronos source** (andro_meda); label "Chronos" |
| D:/ClientProjects/PiggyProject/piggytoken | babypig | label "Piggy Token" |

### NEW projects to add
| Source | Proposed slug | Notes / experience tie |
|---|---|---|
| D:/ClientProjects/arslan_saudia/Copy of homy/homy | homy | **HomyKSA** exp tie (May–Oct 2022). **TEAM project**: 1 backend dev + Flutter (user). Home-services marketplace KSA, STC Pay, OneSignal, Google sign-in. Real framed screenshots in assets/onboarding (services, orderpayment, map). |
| D:/ClientProjects/muhammad_arab/daghta | daghta | label "Daghta"; 4 imgs. Research. |
| D:/ClientProjects/nakoda_urban_services/customer | nakoda | label "Nakoda"; 5 imgs. In moreApps ("Nakoda Urban", India home services). Promote. |
| D:/ClientProjects/rossdonaldson/youshopper_app (customer/seller/delivery) | youshopper | **SD Cold Logistics · YouShopper** exp tie (Nov 2022–May 2023). 3 apps all live. In moreApps. |
| D:/ClientProjects/bestonlinegames | puzzleur | label "Puzzleur". Online games hub. |
| D:/FlutterProject/blooddonation | blood-donors | label "Blood Donors 243 GB". In moreApps. Emergency blood locator. |
| D:/FlutterProject/snaptok | snaptok | label "SnapTok". TikTok-style/downloader — research. |
| D:/FlutterProject/globalnetwork (network + network_admin) | globalnetwork | has Document.pdf + Project Details.docx for spec. |
| D:/FlutterProject/calculator-aliRaza (calculator + adminpanel) | calculator | calculator + admin panel. |
| D:/ClientProjects/VeignLaos (courier_pro / shipox / ecommerce / Customer) | veign-laos OR fold into couriergo | **Fulfil Supply Chain** exp tie. ShipOX/courier — likely same family as existing `couriergo`. Decide: enrich couriergo vs new entry. |
| D:/ClientProjects/yashwant_gound (meesho_e-commerce + admin) | meesho-clone | Meesho-style e-commerce + admin. Research. |

## Experience ties (src/data/experience.ts)
- **HomyKSA** (May–Oct 2022) ↔ homy
- **SD Cold Logistics · YouShopper** (Nov 2022–May 2023) ↔ youshopper (3 apps)
- **Fulfil Supply Chain** (Sep 2021–Mar 2023) ↔ couriergo / VeignLaos (cross-border, OpenCart API)
- BeInMedia · Nmo AI (current) ↔ not in this source list (the BLE fitness app)
- Consider linking project cards ↔ experience entries (e.g. a small "part of <company>" line).

## Per-project status
- [ ] homy (Batch 1 — in progress)
- [ ] youshopper, veign-laos/couriergo (experience-tied logistics/commerce)
- [ ] nakoda, daghta, blood-donors, puzzleur, snaptok, globalnetwork, calculator, meesho-clone (new)
- [ ] enrich: lucky-spin (Egg Network), saveit, wisbig(+admin), grouper(+admin), yt-master(+admin),
      football-wallpaper(+admin), movo(fbsaver), bill-checker, hostel-finder(+admin), meetbook(+admin),
      icare, udownload, status-saver, chronos, babypig

## Schema reminder
Use the `ShowcaseProject` type in showcase.ts (slug, name, packageId, year, role, client, category,
tagline, description, motive, techStack, features, status, storeLink, githubLink, liveLink?, caseHref?,
web?, screens[], featured). For team projects add the team note in `role`/`description`.
Featured carousel cards are hardcoded in FeaturedProjects.astro; grid is data-driven from showcase.ts
(includeFeatured on /projects). Filter buckets + FEATURED_SLUGS live in SelectedWork.astro.
