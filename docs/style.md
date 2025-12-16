# Shelzy's Designs Theme Style Guide

**Version:** 2.0.0
**Last Updated:** December 2024

---

## Overview

This document defines the design system and governance rules for the Shelzy's Designs Shopify theme. All development must follow these guidelines to maintain brand consistency and prevent the need for future rebuilds.

---

## Design Tokens

All design values are controlled via **Theme Settings** in the Shopify customizer. Never hardcode values.

### Colors

| Token | CSS Variable | Purpose |
|-------|--------------|---------|
| Primary | `--sz-primary` | Main brand color (buttons, links, accents) |
| Primary Dark | `--sz-primary-dark` | Hover states, footer, headings |
| Primary Light | `--sz-primary-light` | Subtle accents, selection |
| Background | `--sz-background` | Page background |
| Background Alt | `--sz-background-alt` | Alternating section background |
| Surface | `--sz-surface` | Cards, inputs, elevated surfaces |
| Text | `--sz-text` | Body text |
| Heading | `--sz-heading` | Headings, titles |
| Text Muted | `--sz-text-muted` | Secondary text, captions |
| Accent | `--sz-accent` | Gold highlights, stars |
| Sale | `--sz-sale` | Sale badges, prices |
| Error | `--sz-error` | Error states |
| Success | `--sz-success` | Success states |

### Typography

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| Heading Font | `--sz-font-heading` | H1-H6, display text |
| Body Font | `--sz-font-body` | Body text, buttons, navigation |
| Heading Weight | `--sz-font-heading-weight` | From theme settings |
| Body Weight | `--sz-font-body-weight` | From theme settings |

### Fluid Font Scale

All text sizes use `clamp()` for responsive typography:

```css
--sz-text-xs    /* 11-12px */
--sz-text-sm    /* 13-14px */
--sz-text-base  /* 14-16px */
--sz-text-lg    /* 16-18px */
--sz-text-xl    /* 18-20px */
--sz-text-2xl   /* 20-24px */
--sz-text-3xl   /* 24-32px */
--sz-text-4xl   /* 28-40px */
--sz-text-5xl   /* 32-48px */
--sz-text-6xl   /* 40-60px */
```

### Spacing Scale

All spacing uses a proportional scale controlled by `--sz-space-unit`:

```css
--sz-space-xs   /* 4px */
--sz-space-sm   /* 8px */
--sz-space-md   /* 16px */
--sz-space-lg   /* 24px */
--sz-space-xl   /* 32px */
--sz-space-2xl  /* 48px */
--sz-space-3xl  /* 64px */
--sz-space-4xl  /* 80px */
--sz-space-5xl  /* 96px */
```

### Border Radius

```css
--sz-radius-none  /* 0 */
--sz-radius-sm    /* 4px */
--sz-radius-md    /* 8px */
--sz-radius-lg    /* 12px */
--sz-radius-xl    /* 16px */
--sz-radius-2xl   /* 24px */
--sz-radius-full  /* 9999px (pills) */
--sz-radius-button /* Configurable via settings */
```

---

## Component Rules

### DO ✅

- Use CSS variables for all colors, spacing, typography
- Use blocks instead of fixed layouts
- Add presets to all sections
- Include version comments in all files
- Use `{% render %}` for reusable components
- Lazy load images below the fold
- Use semantic HTML elements
- Include proper alt text
- Test on mobile before committing

### DON'T ❌

- Hardcode hex colors (use `var(--sz-*)`)
- Hardcode pixel values for spacing (use `var(--sz-space-*)`)
- Hardcode font families (use `var(--sz-font-*)`)
- Create one-off sections (make them reusable)
- Duplicate templates
- Add Google Fonts via `@import` (use Shopify font picker)
- Use inline styles for colors or fonts
- Skip schema blocks
- Forget mobile responsiveness

---

## Section Template

All new sections must follow this structure:

