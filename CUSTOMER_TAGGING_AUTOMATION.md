# Customer Tagging & Segmentation Automation

**Purpose**: Automatically segment customers by purchase behavior for targeted marketing
**Goal**: Personalize email campaigns, offers, and product recommendations

---

## 🎯 Why Customer Tagging Matters

### Benefits:
- ✅ Send relevant emails (bridal customers get bridal content, corporate get corporate)
- ✅ Track customer lifetime value by segment
- ✅ Identify repeat customers for VIP treatment
- ✅ Measure segment-specific conversion rates
- ✅ Personalize product recommendations

### Current State:
- ❌ All customers treated the same
- ❌ No differentiation between one-time buyers and repeat customers
- ❌ Generic email campaigns sent to everyone

---

## 🏷️ Tag Structure

### Primary Tags (Purchase-Based)

#### **Segment Tags**:
- `bridal` - Purchased from bridal/wedding collections
- `corporate` - Purchased bulk/corporate products
- `everyday` - Purchased single bottles for personal use
- `bachelorette` - Purchased bachelorette party sets

#### **Value Tags**:
- `first-time` - First purchase
- `repeat-customer` - 2+ purchases
- `vip` - 3+ purchases OR $300+ lifetime value
- `high-value` - Single order $150+

#### **Behavior Tags**:
- `abandoned-cart` - Left items in cart (auto-tagged by Shopify)
- `email-subscriber` - Subscribed to newsletter
- `instagram-referral` - Came from Instagram
- `referral-customer` - Used referral code

---

## 🤖 Automation Methods

### Option 1: Shopify Flow (Best Option - No Code)

**Requires**: Shopify Plus plan OR Shopify Flow app ($0 free version available)

**How to Set Up**:
1. Shopify Admin → Apps → Shopify Flow
2. Create new workflow
3. Trigger: "Order created"
4. Conditions & Actions (see templates below)

---

### Option 2: Third-Party Apps

**Recommended Apps**:
1. **Klaviyo** (Email marketing + segmentation) - FREE up to 250 contacts
   - Auto-tags based on purchase behavior
   - Built-in segments without manual tagging

2. **Shopify Flow** (Automation) - FREE basic version
   - Tag customers automatically based on rules

3. **Customer Tagger** by Bonify - $4.99/month
   - Simple, focused on tagging only

---

### Option 3: Manual Tagging Rules

**If you don't have automation apps**, document rules for manual tagging:

**Weekly Task** (15 minutes):
1. Go to Shopify Admin → Customers → All customers
2. Filter by "Ordered in last 7 days"
3. Check each order:
   - If product from Bridal collection → Add tag `bridal`
   - If product from Corporate collection → Add tag `corporate`
   - If first order → Add tag `first-time`
   - If 2+ orders → Add tag `repeat-customer`

---

## 📋 Shopify Flow Templates

### Flow 1: Tag Bridal Customers

```
Trigger: Order created
Condition: Order contains product from "Bridal & Bachelorette" collection
Action: Add customer tag "bridal"
```

**Setup Steps**:
1. Shopify Flow → Create workflow
2. Trigger: Order → Order created
3. Add condition: Check if → Order → Line items → Product → Collection → equals → "Bridal & Bachelorette"
4. Add action: Customer → Add customer tags → "bridal"
5. Turn workflow ON

---

### Flow 2: Tag Corporate Customers

```
Trigger: Order created
Condition: Order total >= $200 OR product title contains "Corporate" OR product title contains "Bulk"
Action: Add customer tag "corporate"
```

---

### Flow 3: Tag Repeat Customers

```
Trigger: Order created
Condition: Customer order count >= 2
Action: Add customer tag "repeat-customer"
AND Remove customer tag "first-time"
```

---

### Flow 4: Tag High-Value Customers

```
Trigger: Order created
Condition: Order total >= $150
Action: Add customer tag "high-value"
```

---

### Flow 5: Tag VIP Customers

```
Trigger: Order created
Condition: Customer total spent >= $300
Action: Add customer tag "vip"
AND Send notification to store owner (optional)
```

---

## 📧 How to Use Tags in Email Marketing

### Klaviyo Segments (Recommended)

**Segment 1: Bridal Customers**
- Tags contain "bridal"
- Send emails about:
  - New bridal products
  - Bridesmaid gift ideas
  - Wedding planning tips
  - Referral incentive (get bridesmaids to buy)

**Segment 2: Corporate Customers**
- Tags contain "corporate" OR Order total > $200
- Send emails about:
  - Bulk order discounts
  - Corporate gifting ideas
  - Team building events
  - Reorder reminders (annual events)

**Segment 3: VIP Customers**
- Tags contain "vip" OR Total spent > $300
- Send emails about:
  - Exclusive early access to new products
  - Special VIP discount codes
  - Thank you messages
  - Referral rewards

