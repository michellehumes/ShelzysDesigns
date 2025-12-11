# Analytics & Event Tracking Guide

## Overview
This guide covers setting up comprehensive analytics tracking for Shelzy's Designs to measure conversions, user behavior, and marketing effectiveness.

---

## Required Accounts

1. **Google Analytics 4** (GA4) - Primary analytics
2. **Google Tag Manager** (GTM) - Tag management
3. **Google Search Console** - SEO monitoring
4. **Meta Pixel** (Facebook/Instagram) - Social ads
5. **Pinterest Tag** - Pinterest ads
6. **Klaviyo Tracking** - Email attribution

---

## Google Analytics 4 Setup

### Step 1: Create GA4 Property
1. Go to analytics.google.com
2. Click Admin → Create Property
3. Property name: "Shelzy's Designs"
4. Select industry: "Shopping"
5. Business objectives: "Generate leads" + "Drive sales"

### Step 2: Get Measurement ID
Your ID will look like: `G-XXXXXXXXXX`

### Step 3: Add to Shopify
```liquid
{% comment %} Add to theme.liquid before </head> {% endcomment %}

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Enhanced Ecommerce Tracking

### Product View Event
```liquid
{% comment %} Add to product.liquid or product template {% endcomment %}

<script>
document.addEventListener('DOMContentLoaded', function() {
  gtag('event', 'view_item', {
    currency: '{{ shop.currency }}',
    value: {{ product.price | money_without_currency | remove: ',' }},
    items: [{
      item_id: '{{ product.id }}',
      item_name: '{{ product.title | escape }}',
      item_brand: '{{ product.vendor | escape }}',
      item_category: '{{ product.type | escape }}',
      price: {{ product.price | money_without_currency | remove: ',' }},
      quantity: 1
    }]
  });
});
</script>
```

### Add to Cart Event
```liquid
{% comment %} Add to product form or ATC button handler {% endcomment %}

<script>
document.querySelector('[data-add-to-cart]').addEventListener('click', function() {
  gtag('event', 'add_to_cart', {
    currency: '{{ shop.currency }}',
    value: {{ product.price | money_without_currency | remove: ',' }},
    items: [{
      item_id: '{{ product.id }}',
      item_name: '{{ product.title | escape }}',
      price: {{ product.price | money_without_currency | remove: ',' }},
      quantity: document.querySelector('[name="quantity"]').value || 1
    }]
  });
});
</script>
```

### View Cart Event
```liquid
{% comment %} Add to cart.liquid or cart template {% endcomment %}