```liquid
{% comment %}
================================================================================
SHELZY'S DESIGNS - [SECTION NAME]
Version: 2.0.0
Last Updated: [DATE]
================================================================================
[Description of what this section does]

Features:
- [List key features]
================================================================================
{% endcomment %}

{%- liquid
  assign color_scheme = section.settings.color_scheme
  case color_scheme
    when 'light'
      assign bg_color = 'var(--sz-background)'
    when 'alt'
      assign bg_color = 'var(--sz-background-alt)'
    when 'surface'
      assign bg_color = 'var(--sz-surface)'
    when 'dark'
      assign bg_color = 'var(--sz-primary-dark)'
  endcase
-%}

<section
  class="sz-[name]{% if section.settings.full_width %} sz-[name]--bleed{% endif %}"
  style="
    --section-bg: {{ bg_color }};
    --section-padding-top: {{ section.settings.padding_top }}px;
    --section-padding-bottom: {{ section.settings.padding_bottom }}px;
  "
>
  <div class="sz-[name]__container">
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'heading' -%}
          <h2 {{ block.shopify_attributes }}>{{ block.settings.text }}</h2>
      {%- endcase -%}
    {%- endfor -%}
  </div>
</section>

{% style %}
  .sz-[name] {
    background-color: var(--section-bg);
    padding-top: var(--section-padding-top);
    padding-bottom: var(--section-padding-bottom);
  }
{% endstyle %}

{% schema %}
{
  "name": "[Section Name]",
  "tag": "section",
  "class": "sz-section-[name]",
  "settings": [
    {
      "type": "checkbox",
      "id": "full_width",
      "label": "Full width",
      "default": false
    },
    {
      "type": "select",
      "id": "color_scheme",
      "label": "Color Scheme",
      "options": [
        { "value": "light", "label": "Light" },
        { "value": "alt", "label": "Alternate" },
        { "value": "surface", "label": "Surface" },
        { "value": "dark", "label": "Dark" }
      ],
      "default": "light"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Top Padding",
      "min": 0,
      "max": 120,
      "step": 8,
      "default": 80,
      "unit": "px"
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Bottom Padding",
      "min": 0,
      "max": 120,
      "step": 8,
      "default": 80,
      "unit": "px"
    }
  ],
  "blocks": [
    {
      "type": "heading",
      "name": "Heading",
      "settings": [
        {
          "type": "text",
          "id": "text",
          "label": "Text",
          "default": "Heading"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "[Section Name]"
    }
  ]
}
{% endschema %}
```

---

## Image Guidelines

### Optimized Images

Always use the `optimized-image` snippet for performance:

```liquid
{% render 'optimized-image',
  image: product.featured_image,
  alt: product.title,
  sizes: '(min-width: 768px) 50vw, 100vw',
  loading: 'lazy',
  aspect_ratio: '1/1'
%}
```

### Loading Strategy

| Position | `loading` | `fetchpriority` |
|----------|-----------|-----------------|
| Above fold (hero) | `eager` | `high` |
| Below fold | `lazy` | `auto` |

---

## Metafields

### Product Metafields (namespace: `custom`)

| Metafield | Type | Usage |
|-----------|------|-------|
| `custom.highlights` | List/Multi-line | Product highlights |
| `custom.materials` | Text | Materials info |
| `custom.care_instructions` | Rich text | Care instructions |
| `custom.personalization_notes` | Rich text | Personalization tips |
| `custom.production_time` | Text | Production time override |
| `custom.size_info` | Rich text | Size/dimension info |
| `custom.feature_list` | List | Feature checkmarks |

### Using Metafields

```liquid
{% render 'product-metafields', product: product %}
```

Empty metafields are handled gracefully and don't break UI.

---

## Accessibility Checklist

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text on all images
- [ ] Focus states on interactive elements
- [ ] Skip link in header
- [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- [ ] ARIA labels where needed
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Keyboard navigable
- [ ] `prefers-reduced-motion` respected

---

## Files Reference

### Core Files (DO NOT MODIFY unless necessary)

| File | Purpose |
|------|---------|
| `layout/theme.liquid` | Main layout template |
| `config/settings_schema.json` | Theme settings |
| `snippets/shelzys-css-variables.liquid` | Design tokens |

### Reusable Sections

| Section | Purpose |
|---------|---------|
| `hero-banner.liquid` | Full-width hero |
| `media-row.liquid` | Image + text (reversible) |
| `usp-bar.liquid` | Trust badges bar |
| `testimonials.liquid` | Customer reviews |
| `rich-text.liquid` | Flexible text content |
| `newsletter.liquid` | Email signup |
| `faq.liquid` | Accordions with SEO schema |
| `featured-collection.liquid` | Product grid |

### Reusable Snippets

| Snippet | Purpose |
|---------|---------|
| `product-card.liquid` | Product card component |
| `product-metafields.liquid` | Dynamic metafield display |
| `optimized-image.liquid` | Performance images |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Dec 2024 | Full future-proofing refactor |
| 1.0.0 | Original | Initial theme build |

---

## Support

For questions or issues:
- GitHub: https://github.com/michellehumes/shelzysdesigns
- Email: support@shelzysdesigns.com
