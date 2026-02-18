# Calm & Bloom -- Etsy Listing Specifications

> **Last updated:** 2026-02-17
> **Status:** Pre-launch
> **Owner:** Shelzy's Designs

---

## Product Overview

| Field | Value |
|-------|-------|
| **Product Name** | Calm & Bloom -- 60-Page Printable Self-Care & Anxiety Relief Journal Bundle |
| **Type** | Digital Download |
| **SKU** | CALM-BLOOM-JOURNAL-V1 |
| **Listing Price** | $12.97 |
| **Compare-at Price** | $19.97 |
| **Perceived Discount** | 35% off |
| **Shop Section** | Printable Journals & Planners |
| **Processing Time** | Instant download |

---

## File Delivery Specs

**Delivery format:** ZIP file containing all digital assets

| File Name | Size | Pages/Items | Notes |
|-----------|------|-------------|-------|
| `Calm-and-Bloom-Journal-USLetter.pdf` | 8.5 x 11" | 60+ pages | US Letter format |
| `Calm-and-Bloom-Journal-A4.pdf` | 210 x 297mm | 60+ pages | International A4 format |
| `Calm-and-Bloom-Affirmation-Cards.pdf` | 8.5 x 11" sheets | 30 cards | Cut-apart card sheets |
| `Calm-and-Bloom-Wall-Art-8x10.pdf` | 8 x 10" | 5 prints | Standard frame size |
| `Calm-and-Bloom-Wall-Art-11x14.pdf` | 11 x 14" | 5 prints | Medium frame size |
| `Calm-and-Bloom-Wall-Art-16x20.pdf` | 16 x 20" | 5 prints | Large frame size |
| `Calm-and-Bloom-Printing-Guide.pdf` | 8.5 x 11" | Multi-page | Setup and printing instructions |

