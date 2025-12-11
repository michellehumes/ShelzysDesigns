# A/B Testing Framework for Shelzy's Designs

## Overview
This document outlines specific A/B tests to run, with hypotheses, metrics, and implementation details.

---

## Testing Tools

### Recommended Options
1. **Google Optimize** (Free) - Best for simple tests
2. **VWO** ($199/mo) - Advanced features, heatmaps
3. **Optimizely** (Enterprise) - Full-featured
4. **Native Klaviyo A/B** - For email tests

### Quick Start with Google Optimize
```html
<!-- Add to theme.liquid before </head> -->
<!-- Google Optimize snippet -->
<style>.async-hide { opacity: 0 !important }</style>
<script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
})(window,document.documentElement,'async-hide','dataLayer',4000,
{'OPT-XXXXXX':true});</script>
```

---

## Test Queue (Priority Order)

### Test 1: Homepage Hero CTA Button Text
**Priority:** High | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Action-oriented CTA text will increase click-through rate compared to generic text.

| Variant | Button Text |
|---------|-------------|
| Control (A) | Shop Now |
| Variant B | Shop Best Sellers |
| Variant C | Create Your Bottle |

**Primary Metric:** Click-through rate on hero CTA
**Secondary Metric:** Conversion rate from hero visitors

**Implementation:**
```javascript
// Google Optimize experiment code
if (window.experimentVariant === 'B') {
  document.querySelector('.hero-cta').textContent = 'Shop Best Sellers';
} else if (window.experimentVariant === 'C') {
  document.querySelector('.hero-cta').textContent = 'Create Your Bottle';
}
```

**Expected Lift:** +10-20% CTR

---

### Test 2: Free Shipping Threshold Display
**Priority:** High | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Showing progress toward free shipping will increase average order value.

| Variant | Display |
|---------|---------|
| Control (A) | Static banner: "Free shipping on $75+" |
| Variant B | Progress bar: "You're $X away from FREE shipping!" |

**Primary Metric:** Average Order Value (AOV)
**Secondary Metric:** Cart completion rate

**Expected Lift:** +$5-10 AOV

---

### Test 3: Product Page Trust Badges Position
**Priority:** Medium | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Trust badges directly below the Add to Cart button will increase conversion more than in the product description.

| Variant | Badge Position |
|---------|----------------|
| Control (A) | In product description area |
| Variant B | Directly below Add to Cart button |
| Variant C | Both locations |

**Primary Metric:** Add to Cart rate
**Secondary Metric:** Checkout completion rate

**Expected Lift:** +5-15% ATC rate

---

### Test 4: Collection Page Product Cards
**Priority:** Medium | **Duration:** 3 weeks | **Traffic:** 50/50

**Hypothesis:**
Showing star ratings on collection cards will increase product page visits.

| Variant | Card Display |
|---------|--------------|
| Control (A) | Image + Title + Price |
| Variant B | Image + Title + Price + Stars |
| Variant C | Image + Title + Price + Stars + "X Reviews" |

**Primary Metric:** Click-through rate to product pages
**Secondary Metric:** Conversion rate

**Expected Lift:** +8-15% CTR

---

### Test 5: Email Popup Timing
**Priority:** High | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Delayed popup will have higher signup rate than immediate popup.

| Variant | Timing |
|---------|--------|
| Control (A) | 5 seconds after page load |
| Variant B | 15 seconds after page load |
| Variant C | Exit intent only |

**Primary Metric:** Email signup rate
**Secondary Metric:** Popup close rate (lower is better)

**Expected Lift:** +20-50% signup rate

---

### Test 6: Product Page Urgency Messaging
**Priority:** Medium | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Urgency messaging will increase add-to-cart rate.

| Variant | Message |
|---------|---------|
| Control (A) | No urgency message |
| Variant B | "Order within X hours to ship tomorrow!" |
| Variant C | "Only X left in stock!" |
| Variant D | Both messages |

**Primary Metric:** Add to Cart rate
**Secondary Metric:** Conversion rate

**Expected Lift:** +10-25% ATC rate

---

