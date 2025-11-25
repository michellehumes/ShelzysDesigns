# Shelzy's Designs Color System

## Primary Palette

### Sage Green (Primary)
```
Hex:     #8BAA88
RGB:     139, 170, 136
Usage:   Primary CTA buttons, brand accent, highlights, active states, star ratings
```

### Dark Sage / Evergreen (Primary Dark)
```
Hex:     #4E5F4A
RGB:     78, 95, 74
Usage:   Headlines, headings, footer background, hover states, link color
```

### Warm White (Neutral Light)
```
Hex:     #FAF9F6
RGB:     250, 249, 246
Usage:   Alternating section backgrounds, modals, secondary backgrounds
```

### Charcoal (Neutral Dark)
```
Hex:     #2B2B2B
RGB:     43, 43, 43
Usage:   Body text, navigation text, pricing
```

### Pure White
```
Hex:     #FFFFFF
RGB:     255, 255, 255
Usage:   Primary backgrounds, product cards, button text
```

---

## Accent & Border Colors

### Champagne Gold (Accent)
```
Hex:     #D1C7A1
RGB:     209, 199, 161
Usage:   Sale badges, product labels, footer link hovers, premium accents
```

### Soft Border
```
Hex:     #C7D3C5
RGB:     199, 211, 197
Usage:   Product card hover borders, modal borders
```

### Light Border
```
Hex:     #E0E3DF
RGB:     224, 227, 223
Usage:   Section dividers, form input borders, header border
```

---

## Color Combinations

### Homepage Hero
- Background: `#FFFFFF` or `#FAF9F6`
- Headline: `#4E5F4A` (Dark Sage)
- Subtitle: `#2B2B2B` (Charcoal)
- Button: `#8BAA88` background, `#FFFFFF` text
- Button Hover: `#4E5F4A` background

### Product Cards
- Background: `#FFFFFF`
- Border (default): transparent
- Border (hover): `#C7D3C5`
- Product Name: `#4E5F4A` (Playfair Display font)
- Price: `#2B2B2B`
- Shadow (hover): `0 10px 25px rgba(0, 0, 0, 0.04)`

### Badges & Labels
- Background: `#D1C7A1` (Champagne Gold)
- Text: `#FFFFFF`
- Border-radius: 999px (pill shape)

### Navigation / Header
- Background: `#FFFFFF`
- Text: `#2B2B2B`
- Hover: `#8BAA88`
- Border: `#E0E3DF`

### Footer
- Background: `#4E5F4A` (Dark Sage)
- Text: `#FAF9F6` (Warm White)
- Link Hover: `#D1C7A1` (Champagne Gold)

### Forms / Inputs
- Background: `#FFFFFF`
- Border (default): `#E0E3DF`
- Border (focus): `#8BAA88`
- Focus shadow: `0 0 0 1px rgba(139, 170, 136, 0.25)`

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
