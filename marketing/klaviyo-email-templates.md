# Klaviyo Email Marketing Templates

Complete email sequences for Shelzy's Designs. Copy these into Klaviyo to set up automated email marketing.

---

## 1. Welcome Series (3 Emails)

### Email 1: Welcome + Discount Code
**Subject Line:** Welcome to Shelzy's! Here's 10% off your first order 🎁
**Preview Text:** Your exclusive discount code is inside...

```html
Hi {{ first_name|default:"friend" }},

Welcome to the Shelzy's Designs family!

We're so excited you're here. At Shelzy's, we believe personalized gifts should feel special, not cheap. That's why every bottle we make uses permanent sublimation printing—no vinyl stickers that peel or crack.

As a thank you for joining, here's 10% OFF your first order:

[ USE CODE: WELCOME10 ]

→ Shop Best Sellers: [LINK]
→ Browse Bridesmaid Collection: [LINK]
→ See All Products: [LINK]

What makes Shelzy's different?
✓ Permanent sublimation printing (not vinyl)
✓ Beautiful, gift-ready packaging
✓ Ships in 3-5 business days
✓ 4.9 star average reviews

We can't wait to create something special for you.

With love,
The Shelzy's Team

P.S. Your discount code expires in 7 days—don't miss out!
```

---

### Email 2: Our Story + Why Sublimation
**Subject Line:** Why our bottles never peel (and theirs do)
**Preview Text:** The difference is permanent...
**Send:** 2 days after Email 1

```html
Hi {{ first_name|default:"friend" }},

Ever had a personalized gift that looked amazing at first... then started peeling a few months later?

We have too. That's exactly why we started Shelzy's Designs.

THE DIFFERENCE: SUBLIMATION VS. VINYL

Most personalized bottles use vinyl stickers that sit ON TOP of the bottle. Over time, they:
❌ Peel at the edges
❌ Crack with temperature changes
❌ Trap dirt underneath
❌ Look cheap and worn

Our sublimation process is completely different. We use heat and pressure to INFUSE the ink directly into the bottle's coating.

The result?
✓ Smooth finish with no raised edges
✓ Won't peel, crack, or fade
✓ Dishwasher safe
✓ Looks beautiful for years

It's the difference between a gift that lasts a few months and one they'll use forever.

[ SHOP SUBLIMATION BOTTLES ]

Still have questions? Just reply to this email—we'd love to help!

The Shelzy's Team
```

---

### Email 3: Best Sellers + Social Proof
**Subject Line:** Our customers' favorites (with photos!)
**Preview Text:** See what 500+ customers are loving...
**Send:** 4 days after Email 2

```html
Hi {{ first_name|default:"friend" }},

Want to know what our customers love most? Here are our current best sellers:

🥇 #1 BEST SELLER: Bridesmaid Proposal Gift Box
"My bridesmaids were OBSESSED with these boxes. The presentation was perfect!" - Sarah T.
→ Shop Gift Boxes [LINK]

🥈 #2 MOST LOVED: Signature Personalized Bottle
"The quality is incredible. I've had mine for 8 months and it still looks brand new." - Michelle R.
→ Shop Signature Bottles [LINK]

🥉 #3 BRIDAL FAVORITE: Bridal Party Set
"Ordered for my whole bridal party (8 girls) and saved so much. Everyone loved them!" - Jessica M.
→ Shop Party Sets [LINK]

---

WHY CUSTOMERS CHOOSE SHELZY'S:
⭐⭐⭐⭐⭐ 4.9 average rating
✓ 500+ happy customers
✓ Fast shipping (3-5 days)
✓ Gift-ready packaging

---

Don't forget—your 10% off code WELCOME10 expires soon!

[ USE MY DISCOUNT ]

The Shelzy's Team
```

---

## 2. Abandoned Cart Series (3 Emails)

### Email 1: Gentle Reminder
**Subject Line:** Did you forget something? 👀
**Preview Text:** Your custom bottle is waiting...
**Send:** 1 hour after cart abandonment

```html
Hi {{ first_name|default:"there" }},

Looks like you left something behind! Your personalized bottle is still in your cart, waiting to be made just for you.

YOUR CART:
{{ abandoned_cart_items }}

[ COMPLETE MY ORDER ]

Remember, every Shelzy's bottle features:
✓ Permanent sublimation (no peeling!)
✓ Ships in 3-5 business days
✓ Beautiful packaging included

Questions? Just hit reply—we're happy to help!

The Shelzy's Team
```

---