### Test 7: Cart Page Upsell Format
**Priority:** High | **Duration:** 3 weeks | **Traffic:** 50/50

**Hypothesis:**
"Frequently bought together" framing will outperform "You may also like."

| Variant | Upsell Header |
|---------|---------------|
| Control (A) | "You May Also Like" |
| Variant B | "Frequently Bought Together" |
| Variant C | "Complete Your Order" |

**Primary Metric:** Upsell click rate
**Secondary Metric:** Upsell conversion rate, AOV

**Expected Lift:** +15-30% upsell conversion

---

### Test 8: Checkout Trust Elements
**Priority:** Medium | **Duration:** 2 weeks | **Traffic:** 50/50

**Hypothesis:**
Additional trust elements at checkout will reduce abandonment.

| Variant | Elements |
|---------|----------|
| Control (A) | Standard checkout |
| Variant B | + Payment icons + "Secure Checkout" badge |
| Variant C | + Testimonial snippet + Payment icons |

**Primary Metric:** Checkout completion rate
**Secondary Metric:** Cart abandonment rate

**Expected Lift:** +5-10% checkout completion

---

## Email A/B Tests (Klaviyo)

### Email Test 1: Welcome Email Subject Line
| Variant | Subject Line |
|---------|--------------|
| A | Welcome to Shelzy's! Here's 10% Off 🎁 |
| B | Your 10% Off Code is Inside |
| C | Hey [Name], Welcome + Your Exclusive Discount |

**Metric:** Open rate

---

### Email Test 2: Abandoned Cart Timing
| Variant | First Email Timing |
|---------|-------------------|
| A | 1 hour after abandonment |
| B | 4 hours after abandonment |
| C | 24 hours after abandonment |

**Metric:** Recovery rate

---

### Email Test 3: Discount in Subject Line
| Variant | Subject Line |
|---------|--------------|
| A | Did you forget something? 👀 |
| B | 10% Off Your Cart - Limited Time! |
| C | Your cart is waiting + a special gift |

**Metric:** Open rate, click rate, recovery rate

---

## Testing Best Practices

### Sample Size Calculator
For 95% confidence with 80% power:
- **10% lift detection:** ~25,000 visitors per variant
- **20% lift detection:** ~6,500 visitors per variant
- **30% lift detection:** ~3,000 visitors per variant

### Duration Guidelines
- Minimum: 1 full business week (7 days)
- Recommended: 2-4 weeks
- Include weekends for accurate data

### What NOT to Test Simultaneously
- Don't run overlapping tests on same page elements
- Don't change multiple variables in one test
- Don't end tests early based on initial results

---

## Test Documentation Template

```markdown
## Test Name: [Name]

**Dates:** Start - End
**Traffic Split:** X/X
**Sample Size:** X visitors per variant

### Hypothesis
[What you expect to happen and why]

### Variants
- Control: [Description]
- Variant B: [Description]

### Results
| Variant | Sample | Metric | Value | Stat Sig |
|---------|--------|--------|-------|----------|
| Control | X | X | X% | - |
| Variant B | X | X | X% | Yes/No |

### Winner: [Variant]
### Lift: +X%

### Next Steps
[What action to take based on results]
```

---

## Quarterly Test Roadmap

### Q1 Tests
1. Homepage Hero CTA ← Start here
2. Email Popup Timing
3. Product Page Trust Badges

### Q2 Tests
4. Free Shipping Progress Bar
5. Collection Page Cards
6. Cart Upsell Format

### Q3 Tests
7. Product Page Urgency
8. Checkout Trust Elements
9. Email Subject Lines

### Q4 Tests
10. Holiday-specific messaging
11. Bundle display optimization
12. Mobile-specific tests

---

## Success Metrics Dashboard

Track these metrics weekly during tests:

| Metric | Baseline | Current | Change |
|--------|----------|---------|--------|
| Conversion Rate | X% | X% | +X% |
| AOV | $X | $X | +$X |
| Add to Cart Rate | X% | X% | +X% |
| Email Signup Rate | X% | X% | +X% |
| Cart Abandonment | X% | X% | -X% |

---

*Last Updated: December 2025*
