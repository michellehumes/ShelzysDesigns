# ✅ Testing Checklist for Shelzy's Designs Components

## Pre-Implementation Testing

### Environment Setup
- [ ] Shopify store is accessible
- [ ] Theme editor permissions available
- [ ] Test in preview mode before publishing
- [ ] Create backup of current theme

---

## Component-Specific Testing

### 1. Custom Personalization Form

#### Functionality
- [ ] Form renders inside product form correctly
- [ ] Name input accepts text (max 20 characters)
- [ ] Font dropdown shows all 5 options
- [ ] All 6 color options are clickable
- [ ] Preview updates in real-time when typing
- [ ] Preview updates when changing font
- [ ] Preview updates when changing color
- [ ] White text has visible shadow
- [ ] Form submits with product

#### Integration
- [ ] Properties save to cart correctly
- [ ] Cart displays custom properties
- [ ] Properties appear in order confirmation
- [ ] Multiple products can have different customizations

#### Responsive Design
- [ ] Desktop (1920px+): Two-column layout
- [ ] Tablet (768px-1024px): Single column
- [ ] Mobile (320px-767px): Stacked layout
- [ ] Touch targets minimum 44x44px
- [ ] Preview bottle scales appropriately

#### Accessibility
- [ ] All inputs have labels
- [ ] Tab navigation works
- [ ] Enter key submits form
- [ ] Screen reader announces changes

---

### 2. Email Capture Popup

#### Functionality
- [ ] Popup appears after 15 seconds
- [ ] Popup doesn't show if cookie is set
- [ ] Close button works
- [ ] Click outside closes popup
- [ ] ESC key closes popup
- [ ] Form accepts email input
- [ ] Email validation works
- [ ] Success message displays
- [ ] Cookie is set after submission
- [ ] Popup doesn't reappear for 7 days

#### Responsive Design
- [ ] Desktop: Centered, max-width 500px
- [ ] Tablet: 90% width
- [ ] Mobile: Full width with padding

#### Testing Procedure
1. Open site in incognito mode
2. Wait 15 seconds
3. Verify popup appears
4. Submit email
5. Check cookies in browser
6. Refresh page
7. Verify popup doesn't show again

---

### 3. Bulk Pricing Comparison

#### Functionality
- [ ] All 3 pricing cards display
- [ ] Hover effects work
- [ ] "Most Popular" badge shows on 5-pack
- [ ] Savings calculations correct (21% and 24%)
- [ ] CTA buttons clickable
- [ ] Click tracking works in console

#### Responsive Design
- [ ] Desktop: 3 columns
- [ ] Tablet: 2 columns (featured spans 2)
- [ ] Mobile: 1 column (stacked)

#### Content Accuracy
- [ ] Single bottle: $24.99
- [ ] 5-pack: $99 ($19.80 each, save $25.95)
- [ ] 10-pack: $189 ($18.90 each, save $60.90)

---

### 4. Upsell Cross-Sell

#### Functionality
- [ ] All 4 products display
- [ ] Checkboxes work
- [ ] Cards show selected state
- [ ] Clicking card toggles checkbox
- [ ] Item count updates correctly
- [ ] Subtotal calculates correctly
- [ ] 5% discount applies for 2+ items
- [ ] Total calculates correctly
- [ ] Button disabled when no items selected
- [ ] Button text updates with count and price

#### Test Cases
| Items Selected | Subtotal | Discount | Total |
|----------------|----------|----------|-------|
| 0 | $0.00 | $0.00 | $0.00 |
| 1 | $19.99 | $0.00 | $19.99 |
| 2 | $34.98 | $1.75 | $33.23 |
| 4 | $57.96 | $2.90 | $55.06 |

#### Responsive Design
- [ ] Desktop: Grid layout
- [ ] Tablet: 2 columns
- [ ] Mobile: Single column

---

### 5. Rush Order Upgrade

