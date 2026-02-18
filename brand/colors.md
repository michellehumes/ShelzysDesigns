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
- `#1a1a1a` on `#fefefe` = **16.75:1** AAA
- `#fefefe` on `#fb5887` = **3.46:1** AA Large Text (buttons OK)
- `#fefefe` on `#e0416e` = **4.22:1** AA (hover buttons)
- `#fefefe` on `#1a1a1a` = **16.75:1** AAA (footer)
- `#1a1a1a` on `#8adbde` = **8.86:1** AAA (teal highlights)
- `#fefefe` on `#3ca4d7` = **3.28:1** AA Large Text

### Button Recommendations
- Primary CTA: `#fb5887` background with `#fefefe` text (large text compliant)
- Hover state: `#e0416e` background with `#fefefe` text (AA compliant)
- Ensure 3:1 minimum contrast for UI elements

---

## CSS Variables

```css
/* Berthold Block must be self-hosted — NOT available on Google Fonts */
@font-face {
  font-family: 'Berthold Block';
  src: url('/fonts/berthold-block.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap');

:root {
  /* Primary Colors */
  --sz-hot-pink: #fb5887;        /* Hot Pink (primary accent) */
  --sz-darker-pink: #e0416e;     /* Darker Pink (hover) */
  --sz-orange: #fe8c43;          /* Orange (secondary accent) */
  --sz-steel-blue: #3ca4d7;      /* Steel Blue (cool accent) */
  --sz-light-teal: #8adbde;      /* Light Teal/Sky (highlight) */
  --sz-off-white: #fefefe;       /* Off-White (backgrounds) */
  --sz-near-black: #1a1a1a;      /* Near-Black (text) */

  /* Border Colors */
  --sz-border-light: #e0e0e0;
  --sz-border-hover: #fb5887;

  /* Fonts */
  --sz-font-title: "Berthold Block", "Impact", sans-serif;
  --sz-font-heading: "Montserrat", "Inter", sans-serif;
  --sz-font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --sz-font-accent: "Montserrat", "Inter", sans-serif;

  /* Semantic Aliases */
  --color-text-primary: var(--sz-near-black);
  --color-text-heading: var(--sz-near-black);
  --color-bg-primary: var(--sz-off-white);
  --color-bg-secondary: var(--sz-off-white);
  --color-accent: var(--sz-hot-pink);
  --color-cta: var(--sz-hot-pink);
  --color-cta-hover: var(--sz-darker-pink);
}
```

---

## Usage Guidelines

### Do's
- Use Hot Pink (`#fb5887`) as the primary accent and CTA color
- Use Near-Black (`#1a1a1a`) for all body text and headings
- Use Orange (`#fe8c43`) for badges, secondary accents, and warm highlights
- Use Steel Blue (`#3ca4d7`) and Light Teal (`#8adbde`) for cool accents and highlights
- Maintain off-white (`#fefefe`) backgrounds with bold color blocking
- Apply pill-shaped buttons (border-radius: 999px)
- Embrace high contrast and bold color combinations

### Don'ts
- Don't use muted, safe, or boring color combinations
- Don't use sage green, earth tones, or Playfair Display -- that's the OLD brand
- Don't make anything feel timid or washed out
- Don't introduce colors outside this palette
- Don't use more than 3 brand colors in one component

---

## Quick Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary Button | Hot Pink | `#fb5887` |
| Button Hover | Darker Pink | `#e0416e` |
| Headings | Near-Black | `#1a1a1a` |
| Body Text | Near-Black | `#1a1a1a` |
| Background | Off-White | `#fefefe` |
| Badges | Orange | `#fe8c43` |
| Cool Accent | Steel Blue | `#3ca4d7` |
| Highlight | Light Teal/Sky | `#8adbde` |
| Footer BG | Near-Black | `#1a1a1a` |
| Borders | Light Border | `#e0e0e0` |
| Hover Borders | Hot Pink | `#fb5887` |

---

**Version:** 3.0
**Last Updated:** February 2026
