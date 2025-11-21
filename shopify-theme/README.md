# Shelzy's Designs - Shopify Theme Files

**Custom sections and styling for Impulse theme**

---

## 📦 What's Included

### Sections (`/sections/`)
- `shelzy-hero.liquid` - Hero section with CTA
- `shelzy-why-sublimation.liquid` - Explains sublimation vs vinyl
- `shelzy-how-it-works.liquid` - 3-step process
- `shelzy-email-signup.liquid` - Newsletter signup with Shelzy branding

### Snippets (`/snippets/`)
- `product-personalization.liquid` - Auto-detects personalized products and shows custom fields

### Assets (`/assets/`)
- `shelzy-custom.css` - Complete brand styling (colors, fonts, buttons)

### Deployment
- `deploy.sh` - Automated deployment script
- `DEPLOY_GUIDE.md` - Complete step-by-step instructions

---

## 🚀 Quick Deploy

```bash
# Option 1: Automated (recommended)
./deploy.sh

# Option 2: Manual
shopify theme push
```

Then follow `DEPLOY_GUIDE.md` for configuration.

---

## ✨ Features

### Brand Colors Applied:
- Sage Green (#9CAE8C) - Primary CTA buttons
- Soft Black (#111111) - Text
- Brushed Beige (#F7F4EF) - Section backgrounds
- Poppins (headings) + Inter (body) fonts

### Smart Personalization:
- Automatically shows on products tagged:
  - `personalized`
  - `custom`
  - `sublimation`
- Fields adjust based on product type (bridesmaid, kids, etc.)

### Mobile-Optimized:
- All sections responsive
- Touch-friendly forms
- Looks great on all devices

---

## 📋 Installation

**See `DEPLOY_GUIDE.md` for detailed instructions.**

Quick version:

1. Pull your Impulse theme with Shopify CLI
2. Copy files to theme directories
3. Push to Shopify
4. Add sections in theme customizer
5. Link CSS in theme.liquid
6. Tag products for personalization

---

## 🎨 Customization

All brand colors are in `/assets/shelzy-custom.css`:

```css
:root {
  --shelzy-sage: #9CAE8C;
  --shelzy-black: #111111;
  --shelzy-beige: #F7F4EF;
  /* etc. */
}
```

Change these to update colors site-wide.

---

## 📁 File Structure

```
/shopify-theme/
├── sections/
│   ├── shelzy-hero.liquid
│   ├── shelzy-why-sublimation.liquid
│   ├── shelzy-how-it-works.liquid
│   └── shelzy-email-signup.liquid
├── snippets/
│   └── product-personalization.liquid
├── assets/
│   └── shelzy-custom.css
├── deploy.sh
├── DEPLOY_GUIDE.md
└── README.md (this file)
```

---

## ✅ Next Steps

1. **Deploy files** (use `deploy.sh` or follow `DEPLOY_GUIDE.md`)
2. **Configure homepage** (add sections in customizer)
3. **Import products** (use `/shopify/PRODUCTS_IMPORT.csv`)
4. **Add images** (to products and sections)
5. **Test** (personalization, mobile, checkout)

---

**For detailed instructions, see `DEPLOY_GUIDE.md`**
