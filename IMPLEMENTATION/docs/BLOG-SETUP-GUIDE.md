# Blog Setup Guide

## Overview
Setting up the Shelzy's Designs blog for SEO traffic and Amazon affiliate revenue.

---

## Step 1: Create Blog in Shopify

### Navigate to Blog Posts
1. Shopify Admin > Online Store > Blog posts
2. Click "Manage blogs"
3. Create new blog: "News" or "Style Guide"

### Blog Settings
- **Title:** Shelzy's Style Guide (or similar)
- **Handle:** style-guide
- **Comments:** Enabled, moderated
- **SEO title:** Shelzy's Designs Blog | Gifting Ideas & Style Tips

---

## Step 2: Create Blog Template

### Option A: Use Default Blog Template
Most themes include a default blog template that works well.

### Option B: Custom Template
If creating custom template, include:
- Blog post grid
- Sidebar with categories
- Newsletter signup
- Related posts
- Social sharing

---

## Step 3: Publish Blog Posts

### Available Draft Posts
Located in `/amazon-affiliate/blog/drafts/`:

1. **Fitness & Wellness**
   - File: `BLOG_POST_fitness-wellness.md`
   - Target keyword: "fitness gifts"

2. **Travel Essentials**
   - File: `BLOG_POST_travel-essentials.md`
   - Target keyword: "travel must-haves"

3. **Dog Mom Essentials**
   - File: `BLOG_POST_dog-mom-essentials.md`
   - Target keyword: "dog mom gifts"

4. **Amazon Organization Finds**
   - File: `BLOG_POST_amazon-organization-finds.md`
   - Target keyword: "amazon organization"

5. **Home Office Must-Haves**
   - File: `BLOG_POST_home-office-must-haves.md`
   - Target keyword: "home office essentials"

6. **Amazon Beauty Under $30**
   - File: `BLOG_POST_amazon-beauty-under-30.md`
   - Target keyword: "amazon beauty finds"

### Publishing Process
1. Copy content from markdown file
2. Create new blog post in Shopify
3. Add title, content, and featured image
4. Add SEO meta title and description
5. Add Amazon affiliate links
6. Add internal product links
7. Publish

---

## Step 4: Amazon Affiliate Setup

### Create Amazon Associates Account
1. Go to affiliate-program.amazon.com
2. Sign up with business email
3. Complete profile
4. Get tracking ID (e.g., shelzysdesigns-20)

### Add Affiliate Links to Posts
```html
<!-- Example affiliate link format -->
<a href="https://www.amazon.com/dp/ASIN?tag=shelzysdesigns-20"
   rel="nofollow sponsored"
   target="_blank">Product Name</a>
```

### Disclosure Requirements
Add to every post with affiliate links:
```html
<p class="affiliate-disclosure">
  <em>Disclosure: This post contains affiliate links.
  We may earn a small commission at no extra cost to you.</em>
</p>
```

---

## Step 5: Add Blog to Navigation

### Main Navigation
1. Online Store > Navigation
2. Edit main menu
3. Add "Blog" or "Style Guide" link
4. Link to /blogs/style-guide

### Footer Navigation
1. Edit footer menu
2. Add blog link

---

## Step 6: SEO Optimization

### For Each Blog Post
- [ ] Title under 60 characters with keyword
- [ ] Meta description 150-160 characters
- [ ] URL slug contains keyword
- [ ] Primary keyword in first paragraph
- [ ] H2 headings with secondary keywords
- [ ] Alt text on all images
- [ ] 2-5 internal links
- [ ] 1-2 external authority links

### Blog Category Tags
Create tags for organization:
- Bridesmaid Gifts
- Wedding Tips
- Lifestyle
- Amazon Finds
- Gift Guides

---

## Step 7: Pinterest Integration

### Enable Rich Pins
1. Add Pinterest meta tags to theme.liquid
2. Validate at developers.pinterest.com/tools/url-debugger

### Pin Strategy
- Create 2-3 pins per blog post
- Optimal image size: 1000x1500px (2:3 ratio)
- Include keyword in pin title and description
- Link pins to blog posts

---

## Content Calendar

### Monthly Posting Schedule
- Week 1: Product roundup post
- Week 2: How-to/educational post
- Week 3: Gift guide post
- Week 4: Seasonal/trending post

### Seasonal Focus
- **January-February:** Valentine's gifts
- **March-April:** Spring weddings
- **May-June:** Bridesmaid season
- **July-August:** Back to school
- **September-October:** Holiday prep
- **November-December:** Gift guides

---

## Tracking Success

### Metrics to Monitor
| Metric | Tool | Target |
|--------|------|--------|
| Organic traffic | Google Analytics | Growth monthly |
| Keyword rankings | Search Console | Top 10 |
| Affiliate clicks | Amazon Associates | Track conversions |
| Time on page | Analytics | 2+ minutes |

### Review Schedule
- Weekly: Check top posts
- Monthly: Review rankings
- Quarterly: Full content audit
