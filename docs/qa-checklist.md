# Shelzy's Designs QA Checklist

**Version:** 2.0.0
**Last Updated:** December 2024

---

## Overview

This checklist ensures consistent quality across all theme updates. Run through these tests before every major deployment.

---

## Page-Level Tests

### Home Page

- [ ] Hero banner displays correctly with image, text overlay, and CTA buttons
- [ ] Hero image loads with high priority (no lazy loading)
- [ ] USP bar displays all trust badges
- [ ] Featured collection shows correct number of products
- [ ] Newsletter section form submits successfully
- [ ] All sections respect color scheme settings
- [ ] Padding/spacing adjustments work via Theme Editor

### Product Page

- [ ] Product title displays (test with long titles 50+ chars)
- [ ] Product images load and gallery functions correctly
- [ ] Price displays correctly (regular and sale prices)
- [ ] Variant selector works (if multiple variants)
- [ ] Add to cart button functions
- [ ] Quantity selector works
- [ ] Product metafields display when present
- [ ] Product metafields gracefully hidden when empty
- [ ] Personalization field appears (if enabled)
- [ ] Production time displays
- [ ] Buy box remains visible/accessible on scroll

### Collection Page

- [ ] Collection title and description display
- [ ] Product grid shows correct number of products
- [ ] Product cards display correctly
- [ ] Sale badges appear on discounted products
- [ ] Sold out badges appear on unavailable products
- [ ] Pagination works (if applicable)
- [ ] Empty collection shows appropriate message

### Cart Page

- [ ] Cart items display with images, titles, prices
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Subtotal calculates correctly
- [ ] Checkout button works
- [ ] Empty cart shows appropriate message and CTA

### Search Page

- [ ] Search input functions
- [ ] Results display correctly
- [ ] No results shows appropriate message
- [ ] Product cards in results match collection cards

### 404 Page

- [ ] Custom 404 message displays
- [ ] Navigation back to shop works
- [ ] Page doesn't break on any random URL

---

## Responsive Tests

### Desktop (1200px+)

- [ ] Navigation displays full menu
- [ ] Hero banner at full width
- [ ] Product grid shows 4 columns
- [ ] Images are crisp (high-res served)

### Tablet (768px - 1199px)

- [ ] Navigation collapses appropriately
- [ ] Product grid shows 2-3 columns
- [ ] Touch targets are adequate size (44px+)

### Mobile (< 768px)

- [ ] Hamburger menu functions
- [ ] Product grid shows 2 columns
- [ ] Hero text remains readable
- [ ] Add to cart button is easily tappable
- [ ] Forms are usable (inputs not too small)
- [ ] No horizontal scroll on any page

---

## Empty State Tests

### No Product Image

- [ ] Placeholder displays instead of broken image
- [ ] Layout doesn't break
- [ ] Alt text indicates no image available

### No Product Metafields

- [ ] Metafield sections don't render
- [ ] No empty boxes or broken layouts
- [ ] Product page still functions normally

### No Reviews/Ratings

- [ ] Star rating hidden when no reviews
- [ ] No "undefined" or "NaN" displays
- [ ] Layout adjusts gracefully

### Empty Collection

- [ ] Helpful message displays
- [ ] Link to continue shopping
- [ ] No broken grid or layout

### Empty Cart

- [ ] Friendly empty cart message
- [ ] CTA to continue shopping
- [ ] No broken elements

### No Featured Image (Collection)

- [ ] Collection header still displays
- [ ] Placeholder or no-image state works

---

## Stress Tests

### Long Product Title (50+ characters)

- [ ] Title truncates or wraps appropriately
- [ ] Doesn't break card layout
- [ ] Full title visible on hover or product page

### Long Product Description

- [ ] Text doesn't overflow containers
- [ ] Scrolling works if truncated
- [ ] Read more functionality (if applicable)

### Long Personalization Input

- [ ] Input field handles long text
- [ ] Character limit enforced (if set)
- [ ] Text doesn't break cart display

### Many Products (50+ in collection)

- [ ] Page loads in reasonable time
- [ ] Pagination works
- [ ] No layout breaking

### Many Variants (10+ options)

- [ ] Variant selector remains usable
- [ ] Selected variant updates price/image
- [ ] No overflow or breaking

---

## Performance Checks

### Core Web Vitals Targets

- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **FID** (First Input Delay): < 100ms
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

### Loading

- [ ] Hero image loads with `fetchpriority="high"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Fonts load without FOUT (flash of unstyled text)
- [ ] No render-blocking resources

### Image Optimization

- [ ] AVIF/WebP formats served when supported
- [ ] Appropriate image sizes via srcset
- [ ] No oversized images (> 500KB)

---

## Accessibility Checks

### Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Focus order is logical
- [ ] Focus indicators visible
- [ ] Skip link works

### Screen Reader

- [ ] Headings hierarchy correct (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Form labels present
- [ ] ARIA labels on icons/buttons

### Visual

- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Text readable at 200% zoom
- [ ] Reduced motion respected

---

## Theme Editor Tests

### Settings Apply

- [ ] Color changes reflect immediately
- [ ] Font changes apply to correct elements
- [ ] Spacing adjustments work
- [ ] Logo/favicon changes work

### Section Management

- [ ] Sections can be added
- [ ] Sections can be reordered
- [ ] Sections can be removed
- [ ] Block content editable

### Presets

- [ ] Section presets available
- [ ] Presets create expected layout

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

---

## Pre-Launch Final Checks

- [ ] All console errors resolved
- [ ] No 404 errors on assets
- [ ] Favicon displays
- [ ] Social sharing images work
- [ ] Meta descriptions present
- [ ] Google Analytics/tracking verified
- [ ] Forms submit to correct endpoints
- [ ] SSL certificate valid
- [ ] Redirects configured for old URLs

---

## Test Execution Log

| Date | Tester | Pages Tested | Issues Found | Status |
|------|--------|--------------|--------------|--------|
| | | | | |

---

## Issue Template

When logging issues, include:

```
**Page:** [page name]
**Device/Browser:** [device and browser]
**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
**Actual Behavior:**
**Screenshot:** [if applicable]
```