#### Functionality
- [ ] Countdown timer updates every second
- [ ] Timer shows correct time until 5 PM
- [ ] Timer resets to next day after 5 PM
- [ ] All 3 shipping options selectable
- [ ] Clicking card selects radio button
- [ ] Wedding date calculator accepts dates
- [ ] Future dates only (min = today)
- [ ] Calculator recommends correct option
- [ ] Auto-selects recommended shipping

#### Wedding Date Test Cases
| Days Until | Recommendation |
|-----------|----------------|
| 0-1 | Express Overnight |
| 2-4 | Rush Processing |
| 5-10 | Standard Available |
| 11+ | Plenty of Time |

#### Responsive Design
- [ ] Desktop: 3 columns
- [ ] Tablet: Single column
- [ ] Mobile: Optimized layout

---

### 6. Enhanced Hero Section

#### Functionality
- [ ] Gradient animation plays
- [ ] Floating elements animate
- [ ] Stats display correctly
- [ ] CTA buttons work
- [ ] Trust bar badges visible

#### Animations
- [ ] Gradient shifts smoothly (15s loop)
- [ ] Elements float up and down
- [ ] Fade-in animation on load
- [ ] Hover effects on buttons

#### Responsive Design
- [ ] Desktop: Two columns
- [ ] Tablet: Single column
- [ ] Mobile: Stacked content

---

### 7. Urgency Indicators

#### Functionality
- [ ] Low stock indicator shows
- [ ] Stock number is realistic (2-8)
- [ ] Viewers count updates
- [ ] Viewers number realistic (5-25)
- [ ] Recent orders displays
- [ ] Orders count realistic (1-8)
- [ ] High demand shows sometimes
- [ ] Pulse animation works
- [ ] Indicators update every 30s

#### Test in Console
```javascript
// Should see periodic updates
console.log('Checking urgency updates...');
```

---

### 8. Trust Badges

#### Functionality
- [ ] Statistics animate on scroll
- [ ] Counters count up from 0
- [ ] Numbers format with commas
- [ ] Animation triggers once
- [ ] Hover effects on cards
- [ ] Star rating displays (5 stars)

#### Counter Test
- [ ] 10,000+ customers animates to 10,000
- [ ] 5,000+ bridal parties animates to 5,000
- [ ] 25,000+ bottles animates to 25,000
- [ ] 15+ years animates to 15

#### Responsive Design
- [ ] Desktop: 4 columns for stats
- [ ] Tablet: 2 columns
- [ ] Mobile: Single column

---

### 9. Conversion-Focused FAQ

#### Functionality
- [ ] Accordion opens/closes on click
- [ ] Only one item open at a time
- [ ] Search filters questions
- [ ] Search is case-insensitive
- [ ] Category filters work
- [ ] "All Questions" shows everything
- [ ] Schema markup present in HTML

#### Search Test Cases
| Search Term | Should Show |
|-------------|-------------|
| "shipping" | 2-3 questions |
| "bulk" | 1-2 questions |
| "return" | 1 question |
| "" (empty) | All questions |

#### Responsive Design
- [ ] Desktop: Full width
- [ ] Tablet: Adjusted padding
- [ ] Mobile: Single column

---

### 10. Enhanced Product Card

#### Functionality
- [ ] Primary image displays
- [ ] Secondary image shows on hover
- [ ] Badge displays in correct position
- [ ] Quick view button slides up on hover
- [ ] Wishlist button toggles
- [ ] Color swatches clickable
- [ ] Selected swatch highlights
- [ ] Add to cart button works
- [ ] Success feedback shows

#### Hover Effects
- [ ] Card lifts up
- [ ] Shadow increases
- [ ] Secondary image fades in
- [ ] Quick view button appears

#### Responsive Design
- [ ] Desktop: Full features
- [ ] Tablet: Adjusted spacing
- [ ] Mobile: Touch-friendly

---

### 11. Instagram Feed

#### Functionality
- [ ] All 6 posts display
- [ ] Grid layout responsive
- [ ] Hover shows stats overlay
- [ ] Click opens Instagram
- [ ] Follow button works
- [ ] Handle link works
- [ ] Keyboard navigation works

#### Responsive Design
- [ ] Desktop: 3 columns
- [ ] Tablet: 3 columns
- [ ] Mobile (768px-): 2 columns
- [ ] Mobile (480px-): 1 column

