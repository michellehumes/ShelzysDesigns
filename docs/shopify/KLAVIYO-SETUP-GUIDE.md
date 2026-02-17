# Klaviyo Setup Guide for Shelzy's Designs

## Overview
This guide walks you through setting up Klaviyo email automation for Shelzy's Designs. Klaviyo integrates seamlessly with Shopify and powers abandoned cart recovery, welcome sequences, and post-purchase flows.

**Projected Revenue Impact:** +$1,500-3,500/month from email automation alone

---

## Step 1: Create Klaviyo Account

1. Go to [klaviyo.com](https://www.klaviyo.com)
2. Click "Sign Up Free" (free up to 250 contacts)
3. Enter business email: `hello@shelzysdesigns.com`
4. Select "Shopify" as your platform
5. Complete account setup

---

## Step 2: Connect Shopify Store

1. In Klaviyo, go to **Integrations** → **Add Integration**
2. Search for "Shopify" and click **Add Integration**
3. Enter your store URL: `shelzysdesigns.myshopify.com`
4. Click **Connect to Shopify**
5. In Shopify Admin, click **Install App**
6. Enable all sync options:
   - ✅ Sync customers
   - ✅ Sync orders
   - ✅ Sync products
   - ✅ Enable on-site tracking

---

## Step 3: Create Discount Codes in Shopify

### WELCOME10 - New Subscriber Discount
1. Shopify Admin → **Discounts** → **Create Discount**
2. Select "Amount off order"
3. Settings:
   - Discount code: `WELCOME10`
   - Percentage: 10%
   - Minimum purchase: None
   - Customer eligibility: All customers
   - Limit: One use per customer
   - Active dates: No end date

### COMEBACK10 - Abandoned Cart Recovery
1. Create another discount:
   - Discount code: `COMEBACK10`
   - Percentage: 10%
   - Minimum purchase: None
   - Limit: One use per customer

### PHOTOREVIEW15 - Photo Review Incentive
1. Create another discount:
   - Discount code: `PHOTOREVIEW15`
   - Percentage: 15%
   - Minimum purchase: None
   - Limit: One use per customer

---

## Step 4: Set Up Email Flows

### Flow 1: Welcome Series (3 emails)

#### Email 1: Welcome + Discount (Send immediately)
- **Subject:** Welcome to Shelzy's! Here's 10% off 🎁
- **Content:**
  - Personal welcome message
  - Highlight WELCOME10 code
  - Introduce brand story
  - Showcase bestsellers

#### Email 2: Brand Story (Send after 2 days)
- **Subject:** The story behind every sip ✨
- **Content:**
  - Behind-the-scenes story
  - Quality and personalization process
  - Customer testimonials

#### Email 3: Social Proof (Send after 4 days)
- **Subject:** Why 500+ customers love their bottles
- **Content:**
  - Customer reviews
  - UGC photos
  - Gentle CTA to shop

### Flow 2: Abandoned Cart Recovery (3 emails)

#### Email 1: Cart Reminder (Send 1 hour after abandonment)
- **Subject:** Did you forget something? 👀
- **Content:**
  - Dynamic cart contents
  - Product images
  - Clear CTA to return

#### Email 2: Social Proof (Send 24 hours after abandonment)
- **Subject:** Your perfect bottle is waiting!
- **Content:**
  - Cart reminder
  - Customer reviews
  - "Still available" messaging

#### Email 3: Final Offer (Send 48 hours after abandonment)
- **Subject:** Last chance! 10% off your cart
- **Content:**
  - Include COMEBACK10 code
  - Create urgency
  - Free shipping reminder ($75+)

### Flow 3: Post-Purchase (3 emails)

#### Email 1: Thank You + What's Next (Send immediately)
- **Subject:** Your order is confirmed! 🎉
- **Content:**
  - Order confirmation
  - Processing timeline (3-5 days)
  - Care instructions preview

#### Email 2: Shipping Update (Trigger: Shipment created)
- **Subject:** Your bottle is on its way! 📦
- **Content:**
  - Tracking link
  - Estimated delivery
  - Care tips

#### Email 3: Review Request (Send 7 days after delivery)
- **Subject:** How's your new bottle? Share a photo for 15% off!
- **Content:**
  - Request review
  - Offer PHOTOREVIEW15 for photo reviews
  - Link to Judge.me review form

### Flow 4: Browse Abandonment (2 emails)

#### Email 1: We noticed you looking (Send 2 hours after browsing)
- **Subject:** Still thinking about this? 💭
- **Content:**
  - Show viewed products
  - Highlight personalization options
  - Soft CTA

#### Email 2: Bestseller highlight (Send 24 hours later)
- **Subject:** You have great taste!
- **Content:**
  - Similar products
  - Bestsellers
  - Social proof

---

## Step 5: Set Up Signup Forms

### 1. Popup Form (Replace current snippet)
1. In Klaviyo, go to **Signup Forms** → **Create Form**
2. Select "Popup" template
3. Design settings:
   - Background: #FFFFFF
   - Accent color: #8BAA88 (Sage Green)
   - Headline font: Playfair Display
   - Body font: Inter
   - Border radius: 16px
4. Content:
   - Headline: "Get 10% Off Your First Order"
   - Subtext: "Join our list for exclusive offers and new designs"
   - Button text: "Unlock My 10% Off"
   - Success message: Show WELCOME10 code
5. Targeting:
   - Show after 5 seconds OR on exit intent
   - Don't show on checkout/cart pages
   - Don't show to existing subscribers

### 2. Footer Embedded Form
1. Create new form → "Embedded"
2. Design to match site footer
3. Single email input + submit button
4. Add to theme footer section

---

## Step 6: Configure Settings

### Sending Domain
1. Go to **Settings** → **Email** → **Sending Domain**
2. Add custom sending domain: `email.shelzysdesigns.com`
3. Add DNS records (DKIM, SPF) provided by Klaviyo
4. Verify domain

### SMS (Optional - Future)
1. Set up SMS sending number
2. Create SMS consent flow
3. Add SMS to abandoned cart sequence

---

## Step 7: Test Everything

### Checklist:
- [ ] Send test email from each flow
- [ ] Test popup form on desktop and mobile
- [ ] Test abandoned cart trigger (add to cart, leave)
- [ ] Verify discount codes work
- [ ] Check email renders on Gmail, Apple Mail, Outlook

---

## Automation Schedule Summary

| Flow | Trigger | Email Count | Expected Revenue |
|------|---------|-------------|------------------|
| Welcome Series | Signup | 3 | +$500/mo |
| Abandoned Cart | Cart abandonment | 3 | +$800/mo |
| Post-Purchase | Order placed | 3 | +$200/mo |
| Browse Abandonment | Product viewed | 2 | +$300/mo |
| **Total** | | **11** | **+$1,800/mo** |

---

## Brand Guidelines for Emails

### Colors
- Primary CTA: #8BAA88 (Sage Green)
- CTA Hover: #4E5F4A (Dark Sage)
- Background: #FFFFFF or #FAF9F6
- Body Text: #2B2B2B
- Gold Accent: #D1C7A1

### Typography
- Headlines: Playfair Display, 600 weight
- Body: Inter, 400 weight
- Accent/Badges: Montserrat, 600 weight

### Tone
- Warm and welcoming
- Personal (use first names)
- Focus on personalization and quality
- Avoid hard selling

---

## Monthly Maintenance

1. **Review metrics weekly:**
   - Open rates (target: 25%+)
   - Click rates (target: 3%+)
   - Revenue per email
   - Unsubscribe rate (keep under 0.5%)

2. **Clean list monthly:**
   - Remove bounced emails
   - Segment inactive subscribers
   - Re-engagement campaign for 90-day inactive

3. **A/B test monthly:**
   - Subject lines
   - Send times
   - CTA buttons
   - Email length

---

## Support Resources

- [Klaviyo Help Center](https://help.klaviyo.com)
- [Shopify + Klaviyo Integration Guide](https://help.klaviyo.com/hc/en-us/articles/115005253567)
- [Email Deliverability Best Practices](https://help.klaviyo.com/hc/en-us/articles/115005253447)

---

*Last Updated: December 2025*
