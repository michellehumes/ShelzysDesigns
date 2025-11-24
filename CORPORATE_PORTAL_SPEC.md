# Corporate B2B Portal Specifications

**Purpose**: Create dedicated experience for corporate/bulk buyers
**Goal**: Capture high-value B2B orders with streamlined bulk ordering process

---

## 🎯 Why a Corporate Portal Matters

### The B2B Problem:
- ❌ Corporate buyers have different needs than individual consumers
- ❌ Current site is consumer-focused (bridal party emphasis)
- ❌ No bulk pricing calculator or quick reorder
- ❌ No account management or saved orders
- ❌ Missing trust signals for B2B (NET 30, purchase orders, etc.)

### The Portal Solution:
- ✅ Dedicated B2B experience shows you take corporate seriously
- ✅ Bulk pricing transparency builds trust
- ✅ Quick reorder = easier annual event repeat business
- ✅ Account management = relationship building
- ✅ Higher average order values ($500-5,000 vs. $100)

**B2B Stats**:
- Corporate customers have 3x higher lifetime value
- B2B repeat purchase rate: 60-70% (vs. 20-30% consumer)
- Average B2B order: $800-2,000 (vs. $100 consumer)

---

## 🏢 Portal Structure

### Landing Page: `/pages/corporate`

**Current State**: Exists but needs enhancement

**Recommended Structure**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CORPORATE GIFTING & BULK ORDERS
  Custom water bottles for teams, events, and clients
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Hero Image: Conference room with bottles]

┌──────────────────────────────────────────────────────────┐
│  WHY COMPANIES CHOOSE SHELZY'S FOR CORPORATE GIFTS       │
│                                                          │
│  ✓ Bulk Pricing (20% off 25+, 30% off 50+)             │
│  ✓ Logo + Name Personalization                          │
│  ✓ Fast Turnaround (7-10 days)                          │
│  ✓ Account Management                                   │
│  ✓ Reorder History & Quick Reorder                      │
└──────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               PERFECT FOR
┌──────────┬──────────┬──────────┬──────────┐
│ Employee │ Client   │Conference│ Team     │
│ Gifts    │ Gifting  │ Swag     │ Building │
└──────────┴──────────┴──────────┴──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           BULK PRICING CALCULATOR
┌────────────────────────────────────────────────────────┐
│ Quantity: [___] bottles                                 │
│ Personalization: [ ] Names  [ ] Logo  [ ] Both         │
│                                                         │
│ Your Price: $XX.XX per bottle                          │
│ Total: $XXX.XX (Save $XX.XX vs. individual pricing)   │
│                                                         │
│         [Get Custom Quote] [Order Now]                 │
└────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             HOW IT WORKS
┌───────────────────────────────────────────────────────┐
│ 1. Request Quote → 2. Design Proof → 3. Production   │
│    (24 hrs)         (1-2 days)        (7-10 days)     │
└───────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TRUSTED BY COMPANIES LIKE
  [Logo 1]  [Logo 2]  [Logo 3]  [Logo 4]  [Logo 5]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Case Studies / Testimonials]

[Get Started] [Contact Account Manager]
```

---

## 💼 Key Features to Build

### Feature 1: Bulk Pricing Calculator (HIGH PRIORITY)

**What It Does**: Real-time price calculator showing per-unit cost based on quantity

**UI**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INSTANT BULK PRICING CALCULATOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How many bottles do you need?
[Slider: 25 ←→ 500+]
Selected: 50 bottles

Personalization:
( ) Names Only
( ) Logo Only
(•) Names + Logo (+$2/bottle)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           YOUR PRICING

Base Price:    $25.00/bottle
Quantity Disc: -$5.00/bottle (20% off for 50+)
Personalize:   +$2.00/bottle

TOTAL:         $22.00/bottle
ORDER TOTAL:   $1,100.00

You save: $250 compared to individual pricing

[Get Custom Quote] [Start Order]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Pricing Tiers** (Suggested):
| Quantity | Discount | Price Per Bottle |
|----------|----------|------------------|
| 1-24     | 0%       | $25.00           |
| 25-49    | 20%      | $20.00           |
| 50-99    | 25%      | $18.75           |
| 100-249  | 30%      | $17.50           |
| 250+     | 35%      | $16.25           |

**Implementation**:
- JavaScript calculator (no backend needed)
- Updates in real-time as user adjusts slider
- Displays total savings vs. individual pricing
- CTA: "Get Custom Quote" (leads to form)

---

### Feature 2: Quick Quote Request Form

**What It Does**: Streamlined form for corporate inquiries

**Form Fields**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    GET A CUSTOM QUOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Company Information:
Company Name: [_______________]
Industry: [Dropdown: Tech, Finance, Healthcare, etc.]
Contact Name: [_______________]
Email: [_______________]
Phone: [_______________]

Order Details:
Quantity Needed: [___] bottles
Personalization: [ ] Names [ ] Logo [ ] Both
Logo Available: ( ) Yes, I have vector file
                ( ) No, need design help
Preferred Colors: [______________]
Event Date (optional): [__/__/____]

Budget: [Dropdown: Under $500, $500-1K, $1K-2.5K, $2.5K-5K, $5K+]

Additional Notes:
[Text area]

[Request Quote]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Response time: Within 24 business hours
```

