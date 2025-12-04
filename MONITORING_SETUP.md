# Shelzy's Designs - Monitoring Setup

## Overview

This document outlines the monitoring and analytics setup for tracking site performance, conversions, and revenue.

---

## 1. Google Analytics 4 (GA4)

### Setup Steps

1. **Create GA4 Property**
   - Go to analytics.google.com
   - Admin > Create Property
   - Property name: "Shelzy's Designs"
   - Select ecommerce industry

2. **Install on Shopify**
   - Shopify Admin > Online Store > Preferences
   - Paste GA4 Measurement ID (G-XXXXXXXXXX)
   - Or use Google & YouTube app for enhanced tracking

3. **Enable Enhanced Ecommerce**
   - GA4 Admin > Data Streams > Web
   - Enhanced measurement: Enable all
   
### Key Events to Track

| Event | Description |
|-------|-------------|
| page_view | All page views |
| view_item | Product page views |
| add_to_cart | Items added to cart |
| begin_checkout | Checkout started |
| purchase | Completed orders |
| search | Site search queries |

### Custom Dimensions (Recommended)

- Product customization type (name, icon, etc.)
- Collection source
- Discount code used
- Customer type (new vs returning)

---

## 2. Facebook/Meta Pixel

### Setup Steps

1. **Create Pixel**
   - Meta Business Suite > Events Manager
   - Connect Data Sources > Web > Meta Pixel
   
2. **Install on Shopify**
   - Shopify Admin > Settings > Apps > Facebook & Instagram
   - Or manually add pixel code to theme.liquid

3. **Verify Events**
   - Use Meta Pixel Helper Chrome extension
   - Check Events Manager for incoming data

### Events to Configure

- PageView (automatic)
- ViewContent (product pages)
- AddToCart
- InitiateCheckout
- Purchase (with value)

---

## 3. Shopify Analytics

### Built-in Reports to Monitor

**Daily:**
- Total sales
- Online store sessions
- Conversion rate

**Weekly:**
- Sales by product
- Sales by traffic source
- Top landing pages
- Cart abandonment rate

**Monthly:**
- Customer acquisition cost
- Average order value trends
- Returning customer rate

### Shopify Admin Location
Online Store > Analytics > Reports

---

## 4. Performance Monitoring

### Lighthouse CI (Automated)

The GitHub Actions workflow runs weekly:
- `.github/workflows/lighthouse-ci.yml`
- Checks homepage, collection page, product page
- Stores results as artifacts

### Manual Checks (Monthly)

Run local audit:
```bash
./scripts/audit-performance.sh
```

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |
| INP | < 200ms | TBD |

### Google Search Console

1. Verify site ownership
2. Submit sitemap: `https://shelzysdesigns.com/sitemap.xml`
3. Monitor Core Web Vitals report
4. Check for crawl errors

---

## 5. Uptime Monitoring

### Free Options

1. **UptimeRobot** (uptimerobot.com)
   - Monitor: https://shelzysdesigns.com
   - Check interval: 5 minutes
   - Alert via email/SMS

2. **Pingdom** (free tier)
   - Similar functionality
   
3. **Shopify Status**
   - status.shopify.com for platform issues

---

## 6. Conversion Tracking Dashboard

### Key Metrics to Track Weekly

| Metric | Formula | Target |
|--------|---------|--------|
| Conversion Rate | Orders / Sessions | 2-4% |
| Average Order Value | Revenue / Orders | $50+ |
| Cart Abandonment | Abandoned / Started | < 70% |
| Email Capture Rate | Signups / Visitors | 3-5% |
| Return Visitor Rate | Returning / Total | 20%+ |

### Revenue Metrics (Monthly)

| Metric | How to Calculate |
|--------|-----------------|
| Revenue per Visitor | Total Revenue / Sessions |
| Customer Lifetime Value | Avg Order × Avg Orders/Customer |
| Marketing ROI | (Revenue - Ad Spend) / Ad Spend |

---

## 7. Heatmaps & Session Recording

### Microsoft Clarity (Free)

1. Sign up at clarity.microsoft.com
2. Add tracking code to Shopify theme
3. Monitor:
   - Click heatmaps
   - Scroll depth
   - Session recordings
   - Rage clicks

### Hotjar (Alternative)

- Free tier: 1,050 sessions/month
- Heatmaps, recordings, surveys

---

## 8. Email Marketing Metrics (Klaviyo)

### Key Metrics

| Metric | Target |
|--------|--------|
| Open Rate | > 20% |
| Click Rate | > 2.5% |
| Revenue per Email | Track trend |
| List Growth Rate | > 10%/month |

### Flows to Monitor

1. Welcome Series (conversion rate)
2. Abandoned Cart (recovery rate)
3. Post-Purchase (review rate)
4. Browse Abandonment (engagement)

---

## 9. Weekly Monitoring Checklist

```markdown
## Weekly Site Check - [DATE]

### Performance
- [ ] Check GA4 for traffic trends
- [ ] Review conversion rate
- [ ] Check for 404 errors (run script)
- [ ] Verify all products in stock

### Revenue
- [ ] Compare revenue to last week
- [ ] Check AOV trend
- [ ] Review top selling products
- [ ] Check discount code usage

### Technical
- [ ] Test checkout flow manually
- [ ] Verify email popup working
- [ ] Check mobile experience
- [ ] Review any error alerts

### Marketing
- [ ] Check email open/click rates
- [ ] Review ad performance (if running)
- [ ] Monitor social engagement
```

---

## 10. Monthly Reporting Template

```markdown
# Shelzy's Designs Monthly Report - [MONTH YEAR]

## Executive Summary
- Total Revenue: $X,XXX
- Orders: XX
- Conversion Rate: X.X%
- Average Order Value: $XX.XX

## Traffic
- Sessions: X,XXX
- New vs Returning: XX% / XX%
- Top Sources: [list]

## Products
- Top Seller: [product]
- Best Collection: [collection]
- Out of Stock Issues: [any?]

## Technical
- Avg Page Load: X.Xs
- Mobile Traffic: XX%
- Cart Abandonment: XX%

## Action Items for Next Month
1. [item]
2. [item]
3. [item]
```

---

## Quick Links

| Tool | URL |
|------|-----|
| Shopify Admin | shelzysdesigns.myshopify.com/admin |
| Google Analytics | analytics.google.com |
| Search Console | search.google.com/search-console |
| Meta Business | business.facebook.com |
| Klaviyo | klaviyo.com |
| UptimeRobot | uptimerobot.com |
| Microsoft Clarity | clarity.microsoft.com |

---

## Alert Thresholds

Set up alerts for:

| Condition | Alert |
|-----------|-------|
| Site down > 5 min | Email + SMS |
| Conversion rate drops 50% | Email |
| Page load > 5s | Email |
| 404 errors spike | Email |
| Revenue = $0 for 24h | Email |
