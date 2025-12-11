# Shelzy's Designs - Quick Reference Card

Print this page for easy reference during implementation.

---

## Brand Colors (Copy-Paste Ready)

| Color | Hex | Usage |
|-------|-----|-------|
| Sage Green | `#8BAA88` | Primary CTAs, accents |
| Dark Sage | `#4E5F4A` | Headings, footer |
| Warm White | `#FAF9F6` | Backgrounds |
| Charcoal | `#2B2B2B` | Body text |
| Champagne Gold | `#D1C7A1` | Badges, premium accents |

## Typography

| Element | Font | Weight |
|---------|------|--------|
| Headings | Playfair Display | 600 |
| Body | Inter | 400 |
| Badges | Montserrat | 600 |

---

## Key URLs

| Page | URL |
|------|-----|
| Live Site | https://shelzysdesigns.com |
| Shopify Admin | https://shelzysdesigns.myshopify.com/admin |
| GitHub Repo | https://github.com/michellehumes/ShelzysDesigns |

---

## Discount Codes

| Code | Discount | Use Case |
|------|----------|----------|
| `WELCOME10` | 10% off | New subscriber welcome |
| `COMEBACK10` | 10% off | Abandoned cart recovery |
| `PHOTOREVIEW15` | 15% off | Photo review incentive |

---

## Critical Snippets (Deploy First)

```
shelzys-cart-upsell.liquid       → Cart page
shelzys-trust-badges.liquid      → Cart + Product pages
shelzys-free-shipping-bar.liquid → Cart page
shelzys-urgency.liquid           → Product pages
```

---

## Email Flow Timing (Klaviyo)

### Abandoned Cart
- Email 1: 1 hour after abandonment
- Email 2: 24 hours after abandonment
- Email 3: 48 hours after abandonment (with discount)

### Welcome Series
- Email 1: Immediate (with WELCOME10)
- Email 2: 2 days later
- Email 3: 5 days later

### Post-Purchase
- Email 1: Immediate (confirmation)
- Email 2: On shipment
- Email 3: 7 days after delivery (review request)

---

## Revenue Impact Summary

| Initiative | Monthly Impact |
|------------|----------------|
| Blog + Affiliate | +$200-800 |
| Email Automation | +$1,500-3,500 |
| Cart Upsells | +$300-700 |
| Total | **+$2,000-5,000** |

---

## Script Commands

```bash
# Backup theme
./IMPLEMENTATION/scripts/backup-theme.sh

# Optimize images
./IMPLEMENTATION/scripts/optimize-images.sh ./images

# Generate SEO meta tags
./IMPLEMENTATION/scripts/seo-meta-generator.sh

# Deploy snippets
./IMPLEMENTATION/scripts/deploy-snippets.sh --critical

# Monitor performance
./IMPLEMENTATION/scripts/performance-monitor.sh
```

---

## Checklist Quick Links

- [ ] Phase 1: Blog + Email + Cart Upsells
- [ ] Phase 2: Product + Collection + Trust
- [ ] Phase 3: Performance + SEO + Email Optimization
- [ ] Phase 4: Pinterest + Reviews + Growth

Full checklist: `IMPLEMENTATION/CHECKLIST.md`

---

## Support Contacts

- **Site Issues:** hello@shelzysdesigns.com
- **Implementation:** Check `/IMPLEMENTATION/docs/`
- **Klaviyo Help:** help.klaviyo.com
- **Shopify Help:** help.shopify.com

---

## Emergency Rollback

```bash
# Restore from backup
./IMPLEMENTATION/scripts/backup-theme.sh restore backups/LATEST.tar.gz

# Or in Shopify Admin:
# Online Store → Themes → Actions → Duplicate (of working theme)
```

---

## File Locations

| Resource | Path |
|----------|------|
| Main Audit | `/SHELZYS_SITE_AUDIT.md` |
| Roadmap | `/IMPLEMENTATION/ROADMAP.md` |
| Checklist | `/IMPLEMENTATION/CHECKLIST.md` |
| Scripts | `/IMPLEMENTATION/scripts/` |
| Snippets | `/shopify/snippets/` |
| Blog Drafts | `/amazon-affiliate/blog/drafts/` |
| Klaviyo Guide | `/implementation/KLAVIYO-SETUP-GUIDE.md` |
| Brand Guide | `/brand/BRAND_GUIDE.md` |

---

*Quick Reference v1.0 | December 2025*
