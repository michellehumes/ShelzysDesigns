# Vercel Web Analytics Integration Guide

## Overview

This guide covers how to install and configure Vercel Web Analytics for Shelzy's Designs Shopify store.

Vercel Web Analytics provides:
- ✅ Real-time visitor analytics
- ✅ Page views and session tracking
- ✅ Device and browser information
- ✅ Conversion funnel analysis
- ✅ Custom event tracking
- ✅ Zero impact on site performance
- ✅ Privacy-friendly tracking (no cookies)

---

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **Web Analytics Access**: Enable Analytics in your Vercel project
3. **Shopify Store**: Admin access to your Shopify store theme

---

## Installation Steps

### Step 1: Set Up Vercel Web Analytics

1. Go to [vercel.com](https://vercel.com) and sign in
2. Create a new project or select an existing one
3. Navigate to **Analytics** tab
4. Click **Enable Web Analytics**
5. Copy your project ID (if prompted)

### Step 2: Add Analytics Snippet to Theme

#### Option A: Using Shelzy's Snippet (Recommended)

1. Go to your Shopify Admin
2. Navigate to **Online Store > Themes**
3. Find your active theme and click **Edit code**
4. In the left sidebar, click **Snippets**
5. Click **Add a new snippet**
6. Name it `shelzys-vercel-analytics`
7. Copy the contents from `shopify/snippets/shelzys-vercel-analytics.liquid`
8. Click **Save**

#### Option B: Using Deployment Script

```bash
# Deploy all snippets including analytics
SHOPIFY_STORE_URL="your-store.myshopify.com" \
SHOPIFY_ACCESS_TOKEN="your_access_token" \
node shopify/scripts/deploy-master.js --snippets
```

### Step 3: Add Snippet to Theme Layout

1. In the Shopify code editor, find **theme.liquid** in the main section (not snippets)
2. Locate the `<head>` section
3. Find the line with `{{ content_for_header }}`
4. Add the snippet **below** this line:

```liquid
{{ content_for_header }}

<!-- Vercel Web Analytics -->
{% render 'shelzys-vercel-analytics' %}
```

**Important**: The snippet must be placed **after** `{{ content_for_header }}` to ensure Shopify's native tracking works properly.

5. Click **Save**

### Step 4: Verify Installation

1. Visit your store at `https://your-store.com`
2. Go to [vercel.com/analytics](https://vercel.com/analytics)
3. You should see data appearing in real-time within 1-2 minutes
4. Open your store in an incognito window to test tracking

---

## Features & Usage

### Real-Time Dashboard

Once installed, your Vercel Analytics dashboard shows:

- **Page Views**: Total visits to your store
- **Unique Visitors**: Distinct visitor counts
- **Device Breakdown**: Mobile, tablet, desktop distribution
- **Top Pages**: Most visited products and pages
- **Referral Sources**: Where visitors come from
- **Bounce Rate**: Exit rate by page
- **Conversion Funnel**: Product page → Add to cart → Checkout

### Custom Event Tracking

Track specific user actions with custom events:

```javascript
// Example: Track when a customer customizes a bottle
if (window.va) {
  window.va.track('bottle_customized', {
    product: 'signature-bottle',
    color: 'sage-green',
    personalization: 'script'
  });
}
```

Add this code to:
- Product customization forms
- Add-to-cart buttons
- Checkout flows
- Newsletter signups
- Contact form submissions

### Common Events to Track

For e-commerce optimization, consider tracking:

```javascript
// Add to cart event
window.va?.track('add_to_cart', {
  product_id: 'prod_12345',
  product_name: 'Signature Personalized Bottle',
  price: 34.99,
  quantity: 1
});

// Purchase event
window.va?.track('purchase', {
  order_id: 'order_12345',
  total: 99.97,
  items_count: 3
});

// Customization event
window.va?.track('personalization_started', {
  product: 'bridesmaid-bottle',
  form_type: 'name-customization'
});

// Newsletter signup
window.va?.track('newsletter_signup', {
  source: 'popup'
});
```

---

## Integration with Existing Tools

### With Shopify Analytics

Vercel Analytics works **alongside** Shopify Analytics:
- **Shopify Analytics**: Conversions, revenue, customer data
- **Vercel Analytics**: Traffic patterns, device breakdown, referral sources
- **Together**: Complete picture of store performance

### With Klaviyo (Email Marketing)

Vercel Analytics helps identify:
- High-traffic pages to promote via email
- Device patterns for email optimization
- Traffic sources for targeted campaigns
- Cart abandonment patterns

### With Google Analytics (Optional)

For advanced analysis, you can use both:
- Enable Vercel Analytics for simplicity and speed
- Keep Google Analytics for detailed funnel analysis
- Use Shopify's native integration for revenue tracking

---

## Best Practices

### 1. **Placement in theme.liquid**

✅ **Correct**:
```liquid
{{ content_for_header }}
{% render 'shelzys-vercel-analytics' %}
```

❌ **Incorrect**:
```liquid
{% render 'shelzys-vercel-analytics' %}
{{ content_for_header }}
```

### 2. **Performance Considerations**

- Vercel Analytics uses a tiny script (~1KB gzipped)
- Loads asynchronously (defer attribute) - won't block page load
- No cookies = faster loading
- Minimal performance impact (typically < 2ms)

### 3. **Privacy Compliance**

Vercel Web Analytics is GDPR compliant:
- No personal data collection
- No cookies (session-based only)
- No third-party tracking
- Data stored securely

You may still want to:
- Add analytics disclosure to privacy policy
- Include opt-out option for privacy-conscious users

### 4. **Testing**

Test different scenarios:
1. **Desktop visitor**: Analytics should show desktop traffic
2. **Mobile visitor**: Should show mobile traffic
3. **Different referral sources**: Direct, organic search, social, ads
4. **Product customization**: Custom events should track
5. **Purchase completion**: Track through checkout

---

## Troubleshooting

### Analytics Not Showing Data

**Problem**: Dashboard shows no data after 5+ minutes
**Solutions**:
1. Verify snippet is in theme.liquid `<head>`
2. Check Shopify store is published (not in development)
3. Open store in private/incognito window (might be cached)
4. Check browser console for errors: `F12` → Console tab
5. Verify Vercel Analytics is enabled in project settings

### Duplicate Tracking

**Problem**: Data appears twice in analytics
**Solutions**:
1. Verify snippet is only added once to theme.liquid
2. Remove any duplicate scripts
3. Clear browser cache
4. Wait 10 minutes for data consolidation

### Custom Events Not Tracking

**Problem**: `window.va?.track()` calls not appearing
**Solutions**:
1. Verify Vercel Analytics snippet loaded: Check browser console
2. Use correct event name (no special characters)
3. Make sure tracking code runs **after** page load
4. Test in browser console:
   ```javascript
   window.va?.track('test_event', { test: true })
   ```

---

## Configuration Options

### Environment Variables (Optional)

If using environment-based configuration:

```bash
# .env (for local development)
VERCEL_ANALYTICS_ENABLED=true
```

### Advanced: Conditional Analytics

Load analytics only for specific scenarios:

```liquid
{% if shop.checkout_domain != shop.domain %}
  <!-- Skip analytics on checkout pages (handled by Shopify) -->
{% else %}
  {% render 'shelzys-vercel-analytics' %}
{% endif %}
```

---

## Accessing Your Analytics

### Dashboard

1. Log in to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Analytics** tab
4. View real-time data

### Mobile Access

- Available via Vercel mobile app (iOS/Android)
- Responsive web dashboard
- Push notifications for spikes

### API Access (Advanced)

For integrating analytics into custom dashboards:

```bash
# API documentation
https://vercel.com/docs/concepts/analytics/api
```

---

## Removing Analytics (If Needed)

If you want to remove Vercel Web Analytics:

1. Go to Shopify Admin → Online Store → Themes → Edit code
2. Find `theme.liquid`
3. Remove the line: `{% render 'shelzys-vercel-analytics' %}`
4. Remove the `shelzys-vercel-analytics.liquid` snippet file
5. Click **Save**

Data on Vercel side remains for historical reference.

---

## Support & Resources

- **Vercel Docs**: [vercel.com/docs/concepts/analytics](https://vercel.com/docs/concepts/analytics)
- **Vercel Web Analytics Events**: [vercel.com/docs/concepts/analytics/events-api](https://vercel.com/docs/concepts/analytics/events-api)
- **Shopify Theme Code**: [shopify.dev/api/liquid](https://shopify.dev/api/liquid)
- **Analytics Best Practices**: [vercel.com/analytics/best-practices](https://vercel.com/docs/concepts/analytics)

---

## Next Steps

1. ✅ Install Vercel Analytics snippet
2. ✅ Verify data appears in dashboard
3. ⬜ Set up custom events for key actions
4. ⬜ Integrate with email marketing (Klaviyo)
5. ⬜ Create weekly reports from analytics
6. ⬜ Monitor performance metrics and optimize

---

**Last Updated**: December 2025
**Version**: 1.0
