# Speed Pro — Phase 2 Expansion Plan

## Current State Audit

✅ **Already Built**: Multi-page routing, Layout with sidebar, Home (Speed Test), BDIX Hub, ISP Packages, Tools (IP Check, DNS, Bandwidth), Outages, Rankings, Coverage, Blog Pages  
❌ **Missing**: Recharts charts on key pages, design consistency, icon lib, mobile responsiveness, component refactoring  
⚠️ **Needs Update**: `public/data` files need enrichment from scrapped data  

---

## 1. Blog / SEO Pages — ✅ BUILT

Blog pages (`Blog.tsx` and `BlogPost.tsx`) have been created along with their routing in `App.tsx` and navigation in `Layout.tsx`. The content is driven by JSON data.

---

## 2. Public Data Updates (scrapped → data)

The `/public/scrapped/` files contain raw HTML from a Google Sites page listing BD ISP FTP server links. Key URLs found:
- `bdixtools.com`, `bdix.website`, `ftpbd.com` ecosystem servers  
- Hundreds of ISP-specific FTP URLs categorized by ISP name  

### `bdix-servers.json` Enhancements
- Add 15+ more servers from scrapped data (currently 22, expand to ~40)  
- Add new fields: `ispSpecific`, `ispName`, `speedTier`, `contentRating`  
- Add new categories: `ISP-Specific` (servers tied to one ISP)  

### `isp-packages.json` Enhancements  
- Add 3 more ISPs: Link3 Technologies, Carnival Internet, Skyview Online  
- Add `socialProof`, `established`, `btrcLicensed` fields  
- Add Dhaka-wide coverage (not just Mirpur) for broader SEO  

---

## 3. Recharts Integration (recharts already installed v3.2.1)

The `recharts/` folder in the project root is the **recharts library source** (cloned repo), not our app code. `recharts` is already in `package.json` as a dependency (`^3.2.1`).

### Charts to add across pages:
| Page | Chart Type | Purpose |
|------|-----------|---------|
| Rankings | `AreaChart` | Monthly avg speed trend per ISP |
| Rankings | `RadarChart` | Multi-metric ISP comparison |
| Rankings | `BarChart` | Download vs Upload comparison |
| Home | `LineChart` | Speed test history sparkline |
| Packages | `RadialBarChart` | Value score visualization |
| Coverage | `PieChart` | ISP market share in Mirpur |
| Blog posts | `AreaChart` | Mirpur speed reports |

---

## 4. Creative Strategy — Becoming #1 ISP Consultant

### 🏆 "Speed Pro Intelligence" Features

#### A. Google Places API Integration (when key provided)
- `/isp-finder` page: Enter your address → show ISPs available at that exact location  
- Pull ISP business listings from Google Places API  
- Show photos, reviews, phone numbers, hours  
- **SEO**: "ISP near me Mirpur", "internet provider at my address"  

#### B. Live ISP Pricing Tracker
- Weekly scraping of ISP websites for price changes  
- "Price Alert" feature: Notify when your ISP changes rates  
- Historical price chart for each ISP  

#### C. AI-Powered ISP Advisor
- After speed test → contextual recommendation  
- "Based on your 12 Mbps result on a 50 Mbps plan: You're getting 24% of paid speed. Here are 3 ISPs with better real-world speeds in your area"  
- BTRC complaint template generator  

#### D. Community Reviews & Ratings
- Users rate their ISP (1-5 stars) + write micro-reviews  
- Stored in localStorage → exportable JSON  
- Aggregate visible on the Rankings and Packages pages  

#### E. ISP Outage Heatmap (Google Maps API)
- Real-time outage map overlaid on Mirpur/Dhaka  
- Community-reported outages show as red zones  
- **Requires Google Maps JavaScript API key**  

#### F. "ISP Report Card" Monthly PDF
- Auto-generated report card for each ISP  
- Shows: Avg speed, reliability %, complaint rate, price changes  
- Share-worthy → drives backlinks  

---

## 5. Scraping More ISP Packages

### Known ISPs to scrape/research:
- **Link3 Technologies** (link3.net) — major Dhaka ISP  
- **Carnival Internet** (carnival.com.bd)  
- **Skyview Online** — already appears in scrapped data  
- **Pradiger Net** — Mirpur coverage  
- **Shuttle Networks** — mid-tier Dhaka ISP  
- **Amber IT** — enterprise/residential  

Data to add to `isp-packages.json`:
- Actual package names, speeds, prices (from their websites)  
- Customer service contacts  
- BTRC license numbers (public data)  

---

## 6. Design System Fix + HugeIcons

### Problems Identified
- **Rankings**: Uses plain `bg-white` cards without the dark gradient design system  
- **Outages**: Minimal, lacks premium feel  
- **Tools subpages** (DNS, Bandwidth, IPCheck): Basic layout, no theming  
- **Coverage**: Doesn't match the indigo/violet design of Home  

### Solution
1. Install `@hugeicons/core-free-icons` and create an icon wrapper component (Done)  
2. Create a shared `design-tokens.css` with CSS variables  
3. Refactor all 10 pages to use consistent:
   - Dark gradient header sections  
   - Indigo/violet accent colors  
   - Glassmorphism cards  
   - Consistent typography scale  

---

## 7. Refactoring and Mobile Responsiveness (NEW)

### Problems Identified
- Files in `src/pages/` are very long (e.g., `Home.tsx` is >24KB, `Coverage.tsx` is >14KB).
- Reusability of UI components is low.
- Mobile responsiveness needs to be robust across all layouts.

### Solution
1. **Component Extraction**: Break down large page files into smaller, reusable components inside `src/components/` (e.g., Cards, Charts, Header Sections, Modals).
2. **Mobile First Design**: Ensure all views use Tailwind's responsive utilities (`md:`, `lg:`) to provide an excellent experience on small screens.

---

## Execution Order

```text
[x] Step 1: Install @hugeicons/core-free-icons
[x] Step 4: Create Blog.tsx + BlogPost.tsx pages + JSON content
[x] Step 5: Update App.tsx routing for /blog and /blog/:slug
[x] Step 7: Update Layout.tsx to add Blog nav item
[ ] Step 2: Enrich public/data JSON files (bdix + packages)  
[ ] Step 3: Add Recharts to Rankings, Home history, Packages  
[ ] Step 6: Fix design consistency on all pages  
[ ] Step 8: Refactor pages into smaller, reusable components (No long files)
[ ] Step 9: Ensure robust mobile responsiveness across the entire app
[ ] Step 10: Plan for API integrations (Google Maps, Places)  
```

---

## Open Questions

> [!IMPORTANT]
> **Google Maps/Places API Key**: Ready to provide when needed. Which features should we prioritize first?
> - ISP Outage Heatmap (Maps JS API)  
> - ISP Finder by Address (Places API)  
> - Both?

> [!TIP]
> The `recharts` package is **already installed** — no `npm install recharts` needed. The `/recharts` folder in the project root is the recharts GitHub source (separate clone), not related to our app.
