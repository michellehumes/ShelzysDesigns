# Shelzy's Designs Color System

## Primary Palette

### Soft Black
```
Hex:     #111111
RGB:     17, 17, 17
Usage:   Primary text, headlines, buttons, navigation
```

### White
```
Hex:     #FFFFFF
RGB:     255, 255, 255
Usage:   Backgrounds, clean space, reverse text
```

### Brushed Beige
```
Hex:     #F7F4EF
RGB:     247, 244, 239
Usage:   Section backgrounds, product card backgrounds, alternating sections
```

### Sage Green
```
Hex:     #9CAE8C
RGB:     156, 174, 140
Usage:   Primary CTA buttons, brand accent, highlights, active states
```

---

## Secondary Palette

### Sandstone
```
Hex:     #D8CFC4
RGB:     216, 207, 196
Usage:   Subtle dividers, secondary backgrounds, borders
```

### Blush Apricot
```
Hex:     #F8D9C5
RGB:     248, 217, 197
Usage:   Warm accent, bridal sections, feminine highlights
```

### Dusty Seagrass
```
Hex:     #7C9F8C
RGB:     124, 159, 140
Usage:   Deeper green accent, hover states, secondary CTAs
```

---

## Color Combinations

### Homepage Hero
- Background: `#FFFFFF` or `#F7F4EF`
- Headline: `#111111`
- Button: `#9CAE8C` background, `#FFFFFF` text

### Product Cards
- Background: `#F7F4EF`
- Product Name: `#111111`
- Price: `#111111`
- Button: `#9CAE8C`

### Bridal Sections
- Background: `#F8D9C5` (light blush) or `#FFFFFF`
- Accent: `#9CAE8C`
- Text: `#111111`

### Navigation
- Background: `#FFFFFF`
- Text: `#111111`
- Hover: `#9CAE8C`
- Active: `#7C9F8C`

---

## Accessibility

### Text Contrast Ratios
- `#111111` on `#FFFFFF` = **19.56:1** ✅ AAA
- `#111111` on `#F7F4EF` = **18.12:1** ✅ AAA
- `#FFFFFF` on `#9CAE8C` = **2.85:1** ⚠️ Use for large text only
- `#111111` on `#9CAE8C` = **6.88:1** ✅ AA

### Button Recommendations
- Primary CTA: `#9CAE8C` background with `#FFFFFF` or `#111111` text
- Ensure 3:1 minimum contrast for UI elements

---

## CSS Variables

```css
:root {
  /* Primary */
  --color-black: #111111;
  --color-white: #FFFFFF;
  --color-beige: #F7F4EF;
  --color-sage: #9CAE8C;

  /* Secondary */
  --color-sandstone: #D8CFC4;
  --color-blush: #F8D9C5;
  --color-seagrass: #7C9F8C;

  /* Semantic */
  --color-text-primary: var(--color-black);
  --color-text-secondary: #666666;
  --color-bg-primary: var(--color-white);
  --color-bg-secondary: var(--color-beige);
  --color-accent: var(--color-sage);
  --color-cta: var(--color-sage);
  --color-cta-hover: var(--color-seagrass);
}
```

---

## Usage Guidelines

### Do's
✅ Use sage green sparingly as an accent
✅ Maintain clean white or beige backgrounds
✅ Use soft black for all primary text
✅ Use blush apricot for bridal/feminine sections only

### Don'ts
❌ Don't use bright, saturated colors
❌ Don't use more than 3 colors in one section
❌ Don't use sage green for large background areas
❌ Don't introduce colors outside this palette

---

**Version:** 1.0
**Last Updated:** November 2025
