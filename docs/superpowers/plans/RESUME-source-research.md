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

## Generated SVG mockups (for projects with NO real screenshots) — APPROVED + VALIDATED
For projects that have no real screenshots in their repo, generate **hand-designed SVG screen
mockups** rendered to AVIF — NOT fabricated photo-screenshots. Rules:
- **Faithful to each app's REAL design**: pull the app's real theme colours, screen names, nav
  structure and features from its source (theme files, lib/, README) and mock 2-4 key screens in
  that style. They are honest *representations* of real work, grounded in the code — not invented UI.
- Match existing sizes: **phone 540×1200**, web **1280×620**.
- Pipeline (validated — sharp rasterizes SVG; Segoe UI/Arial fonts render fine):
  ```js
  // write screen as <svg width=540 height=1200 ...> with the app's real colours/labels
  await sharp(svgPathOrBuffer).resize(540,1200).avif({quality:70,effort:6}).toFile(out);
  ```
- Keep a consistent device-screen layout (status bar, app bar, content, bottom nav) but themed per app.
- Honesty: these are designed mockups, not literal captures — fine for a portfolio when accurate.

## Screenshot crop recipe (real framed mockups in repos)
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

## How to run a batch (command: "Continue source research — Batch N")
For EACH project in the batch, do all of:
1. **Research the source deeply**: `pubspec.yaml` (real deps → tech stack), `README.md`,
   `lib/` structure, Android `android:label` (real app name), theme files (real brand colours),
   `assets/` (real screenshots? often device-framed in `assets/onboarding` or `assets/screenshots`).
2. **Write accurate data** into `src/data/showcase.ts` (new entry) or update the existing entry.
   Use the `ShowcaseProject` schema. Team projects → reflect in `role` + `description`.
3. **Screenshots**:
   - If real images exist in the repo → crop (remove frame/bg) + resize to 540px wide, AVIF.
   - Else → generate 2-4 faithful **SVG mockups** themed in the app's REAL colours (see method
     above) → AVIF at 540×1200 (phone) / 1280×620 (web). Never fabricate photo-screenshots.
   - Name files `slug_screen.avif` in `public/screens/`.
4. **Wire-in**: add to `GROUPS` (filter bucket) in SelectedWork.astro; if promoting from
   `moreApps.ts`, remove the moreApps duplicate; if it ties to an Experience entry, keep names
   consistent. Decide featured vs grid (default: grid, `featured:false`).
5. **Verify**: `npm run build` clean, screens referenced exist, 0 JS. **Commit** (plain message,
   NO Claude attribution). Tick the batch box below.

Default filter buckets: rewards · media · web · health · social · other ("Commerce & More").
Add a new bucket only if a batch introduces a clearly distinct category (update FILTERS + the 3
CSS selector groups + GROUPS together).

## BATCH PLAN

### Batch 1 ✅ DONE — Homy
`D:/ClientProjects/arslan_saudia/Copy of homy/homy` → new `homy` (grid). Team of 2 (backend + me).
HomyKSA exp tie. 3 real screenshots (homy_services/order/map.avif). Committed.

### Batch 2 — Experience-tied commerce & logistics (NEW + enrich couriergo)
- `D:/ClientProjects/rossdonaldson/youshopper_app` (customer_app_source / seller_app_source /
  delivery_app_source) → NEW `youshopper`. Tie: **SD Cold Logistics · YouShopper** exp (3 apps live,
  coin monetisation, OneSignal, YouTube V3). Remove "YouShopper"/"YouShopper Seller" from moreApps.ts.
- `D:/ClientProjects/VeignLaos` (courier_pro/courier_pro, shipox, ecommerce, Customer/CustomerApp) →
  **enrich existing `couriergo`** (Fulfil Supply Chain; ShipOX; cross-border China/Laos/Thailand).
  Add screens if any real ones; else SVG mockups in ShipOX colours.
- `D:/ClientProjects/nakoda_urban_services/customer` → NEW `nakoda` (India home services). Remove
  "Nakoda Urban" from moreApps.ts. 5 repo imgs — check if real screenshots.

### Batch 3 — New consumer apps
- `D:/ClientProjects/muhammad_arab/daghta` → NEW `daghta` (4 imgs — inspect). Research what it is.
- `D:/ClientProjects/bestonlinegames` → NEW `puzzleur` (label "Puzzleur"; online games hub).
- `D:/FlutterProject/blooddonation` → NEW `blood-donors` (label "Blood Donors 243 GB"; emergency
  blood locator). Remove "Blood Donors" from moreApps.ts.
- `D:/FlutterProject/snaptok` → NEW `snaptok` (label "SnapTok"; research — TikTok tools/downloader).

### Batch 4 — New multi-app systems
- `D:/FlutterProject/globalnetwork` (network + network_admin; has Document.pdf + Project Details.docx
  → read for spec) → NEW `globalnetwork`.
- `D:/FlutterProject/calculator-aliRaza` (calculator + adminpanel) → NEW `calculator`.
- `D:/ClientProjects/yashwant_gound` (meesho_e-commerce + admin) → NEW `meesho-clone`.

### Batch 5 — Enrich rewards/earning (existing) + admins
- `D:/ClientProjects/tech_gayan_vishal_india/three_lucky_spin_mining` → enrich `lucky-spin`
  (**label "Egg Network"** + mining mechanic — verify/correct the entry).
- `D:/FlutterProject/wish_coin` (+ `D:/FlutterProject/wishadmin`) → enrich `wisbig` (+admin panel).
- `D:/FlutterProject/probooster` (+ `D:/FlutterProject/adminpanelprobooster`) → enrich `yt-master`.

### Batch 6 — Enrich downloaders/media (existing)
- `D:/FlutterProject/saveit` → enrich `saveit` (17 repo imgs — likely real screenshots to add).
- `D:/FlutterProject/fbsaver` → enrich `movo-downloader`.
- `D:/statusgetter` → enrich `status-saver`.
- `D:/ClientProjects/fahad_hanif/udownload` → enrich `udownload`.

### Batch 7 — Enrich social/utility (existing) + admins
- `D:/FlutterProject/grouper` (+ `grouper_admin`) → enrich `grouper`.
- `D:/FlutterProject/footballwallpaper` (+ `WallpaperAdmin`) → enrich `football-wallpaper`.
- `D:/FlutterProject/bill_checker` → enrich `bill-checker`.
- `D:/ClientProjects/hostelfinder` (+ `D:/ClientProjects/adminhostelfinder`) → enrich `hostel-finder`.
- `D:/ClientProjects/fahad_hanif/meetbook` (dating_app + meetbook_admin) → enrich `meetbook`.

### Batch 8 — Enrich health/web (existing)
- `D:/ClientProjects/icare` → enrich `icare` (39 repo imgs — inspect for real screenshots).
- `D:/ClientProjects/smriit_canada/lifelink` → light pass on `lifelink` (already enriched).
- `D:/ClientProjects/safeandromeda` → enrich `chronos`.
- `D:/ClientProjects/PiggyProject/piggytoken` → enrich `babypig`.

## Schema reminder
Use the `ShowcaseProject` type in showcase.ts (slug, name, packageId, year, role, client, category,
tagline, description, motive, techStack, features, status, storeLink, githubLink, liveLink?, caseHref?,
web?, screens[], featured). For team projects add the team note in `role`/`description`.
Featured carousel cards are hardcoded in FeaturedProjects.astro; grid is data-driven from showcase.ts
(includeFeatured on /projects). Filter buckets + FEATURED_SLUGS live in SelectedWork.astro.
