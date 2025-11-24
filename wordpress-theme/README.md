# ShelzyPerkins.com - WordPress Affiliate Site

**Complete WordPress theme and content for Amazon affiliate marketing site**

---

## 📦 What's Included

### WordPress Theme
- **Location:** `shelzyperkins-theme/` or `shelzyperkins-theme.zip`
- Custom affiliate-focused WordPress theme
- Automatic Amazon affiliate link management (tag: shelzysdesigns-20)
- Product card and comparison table shortcodes
- SEO-optimized and mobile-responsive
- Coral & yellow branding

### Content Ready to Publish
- **6 Blog Posts** – Ready-to-publish Amazon affiliate content (in `../wordpress-content/blog-posts/`)
- **4 Essential Pages** – About, Contact, Privacy Policy, Affiliate Disclosure (in `../wordpress-content/pages/`)

### Documentation
- **DEPLOYMENT-GUIDE.md** – Complete step-by-step deployment instructions

---

## 🚀 Quick Start

### 1. Download Theme ZIP
**File:** `shelzyperkins-theme.zip`

This ZIP file is ready to upload directly to WordPress.

### 2. Upload to WordPress

1. Log into WordPress: **https://shelzyperkins.com/wp-admin**
2. Go to: **Appearance → Themes → Add New → Upload Theme**
3. Upload `shelzyperkins-theme.zip`
4. Activate the theme

### 3. Follow Deployment Guide

Open **DEPLOYMENT-GUIDE.md** for complete step-by-step instructions including:
- Theme upload and activation
- Page creation
- Blog post import
- Settings configuration
- Plugin recommendations

---

## ✨ Theme Features

### Affiliate Marketing Features
- ✅ Automatic Amazon affiliate tag injection (shelzysdesigns-20)
- ✅ `[affiliate_disclosure]` shortcode
- ✅ `[amazon_button]` shortcode for styled CTAs
- ✅ `[product_card]` shortcode for product showcases
- ✅ `[amazon_search]` shortcode for search links
- ✅ All Amazon links open in new tab with nofollow

### Design Features
- ✅ Clean, modern design
- ✅ Mobile-responsive
- ✅ Fast-loading (minimal dependencies)
- ✅ Coral (#FF6B6B) & yellow (#FFD93D) branding
- ✅ Easy-to-read typography (Poppins + Inter)

### SEO Features
- ✅ Semantic HTML5 markup
- ✅ Automatic meta descriptions
- ✅ Clean URL structure
- ✅ Schema-ready markup
- ✅ Fast page load times

---

## 📝 Shortcode Usage

### Affiliate Disclosure
```
[affiliate_disclosure]
```
Displays FTC-compliant affiliate disclosure box.

### Amazon Button
```
[amazon_button url="https://amazon.com/..." text="Shop Now"]
```
Creates styled button with automatic affiliate tag.

### Product Card
```
[product_card
    title="Product Name"
    price="$29.99"
    url="https://amazon.com/..."
    features="Feature 1, Feature 2, Feature 3"
    button_text="Check Price"]
```
Creates attractive product showcase card.

### Amazon Search
```
[amazon_search keywords="yoga mat" text="Find on Amazon"]
```
Creates search link for Amazon with your affiliate tag.

---

## 🎨 Customization

### Changing Colors

Edit `style.css` and modify the `:root` variables:

```css
:root {
    --primary-coral: #FF6B6B;  /* Main brand color */
    --primary-yellow: #FFD93D;  /* Accent color */
    --dark-gray: #2C3E50;       /* Text color */
    /* ... more colors ... */
}
```

### Changing Affiliate Tag

Edit `functions.php` and modify:

```php
$affiliate_tag = 'shelzysdesigns-20';
```

Change to your Amazon Associates tracking ID.

---

## 📂 File Structure

```
wordpress-theme/
├── shelzyperkins-theme/         # Main theme directory
│   ├── style.css               # Theme styles & header
│   ├── functions.php           # Theme functionality & shortcodes
│   ├── index.php               # Main template
│   ├── header.php              # Site header
│   ├── footer.php              # Site footer
│   ├── single.php              # Single post template
│   ├── page.php                # Page template
│   └── archive.php             # Archive/category template
├── shelzyperkins-theme.zip     # Ready-to-upload theme ZIP
├── DEPLOYMENT-GUIDE.md         # Step-by-step setup instructions
└── README.md                   # This file
```

---

## ✅ Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] WordPress installed at shelzyperkins.com
- [ ] WordPress admin access
- [ ] Theme ZIP file (`shelzyperkins-theme.zip`)
- [ ] Blog post content files
- [ ] Page content files
- [ ] Read DEPLOYMENT-GUIDE.md

---

## 🔧 Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern web browser
- Amazon Associates account (tracking ID: shelzysdesigns-20)

---

## 📊 Recommended Plugins

These plugins enhance your affiliate site (all free):

- **Rank Math SEO** – SEO optimization
- **LiteSpeed Cache** – Speed optimization
- **Pretty Links** – Link management and tracking
- **MailChimp for WordPress** – Email capture
- **Smush** – Image compression
- **WPForms Lite** – Contact forms

---

## 🆘 Support

### Documentation
- **Deployment Guide:** See DEPLOYMENT-GUIDE.md
- **WordPress Codex:** [wordpress.org/support](https://wordpress.org/support)

### Services
- **GoDaddy Support:** 1-480-505-8877
- **Amazon Associates:** [affiliate-program.amazon.com/support](https://affiliate-program.amazon.com/support)

---

## 📈 Next Steps After Deployment

1. **Complete Setup** – Follow DEPLOYMENT-GUIDE.md
2. **Publish Posts** – Import and publish the 6 ready blog posts
3. **Install Plugins** – Add Rank Math SEO and caching plugin
4. **Set Up Analytics** – Add Google Analytics tracking
5. **Create Pinterest** – Start pinning content for traffic
6. **Write More Content** – Aim for 2-3 posts per week

---

## 📄 License

This theme is built specifically for ShelzyPerkins.com.

---

## 🎉 Ready to Deploy!

Everything you need is here. Follow the DEPLOYMENT-GUIDE.md and you'll have a live affiliate site in under an hour!

**Questions?** Check the deployment guide or contact support.

Good luck building your affiliate income! 🚀
