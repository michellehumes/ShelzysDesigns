# Shelzy's Designs Color System

## Primary Palette

### Off-White (Background)
```
Hex:     #fefefe
RGB:     254, 254, 254
Usage:   Primary backgrounds, product cards, section backgrounds
```

### Hot Pink (Primary Accent)
```
Hex:     #fb5887
RGB:     251, 88, 135
Usage:   Primary CTA buttons, brand accent, highlights, active states, star ratings
```

### Orange (Secondary Accent)
```
Hex:     #fe8c43
RGB:     254, 140, 67
Usage:   Sale badges, product labels, warm highlights, secondary CTAs
```

### Steel Blue (Cool Accent)
```
Hex:     #3ca4d7
RGB:     60, 164, 215
Usage:   Links, informational elements, cool accent, trust indicators
```

### Light Teal/Sky (Highlight)
```
Hex:     #8adbde
RGB:     138, 219, 222
Usage:   Hover accents, decorative elements, highlight backgrounds
```

### Near-Black (Text)
```
Hex:     #1a1a1a
RGB:     26, 26, 26
Usage:   Body text, navigation text, headings, pricing
```

### Darker Pink (Hover)
```
Hex:     #e0416e
RGB:     224, 65, 110
Usage:   Hover states, active states, pressed buttons
```

---

## Functional Colors

### Border Light
```
Hex:     #e0e0e0
RGB:     224, 224, 224
Usage:   Section dividers, form input borders, header border
```

### Border Hover
```
Hex:     #fb5887
RGB:     251, 88, 135
Usage:   Product card hover borders, focused input borders
```

---

## Color Combinations

### Homepage Hero
- Background: `#fefefe` (Off-White)
- Headline: `#1a1a1a` (Near-Black)
- Subtitle: `#1a1a1a` (Near-Black)
- Button: `#fb5887` background (Hot Pink), `#fefefe` text
- Button Hover: `#e0416e` background (Darker Pink)

### Product Cards
- Background: `#fefefe` (Off-White)
- Border (default): transparent
- Border (hover): `#fb5887` (Hot Pink)
- Product Name: `#1a1a1a` (Near-Black, Montserrat Bold)
- Price: `#1a1a1a`
- Shadow (hover): `0 10px 25px rgba(0, 0, 0, 0.06)`

### Badges & Labels
- Background: `#fe8c43` (Orange)
- Text: `#fefefe`
- Border-radius: 999px (pill shape)

### Navigation / Header
- Background: `#fefefe` (Off-White)
- Text: `#1a1a1a` (Near-Black)
- Hover: `#fb5887` (Hot Pink)
- Border: `#e0e0e0`

### Footer
- Background: `#1a1a1a` (Near-Black)
- Text: `#fefefe` (Off-White)
- Link Hover: `#fb5887` (Hot Pink)

### Forms / Inputs
- Background: `#fefefe` (Off-White)
- Border (default): `#e0e0e0`
- Border (focus): `#fb5887` (Hot Pink)
- Focus shadow: `0 0 0 1px rgba(251, 88, 135, 0.25)`

---

## Accessibility

### Text Contrast Ratios
- `#2B2B2B` on `#FFFFFF` = **12.63:1** AAA
- `#2B2B2B` on `#FAF9F6` = **11.92:1** AAA
- `#4E5F4A` on `#FFFFFF` = **7.28:1** AAA
- `#4E5F4A` on `#FAF9F6` = **6.87:1** AA Large Text / AAA
- `#FFFFFF` on `#8BAA88` = **3.02:1** AA Large Text (buttons OK)
- `#FFFFFF` on `#4E5F4A` = **7.28:1** AAA

### Button Recommendations
- Primary CTA: `#8BAA88` background with `#FFFFFF` text (large text compliant)
- Hover state: `#4E5F4A` background with `#FFFFFF` text (fully AAA compliant)
- Ensure 3:1 minimum contrast for UI elements

---

## CSS Variables

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

:root {
  /* Primary Colors */
  --sz-primary: #8BAA88;        /* Sage Green */
  --sz-primary-dark: #4E5F4A;   /* Dark Sage / Evergreen */
  --sz-neutral-light: #FAF9F6;  /* Warm White */
  --sz-neutral-dark: #2B2B2B;   /* Charcoal */
  --sz-accent-gold: #D1C7A1;    /* Champagne Gold */

  /* Border Colors */
  --sz-border-soft: #C7D3C5;
  --sz-border-light: #E0E3DF;

  /* Fonts */
  --sz-font-heading: "Playfair Display", "Times New Roman", serif;
  --sz-font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --sz-font-accent: "Montserrat", "Inter", sans-serif;

  /* Semantic Aliases */
  --color-text-primary: var(--sz-neutral-dark);
  --color-text-heading: var(--sz-primary-dark);
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: var(--sz-neutral-light);
  --color-accent: var(--sz-primary);
  --color-cta: var(--sz-primary);
  --color-cta-hover: var(--sz-primary-dark);
}
```

---

## Usage Guidelines

### Do's
- Use Sage Green (`#8BAA88`) as the primary accent and CTA color
- Use Dark Sage (`#4E5F4A`) for all headings and the footer
- Use Champagne Gold (`#D1C7A1`) sparingly for badges and premium highlights
- Maintain clean white or warm white backgrounds
- Use Charcoal (`#2B2B2B`) for all body text
- Apply pill-shaped buttons (border-radius: 999px)

### Don'ts
- Don't use bright, saturated colors outside this palette
- Don't use more than 3 colors in one section
- Don't use Sage Green for large background areas
- Don't introduce colors outside this palette (no teal, pink, or other accents)
- Don't mix multiple accent colors in the same component

---

## Quick Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary Button | Sage Green | `#8BAA88` |
| Button Hover | Dark Sage | `#4E5F4A` |
| Headings | Dark Sage | `#4E5F4A` |
| Body Text | Charcoal | `#2B2B2B` |
| Alt Background | Warm White | `#FAF9F6` |
| Badges | Champagne Gold | `#D1C7A1` |
| Footer BG | Dark Sage | `#4E5F4A` |
| Borders | Light Border | `#E0E3DF` |
| Hover Borders | Soft Border | `#C7D3C5` |

---

**Version:** 2.0
**Last Updated:** November 2025