**Backend**:
- Email notification to orders@shelzysdesigns.com
- Auto-reply to customer: "Thanks, we'll respond within 24 hours"
- Store in Shopify Customer metafields or CRM (HubSpot, etc.)

---

### Feature 3: Logo Upload & Design Proof Portal

**What It Does**: Allow customers to upload logo, receive design proof

**Flow**:
```
Step 1: Upload Logo
┌────────────────────────────────────────┐
│ Upload your logo (PNG, SVG, or AI)     │
│ [Drag & Drop or Browse]                │
│                                        │
│ Don't have a vector file?              │
│ We can convert it for you (+$50)      │
└────────────────────────────────────────┘

Step 2: Design Placement
┌────────────────────────────────────────┐
│ Where should the logo go?              │
│ ( ) Center front                       │
│ ( ) Upper left front                   │
│ ( ) Back                               │
│                                        │
│ [Preview]                              │
└────────────────────────────────────────┘

Step 3: Review Proof (1-2 days later)
┌────────────────────────────────────────┐
│ Your Design Proof is Ready!            │
│ [View Mockup]                          │
│                                        │
│ [✓ Approve] or [Request Changes]      │
└────────────────────────────────────────┘
```

**Implementation**:
- File upload widget (Dropbox, Uploadcare, or custom)
- Manual review process (you create proof, email customer)
- Approval system (customer clicks link to approve)

**Alternative**: Third-party app like **Printful** or **Customily** ($30-50/mo) handles entire custom product workflow

---

### Feature 4: Corporate Account Dashboard

**What It Does**: Repeat customers get saved order history & quick reorder

**Dashboard Features**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       WELCOME BACK, [COMPANY NAME]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Account Manager: Sarah Johnson
Email: sarah@shelzysdesigns.com
Phone: (555) 123-4567

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          YOUR ORDER HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────────┐
│ Order #1234 - Nov 2024                       │
│ 50 bottles - Logo + Names                   │
│ $1,100.00                                    │
│ [View Details] [Reorder] [Download Invoice] │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Order #1123 - Jan 2024                       │
│ 50 bottles - Logo + Names                   │
│ $1,100.00                                    │
│ [View Details] [Reorder] [Download Invoice] │
└──────────────────────────────────────────────┘

[View All Orders]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         QUICK REORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to order for this year's event?
Use your saved design or request updates.

[Reorder Last Order] [Start New Order]
```

**Implementation Options**:

**Option A**: Shopify Customer Accounts (Basic)
- Enable customer accounts in Shopify
- Customers see order history automatically
- Add custom "Reorder" button via theme customization

**Option B**: Shopify Plus B2B Features (Advanced)
- Requires Shopify Plus ($2,000/mo)
- Native B2B features: custom pricing, NET 30 payment terms, draft order checkout
- Worth it if you have 10+ corporate accounts

**Option C**: Third-Party B2B App (Medium)
- **SparkLayer**: https://www.sparklayer.io ($99-299/mo)
- **Wholesale Club**: https://wholesalehelper.io ($49/mo)
- Adds B2B features to any Shopify plan

---

### Feature 5: Saved Designs & Templates

**What It Does**: Corporate customers can save their approved designs for easy reordering

**UI**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          YOUR SAVED DESIGNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│ [Logo Mockup Image]                         │
│                                             │
│ "Company Conference 2025"                   │
│ Logo + Employee Names                       │
│ Colors: Navy, Gray                          │
│                                             │
│ [Order with This Design]                    │
└─────────────────────────────────────────────┘

[+ Save New Design]
```

**Implementation**:
- Store design specs in Shopify Customer metafields
- Or use external CRM (HubSpot, Salesforce) to track corporate accounts
- Link designs to customer account

---

## 📋 B2B Trust Elements to Add

### 1. **Social Proof for B2B**
```
TRUSTED BY 500+ COMPANIES

[TechCorp Logo] [FinanceInc Logo] [HealthPlus Logo]

"We order 200 bottles every year for our annual retreat.
The team loves them and they make great keepsakes."
- Sarah J., HR Director at TechCorp
```

---

### 2. **Payment Options**
```
FLEXIBLE PAYMENT OPTIONS

✓ Credit Card (instant)
✓ Purchase Order (NET 30 for established accounts)
✓ ACH/Wire Transfer
✓ Request a W-9 Form
```

---

### 3. **Guarantees**
```
OUR B2B GUARANTEE

✓ On-Time Delivery or 10% Off Next Order
✓ Free Design Revisions Until You're Happy
✓ Bulk Discount Price Match
✓ Dedicated Account Manager
```

