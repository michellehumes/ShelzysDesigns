# ShelzyPerkins.com WordPress Deployment Guide

**Complete step-by-step instructions for deploying your Amazon affiliate WordPress site**

---

## 📋 What You're Deploying

- ✅ Custom WordPress theme with affiliate features
- ✅ 6 ready-to-publish blog posts with Amazon affiliate links
- ✅ 4 essential pages (About, Contact, Privacy Policy, Affiliate Disclosure)
- ✅ Automatic affiliate link management
- ✅ Product card and comparison table shortcodes
- ✅ SEO-optimized structure

---

## ⏱️ Time Required

- **Theme Upload & Activation:** 5 minutes
- **Page Import:** 10 minutes
- **Blog Post Import:** 15 minutes
- **Settings & Configuration:** 15 minutes
- **Total:** ~45 minutes

---

## 🚀 Phase 1: Upload & Activate Theme (5 minutes)

### Step 1: Create Theme ZIP File

**On your computer:**
1. Navigate to: `wordpress-theme/shelzyperkins-theme/`
2. Select ALL files in this folder:
   - `style.css`
   - `functions.php`
   - `index.php`
   - `header.php`
   - `footer.php`
   - `single.php`
   - `page.php`
   - `archive.php`
3. Right-click → "Compress" (Mac) or "Send to → Compressed folder" (Windows)
4. Name the ZIP file: **shelzyperkins-theme.zip**

### Step 2: Upload to WordPress

1. Log into WordPress: **https://shelzyperkins.com/wp-admin**
   - Email: michelle.e.humes@gmail.com
   - Password: Perkins@22

2. Go to: **Appearance → Themes**

3. Click **Add New** (top of page)

4. Click **Upload Theme**

5. Click **Choose File** and select **shelzyperkins-theme.zip**

6. Click **Install Now**

7. After installation completes, click **Activate**

**✅ Success!** Your theme is now active.

---

## 📄 Phase 2: Create Essential Pages (10 minutes)

You need to create 4 pages. Here's how to create each one:

### Create Each Page

For each page, follow these steps:

1. Go to: **Pages → Add New**

2. Add the page title (see list below)

3. Copy the content from the corresponding file in `wordpress-content/pages/`

4. Paste into the WordPress editor

5. Click **Publish**

### Pages to Create

| Page Title | Content File | URL Slug |
|------------|--------------|----------|
| About | about.md | about |
| Contact | contact.md | contact |
| Privacy Policy | privacy-policy.md | privacy-policy |
| Affiliate Disclosure | affiliate-disclosure.md | affiliate-disclosure |

**Pro Tip:** WordPress will automatically create clean URLs like `shelzyperkins.com/about`

### After Creating All Pages

1. Go to: **Settings → Reading**
2. Set "Homepage displays" to: **Your latest posts**
3. Click **Save Changes**

---

## 📝 Phase 3: Import Blog Posts (15 minutes)

### Method 1: Manual Import (Recommended for First-Time)

For each blog post in `wordpress-content/blog-posts/`:

1. Go to: **Posts → Add New**

2. **Add Title:**
   - Remove "BLOG_POST_" prefix
   - Example: "amazon-beauty-under-30" becomes "12 Amazon Beauty Must-Haves Under $30"

3. **Copy Content:**
   - Open the .md file
   - Copy all content
   - Paste into WordPress editor

4. **Add Categories:**
   - In right sidebar, click **+ Add New Category**
   - Suggested categories:
     - Deals
     - Beauty
     - Home & Organization
     - Travel
     - Fitness & Wellness
     - Pets

5. **Add Tags:**
   - amazon finds
   - deals
   - product reviews
   - [specific category, e.g., "beauty", "organization"]