---

## Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari (iPhone)
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

---

## Performance Testing

### Page Speed
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3.5s
- [ ] No render-blocking resources

### Asset Loading
- [ ] Images lazy load
- [ ] No 404 errors in console
- [ ] No JavaScript errors
- [ ] CSS loads correctly

---

## Integration Testing

### Shopify Functionality
- [ ] Components work with Shopify Ajax Cart
- [ ] Product properties save correctly
- [ ] Checkout shows customizations
- [ ] Order emails include properties
- [ ] Admin panel shows custom fields

### Theme Compatibility
- [ ] Components don't break existing theme
- [ ] CSS doesn't conflict
- [ ] JavaScript doesn't conflict
- [ ] Mobile menu still works
- [ ] Search functionality works
- [ ] Cart drawer/page works

---

## User Experience Testing

### Navigation Flow
1. [ ] Homepage → Product page → Cart
2. [ ] Email popup doesn't block navigation
3. [ ] All links work
4. [ ] Back button works
5. [ ] Breadcrumbs work

### Form Submission
1. [ ] Add to cart works with customization
2. [ ] Email capture submits correctly
3. [ ] Wedding date calculator submits
4. [ ] FAQ search works

### Error Handling
- [ ] Invalid email shows error
- [ ] Empty form shows validation
- [ ] Network errors handled gracefully

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] ESC closes popups
- [ ] Focus visible on all elements

### Screen Readers
- [ ] Test with NVDA/JAWS (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Heading hierarchy correct

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] WCAG AA compliance
- [ ] Test with color blindness simulator

---

## Mobile-Specific Testing

### Touch Interactions
- [ ] All buttons minimum 44x44px
- [ ] Swipe gestures don't conflict
- [ ] Pinch zoom works (where appropriate)
- [ ] Dropdown menus work
- [ ] Date picker works

### Viewport Sizes
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro Max (428px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

### Mobile Network
- [ ] Test on 3G connection
- [ ] Components load progressively
- [ ] No blocking scripts

---

## Security Testing

### Input Validation
- [ ] XSS protection in form inputs
- [ ] SQL injection protection
- [ ] No sensitive data in cookies
- [ ] HTTPS enforced

### Cookie Management
- [ ] Cookies set with appropriate flags
- [ ] Cookie consent respected (if applicable)
- [ ] No tracking without consent

---

## Pre-Launch Checklist

### Content
- [ ] All placeholder text updated
- [ ] Real images uploaded
- [ ] Links point to correct pages
- [ ] Instagram handle updated
- [ ] Email integration configured
- [ ] Prices accurate

### Settings
- [ ] Cookie duration set correctly
- [ ] Popup delay configured
- [ ] Countdown times correct
- [ ] Shipping prices accurate
- [ ] Discount percentages correct

### Analytics
- [ ] Google Analytics tracking
- [ ] Facebook Pixel (if applicable)
- [ ] Event tracking configured
- [ ] Conversion tracking works

---

## Post-Launch Monitoring

### Week 1
- [ ] Check email signups
- [ ] Monitor cart properties
- [ ] Review error logs
- [ ] Check conversion rates
- [ ] Monitor page speed
- [ ] Review user feedback

### Week 2-4
- [ ] A/B test variations
- [ ] Optimize based on data
- [ ] Update content as needed
- [ ] Monitor performance metrics

---

## Success Metrics

### Expected Outcomes (30 Days)
- [ ] Email subscribers: +300/month
- [ ] Conversion rate: +15-25%
- [ ] Average order value: +30-40%
- [ ] Revenue increase: +20-40%
- [ ] Bulk orders: +50%

---

## Testing Sign-Off

**Tester Name:** ___________________________
**Date:** ___________________________
**Environment:** Production / Staging / Development
**Theme Version:** ___________________________

**Issues Found:** ___________________________
**Issues Resolved:** ___________________________
**Ready for Launch:** Yes / No

---

**Version:** 1.0.0
**Last Updated:** 2024
