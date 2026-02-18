# Prompt for Claude Chat (Chrome) — Post Calm & Bloom to Etsy

> Copy everything below the line and paste it into Claude Chat that has Chrome access.

---

## TASK

You are helping me post my digital product "Calm & Bloom" to Etsy. This is a printable self-care journal bundle. I need you to do the following steps in order using Chrome. Take your time with each step and confirm what you see on screen before proceeding.

---

## STEP 1: EXPORT THE PDFs FROM HTML FILES

I have 4 HTML product files that need to be saved as PDFs using Chrome's Print > Save as PDF. The files are located at:

```
/home/user/ShelzysDesigns/products/calm-bloom-journal/
```

**For each file below, open it in Chrome (Ctrl+O or File > Open), then Ctrl+P to print, and use these EXACT settings:**

### 1A — Journal (US Letter)
- Open: `journal.html`
- Destination: Save as PDF
- Paper size: **Letter (8.5 x 11 in)**
- Margins: **None**
- Scale: **Default (100%)**
- Background graphics: **ON** (checked) — CRITICAL, the design won't appear without this
- Headers and footers: **OFF** (unchecked)
- Save as: `Calm-and-Bloom-Journal-USLetter.pdf`

### 1B — Journal (A4)
- Open: `journal.html` (same file, different paper size)
- Paper size: **A4**
- All other settings same as 1A
- Save as: `Calm-and-Bloom-Journal-A4.pdf`

### 1C — Affirmation Cards
- Open: `affirmation-cards.html`
- Paper size: **Letter**
- All other settings same as 1A
- Save as: `Calm-and-Bloom-Affirmation-Cards.pdf`

### 1D — Wall Art
- Open: `wall-art.html`
- Paper size: **Letter**
- All other settings same as 1A
- Save as: `Calm-and-Bloom-Wall-Art-AllSizes.pdf`

### 1E — Printing Guide
- Open: `printing-guide.html`
- Paper size: **Letter**
- All other settings same as 1A
- Save as: `Calm-and-Bloom-Printing-Guide.pdf`

Save all PDFs to the same folder: `/home/user/ShelzysDesigns/products/calm-bloom-journal/`

After exporting, open each PDF briefly to verify pages look correct — colors, layout, no cut-off content.

---

## STEP 2: PACKAGE INTO ZIP FILES

Create these ZIP files from the PDFs you just exported:

**Main bundle (for Full Bundle variation):**
```
Calm-and-Bloom-Complete-Bundle.zip containing:
  - Calm-and-Bloom-Journal-USLetter.pdf
  - Calm-and-Bloom-Journal-A4.pdf
  - Calm-and-Bloom-Affirmation-Cards.pdf
  - Calm-and-Bloom-Wall-Art-AllSizes.pdf
  - Calm-and-Bloom-Printing-Guide.pdf
```

**Journal Only (for Journal Only variation):**
```
Calm-and-Bloom-Journal-Only.zip containing:
  - Calm-and-Bloom-Journal-USLetter.pdf
  - Calm-and-Bloom-Journal-A4.pdf
  - Calm-and-Bloom-Printing-Guide.pdf
```

**Cards Only (for Cards Only variation):**
```
Calm-and-Bloom-Cards-Only.zip containing:
  - Calm-and-Bloom-Affirmation-Cards.pdf
  - Calm-and-Bloom-Printing-Guide.pdf
```

If any single ZIP exceeds 20MB, compress the PDFs first using an online tool or split the main bundle into two ZIPs.

---

## STEP 3: EXPORT THE LISTING VIDEO

1. Open `etsy-video.html` in Chrome (located in the same folder)
2. Press F12 to open DevTools, click the device toolbar icon, set viewport to **1080 x 1080**
3. Record a 15-second screen capture of the animation (refresh the page to start from the beginning)
4. Save as `Calm-and-Bloom-Etsy-Video.mp4`
5. Make sure there is **NO audio** (Etsy rejects videos with audio)
6. The video should be 1080x1080, MP4 format, under 100MB

If screen recording is difficult, skip the video for now — we can add it later. The images and listing copy are more important.

---

## STEP 4: CREATE THE ETSY LISTING

Go to: **https://www.etsy.com/your/shops/me/tools/listings/create**