### Email 2: Urgency + Social Proof
**Subject Line:** Your cart is about to expire ⏰
**Preview Text:** Plus see why customers love us...
**Send:** 24 hours after Email 1

```html
Hi {{ first_name|default:"there" }},

Just checking in—your cart is still waiting, but we can't hold these items forever!

YOUR CART:
{{ abandoned_cart_items }}

[ COMPLETE MY ORDER ]

---

WHAT OUR CUSTOMERS SAY:

"I was skeptical about ordering personalized items online, but Shelzy's exceeded my expectations. The quality is amazing!" ⭐⭐⭐⭐⭐
- Amanda K.

"Fast shipping, beautiful packaging, and the bottles look even better in person. Already ordered my second one!" ⭐⭐⭐⭐⭐
- Rachel S.

---

Need help deciding? Here are answers to common questions:

Q: Will the personalization peel?
A: Never! We use sublimation printing, which infuses the ink INTO the bottle.

Q: How long does shipping take?
A: Processing is 3-5 business days, then shipping is 3-7 days depending on location.

Q: Is it gift-ready?
A: Yes! Every bottle comes beautifully packaged.

[ FINISH MY ORDER ]

The Shelzy's Team
```

---

### Email 3: Final Reminder + Discount
**Subject Line:** Final call: 10% off to complete your order
**Preview Text:** We saved you a special discount...
**Send:** 48 hours after Email 2

```html
Hi {{ first_name|default:"there" }},

This is your last reminder—and we're sweetening the deal.

Use code COMEBACK10 for 10% OFF your order!

YOUR CART:
{{ abandoned_cart_items }}

[ CLAIM MY 10% OFF ]

This discount expires in 24 hours, so don't wait too long!

Why complete your order?
✓ Permanent, peel-proof personalization
✓ Gift-ready packaging
✓ Ships in 3-5 business days
✓ 4.9 star reviews from 500+ customers

We'd love to create something special for you.

The Shelzy's Team

P.S. Code COMEBACK10 is only valid for the next 24 hours!
```

---

## 3. Post-Purchase Series (3 Emails)

### Email 1: Order Confirmation + What's Next
**Subject Line:** We're making your bottle! 🎉
**Preview Text:** Here's what happens next...
**Send:** Immediately after purchase

```html
Hi {{ first_name|default:"there" }},

Thank you for your order! We're so excited to create your personalized bottle.

ORDER DETAILS:
{{ order_details }}

WHAT HAPPENS NEXT:

1️⃣ NOW: Our team is reviewing your personalization details
2️⃣ 1-2 DAYS: Your design is printed and sublimated
3️⃣ 3-5 DAYS: Quality check, packaging, and shipping
4️⃣ YOU'LL RECEIVE: Tracking email when your order ships

PROCESSING TIME: 3-5 business days
SHIPPING TIME: 3-7 business days after processing

Questions about your order? Just reply to this email!

Thank you for choosing Shelzy's Designs. ❤️

The Shelzy's Team
```

---

### Email 2: Review Request
**Subject Line:** How did we do? (Quick 30-second review)
**Preview Text:** Your feedback means the world to us...
**Send:** 7 days after delivery

```html
Hi {{ first_name|default:"there" }},

We hope you're loving your new personalized bottle!

Would you take 30 seconds to leave us a review? Your feedback helps other customers discover Shelzy's—and it truly means the world to our small business.

[ LEAVE A REVIEW ]

BONUS: Share a photo of your bottle in action and we might feature you on our Instagram! 📸

Tag us @shelzysdesigns or reply to this email with your photo.

Thank you for being part of the Shelzy's family!

With gratitude,
The Shelzy's Team
```

---

### Email 3: Referral + Reorder
**Subject Line:** Give 10%, Get 10% 🎁
**Preview Text:** Share the love with your friends...
**Send:** 14 days after delivery

```html
Hi {{ first_name|default:"there" }},

Loving your Shelzy's bottle? Share the love!

GIVE 10%, GET 10%

Share your unique referral link with friends and family:
→ They get 10% off their first order
→ You get 10% off your next order

[ GET MY REFERRAL LINK ]

---

PERFECT FOR GIFTING:

Know someone who would love a personalized bottle? Here are some ideas:

🎂 Birthday gifts
👰 Bridesmaid proposals
💼 Corporate gifts
👶 Kids' back-to-school
🎄 Holiday presents

---

NEED MORE?

Already thinking about your next order? Here are some popular picks:

→ Bridesmaid Proposal Gift Box [LINK]
→ Everyday Custom Bottle [LINK]
→ Kids Personalized Bottle [LINK]

Thank you for being a Shelzy's customer!

The Shelzy's Team
```