---

## 🎨 Design & Branding

### Visual Differences from Consumer Site:

| Element | Consumer (Bridal) | Corporate (B2B) |
|---------|------------------|----------------|
| Color Palette | Soft pastels, romantic | Bold, professional (navy, gray) |
| Imagery | Bridesmaids, weddings | Office, conferences, teams |
| Tone | Emotional, personal | Professional, ROI-focused |
| CTAs | "Shop Now", "Add to Cart" | "Request Quote", "Contact Sales" |
| Trust Signals | Reviews, testimonials | Company logos, case studies |

---

## 🚀 Launch Plan

### Phase 1: Landing Page Enhancement (Week 1-2)
- [ ] Update `/pages/corporate` with new copy
- [ ] Add bulk pricing calculator
- [ ] Add quick quote form
- [ ] Add corporate trust elements (logos, testimonials)

### Phase 2: Quote Process (Week 3-4)
- [ ] Set up quote request form backend
- [ ] Create email template for quote responses
- [ ] Document internal quote approval process
- [ ] Train team on B2B sales process

### Phase 3: Account Management (Week 5-8)
- [ ] Enable Shopify customer accounts
- [ ] Add "Reorder" functionality to orders
- [ ] Set up saved designs system
- [ ] Assign account manager (could be you initially)

### Phase 4: Advanced Features (Optional, Month 3+)
- [ ] Logo upload portal
- [ ] Design proof approval system
- [ ] NET 30 payment terms (Shopify Plus or app)
- [ ] CRM integration (HubSpot, Salesforce)

---

## 📊 Success Metrics

### KPIs to Track:
- Number of quote requests per month
- Quote-to-order conversion rate (target: 30-50%)
- Average B2B order value (target: $800-2,000)
- B2B repeat purchase rate (target: 60%+)
- B2B revenue as % of total (target: 20-30%)

### Quarterly Goals:
- Q1: 10 corporate orders, $15,000 B2B revenue
- Q2: 20 corporate orders, $35,000 B2B revenue
- Q3: 30 corporate orders, $60,000 B2B revenue
- Q4: 40 corporate orders, $100,000 B2B revenue

**Year 1 B2B Target**: $200,000+ (20% of total revenue)

---

## 💰 Budget & Resources

### Minimum Viable Portal (Low Budget):
- Enhanced landing page: 4-8 hours design/dev ($400-800)
- Quote form setup: 2 hours ($200)
- **Total**: $600-1,000 one-time

### Mid-Tier Portal:
- Above + bulk calculator: 4 hours dev ($400)
- Above + customer accounts: 2 hours setup ($200)
- B2B app (Wholesale Club): $49/month
- **Total**: $1,200 setup + $49/month

### Full-Featured Portal:
- All above features
- Logo upload portal: 8-12 hours dev ($800-1,200)
- Design proof system: 8 hours dev ($800)
- CRM integration: 8 hours dev ($800)
- **Total**: $3,600-4,800 setup + ongoing CRM costs

**ROI**: If you close 10 corporate orders at $1,500 average = $15,000 revenue
First month ROI = 300-2,400% on initial investment

---

## ✅ Quick Start Checklist

**Week 1**:
- [ ] Update corporate landing page with new copy
- [ ] Add bulk pricing tiers to page
- [ ] Create quote request form
- [ ] Set up email notifications for quote requests

**Week 2**:
- [ ] Reach out to 5-10 past corporate customers
- [ ] Ask for testimonials and permission to use logo
- [ ] Create case study (even if short)
- [ ] Update navigation to prominently feature "Corporate Gifts"

**Week 3**:
- [ ] Enable customer accounts in Shopify
- [ ] Document quote response process (templates, pricing)
- [ ] Train on B2B sales (if team member handles)
- [ ] Create internal SOP for corporate orders

**Week 4**:
- [ ] Launch and promote corporate portal
- [ ] Email past corporate customers about new portal
- [ ] Run LinkedIn ads targeting HR/Events professionals
- [ ] Track first quote requests

---

## 🔗 Tools & Resources

### B2B Apps for Shopify:
- **SparkLayer**: https://www.sparklayer.io (best for Shopify Plus)
- **Wholesale Club**: https://wholesalehelper.io (best budget option)
- **Bold Commerce B2B**: https://boldcommerce.com/b2b

### Quote Management:
- **HubSpot (FREE CRM)**: Track corporate leads and quotes
- **Notion**: Simple quote tracking database

### Design Proof Tools:
- **GoProof**: https://www.goproof.com (design approval workflow)
- **Filestage**: https://filestage.io (creative review)

---

**Pro Tip**: Start simple with an enhanced landing page and quote form. Don't over-engineer. As you get more corporate orders, invest in more sophisticated features based on real customer needs, not assumptions.

**Expected Timeline**: 1 month to launch basic portal, 3-6 months to see strong B2B momentum, 12 months to hit $200K+ annual B2B revenue
