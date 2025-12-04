# Remove Blog from Shelzy's Designs

## Option 1: Hide Blog (Recommended - Reversible)

### Step 1: Remove from Navigation
1. **Shopify Admin > Online Store > Navigation**
2. Click **Main Menu**
3. Find and delete any "Blog" or "News" links
4. Click **Save**

### Step 2: Remove from Footer
1. **Shopify Admin > Online Store > Navigation**
2. Click **Footer Menu**
3. Remove any blog links
4. Click **Save**

### Step 3: Hide Blog Link in Theme
1. **Online Store > Themes > Customize**
2. Check Header and Footer sections
3. Remove any blog references
4. Save

---

## Option 2: Delete All Blog Posts (Permanent)

### Bulk Delete Posts
1. **Shopify Admin > Online Store > Blog Posts**
2. Check the box to select all posts
3. Click **Actions > Delete selected blog posts**
4. Confirm deletion

### Delete the Blog Itself
1. **Shopify Admin > Online Store > Blog Posts**
2. Click **Manage blogs**
3. Click on "News" (or your blog name)
4. Scroll down and click **Delete blog**

---

## Option 3: Redirect Blog URLs (Best for SEO)

If posts have been indexed by Google, redirect them to avoid 404s.

### Add Redirects for Top Posts
Add these to **Online Store > Navigation > URL Redirects**:

```
/blogs/news/* → /collections/all
```

Or redirect individual high-traffic posts:
```
/blogs/news/best-bridesmaid-gift-ideas-2025 → /collections/bridesmaid-bridal
/blogs/news/holiday-gift-guide-personalized-gifts-2025 → /collections/holiday
/blogs/news/best-kids-water-bottles-school-2025 → /products/kids-personalized-bottle
```

---

## Bulk Redirect CSV

Save and import this to redirect all blog traffic to collections:

```csv
Redirect from,Redirect to
/blogs/news/best-bridesmaid-gift-ideas-2025,/collections/bridesmaid-bridal
/blogs/news/what-to-put-in-a-bridesmaid-proposal-box-2025-guide,/collections/proposal-gift-boxes
/blogs/news/the-ultimate-bridesmaid-proposal-guide,/collections/proposal-gift-boxes
/blogs/news/how-to-ask-bridesmaids-proposal-ideas,/collections/proposal-gift-boxes
/blogs/news/the-best-bridal-party-gifts-under-50-2025-guide,/collections/bridesmaid-bridal
/blogs/news/best-kids-water-bottles-school-2025,/products/kids-personalized-bottle
/blogs/news/holiday-gift-guide-personalized-gifts-2025,/collections/holiday
/blogs/news/corporate-gift-ideas-employees-love,/pages/bulk-corporate
/blogs/news,/collections/all
```

---

## Quick Steps Summary

1. Remove blog from navigation menus
2. Set up redirects (optional but recommended)
3. Delete blog posts
4. Delete the blog

**Time needed:** 10-15 minutes