<script>
document.addEventListener('DOMContentLoaded', function() {
  gtag('event', 'view_cart', {
    currency: '{{ shop.currency }}',
    value: {{ cart.total_price | money_without_currency | remove: ',' }},
    items: [
      {% for item in cart.items %}
      {
        item_id: '{{ item.product.id }}',
        item_name: '{{ item.product.title | escape }}',
        price: {{ item.price | money_without_currency | remove: ',' }},
        quantity: {{ item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  });
});
</script>
```

### Begin Checkout Event
```liquid
{% comment %} Add to cart page checkout button {% endcomment %}

<script>
document.querySelector('[data-checkout-button]').addEventListener('click', function() {
  gtag('event', 'begin_checkout', {
    currency: '{{ shop.currency }}',
    value: {{ cart.total_price | money_without_currency | remove: ',' }},
    items: [
      {% for item in cart.items %}
      {
        item_id: '{{ item.product.id }}',
        item_name: '{{ item.product.title | escape }}',
        price: {{ item.price | money_without_currency | remove: ',' }},
        quantity: {{ item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  });
});
</script>
```

### Purchase Event (Thank You Page)
In Shopify Admin → Settings → Checkout → Additional Scripts:

```liquid
{% if first_time_accessed %}
<script>
  gtag('event', 'purchase', {
    transaction_id: '{{ order.order_number }}',
    value: {{ total_price | money_without_currency | remove: ',' }},
    tax: {{ tax_price | money_without_currency | remove: ',' }},
    shipping: {{ shipping_price | money_without_currency | remove: ',' }},
    currency: '{{ shop.currency }}',
    items: [
      {% for line_item in line_items %}
      {
        item_id: '{{ line_item.product.id }}',
        item_name: '{{ line_item.title | escape }}',
        price: {{ line_item.final_price | money_without_currency | remove: ',' }},
        quantity: {{ line_item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  });
</script>
{% endif %}
```

---

## Custom Events to Track

### Email Signup
```javascript
// When email popup form is submitted
function trackEmailSignup(source) {
  gtag('event', 'sign_up', {
    method: source // 'popup', 'footer', 'exit_intent'
  });

  // Also track as conversion
  gtag('event', 'conversion', {
    send_to: 'AW-XXXXXXXXXX/XXXXXXXXXX' // If using Google Ads
  });
}
```

### Popup Interactions
```javascript
// Popup shown
gtag('event', 'popup_shown', {
  popup_type: 'email_capture'
});

// Popup closed
gtag('event', 'popup_closed', {
  popup_type: 'email_capture',
  time_visible: timeVisible // seconds
});
```

### Cart Upsell Click
```javascript
function trackUpsellClick(productId, productName) {
  gtag('event', 'select_promotion', {
    promotion_name: 'cart_upsell',
    items: [{
      item_id: productId,
      item_name: productName
    }]
  });
}
```

### Free Shipping Progress
```javascript
// When customer hits free shipping threshold
gtag('event', 'free_shipping_unlocked', {
  cart_value: cartTotal
});
```

### Personalization Form
```javascript
// When personalization is completed
gtag('event', 'personalization_complete', {
  product_id: productId,
  font_selected: fontName,
  has_icon: hasIcon
});
```

---

## Meta Pixel Setup

### Base Pixel Code
```liquid
{% comment %} Add to theme.liquid before </head> {% endcomment %}

<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.net/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

### Meta Events
```javascript
// View Content (Product Page)
fbq('track', 'ViewContent', {
  content_ids: ['{{ product.id }}'],
  content_type: 'product',
  value: {{ product.price | money_without_currency }},
  currency: '{{ shop.currency }}'
});

// Add to Cart
fbq('track', 'AddToCart', {
  content_ids: ['{{ product.id }}'],
  content_type: 'product',
  value: {{ product.price | money_without_currency }},
  currency: '{{ shop.currency }}'
});

// Initiate Checkout
fbq('track', 'InitiateCheckout', {
  value: {{ cart.total_price | money_without_currency }},
  currency: '{{ shop.currency }}',
  num_items: {{ cart.item_count }}
});

// Purchase (Thank You Page)
fbq('track', 'Purchase', {
  value: {{ total_price | money_without_currency }},
  currency: '{{ shop.currency }}',
  content_ids: [{% for item in line_items %}'{{ item.product_id }}'{% unless forloop.last %},{% endunless %}{% endfor %}],
  content_type: 'product',
  num_items: {{ line_items.size }}
});
```

---

## Pinterest Tag Setup

```liquid
{% comment %} Add to theme.liquid before </head> {% endcomment %}

<!-- Pinterest Tag -->
<script>
!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(
Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var
t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];
r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', 'YOUR_TAG_ID');
pintrk('page');
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt=""
src="https://ct.pinterest.com/v3/?tid=YOUR_TAG_ID&noscript=1" />
</noscript>
```

### Pinterest Events
```javascript
// Page Visit
pintrk('track', 'pagevisit');

// View Product
pintrk('track', 'viewcategory', {
  product_id: '{{ product.id }}'
});

// Add to Cart
pintrk('track', 'addtocart', {
  product_id: '{{ product.id }}',
  value: {{ product.price | money_without_currency }},
  currency: '{{ shop.currency }}'
});

// Checkout
pintrk('track', 'checkout', {
  value: {{ total_price | money_without_currency }},
  currency: '{{ shop.currency }}',
  order_quantity: {{ line_items.size }}
});
```

---

## Google Tag Manager Setup

### Container Code
```liquid
{% comment %} Add immediately after <head> {% endcomment %}
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->

{% comment %} Add immediately after <body> {% endcomment %}
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### DataLayer Events
```javascript
// Standard ecommerce dataLayer push
dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    items: [{
      item_name: productName,
      item_id: productId,
      price: price,
      quantity: quantity
    }]
  }
});
```

---

## Key Metrics Dashboard

### Weekly Review Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Conversion Rate | Purchases / Sessions | 2-3% |
| Add to Cart Rate | ATC Events / Product Views | 8-12% |
| Cart Abandonment | (Carts - Purchases) / Carts | < 65% |
| AOV | Revenue / Orders | $45+ |
| Email Capture Rate | Signups / Sessions | 3-5% |
| Revenue per Session | Revenue / Sessions | $2+ |

### Monthly Review Metrics

| Metric | Target |
|--------|--------|
| Customer Acquisition Cost | < $25 |
| Customer Lifetime Value | > $75 |
| Return Customer Rate | > 20% |
| Email Revenue Attribution | > 25% |

---

## Shopify Analytics Integration

Shopify provides built-in analytics. Ensure these are enabled:
1. Admin → Analytics → Reports
2. Enable "Live View"
3. Set up custom reports for:
   - Sales by product
   - Traffic sources
   - Customer cohorts
   - Repeat purchase rate

---

## Debugging & Testing

### GA4 Debug Mode
```javascript
gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true });
```

### Meta Pixel Helper
Install "Facebook Pixel Helper" Chrome extension

### Pinterest Tag Helper
Install "Pinterest Tag Helper" Chrome extension

### GTM Preview Mode
Use GTM's built-in preview mode to test tags

---

## Privacy Compliance

### Cookie Consent
Add a cookie consent banner for GDPR/CCPA compliance:

```liquid
{% comment %} Consider using apps like: Pandectes GDPR, Termly, or CookieYes {% endcomment %}
```

### Tracking Opt-Out
```javascript
// If user opts out of tracking
if (!hasConsent) {
  window['ga-disable-G-XXXXXXXXXX'] = true;
  fbq('consent', 'revoke');
}
```

---

## Implementation Checklist

- [ ] GA4 property created
- [ ] GA4 code added to theme
- [ ] Enhanced ecommerce events added
- [ ] Meta Pixel installed
- [ ] Pinterest Tag installed
- [ ] Google Search Console connected
- [ ] Conversion events tested
- [ ] Thank you page tracking verified
- [ ] Cookie consent implemented
- [ ] Custom events tracked
- [ ] Dashboard set up

---

*Last Updated: December 2025*
