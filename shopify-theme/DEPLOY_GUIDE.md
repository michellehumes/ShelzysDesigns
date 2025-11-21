# Shelzy's Designs - Shopify CLI Deployment Guide

**Deploy your custom sections and brand styling to Impulse theme**

---

## 📋 What You're Installing

✅ **4 Custom Homepage Sections:**
- Hero section with brand colors
- Why Sublimation explanation
- How It Works (3 steps)
- Email signup

✅ **Brand Styling (CSS):**
- Shelzy's color palette (#9CAE8C sage, #111111 black, etc.)
- Poppins & Inter fonts
- Custom button styles
- Branded forms

✅ **Product Personalization:**
- Name input fields
- Font/color selectors
- Icon choices
- Auto-displays on tagged products

---

## 🚀 Quick Start (5 Minutes)

### Option A: Automated Deployment (Recommended)

```bash
# 1. Navigate to your Shopify theme directory
cd /path/to/your/theme

# 2. Copy deployment files
cp -r /home/user/ShelzysDesigns/shopify-theme/* .

# 3. Run deployment script
./deploy.sh
```

That's it! Skip to "Step 3: Configure Sections" below.

---

### Option B: Manual Deployment (If script doesn't work)

Follow Step 1 and Step 2 below.

---

## STEP 1: Install Shopify CLI (If Not Already Installed)

```bash
# Check if installed
shopify version

# If not installed:
npm install -g @shopify/cli @shopify/theme
```

---

## STEP 2: Pull Your Impulse Theme

```bash
# Login to your Shopify store
shopify login --store your-store.myshopify.com

# List your themes
shopify theme list

# Pull your Impulse theme (replace ID with your theme ID)
shopify theme pull --theme=THEME_ID

# This creates a local copy of your theme
```

---

## STEP 3: Add Custom Files to Theme

### Method 1: Using CLI Commands

```bash
# Navigate to your theme directory
cd your-theme-directory

# Copy sections
cp /home/user/ShelzysDesigns/shopify-theme/sections/*.liquid sections/

# Copy snippets
cp /home/user/ShelzysDesigns/shopify-theme/snippets/*.liquid snippets/

# Copy CSS
cp /home/user/ShelzysDesigns/shopify-theme/assets/shelzy-custom.css assets/

# Push changes to Shopify
shopify theme push
```

### Method 2: Manual Upload via Admin

If CLI doesn't work:

1. Go to **Online Store > Themes > Actions > Edit code**

2. **Add Sections:**
   - Click **Add a new section**
   - Name: `shelzy-hero`
   - Copy content from `/shopify-theme/sections/shelzy-hero.liquid`
   - Paste and save
   - Repeat for:
     - `shelzy-why-sublimation`
     - `shelzy-how-it-works`
     - `shelzy-email-signup`

3. **Add Snippet:**
   - Click **Add a new snippet**
   - Name: `product-personalization`
   - Copy content from `/shopify-theme/snippets/product-personalization.liquid`
   - Paste and save

4. **Add CSS:**
   - In **Assets** folder, click **Add a new asset**
   - Create blank file: `shelzy-custom.css`
   - Copy content from `/shopify-theme/assets/shelzy-custom.css`
   - Paste and save

---

## STEP 4: Link CSS to Theme

You need to include the custom CSS in your theme.

### Find theme.liquid

1. Go to **Layout > theme.liquid**
2. Find the `</head>` closing tag (usually around line 200-300)
3. **Add this line BEFORE `</head>`:**

```liquid
{{ 'shelzy-custom.css' | asset_url | stylesheet_tag }}
```

4. **Save**

---

## STEP 5: Add Sections to Homepage

1. Go to **Online Store > Themes > Customize**

2. **On Homepage**, click **Add section**

3. **Add sections in this order:**
   - Shelzy Hero
   - (Existing) Featured collection (rename to "Best Sellers")
   - Shelzy Why Sublimation
   - Shelzy How It Works
   - (Optional) Reviews section
   - Shelzy Email Signup

4. **Configure each section:**

**Shelzy Hero:**
- Title: "Premium Personalized Sublimation Water Bottles"
- Subtitle: "Custom-made bottles for bridesmaids, weddings, holidays, and every day in between."
- Button text: "Shop Best Sellers"
- Button link: `/collections/all` or `/collections/best-sellers`
- Upload hero image (or leave placeholder)

