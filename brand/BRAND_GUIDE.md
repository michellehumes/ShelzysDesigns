# Shelzy's Designs Brand Guide

## Brand Identity

**Brand Name:** Shelzy's Designs
**Tagline:** Premium Personalized Sublimation Water Bottles
**Core Product:** 20oz insulated sublimation water bottles

---

## Brand Positioning

### Core Promise
- **Permanent personalization** – No vinyl, no peeling, no cracking
- **Premium quality** – Bottles that look and feel expensive
- **Thoughtful gifting** – Beautiful packaging and bundles
- **Bold aesthetic** – High contrast, bold color blocking, nothing safe or boring

### Target Customers
1. **Brides & Bridal Parties** – Bridesmaid proposals, wedding day gifts
2. **Women 20-45** – Aesthetic hydration enthusiasts
3. **Gift Buyers** – Birthdays, holidays, teacher gifts, special occasions
4. **Moms & Kids** – Personalized family hydration
5. **Corporate & Events** – Team gifts, branded bottles

### Brand Voice
- Bold, confident, elevated
- Warm but not overly casual
- High contrast and aspirational
- Focus on quality and permanence
- Avoid: cutesy, cheesy, or discount-feeling language

### Design Philosophy
> "High contrast. Bold color blocking. Nothing should feel safe or boring."

---

## Visual Identity

### Color Palette

#### Primary Colors
```
Off-White:       #fefefe  (Primary backgrounds, product cards, section backgrounds)
Hot Pink:        #fb5887  (Primary accent, CTA buttons, brand accent, highlights)
Orange:          #fe8c43  (Secondary accent, sale badges, product labels, warm highlights)
Steel Blue:      #3ca4d7  (Cool accent, links, informational elements)
Light Teal/Sky:  #8adbde  (Highlight, hover accents, decorative elements)
Near-Black:      #1a1a1a  (Body text, navigation, pricing)
Darker Pink:     #e0416e  (Hover states, active states, pressed buttons)
```

#### Usage Guidelines
- **Off-White (`#fefefe`)** for main backgrounds
- **Near-Black (`#1a1a1a`)** for all body text and headings text color
- **Hot Pink (`#fb5887`)** for primary CTAs and accent elements
- **Orange (`#fe8c43`)** for badges, secondary accents, and warm highlights
- **Steel Blue (`#3ca4d7`)** for cool accent elements and links
- **Light Teal/Sky (`#8adbde`)** for highlight and decorative accents
- **Darker Pink (`#e0416e`)** for hover/active states

### Typography

#### Typeface Stack
```
Titles:       Berthold Block (Bold) - Self-hosted, not on Google Fonts
Headings:     Montserrat (Bold) - Strong sans-serif
Body Text:    Inter (400 weight, 16px) - Clean sans-serif
Accents:      Montserrat (uppercase, Bold) - Uppercase subheadings, badges
Buttons:      Inter (600 weight)
```

#### Font Loading
```css
/* Berthold Block must be self-hosted — it is NOT available on Google Fonts */
@font-face {
  font-family: 'Berthold Block';
  src: url('/fonts/berthold-block.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

/* Google Fonts for Montserrat and Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap');
```

#### Size Scale (Web)
```
Title (Hero):        42px     (Berthold Block, Bold)
H1 (Hero):           48-64px  (Montserrat, Bold)
H2 (Section):        36-42px  (Montserrat, Bold)
H3 (Subsection):     24-28px  (Montserrat, Bold)
Body (Primary):      16px     (Inter, 400 weight)
Body (Secondary):    14-16px  (Inter, 400 weight)
Captions/Badges:     12-14px  (Montserrat, uppercase, bold, 0.12em letter-spacing)
```

#### Typography Details
- **Titles:** Berthold Block, 42px, Bold — self-hosted font file required
- **Headings:** Montserrat Bold, high-contrast and commanding
- **Subheadings/Badges:** Uppercase, 0.12em letter-spacing, Montserrat Bold
- **Buttons:** Inter 600 weight, 0.06em letter-spacing, no text-transform

#### On-Bottle Typography (Mockups Only)
For product mockups showing personalization:
- **Script Style:** Selena Script, Better Grade Script, or similar elegant script
- **Block Style:** Clean sans-serif, uppercase or mixed case
- **NOT:** Love Island font or overly trendy fonts

### Photography Style

#### Overall Aesthetic
- Bold, bright, high-contrast
- Eye-catching color blocking
- Modern and energetic with warmth
- Consistent lighting (soft, natural)
- Cohesive color palette across all images

#### Background Colors
- Off-white (#fefefe)
- Bold color block sections (Hot Pink, Orange, Steel Blue, Light Teal)
- Natural textures (marble, wood, linen)
- Avoid: muted earth tones, safe/boring palettes, cluttered scenes

#### Props & Styling
- **Bridal:** Satin ribbons, white florals, elegant stationery
- **Everyday:** Coffee cups, planners, neutral desk accessories
- **Kids:** Playful but not chaotic – clean colorful accents
- **Holiday:** Greenery, simple ornaments, cozy textures

---

## Brand Differentiation

### What Makes Shelzy's Different

**Sublimation vs. Vinyl**
- Most competitors use **vinyl decals** that peel, crack, and fade
- Shelzy's uses **true sublimation printing** – ink is infused into the coating
- Result: Smooth, permanent, professional finish

**Premium Positioning**
- Not the cheapest option
- Quality over quantity
- Beautiful packaging (gift-ready)
- Bundles and thoughtful add-ons

**Specialization**
- Focus on **weddings & bridal parties** as hero use case
- Expertise in personalization layout and design
- Fast turnaround with white-glove service

---

## Brand Personality

If Shelzy's Designs were a person, she would be:
- Thoughtful and detail-oriented
- Confident and bold
- Warm and approachable
- Quality-obsessed
- Organized and reliable
- High-contrast, vibrant aesthetic

---

## Competitive Positioning

### We Are NOT:
- A mass-market Etsy shop with vinyl stickers
- A discount bulk supplier
- A trendy fast-fashion brand

### We ARE:
- A premium personalization brand
- A specialist in sublimation quality
- A go-to for brides and thoughtful gift-givers
- A brand people discover and recommend

---

## Usage Examples

### ✅ On-Brand
- "Premium personalized sublimation bottles"
- "Permanent, scratch-proof finish"
- "Made with care, one bottle at a time"
- "Your personalization becomes part of the bottle"
- Bold product photography with off-white or color-blocked backgrounds

### ❌ Off-Brand
- "Cute water bottles!!!"
- "Cheapest personalized tumblers"
- "OMG SALE!!!"
- Muted/sage green palettes, busy patterns
- Stock photos with watermarks

---

## File Organization

All brand assets should follow this structure:
```
/brand/
  BRAND_GUIDE.md (this file)
  colors.md
  typography.md
/products/
  product_catalog.md
  product_descriptions.md
/copy/
  copy_bank.md
  homepage_copy.md
  collection_copy.md
/imagery/
  shot_list.md
  ai_image_prompts.md
```

---

**Last Updated:** February 2026
**Version:** 2.0