**Total file size estimate:** ~15-25 MB (within Etsy's 20MB per file limit; use multiple ZIP files if needed)

**Important:** Etsy allows up to 5 digital files per listing. If the total exceeds 20MB per file, split into:
- `Calm-and-Bloom-Journal-Bundle.zip` (both journal PDFs + printing guide)
- `Calm-and-Bloom-Cards-and-Art.zip` (affirmation cards + all wall art sizes)

---

## Etsy Image Specs

| Spec | Value |
|------|-------|
| Number of images | 10 (of 20 max slots) |
| Dimensions | 2000 x 2000px (1:1 square) |
| Format | JPG, sRGB color profile |
| File size | Under 1MB each |
| Resolution | 72 PPI |
| Thumbnail | Auto-generated 570 x 456px |

### Image Slot Assignments

| Slot | Content | Purpose |
|------|---------|---------|
| 1 | **Hero/Thumbnail** -- flat lay product shot | First impression; drives click-through rate |
| 2 | **What's Included** overview | Shows full bundle contents at a glance |
| 3 | **Journal interior** -- mood tracker spread | Demonstrates page quality and design |
| 4 | **Affirmation cards** display | Highlights bonus cards with readable text |
| 5 | **Wall art** room mockup | Shows art in real-life setting |
| 6 | **Lifestyle** -- woman using journal | Emotional connection and aspirational use |
| 7 | **Close-up detail** shot | Showcases design quality, typography, textures |
| 8 | **Anxiety toolkit** pages | Highlights therapeutic content and exercises |
| 9 | **Bundle value** shot | Emphasizes everything included for $12.97 |
| 10 | **Printing results / gifting** | Shows printed output; gift-giving use case |

### Image Design Guidelines

- Consistent warm cream (#FAF6F0) and sage green (#A8B5A2) color palette
- Playfair Display for headings; Lato or Open Sans for body text overlays
- Use drop shadows and perspective transforms for depth
- Include lifestyle props: eucalyptus sprigs, candles, cozy blankets, coffee cups
- Every image should include at least one keyword-relevant text overlay

---

## Etsy Video Specs

| Spec | Value |
|------|-------|
| Duration | 15 seconds |
| Resolution | 1080 x 1080px (1:1 square) |
| Frame rate | 30 FPS |
| Format | MP4 (H.264 codec) |
| Audio | None (Etsy prohibits audio on listing videos) |
| File size | Under 100MB |
| Content | Product showcase animation |

### Video Storyboard

| Time | Scene | Content |
|------|-------|---------|
| 0-3s | Title Reveal | "Calm & Bloom" title with botanical SVG wreath animation |
| 3-6s | Journal Showcase | 3 journal page thumbnails slide in (mood tracker, gratitude, anxiety toolkit) |
| 6-9s | Affirmation Cards | 5 cards fan out from center with staggered timing |
| 9-12s | Wall Art Gallery | 5 framed prints arrange into gallery wall layout |
| 12-15s | CTA & Value Props | Badges: "60+ Pages", "30 Cards", "5 Prints" + "Instant Download" |

**Production file:** `etsy-video.html` (self-contained HTML/CSS/JS animation)
**Export script:** `scripts/export-video.sh` (renders HTML to MP4 via headless Chrome + ffmpeg)

---

## SEO Strategy

### Title

**Formula:** `[Primary KW] | [Secondary KW] | [Descriptor Bundle]`

**Full Title (138 characters):**
```
Self Care Journal Printable | Anxiety Relief Planner | Mental Health Wellness Bundle Digital Download Affirmation Cards Wall Art
```

> Title is under the 140-character Etsy limit. Primary keywords are front-loaded for maximum search visibility.

### 13 Tags (max 20 characters each)

| # | Tag | Character Count |
|---|-----|-----------------|
| 1 | self care journal | 17 |
| 2 | anxiety journal | 15 |
| 3 | mental health planner | 21* |
| 4 | printable planner | 17 |
| 5 | wellness journal | 16 |
| 6 | self care printable | 19 |
| 7 | anxiety relief | 14 |
| 8 | gratitude journal | 17 |
| 9 | mindfulness planner | 19 |
| 10 | affirmation cards | 17 |
| 11 | self care bundle | 16 |
| 12 | therapy journal | 15 |
| 13 | digital planner | 15 |

> *Tag 3 is 21 characters -- trim to "mental health plan" (18 chars) if Etsy enforces the 20-char limit strictly.

### Category

**Primary:** Paper & Party Supplies > Paper > Journals & Planners

### Description SEO

**First 160 characters (search snippet):**
```
Calm & Bloom Self-Care Journal Bundle -- 60+ printable pages for anxiety relief, mood tracking, gratitude, and mindfulness. Includes 30 affirmation cards + 5 wall art prints.
```

> Front-load the highest-traffic keywords in the first sentence. Etsy uses the opening text for search ranking and the Google snippet.

### Long-tail Keyword Targets

- "printable self care journal for anxiety"
- "anxiety relief journal digital download"
- "mental health planner printable"
- "self care journal with affirmation cards"
- "printable wellness bundle"

---

## Pricing Strategy & Fee Breakdown

### Per-Sale Economics

| Item | Amount |
|------|--------|
| Listing price | $12.97 |
| Etsy listing fee | $0.20 |
| Etsy transaction fee (6.5%) | $0.84 |
| Etsy payment processing (3% + $0.25) | $0.64 |
| **Total Etsy fees per sale** | **$1.68** |
| **Net revenue per sale** | **$11.29** |
| **Profit margin** | **87%** |

### Break-Even Analysis

| Metric | Value |
|--------|-------|
| Design time investment | ~20-30 hours |
| Hourly rate target | $50/hr |
| Total investment at $50/hr | $1,250 |
| Sales to break even | 111 sales ($1,250 / $11.29) |
| At 5 sales/day | Break even in ~22 days |
| At 2 sales/day | Break even in ~56 days |

### Pricing Psychology

- **$12.97** ends in .97 (perceived as a deal vs. round numbers)
- **$19.97 compare-at** creates 35% perceived discount
- Below the $15 impulse-buy threshold for digital products
- Variation pricing creates anchoring effect (full bundle feels like best value)

---

## Variation Setup

| Variation | Price | SKU | Files Included |
|-----------|-------|-----|----------------|
| Full Bundle (Journal + Cards + Art + Guide) | $12.97 | CALM-BLOOM-FULL | All 7 PDFs |
| Journal Only | $8.97 | CALM-BLOOM-JOURNAL | US Letter + A4 journal PDFs + printing guide |
| Affirmation Cards Only | $4.97 | CALM-BLOOM-CARDS | Affirmation cards PDF + printing guide |

### Variation Notes

- Full Bundle is the default selection (best value messaging)
- Journal Only is priced to make the bundle feel like a steal (+$4 for cards + art)
- Cards Only targets gift-buyers and lower price-point browsers
- Each variation uses a separate set of digital files on Etsy

---

## Listing Renewal Strategy

| Setting | Value |
|---------|-------|
| Auto-renew | ON |
| Renewal fee | $0.20 per sale (auto-charged) |
| Listing expiration | 4 months if no sale |
| Manual renewal fee | $0.20 per renewal |

### Renewal Best Practices

- Keep auto-renew ON for consistent visibility
- If no sales after 4 months, refresh SEO (title, tags, images) before renewing
- Each sale triggers a $0.20 renewal fee -- already factored into fee breakdown above
- Multi-quantity is irrelevant for digital downloads (unlimited inventory)

---

## Etsy Description Template

```
-- CALM & BLOOM -- Self-Care & Anxiety Relief Journal Bundle --

Transform your daily routine with this beautiful 60+ page printable journal designed for anxiety relief, mood tracking, gratitude practice, and mindful self-care.

--- WHAT'S INCLUDED ---

[Journal] 60+ Page Self-Care Journal (US Letter + A4 sizes)
[Cards] 30 Printable Affirmation Cards
[Art] 5 Wall Art Prints (3 sizes: 8x10, 11x14, 16x20)
[Guide] Printing Guide with tips for best results

--- JOURNAL PAGES INCLUDE ---

- Daily mood tracker
- Gratitude log
- Anxiety toolkit worksheets
- Self-care planning pages
- Reflection prompts
- Breathing exercise guides
- Weekly check-in pages
- Goal setting worksheets
- Positive affirmation pages
- Sleep tracker
- Habit tracker
- Brain dump pages

--- PERFECT FOR ---

- Anyone managing anxiety or stress
- Self-care routine building
- Therapy homework and journaling
- Mindfulness and meditation practice
- Thoughtful gift for a friend or loved one

--- HOW IT WORKS ---

1. Purchase and instantly download your files
2. Open the Printing Guide for setup tips
3. Print at home or at a local print shop
4. Bind with a spiral binder, staples, or place in a binder
5. Begin your self-care journey!

--- PRINTING TIPS ---

- Use cardstock (65-80 lb) for covers and affirmation cards
- Use standard 24 lb paper for journal pages
- Print double-sided to save paper
- Both US Letter (8.5x11") and A4 sizes included

--- PLEASE NOTE ---

- This is a DIGITAL DOWNLOAD. No physical product will be shipped.
- Files are delivered as PDF format.
- Colors may vary slightly depending on your printer settings.
- For personal use only. Not for resale or commercial use.
- Due to the digital nature of this product, no refunds are offered.

--- NEED HELP? ---

Message me anytime! I'm happy to help with printing questions or file issues.

Thank you for shopping with Shelzy's Designs!
```

---

## Optimization Checklist

### Pre-Launch

- [ ] All 10 image slots filled with 2000x2000 JPGs
- [ ] Video uploaded (15s, 1080x1080, MP4, no audio)
- [ ] Title under 140 chars, keyword-frontloaded
- [ ] All 13 tags used (max 20 chars each)
- [ ] Description first 160 chars are keyword-rich
- [ ] Price set to $12.97, compare-at $19.97
- [ ] Digital download files uploaded (ZIP, under 20MB each)
- [ ] All 3 variations configured with correct SKUs
- [ ] Shop policies updated for digital downloads (no refunds)
- [ ] Processing time set to: Instant download
- [ ] Category set to: Paper & Party Supplies > Paper > Journals & Planners

### Post-Launch (First 48 Hours)

- [ ] Verify download links work for all variations
- [ ] Test purchase with a friend or second account
- [ ] Share to Pinterest (3-5 pins with keyword-rich descriptions)
- [ ] Share to Instagram Stories with link sticker
- [ ] Run Etsy Ads at $1-3/day budget for initial visibility boost

### Ongoing Optimization

- [ ] Monitor search analytics weekly (Etsy Shop Manager > Stats)
- [ ] A/B test hero image every 2 weeks
- [ ] Refresh tags monthly based on trending search terms
- [ ] Respond to all reviews within 24 hours
- [ ] Add seasonal tags during peak periods (New Year, Mental Health Awareness Month)

---

## Competitor Analysis Notes

| Competitor Metric | Low End | Average | High End | Our Target |
|-------------------|---------|---------|----------|------------|
| Price | $3.99 | $8.99 | $18.99 | $12.97 |
| Pages | 20 | 40 | 100+ | 60+ |
| Reviews | 5 | 150 | 5,000+ | 50+ (first 90 days) |
| Images used | 3 | 7 | 10 | 10 |
| Has video | Rare | ~20% | Yes | Yes |
| Includes extras | No | Sometimes | Yes | Yes (cards + art) |

**Our competitive advantages:**
1. Full bundle (journal + cards + art) at mid-range price
2. Professional video (rare among competitors)
3. All 10 image slots used with high-quality mockups
4. Dual format (US Letter + A4) for international buyers
5. Multiple wall art sizes included

---

*Document maintained by Shelzy's Designs. For internal use only.*