6. **Add Featured Image (Optional but Recommended):**
   - Click "Set featured image" in right sidebar
   - Upload or find free images from [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
   - Search for keywords from the post title

7. **Add Affiliate Disclosure:**
   - At the top of each post, add: `[affiliate_disclosure]`
   - This automatically displays the disclosure box

8. Click **Publish**

### Blog Posts to Import

1. **amazon-beauty-under-30.md** → "12 Amazon Beauty Must-Haves Under $30"
   - Category: Beauty, Deals
   - Tags: amazon beauty, skincare, beauty tools

2. **amazon-organization-finds.md** → "15 Viral Amazon Organization Finds That Actually Work"
   - Category: Home & Organization, Deals
   - Tags: organization, amazon finds, storage

3. **home-office-must-haves.md** → "15 Work From Home Office Must-Haves on Amazon"
   - Category: Home & Organization, Tech
   - Tags: home office, work from home, productivity

4. **travel-essentials.md** → "20 Amazon Travel Essentials for Your Next Trip"
   - Category: Travel, Deals
   - Tags: travel essentials, packing, vacation

5. **fitness-wellness.md** → "15 Amazon Fitness & Wellness Finds to Level Up Your Routine"
   - Category: Fitness & Wellness, Deals
   - Tags: fitness, wellness, workout essentials

6. **dog-mom-essentials.md** → "15 Amazon Dog Mom Essentials Your Pup Will Love"
   - Category: Pets, Deals
   - Tags: dog mom, pet essentials, dog products

---

## ⚙️ Phase 4: Configure Settings (15 minutes)

### 1. Permalinks (CRITICAL for SEO)

1. Go to: **Settings → Permalinks**
2. Select: **Post name**
3. Click **Save Changes**

**Why:** This creates clean URLs like `shelzyperkins.com/amazon-beauty-finds` instead of `shelzyperkins.com/?p=123`

### 2. Create Navigation Menu

1. Go to: **Appearance → Menus**
2. Click **Create a new menu**
3. Name it: "Primary Menu"
4. Check: **Primary Menu** under "Display location"
5. Click **Create Menu**

6. Add pages to menu:
   - In left sidebar, expand **Pages**
   - Select: Home, About, Contact
   - Click **Add to Menu**

7. Drag to arrange:
   ```
   Home
   Blog
   About
   Contact
   ```

8. Click **Save Menu**

### 3. Create Footer Menu

1. Click **create a new menu** again
2. Name it: "Footer Menu"
3. Check: **Footer Menu** under "Display location"
4. Add pages:
   - Privacy Policy
   - Affiliate Disclosure
5. Click **Save Menu**

### 4. Configure Blog Settings

1. Go to: **Settings → General**
   - **Site Title:** ShelzyPerkins
   - **Tagline:** "Amazon Deals & Product Reviews That Save You Money"
2. Click **Save Changes**

3. Go to: **Settings → Reading**
   - **Blog pages show at most:** 10 posts
4. Click **Save Changes**

4. Go to: **Settings → Discussion**
   - ✅ Check "Email me whenever anyone posts a comment"
   - ✅ Check "Comment author must have a previously approved comment"
5. Click **Save Changes**

---

## 📊 Phase 5: Install Recommended Plugins (Optional but Recommended)

These plugins will supercharge your affiliate site:

### Essential Plugins

1. **Rank Math SEO** (FREE)
   - Go to: **Plugins → Add New**
   - Search: "Rank Math SEO"
   - Click **Install Now** → **Activate**
   - Follow setup wizard (choose "Easy" mode)

2. **LiteSpeed Cache** or **WP Super Cache** (FREE)
   - Speeds up your site significantly
   - Install and activate
   - Use default settings

3. **Pretty Links** (FREE)
   - Manages and tracks your affiliate links
   - Go to: **Pretty Links → Add New**
   - Create short links like `shelzyperkins.com/go/amazon-beauty`

4. **MailChimp for WordPress** (FREE)
   - Add email signup forms
   - Connect your Mailchimp account

### Nice-to-Have Plugins

- **Smush** – Image compression
- **WPForms Lite** – Contact form builder
- **Yoast Duplicate Post** – Easily duplicate posts as templates

---

## 🎨 Phase 6: Customization & Branding

### Add Logo (Optional)

1. Go to: **Appearance → Customize → Site Identity**
2. Upload your logo
3. Click **Publish**

### Customize Colors (If Desired)

The theme uses coral (#FF6B6B) and yellow (#FFD93D) by default.

To change colors:
1. Go to: **Appearance → Theme Editor**
2. Select **style.css**
3. Find `:root {` section (top of file)
4. Change color values
5. Click **Update File**

---

## ✅ Phase 7: Final Checks

### Pre-Launch Checklist

- [ ] Theme is activated
- [ ] All 4 pages are published
- [ ] All 6 blog posts are published
- [ ] Primary menu is set up
- [ ] Footer menu is set up
- [ ] Permalinks are set to "Post name"
- [ ] Site title and tagline are set
- [ ] Test Amazon links open in new tab with affiliate tag

### Test Your Affiliate Links

1. Open any blog post
2. Click an Amazon link
3. Check that:
   - Link opens in a new tab
   - URL contains `tag=shelzysdesigns-20`
   - You're redirected to Amazon properly

**✅ If yes to all three, your affiliate links are working!**

---

## 🚀 Phase 8: Go Live!

### Announce Your Launch

1. **Social Media:**
   - Share your first blog post on Pinterest
   - Post about your launch on any social channels

2. **Tell Friends & Family:**
   - Send an email to your contacts
   - Ask them to check it out and provide feedback

3. **Start Publishing:**
   - Aim for 2-3 new posts per week
   - Consistency is key!

---

## 📈 Phase 9: Ongoing Optimization

### Weekly Tasks

- [ ] Publish 2-3 new blog posts
- [ ] Pin new posts to Pinterest (3-5 pins per post)
- [ ] Respond to any comments
- [ ] Check Amazon affiliate dashboard for earnings

### Monthly Tasks

- [ ] Update old posts with new products
- [ ] Review Google Analytics (install it!)
- [ ] Check for broken Amazon links
- [ ] Refresh seasonal content

---

## 🛠️ Troubleshooting

### Theme Doesn't Look Right

**Problem:** Theme looks broken or unstyled
**Solution:**
1. Go to **Appearance → Themes**
2. Make sure "ShelzyPerkins Affiliate Theme" is activated
3. Clear your browser cache (Ctrl+Shift+R)

### Amazon Links Don't Have Affiliate Tag

**Problem:** Clicked link doesn't show `tag=shelzysdesigns-20`
**Solution:**
- The theme automatically adds this to all Amazon.com links
- Make sure you're using regular amazon.com URLs (not shortened links)
- The tag is added automatically on click

### Menu Not Showing

**Problem:** Navigation menu is empty
**Solution:**
1. Go to **Appearance → Menus**
2. Make sure "Primary Menu" is assigned to "Primary Menu" location
3. Click **Save Menu**

### Shortcodes Not Working

**Problem:** `[affiliate_disclosure]` shows as text
**Solution:**
- Make sure theme is activated
- Check that you're using the **Visual** editor, not "Code" mode
- Refresh the page

---

## 🎯 Success Metrics to Track

Once live, track these metrics:

### Traffic
- Pageviews per day/month
- Top-performing posts
- Traffic sources (Google, Pinterest, etc.)

### Engagement
- Time on page (aim for 2+ minutes)
- Bounce rate (aim for <70%)
- Comments and shares

### Revenue
- Amazon affiliate clicks
- Amazon affiliate earnings
- Conversion rate (clicks to sales)

**Tools to Use:**
- Google Analytics (free)
- Amazon Associates Dashboard
- Google Search Console (free)

---

## 📧 Need Help?

If you get stuck or have questions:

1. **WordPress Support:** [wordpress.org/support](https://wordpress.org/support)
2. **Amazon Associates Support:** [affiliate-program.amazon.com/support](https://affiliate-program.amazon.com/support)
3. **GoDaddy Support:** 1-480-505-8877

---

## 🎉 Congratulations!

You now have a fully functional Amazon affiliate WordPress site!

**Next Steps:**
1. ✅ Complete the deployment checklist
2. ✅ Publish your first 6 posts
3. ✅ Start creating Pinterest pins
4. ✅ Write 2-3 new posts per week
5. ✅ Track your progress and earnings

**Let's build that passive income! 🚀**

---

*Last Updated: November 2025*
