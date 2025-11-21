# 🚀 Deploy Shelzy's Designs to Your Shopify Store

**Quick deployment instructions for shelzys-designs.myshopify.com**

---

## ⚡ Quick Deploy (On Your Computer)

Since I can't authenticate to Shopify from here, **run this on your local machine:**

### Option 1: Automated Script (Easiest)

```bash
# 1. Download this repository to your computer
# 2. Open Terminal and navigate to the folder
cd /path/to/ShelzysDesigns

# 3. Run the deployment script
./DEPLOY_NOW.sh
```

The script will:
- Install Shopify CLI (if needed)
- Authenticate with your store
- Pull your Impulse theme
- Add custom sections
- Push back to Shopify

---

### Option 2: Manual Steps (If script doesn't work)

```bash
# 1. Install Shopify CLI (if not already installed)
npm install -g @shopify/cli @shopify/theme

# 2. Login to your store
shopify auth login --store=shelzys-designs.myshopify.com

# 3. List your themes to find the ID
shopify theme list --store=shelzys-designs.myshopify.com

# 4. Pull your Impulse theme (replace THEME_ID with actual ID)
shopify theme pull --theme=THEME_ID --store=shelzys-designs.myshopify.com

# 5. Copy custom files
cd your-theme-directory
cp /path/to/ShelzysDesigns/shopify-theme/sections/*.liquid sections/
cp /path/to/ShelzysDesigns/shopify-theme/snippets/*.liquid snippets/
cp /path/to/ShelzysDesigns/shopify-theme/assets/*.css assets/

# 6. Push to Shopify
shopify theme push --theme=THEME_ID --store=shelzys-designs.myshopify.com
```

---

## 🎨 After Deployment: Configure in Shopify Admin

### 1. Add Sections to Homepage (5 minutes)

Go to: https://admin.shopify.com/store/shelzys-designs/themes/current/editor

1. Click **"Add section"**
2. Find and add these sections in order:
   - **Shelzy Hero**
   - Featured Collection (rename to "Best Sellers")
   - **Shelzy Why Sublimation**
   - **Shelzy How It Works**
   - **Shelzy Email Signup**

3. **Configure Shelzy Hero:**
   - Title: "Premium Personalized Sublimation Water Bottles"
   - Subtitle: "Custom-made bottles for bridesmaids, weddings, holidays, and every day in between."
   - Button text: "Shop Best Sellers"
   - Button link: `/collections/all`
   - Upload image (or leave placeholder for now)

4. **Save**

---

### 2. Link Custom CSS (2 minutes)

Go to: **Online Store > Themes > Actions > Edit code**

1. Open **Layout > theme.liquid**
2. Find the `</head>` tag (around line 200-300)
3. **Add this line BEFORE `</head>`:**
   ```liquid
   {{ 'shelzy-custom.css' | asset_url | stylesheet_tag }}
   ```
4. **Save**

---

### 3. Enable Product Personalization (3 minutes)

Still in **Edit code**:

1. Open **Sections > product-template.liquid** (or `main-product.liquid` for newer Impulse)
2. Find the "Add to Cart" button - look for:
   ```liquid
   <button type="submit" name="add"
   ```
3. **Add this line BEFORE the button:**
   ```liquid
   {% render 'product-personalization', product: product %}
   ```
4. **Save**

---

### 4. Import Products (2 minutes)

Go to: **Products > Import**

1. Click **"Add file"**
2. Upload: `/shopify/PRODUCTS_IMPORT.csv` (from this repository)
3. Click **"Upload and continue"**
4. Review and **Import products**

You'll get 7 products instantly!

---

### 5. Tag Products for Personalization (2 minutes)

Go to: **Products > All products**

For each personalized product:
1. Click the product name
2. Scroll to **"Tags"**
3. Add these tags: `personalized`, `custom`, `sublimation`
4. **Save**

Now personalization fields will auto-appear on those products!

---

## ✅ Complete Checklist

- [ ] Run `DEPLOY_NOW.sh` on your computer (or manual steps)
- [ ] Sections added to homepage (via Customize)
- [ ] Custom CSS linked in theme.liquid
- [ ] Personalization snippet added to product template
- [ ] Products imported from CSV
- [ ] Products tagged: `personalized`, `custom`, `sublimation`
- [ ] Test personalization on product page
- [ ] Test mobile view
- [ ] Review and launch!

---

## 🎯 Your Store Links

**Admin:** https://admin.shopify.com/store/shelzys-designs
**Theme Editor:** https://admin.shopify.com/store/shelzys-designs/themes/current/editor
**Products:** https://admin.shopify.com/store/shelzys-designs/products
**Edit Code:** https://admin.shopify.com/store/shelzys-designs/themes/current

---

## 🐛 Troubleshooting

### "I don't have Shopify CLI"
Install it:
```bash
npm install -g @shopify/cli @shopify/theme
```

### "Authentication fails"
Make sure you're an admin on the store. Run:
```bash
shopify auth logout
shopify auth login --store=shelzys-designs.myshopify.com
```

### "Can't find theme ID"
Use the live theme:
```bash
shopify theme push --live --store=shelzys-designs.myshopify.com
```

### "Files didn't copy"
Check that you're in the right directory with the custom files. The files are in:
- `/shopify-theme/sections/`
- `/shopify-theme/snippets/`
- `/shopify-theme/assets/`

---

## 📞 Need Help?

**Full detailed guide:** `/shopify-theme/DEPLOY_GUIDE.md`
**Quick reference:** `/CLI_DEPLOYMENT_INSTRUCTIONS.md`

---

## 🎉 You're Almost There!

**Total time:** 20-30 minutes to complete deployment and configuration

**After this, you'll have:**
✅ Custom branded homepage
✅ Product personalization working
✅ Brand colors and fonts applied
✅ Ready to add images and launch!

---

**Run `./DEPLOY_NOW.sh` on your computer to start!**