---

## 4. Browse Abandonment (1 Email)

### Subject Line: Still thinking about it?
**Preview Text:** We saved your favorites...
**Send:** 2 hours after browsing without purchase

```html
Hi {{ first_name|default:"there" }},

We noticed you were checking out some beautiful bottles earlier. Still thinking about it?

Here's what caught your eye:
{{ browse_items }}

[ SHOP NOW ]

Not sure which one to pick? Here's what our customers love most:

⭐ BEST FOR GIFTS: Bridesmaid Proposal Gift Box
⭐ BEST FOR EVERYDAY: Signature Personalized Bottle
⭐ BEST VALUE: Bridal Party Set (save 15%!)

---

WHY SHELZY'S?
✓ Permanent sublimation (never peels)
✓ Beautiful, gift-ready packaging
✓ Ships in 3-5 business days
✓ 4.9 star reviews

Questions? Just reply—we'd love to help!

The Shelzy's Team
```

---

## 5. Win-Back Series (2 Emails)

### Email 1: We Miss You!
**Subject Line:** It's been a while... here's 15% off
**Preview Text:** Come back and save!
**Send:** 60 days after last purchase

```html
Hi {{ first_name|default:"there" }},

It's been a while since we've seen you, and we miss you!

As a thank you for being part of the Shelzy's family, here's 15% OFF your next order:

[ USE CODE: MISSYOU15 ]

WHAT'S NEW AT SHELZY'S:
→ New colors added to Best Sellers
→ Holiday Collection launching soon
→ Bulk pricing for bridal parties

[ SHOP NEW ARRIVALS ]

Your discount code expires in 14 days. We hope to see you soon!

The Shelzy's Team
```

---

### Email 2: Final Win-Back
**Subject Line:** Last chance: 20% off before it's gone
**Preview Text:** Our biggest discount yet...
**Send:** 7 days after Email 1

```html
Hi {{ first_name|default:"there" }},

This is our final attempt to win you back—and we're pulling out all the stops.

Here's 20% OFF your next order:

[ USE CODE: COMEBACK20 ]

This is our biggest discount we offer, and it expires in 48 hours.

CUSTOMER FAVORITES:
→ Bridesmaid Proposal Gift Box
→ Signature Personalized Bottle
→ Bridal Party Set

[ CLAIM MY 20% OFF ]

We'd love to create something special for you again.

The Shelzy's Team

P.S. This code won't be available again—don't miss out!
```

---

## 6. VIP/High-Value Customer (1 Email)

### Subject Line: A special thank you for being a VIP 💎
**Preview Text:** Exclusive perks just for you...
**Send:** After 2+ purchases or $150+ spent

```html
Hi {{ first_name }},

We wanted to take a moment to say THANK YOU.

You're officially one of our VIP customers, and we appreciate you more than you know. Small businesses like ours exist because of loyal customers like you.

AS A VIP, YOU GET:

🎁 15% OFF your next order (code: VIP15)
📦 Priority processing on future orders
💎 Early access to new products
📧 Exclusive VIP-only offers

[ SHOP WITH VIP DISCOUNT ]

Planning a big order? VIPs also get access to:
→ Custom bulk pricing
→ Special packaging options
→ Direct line to our team

Just reply to this email and let us know what you need!

With gratitude,
The Shelzy's Team
```

---

## Klaviyo Setup Instructions

### Flows to Create:

1. **Welcome Series**
   - Trigger: Person subscribes to list
   - 3 emails over 6 days

2. **Abandoned Cart**
   - Trigger: Checkout started, not completed
   - 3 emails over 3 days

3. **Post-Purchase**
   - Trigger: Order placed
   - 3 emails (immediate, +7 days, +14 days)

4. **Browse Abandonment**
   - Trigger: Viewed product, didn't purchase
   - 1 email after 2 hours

5. **Win-Back**
   - Trigger: No purchase in 60 days
   - 2 emails over 7 days

6. **VIP**
   - Trigger: Customer places 2nd order OR total spend > $150
   - 1 email

### Recommended Segments:

- Newsletter Subscribers
- Customers (purchased 1+ times)
- VIP Customers ($150+ spent)
- Bridal Customers (purchased from bridal collection)
- Inactive (no purchase in 60+ days)

### A/B Testing Suggestions:

1. Subject lines with emoji vs. without
2. Discount amount (10% vs. 15%)
3. CTA button color
4. Email length (short vs. detailed)
