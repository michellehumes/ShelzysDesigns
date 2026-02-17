# Shelzy's Designs - Live Theme Implementation Guide

**Estimated Time:** 10-15 minutes
**Difficulty:** Easy (copy-paste)

---

## Quick Overview

This guide will help you implement the Shelzy's Designs brand styling on your live Shopify theme. You'll be adding:
- Custom fonts (Playfair Display, Inter, Montserrat)
- Brand color palette (Sage Green, Dark Sage, Champagne Gold)
- Pill-shaped buttons with hover effects
- Product card hover animations
- Styled footer, badges, and more

---

## Step 1: Backup Your Theme (2 minutes)

**Before making any changes, always backup:**

1. Go to **Online Store > Themes**
2. Find your live theme
3. Click **Actions > Duplicate**
4. Wait for the copy to complete

Now you have a backup if anything goes wrong.

---

## Step 2: Add the CSS File (5 minutes)

### 2.1 Open Theme Editor
1. Go to **Online Store > Themes**
2. Find your live theme
3. Click **Actions > Edit code**

### 2.2 Create the CSS Asset
1. In the left sidebar, find the **Assets** folder
2. Click **Add a new asset**
3. Select **Create a blank file**
4. Choose **css** as the file type
5. Name it: `shelzys-brand`
6. Click **Done**

### 2.3 Add the CSS Content
1. Open the file `/shopify/assets/shelzys-brand.css` from this repository
2. Copy the **entire contents**
3. Paste into the new `shelzys-brand.css` file in Shopify
4. Click **Save**

---

## Step 3: Add the Fonts Snippet (3 minutes)

### 3.1 Create the Snippet
1. In the left sidebar, find the **Snippets** folder
2. Click **Add a new snippet**
3. Name it: `shelzys-fonts`
4. Click **Done**

### 3.2 Add the Snippet Content
1. Open the file `/shopify/snippets/shelzys-fonts.liquid` from this repository
2. Copy the **entire contents**
3. Paste into the new `shelzys-fonts.liquid` file in Shopify
4. Click **Save**

---

## Step 4: Connect to Theme (3 minutes)

### 4.1 Edit theme.liquid
1. In the left sidebar, find **Layout > theme.liquid**
2. Click to open it
3. Find the `</head>` closing tag (usually around line 100-150)
4. **Just BEFORE** the `</head>` tag, add this line:

```liquid
{% render 'shelzys-fonts' %}
```

**Example:**
```liquid
  ... other code ...

  {% render 'shelzys-fonts' %}
</head>
```

5. Click **Save**

---

## Step 5: Verify It's Working (2 minutes)

1. Open your store in a new browser tab
2. **Hard refresh** the page:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
3. Check these elements:
   - [ ] Headings are now in Playfair Display (elegant serif)
   - [ ] Body text is in Inter (clean sans-serif)
   - [ ] Buttons are pill-shaped (rounded)
   - [ ] Footer is dark sage green
   - [ ] Product cards have subtle hover effect

---

## Troubleshooting

### Fonts not loading?
- Make sure the `{% render 'shelzys-fonts' %}` line is inside the `<head>` section
- Check for typos in the snippet name
- Try clearing browser cache

### Styles not applying?
- Verify `shelzys-brand.css` is in the Assets folder
- Make sure the snippet references it correctly
- Some themes have aggressive CSS - you may need to add more `!important` tags

### Footer not changing color?
Some themes use different class names. Try adding this to the CSS:
```css
footer,
.footer,
[data-section-type="footer"] {
  background-color: var(--sz-primary-dark) !important;
}
```

### Buttons look wrong?
Some themes override button styles heavily. Try adding:
```css
.btn,
.button,
[class*="button"] {
  border-radius: 999px !important;
  background-color: var(--sz-primary) !important;
}
```

---

## Optional: Theme Settings Adjustments

For best results, also update your theme settings:

1. Go to **Online Store > Themes > Customize**
2. Click **Theme settings** (gear icon)
3. Go to **Colors** and update:

| Setting | Value |
|---------|-------|
| Text | `#2B2B2B` |
| Background | `#FFFFFF` |
| Secondary background | `#FAF9F6` |
| Accent/Buttons | `#8BAA88` |
| Sale | `#8BAA88` |

4. Go to **Typography**:
   - If your theme supports custom fonts, select Playfair Display for headings
   - Select Inter for body text

---

## File Reference

| File | Location | Purpose |
|------|----------|---------|
| `shelzys-brand.css` | Assets folder | All brand CSS styles |
| `shelzys-fonts.liquid` | Snippets folder | Font loading & CSS connection |

---

## Color Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Sage Green | `#8BAA88` | Buttons, accents, stars |
| Dark Sage | `#4E5F4A` | Headings, footer, hovers |
| Charcoal | `#2B2B2B` | Body text |
| Warm White | `#FAF9F6` | Alt backgrounds |
| Champagne Gold | `#D1C7A1` | Badges, premium accents |
| Light Border | `#E0E3DF` | Dividers, inputs |
| Soft Border | `#C7D3C5` | Hover borders |

---

## Font Reference

| Font | Weight | Usage |
|------|--------|-------|
| Playfair Display | 500-700 | Headings, titles |
| Inter | 300-700 | Body text, buttons |
| Montserrat | 500-700 | Badges, captions |

---

## Need Help?

If styles aren't applying correctly, the CSS may need adjustments for your specific theme. Common themes that work well:
- Dawn (Shopify default) - Excellent compatibility
- Impulse - Good compatibility
- Prestige - Good compatibility
- Minimal - Good compatibility

For heavily customized themes, you may need to inspect elements and add theme-specific selectors.

---

**Version:** 1.0
**Last Updated:** November 2025