**Shelzy Why Sublimation:**
- Use default text (it's already filled in)

**Shelzy How It Works:**
- No configuration needed (uses defaults)

**Shelzy Email Signup:**
- Use defaults or customize text

5. **Save**

---

## STEP 6: Add Personalization to Product Pages

### Option A: Using the Snippet (Recommended)

1. Go to **Sections > product-template.liquid** (or **main-product.liquid** for newer themes)

2. Find the line with the **Add to Cart button**. Look for:
```liquid
<button type="submit" name="add" class="...">
```

3. **Add this line BEFORE the Add to Cart button:**
```liquid
{% render 'product-personalization', product: product %}
```

4. **Save**

Now personalization fields will automatically appear on products tagged with `personalized`, `custom`, or `sublimation`.

### Option B: Manual Fields

If snippet doesn't work, copy the HTML form fields from `/shopify/CUSTOMIZATION_FIELDS.md` and paste them directly into the product template.

---

## STEP 7: Tag Your Products

For personalization to appear, products need tags:

1. Go to **Products > [Product Name]**
2. In **Tags**, add:
   - `personalized`
   - `sublimation`
   - `custom`
3. **Save**

Do this for all personalized bottles.

---

## STEP 8: Test Everything

### Test Personalization:
1. Go to a product page
2. You should see personalization fields
3. Fill them out
4. Add to cart
5. Check cart - custom data should show

### Test Homepage:
1. View your homepage
2. All new sections should appear
3. Check mobile view
4. Test email signup form

### Test Brand Colors:
1. All buttons should be sage green (#9CAE8C)
2. Hover should be darker sage (#7C9F8C)
3. Fonts should be Poppins for headings

---

## STEP 9: Import Products

Now that your theme is ready, import your products:

1. Go to **Products > All products > Import**
2. Upload `/shopify/PRODUCTS_IMPORT.csv`
3. Review and import
4. You'll have 7 products with variants instantly

**Then:**
- Add images to each product
- Verify customization fields show (add tags if needed)
- Set up collections

---

## 🎨 Customizing Further

### Change Colors

Edit `/assets/shelzy-custom.css`:

```css
:root {
  --shelzy-sage: #9CAE8C;  /* Change this to your preferred color */
  --shelzy-black: #111111;
  --shelzy-beige: #F7F4EF;
}
```

### Change Fonts

In `shelzy-custom.css`, update:

```css
body {
  font-family: 'Your Font', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Your Heading Font', sans-serif;
}
```

---

## 🐛 Troubleshooting

### Sections Don't Appear in Customizer
**Solution:** Make sure files are in `/sections/` folder and have `.liquid` extension

### CSS Not Loading
**Solution:** Check that you added the stylesheet tag to `theme.liquid` before `</head>`

### Personalization Fields Don't Show
**Solution:**
1. Check that snippet is in `/snippets/` folder
2. Verify you added `{% render 'product-personalization' %}` to product template
3. Ensure product has tag `personalized`, `custom`, or `sublimation`

### CLI Push Fails
**Solution:**
```bash
# Re-login
shopify login --store your-store.myshopify.com

# Try pushing with development flag
shopify theme push --development
```

### Deployment Script Won't Run
**Solution:**
```bash
# Make it executable
chmod +x deploy.sh

# Run with bash explicitly
bash deploy.sh
```

---

## 📋 Deployment Checklist

- [ ] Shopify CLI installed
- [ ] Logged into store
- [ ] Theme pulled locally
- [ ] Custom sections copied to `/sections/`
- [ ] Custom snippet copied to `/snippets/`
- [ ] Custom CSS copied to `/assets/`
- [ ] CSS linked in `theme.liquid`
- [ ] Changes pushed to Shopify
- [ ] Sections added to homepage
- [ ] Personalization snippet added to product template
- [ ] Products tagged for personalization
- [ ] Tested on live site
- [ ] Mobile tested
- [ ] Products imported

---

## 🎉 You're Done!

Your Impulse theme now has:
✅ Custom Shelzy's Designs sections
✅ Brand colors and fonts
✅ Product personalization fields
✅ Ready for products to be added

---

## 📞 Need Help?

**CLI Issues:**
- Shopify CLI Docs: https://shopify.dev/docs/themes/tools/cli

**Theme Issues:**
- Impulse Theme Docs: https://support.shopify.com/themes

**File Locations:**
- Sections: `/shopify-theme/sections/`
- Snippets: `/shopify-theme/snippets/`
- CSS: `/shopify-theme/assets/`
- Deployment script: `/shopify-theme/deploy.sh`

---

**Version:** 1.0
**Last Updated:** November 2025