(If not logged in, log into the Shelzy's Designs Etsy seller account first.)

### 4A — PHOTOS

Upload these 10 listing images in this exact order (they should already be generated and saved — look for files named `listing-image-01-hero.jpg` through `listing-image-10-gift.jpg` in the project folder):

| Slot | Filename | Content |
|------|----------|---------|
| 1 | listing-image-01-hero.jpg | Hero/Thumbnail — flat lay product shot |
| 2 | listing-image-02-whats-included.jpg | What's Included overview |
| 3 | listing-image-03-mood-tracker.jpg | Journal interior — mood tracker |
| 4 | listing-image-04-affirmation-cards.jpg | Affirmation cards display |
| 5 | listing-image-05-wall-art.jpg | Wall art room mockup |
| 6 | listing-image-06-lifestyle.jpg | Woman using journal |
| 7 | listing-image-07-detail.jpg | Close-up detail shot |
| 8 | listing-image-08-anxiety-toolkit.jpg | Anxiety toolkit pages |
| 9 | listing-image-09-bundle-value.jpg | Bundle value shot |
| 10 | listing-image-10-gift.jpg | Printing results / gifting |

If the listing images don't exist yet, tell me and we'll generate them. Do NOT skip this step — all 10 slots must be filled.

### 4B — VIDEO

Upload `Calm-and-Bloom-Etsy-Video.mp4` if it was exported in Step 3. Otherwise skip for now.

### 4C — TITLE

Paste this EXACT title:

```
Self Care Journal Printable | Anxiety Relief Planner | Mental Health Wellness Bundle Digital Download Affirmation Cards Wall Art
```

(126 characters — under the 140-char Etsy limit, keywords front-loaded for SEO)

### 4D — ABOUT THIS LISTING

| Field | Selection |
|-------|-----------|
| Who made it? | **I did** |
| What is it? | **A finished product** |
| When was it made? | **2020-2026** |

### 4E — CATEGORY

Navigate to: **Paper & Party Supplies > Paper > Journals & Planners**

### 4F — TYPE

Select: **Digital** (NOT Physical — this is critical)

### 4G — ATTRIBUTES (fill in whatever Etsy shows)

| Attribute | Value |
|-----------|-------|
| Digital download | Yes |
| File format | PDF |
| Color | Green, Neutral |
| Paper size | US Letter, A4 |

### 4H — DESCRIPTION

Paste this entire description into the Description box (Etsy uses plain text, not markdown):

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

### 4I — TAGS

Enter ALL 13 tags below, one at a time (type each one, press Enter to confirm, then type the next):

1. `self care journal`
2. `anxiety journal`
3. `mental health planner`
4. `printable planner`
5. `wellness journal`
6. `self care printable`
7. `anxiety relief`
8. `gratitude journal`
9. `mindfulness planner`
10. `affirmation cards`
11. `self care bundle`
12. `therapy journal`
13. `digital planner`

If tag #3 ("mental health planner") is rejected for being over 20 characters, use `mental health plan` instead.

### 4J — DIGITAL FILES

Upload the ZIP files created in Step 2 as the downloadable files buyers receive.

For the default listing, upload: `Calm-and-Bloom-Complete-Bundle.zip`

### 4K — PRICING

| Field | Value |
|-------|-------|
| Price | **12.97** |
| Compare-at price (Original price) | **19.97** |
| Quantity | **999** |
| SKU | **CALM-BLOOM-JOURNAL-V1** |

### 4L — VARIATIONS

Set up 3 variations so buyers can choose their option:

**Variation name:** Bundle Option (or "Style" or "Format" — whatever Etsy offers)

| Option | Price | SKU | Digital File |
|--------|-------|-----|-------------|
| Full Bundle (Journal + Cards + Art + Guide) | $12.97 | CALM-BLOOM-FULL | Calm-and-Bloom-Complete-Bundle.zip |
| Journal Only | $8.97 | CALM-BLOOM-JOURNAL | Calm-and-Bloom-Journal-Only.zip |
| Affirmation Cards Only | $4.97 | CALM-BLOOM-CARDS | Calm-and-Bloom-Cards-Only.zip |

Make "Full Bundle" the default/first option.

### 4M — OTHER SETTINGS

| Setting | Value |
|---------|-------|
| Renewal option | **Automatic** |
| Shop section | **Printable Journals & Planners** (create this section if it doesn't exist) |
| Production partner | **No** |
| Personalization | **Off** |

---

## STEP 5: FINAL CHECK BEFORE PUBLISHING

Before clicking Publish, verify:

- [ ] All 10 image slots are filled
- [ ] Title is exactly: "Self Care Journal Printable | Anxiety Relief Planner | Mental Health Wellness Bundle Digital Download Affirmation Cards Wall Art"
- [ ] All 13 tags are entered
- [ ] Price shows $12.97 with $19.97 crossed out (35% off badge)
- [ ] Type is Digital (not Physical)
- [ ] Category is Paper & Party Supplies > Paper > Journals & Planners
- [ ] Digital file(s) uploaded
- [ ] All 3 variations configured with correct prices and files
- [ ] Description is complete and formatted correctly

Tell me what you see on the preview before clicking Publish — I want to confirm everything looks right.

---

## STEP 6: PUBLISH

Once I confirm, click **Publish**. Then:

1. Copy the live listing URL and share it with me
2. Open the listing in an incognito window to verify it looks correct as a buyer would see it
3. Check that all variations show correct prices
4. Check that images display in the right order

---

## IMPORTANT NOTES

- Take screenshots at each major step so I can see what's happening
- If any field or option looks different from what I described, tell me before proceeding
- If images or ZIP files don't exist yet, STOP and tell me — don't skip them
- The listing MUST be set as Digital download, not Physical
- Background graphics MUST be turned ON when exporting PDFs or the designs will be blank
- Do NOT click Publish without my confirmation