**Segment 4: First-Time Customers**
- Tags contain "first-time"
- Send emails about:
  - Welcome series
  - How to care for your bottle
  - Share your photo incentive
  - Second purchase discount

---

## 📊 Reporting & Analytics

### Metrics to Track by Segment

**Bridal Segment**:
- Average order value
- Repeat purchase rate
- Referral rate (bridesmaids buying after seeing friend's bottle)
- Peak seasons (spring/summer)

**Corporate Segment**:
- Average order value (should be higher)
- Reorder rate (annual events)
- Lead time (plan ahead for corporate orders)

**VIP Segment**:
- Lifetime value
- Churn rate
- Referral impact

### How to Pull Reports:

**Shopify Admin**:
1. Customers → Saved searches
2. Create search: "Customers tagged with 'bridal'"
3. Export to CSV
4. Analyze in Excel/Google Sheets

**Klaviyo**:
- Built-in segment reports
- Shows revenue per segment
- Email performance by segment

---

## 🎯 Tag-Based Campaign Ideas

### Campaign 1: Bridal Reorder (6 months after purchase)
**Audience**: Customers tagged "bridal" who purchased 6 months ago
**Email Subject**: "Did your bridesmaids ask where you got those bottles?"
**Offer**: 15% off their friends' orders
**CTA**: "Share Your Referral Link"

---

### Campaign 2: Corporate Reorder (Annual)
**Audience**: Customers tagged "corporate" who purchased 12 months ago
**Email Subject**: "[Company Name], time to reorder for this year's event?"
**Offer**: Same order with 10% off, or upgrade quantity for 15% off
**CTA**: "Reorder Now"

---

### Campaign 3: VIP Exclusive Launch
**Audience**: Customers tagged "vip"
**Email Subject**: "You're invited: See our new collection before everyone else"
**Offer**: 24-hour early access + free gift box upgrade
**CTA**: "Shop Early Access"

---

### Campaign 4: Win-Back First-Time
**Audience**: Customers tagged "first-time" who haven't purchased in 90 days
**Email Subject**: "We miss you! Here's 20% off your next order"
**Offer**: 20% off second purchase
**CTA**: "Shop Now"

---

## 🚀 Implementation Timeline

### Week 1: Setup
- [ ] Install Shopify Flow or Klaviyo
- [ ] Create 5 core automation workflows
- [ ] Test with sample orders
- [ ] Turn workflows ON

### Week 2: Retroactive Tagging
- [ ] Export all customers
- [ ] Use order history to manually tag past customers
- [ ] Import tagged customers back to Shopify

### Week 3: Create Segments
- [ ] Set up Klaviyo segments
- [ ] Create email templates for each segment
- [ ] Design first campaign

### Week 4: Launch
- [ ] Send first segmented campaign
- [ ] Monitor open rates, click rates, conversion
- [ ] Iterate based on performance

**Total**: 1 month from setup to first campaign

---

## 📈 Expected Results

### Open Rates:
- Generic campaigns: 15-20%
- Segmented campaigns: 25-35%
- **Improvement**: +50-75%

### Click-Through Rates:
- Generic campaigns: 2-3%
- Segmented campaigns: 5-8%
- **Improvement**: +100-150%

### Conversion Rates:
- Generic campaigns: 0.5-1%
- Segmented campaigns: 2-4%
- **Improvement**: +200-300%

### Revenue Per Email:
- Generic: $0.10-0.20 per email
- Segmented: $0.50-1.00 per email
- **Improvement**: +400-500%

---

## ✅ Quick Start Checklist

- [ ] Install Shopify Flow OR Klaviyo
- [ ] Create "bridal" tagging workflow
- [ ] Create "corporate" tagging workflow
- [ ] Create "repeat-customer" workflow
- [ ] Create "vip" workflow
- [ ] Test with dummy order
- [ ] Turn workflows ON
- [ ] Tag existing customers (retroactive)
- [ ] Create first segmented email campaign
- [ ] Monitor results

---

## 🔗 Related Resources

- `marketing/klaviyo-email-templates.md` - Email templates for each segment
- `marketing/REFERRAL_PROGRAM_SETUP.md` - Leverage bridal customers for referrals
- `IMPLEMENTATION_QUICK_START.md` - Overall setup guide

---

## 📎 Tag Cheat Sheet

| Customer Type | Primary Tag | Secondary Tags | Email Frequency |
|--------------|-------------|----------------|-----------------|
| First-time bridal | `bridal`, `first-time` | - | 2x/month |
| Repeat bridal | `bridal`, `repeat-customer` | `vip` if 3+ | 1x/month |
| Corporate buyer | `corporate`, `high-value` | `vip` if $300+ | 1x/quarter |
| VIP | `vip` | Segment-specific | 1x/month exclusive |
| Abandoned cart | `abandoned-cart` | Segment-specific | 1x (automated) |

---

**Pro Tip**: Start simple with 3-4 core tags, then expand as you see results. Don't over-complicate on day one.
