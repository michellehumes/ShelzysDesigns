#!/usr/bin/env node

/**
 * Shopify Blog Publisher
 * Publishes all 6 Amazon affiliate blog posts to Shopify
 *
 * Usage: node publish-to-shopify.js
 */

const https = require('https');

// Load from environment variables or .env file
const STORE_URL = process.env.SHOPIFY_STORE_URL || 'YOUR_STORE.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

// Check for required credentials
if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN' || STORE_URL === 'YOUR_STORE.myshopify.com') {
  console.error('❌ Missing credentials!');
  console.error('Set environment variables:');
  console.error('  export SHOPIFY_STORE_URL="your-store.myshopify.com"');
  console.error('  export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"');
  console.error('\nOr create a .env file with these values.');
  process.exit(1);
}

// All 6 blog posts
const posts = [
  {
    title: "12 Amazon Beauty Must-Haves Under $30 (2025)",
    handle: "amazon-beauty-must-haves-under-30",
    tags: "amazon beauty, skincare, beauty tools, viral beauty, affordable beauty",
    metaDescription: "These viral Amazon beauty products are under $30 and actually work! From skincare tools to K-beauty finds, discover what's worth adding to your routine."
  },
  {
    title: "15 Viral Amazon Organization Finds That Actually Work (2025)",
    handle: "viral-amazon-organization-finds-2025",
    tags: "organization, amazon finds, home organization, viral products, storage solutions",
    metaDescription: "Discover the viral Amazon organization products that live up to the hype! From under-sink organizers to closet systems, these finds will transform your home."
  },
  {
    title: "15 Work From Home Office Must-Haves on Amazon (2025)",
    handle: "work-from-home-office-must-haves-amazon",
    tags: "home office, work from home, office organization, productivity, amazon finds",
    metaDescription: "Upgrade your home office with these 15 must-have products from Amazon. From ergonomic essentials to aesthetic decor, create a productive workspace you love."
  },
  {
    title: "20 Amazon Travel Essentials for Your Next Trip (2025)",
    handle: "amazon-travel-essentials-2025",
    tags: "travel essentials, packing, travel tips, amazon finds, vacation, flight essentials",
    metaDescription: "Pack smarter with these 20 Amazon travel essentials. From packing cubes to in-flight must-haves, these items will make your next trip stress-free."
  },
  {
    title: "15 Amazon Fitness & Wellness Finds to Level Up Your Routine (2025)",
    handle: "amazon-fitness-wellness-finds-2025",
    tags: "fitness, wellness, workout essentials, self-care, amazon finds, health",
    metaDescription: "From resistance bands to recovery tools, these 15 Amazon fitness and wellness products will help you build healthy habits without breaking the bank."
  },
  {
    title: "15 Amazon Dog Mom Essentials Your Pup Will Love (2025)",
    handle: "amazon-dog-mom-essentials-2025",
    tags: "dog mom, pet essentials, amazon finds, dog products, pet lover gifts",
    metaDescription: "Spoil your fur baby with these 15 Amazon dog essentials. From grooming tools to travel gear, these products make dog parenting easier (and cuter)."
  }
];

// Blog post content (HTML)
const postContent = {
  "amazon-beauty-must-haves-under-30": `<p><em>Last Updated: November 2025 | This post contains affiliate links. See disclosure below.</em></p>
<p>TikTok has us adding everything to our Amazon carts—but which viral beauty products are actually worth it? We tested the most hyped products so you don't waste your money on duds.</p>
<p>Here are 12 Amazon beauty must-haves that live up to the hype, all under $30.</p>
<hr>
<h2>1. Ice Roller for Face</h2>
<p><strong>Price:</strong> $8-$15</p>
<p>This is the skincare tool everyone needs. Pop it in the freezer, then roll it on your face in the morning to depuff, reduce redness, and wake up your skin instantly.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Depuffs eyes and face in minutes</li><li>Reduces redness and inflammation</li><li>Feels amazing on hot days or after a long night</li><li>Helps skincare products absorb better</li></ul>
<p><strong>Best For:</strong> Morning routines, hangover recovery, and anyone who wakes up puffy</p>
<p><a href="https://www.amazon.com/s?k=ice+roller+for+face&tag=shelzysdesigns-20" target="_blank">Shop Ice Rollers on Amazon</a></p>
<hr>
<h2>2. Gua Sha Stone</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>This ancient Chinese beauty tool is having a major moment—and for good reason. Regular use can sculpt your jawline, reduce puffiness, and give you that lifted look.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Sculpts and lifts with regular use</li><li>Promotes lymphatic drainage</li><li>Pairs perfectly with facial oils</li><li>Rose quartz and jade options available</li></ul>
<p><strong>Best For:</strong> Anyone wanting a more sculpted, lifted appearance</p>
<p><a href="https://www.amazon.com/s?k=gua+sha+stone&tag=shelzysdesigns-20" target="_blank">Shop Gua Sha Stones on Amazon</a></p>
<hr>
<h2>3. Glass Skin Serum (Hyaluronic Acid)</h2>
<p><strong>Price:</strong> $12-$25</p>
<p>Want that dewy, "glass skin" look? Hyaluronic acid is the secret. This hydrating serum plumps skin and gives you that lit-from-within glow.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Hydrates without feeling heavy</li><li>Plumps fine lines</li><li>Works under makeup</li><li>Suitable for all skin types</li></ul>
<p><strong>Best For:</strong> Dry skin, dehydrated skin, and anyone wanting a dewy glow</p>
<p><a href="https://www.amazon.com/s?k=hyaluronic+acid+serum&tag=shelzysdesigns-20" target="_blank">Shop Hyaluronic Acid Serums on Amazon</a></p>
<hr>
<h2>4. LED Face Mask</h2>
<p><strong>Price:</strong> $25-$30</p>
<p>At-home LED therapy used to cost thousands—now you can get it for under $30. Red light reduces wrinkles, blue light fights acne.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Multiple light settings for different concerns</li><li>Hands-free treatment</li><li>See results in weeks with consistent use</li><li>Much cheaper than professional treatments</li></ul>
<p><strong>Best For:</strong> Anti-aging and acne-prone skin</p>
<p><a href="https://www.amazon.com/s?k=led+face+mask&tag=shelzysdesigns-20" target="_blank">Shop LED Face Masks on Amazon</a></p>
<hr>
<h2>5. Vitamin C Serum</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Vitamin C is the gold standard for brightening dark spots and evening skin tone.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Fades dark spots and hyperpigmentation</li><li>Brightens dull skin</li><li>Protects against environmental damage</li><li>Boosts collagen production</li></ul>
<p><strong>Best For:</strong> Uneven skin tone, dark spots, and dull skin</p>
<p><a href="https://www.amazon.com/s?k=vitamin+c+serum+face&tag=shelzysdesigns-20" target="_blank">Shop Vitamin C Serums on Amazon</a></p>
<hr>
<h2>6. Scalp Massager Shampoo Brush</h2>
<p><strong>Price:</strong> $6-$12</p>
<p>This little tool transforms your shower routine. It exfoliates your scalp, helps shampoo work better, and feels like a spa treatment.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Exfoliates and removes buildup</li><li>Stimulates hair growth</li><li>Makes shampooing more effective</li><li>Feels incredibly relaxing</li></ul>
<p><strong>Best For:</strong> Anyone with product buildup, oily scalp, or who wants healthier hair</p>
<p><a href="https://www.amazon.com/s?k=scalp+massager+shampoo+brush&tag=shelzysdesigns-20" target="_blank">Shop Scalp Massagers on Amazon</a></p>
<hr>
<h2>7. Retinol Serum</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Retinol is the #1 anti-aging ingredient dermatologists recommend.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Reduces fine lines and wrinkles</li><li>Improves skin texture</li><li>Fades dark spots</li><li>Boosts cell turnover</li></ul>
<p><strong>Best For:</strong> Anti-aging and texture improvement (ages 25+)</p>
<p><a href="https://www.amazon.com/s?k=retinol+serum&tag=shelzysdesigns-20" target="_blank">Shop Retinol Serums on Amazon</a></p>
<hr>
<h2>8. Lash Growth Serum</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Longer, fuller lashes without extensions? Yes, please.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Longer and fuller lashes naturally</li><li>No salon appointments needed</li><li>Easy to apply before bed</li><li>Visible results in weeks</li></ul>
<p><strong>Best For:</strong> Short or sparse lashes</p>
<p><a href="https://www.amazon.com/s?k=lash+growth+serum&tag=shelzysdesigns-20" target="_blank">Shop Lash Growth Serums on Amazon</a></p>
<hr>
<h2>9. Blackhead Remover Vacuum</h2>
<p><strong>Price:</strong> $20-$30</p>
<p>These pore vacuums suck out blackheads and sebum for instantly clearer skin.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Visibly removes blackheads and sebum</li><li>Adjustable suction levels</li><li>Rechargeable and portable</li><li>Satisfying to use!</li></ul>
<p><strong>Best For:</strong> Blackhead-prone skin</p>
<p><a href="https://www.amazon.com/s?k=blackhead+remover+vacuum&tag=shelzysdesigns-20" target="_blank">Shop Blackhead Vacuums on Amazon</a></p>
<hr>
<h2>10. Snail Mucin Essence</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Don't let the name scare you—snail mucin is a K-beauty hero ingredient.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Intense hydration without heaviness</li><li>Repairs skin barrier</li><li>Fades acne scars</li><li>That bouncy, glass skin texture</li></ul>
<p><strong>Best For:</strong> Dehydrated skin, acne scars, and anyone wanting glass skin</p>
<p><a href="https://www.amazon.com/s?k=snail+mucin+essence&tag=shelzysdesigns-20" target="_blank">Shop Snail Mucin on Amazon</a></p>
<hr>
<h2>11. Dermaplaning Tool</h2>
<p><strong>Price:</strong> $8-$15 for a set</p>
<p>Remove peach fuzz and dead skin cells at home for smoother makeup application.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Removes peach fuzz instantly</li><li>Smoother makeup application</li><li>Exfoliates dead skin cells</li><li>No downtime</li></ul>
<p><strong>Best For:</strong> Smoother skin texture and better makeup application</p>
<p><a href="https://www.amazon.com/s?k=dermaplaning+tool&tag=shelzysdesigns-20" target="_blank">Shop Dermaplaning Tools on Amazon</a></p>
<hr>
<h2>12. Silk Sleep Set</h2>
<p><strong>Price:</strong> $20-$30</p>
<p>Upgrade your beauty sleep literally. Silk pillowcases reduce hair breakage and face creases.</p>
<p><strong>Why We Love It:</strong></p>
<ul><li>Reduces hair breakage and frizz</li><li>Prevents sleep creases on face</li><li>Gentle on skin and lashes</li><li>Feels luxurious</li></ul>
<p><strong>Best For:</strong> Anti-aging, hair health, and anyone who wants better sleep</p>
<p><a href="https://www.amazon.com/s?k=silk+pillowcase+eye+mask+set&tag=shelzysdesigns-20" target="_blank">Shop Silk Sleep Sets on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links, which means I may earn a small commission if you make a purchase through these links, at no additional cost to you. I only recommend products I genuinely believe in. Thank you for supporting Shelzy's Designs!</em></p>`,

  "viral-amazon-organization-finds-2025": `<p><em>Last Updated: November 2025 | This post contains affiliate links. See disclosure below.</em></p>
<p>You've seen them all over TikTok and Instagram—those satisfying before-and-after organization videos. We tested the most popular organization products so you don't have to waste your money.</p>
<hr>
<h2>1. Clear Stackable Bins for Fridge & Pantry</h2>
<p><strong>Price:</strong> $25-$35 for a set</p>
<p>These clear bins have over 50,000 reviews for a reason.</p>
<p><a href="https://www.amazon.com/s?k=clear+stackable+bins+fridge&tag=shelzysdesigns-20" target="_blank">Shop Clear Stackable Bins on Amazon</a></p>
<hr>
<h2>2. Under Sink Organizer</h2>
<p><strong>Price:</strong> $20-$40</p>
<p>This two-tier organizer turns the chaotic cabinet under your sink into functional storage.</p>
<p><a href="https://www.amazon.com/s?k=under+sink+organizer&tag=shelzysdesigns-20" target="_blank">Shop Under Sink Organizers on Amazon</a></p>
<hr>
<h2>3. Rotating Makeup Organizer</h2>
<p><strong>Price:</strong> $20-$30</p>
<p>Stop digging through makeup bags! This rotating organizer puts everything on display.</p>
<p><a href="https://www.amazon.com/s?k=rotating+makeup+organizer&tag=shelzysdesigns-20" target="_blank">Shop Rotating Makeup Organizers on Amazon</a></p>
<hr>
<h2>4. Drawer Dividers (Expandable)</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>These bamboo dividers expand to fit any drawer and create instant organization.</p>
<p><a href="https://www.amazon.com/s?k=expandable+drawer+dividers+bamboo&tag=shelzysdesigns-20" target="_blank">Shop Drawer Dividers on Amazon</a></p>
<hr>
<h2>5. Over-the-Door Pantry Organizer</h2>
<p><strong>Price:</strong> $25-$40</p>
<p>Don't have a pantry? This over-the-door organizer creates one!</p>
<p><a href="https://www.amazon.com/s?k=over+the+door+pantry+organizer&tag=shelzysdesigns-20" target="_blank">Shop Over-the-Door Organizers on Amazon</a></p>
<hr>
<h2>6. Acrylic Shelf Dividers</h2>
<p><strong>Price:</strong> $15-$20</p>
<p>Keep sweaters, purses, and linens from toppling over.</p>
<p><a href="https://www.amazon.com/s?k=acrylic+shelf+dividers&tag=shelzysdesigns-20" target="_blank">Shop Shelf Dividers on Amazon</a></p>
<hr>
<h2>7. Cable Management Box</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Hide the cable chaos behind your TV or desk.</p>
<p><a href="https://www.amazon.com/s?k=cable+management+box&tag=shelzysdesigns-20" target="_blank">Shop Cable Management Boxes on Amazon</a></p>
<hr>
<h2>8. Lazy Susan Turntable</h2>
<p><strong>Price:</strong> $15-$20</p>
<p>Stop reaching to the back of cabinets! These turntables spin to bring everything to you.</p>
<p><a href="https://www.amazon.com/s?k=lazy+susan+turntable+kitchen&tag=shelzysdesigns-20" target="_blank">Shop Lazy Susan Turntables on Amazon</a></p>
<hr>
<h2>9. Closet Hanging Organizer</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Add instant shelving to any closet.</p>
<p><a href="https://www.amazon.com/s?k=hanging+closet+organizer&tag=shelzysdesigns-20" target="_blank">Shop Hanging Closet Organizers on Amazon</a></p>
<hr>
<h2>10. Spice Drawer Organizer</h2>
<p><strong>Price:</strong> $20-$30</p>
<p>Ditch the spinning spice rack and go drawer-style!</p>
<p><a href="https://www.amazon.com/s?k=spice+drawer+organizer&tag=shelzysdesigns-20" target="_blank">Shop Spice Drawer Organizers on Amazon</a></p>
<hr>
<h2>11. Vacuum Storage Bags</h2>
<p><strong>Price:</strong> $20-$30</p>
<p>Compress bulky items like comforters and winter coats.</p>
<p><a href="https://www.amazon.com/s?k=vacuum+storage+bags&tag=shelzysdesigns-20" target="_blank">Shop Vacuum Storage Bags on Amazon</a></p>
<hr>
<h2>12. Stackable Can Organizer</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>No more canned goods avalanche!</p>
<p><a href="https://www.amazon.com/s?k=stackable+can+organizer&tag=shelzysdesigns-20" target="_blank">Shop Can Organizers on Amazon</a></p>
<hr>
<h2>13. Jewelry Organizer Tray</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Keep necklaces untangled and earrings paired.</p>
<p><a href="https://www.amazon.com/s?k=jewelry+organizer+tray+velvet&tag=shelzysdesigns-20" target="_blank">Shop Jewelry Organizers on Amazon</a></p>
<hr>
<h2>14. Pot Lid Organizer</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Stop the pot lid chaos!</p>
<p><a href="https://www.amazon.com/s?k=pot+lid+organizer&tag=shelzysdesigns-20" target="_blank">Shop Pot Lid Organizers on Amazon</a></p>
<hr>
<h2>15. Clear Shoe Boxes</h2>
<p><strong>Price:</strong> $30-$40 for 12</p>
<p>The secret to a Pinterest-worthy closet.</p>
<p><a href="https://www.amazon.com/s?k=clear+stackable+shoe+boxes&tag=shelzysdesigns-20" target="_blank">Shop Clear Shoe Boxes on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`,

  "work-from-home-office-must-haves-amazon": `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>Whether you're working from home full-time, building a side hustle, or running your own business, your workspace matters.</p>
<hr>
<h2>1. Laptop Stand</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Stop hunching over your laptop! Raises your screen to eye level.</p>
<p><a href="https://www.amazon.com/s?k=laptop+stand+adjustable&tag=shelzysdesigns-20" target="_blank">Shop Laptop Stands on Amazon</a></p>
<hr>
<h2>2. Ergonomic Mouse Pad with Wrist Rest</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Your wrists will thank you.</p>
<p><a href="https://www.amazon.com/s?k=mouse+pad+wrist+rest+memory+foam&tag=shelzysdesigns-20" target="_blank">Shop Mouse Pads on Amazon</a></p>
<hr>
<h2>3. Lumbar Support Pillow</h2>
<p><strong>Price:</strong> $25-$40</p>
<p>Back pain from sitting all day? This helps.</p>
<p><a href="https://www.amazon.com/s?k=lumbar+support+pillow+office+chair&tag=shelzysdesigns-20" target="_blank">Shop Lumbar Pillows on Amazon</a></p>
<hr>
<h2>4. Desk Organizer</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>A cluttered desk = a cluttered mind.</p>
<p><a href="https://www.amazon.com/s?k=desk+organizer+with+drawers&tag=shelzysdesigns-20" target="_blank">Shop Desk Organizers on Amazon</a></p>
<hr>
<h2>5. Cable Management Box</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Hide tangled cords.</p>
<p><a href="https://www.amazon.com/s?k=cable+management+box&tag=shelzysdesigns-20" target="_blank">Shop Cable Boxes on Amazon</a></p>
<hr>
<h2>6. Monitor Stand with Storage</h2>
<p><strong>Price:</strong> $25-$40</p>
<p>Raise your monitor AND create storage space.</p>
<p><a href="https://www.amazon.com/s?k=monitor+stand+with+drawers&tag=shelzysdesigns-20" target="_blank">Shop Monitor Stands on Amazon</a></p>
<hr>
<h2>7. LED Desk Lamp</h2>
<p><strong>Price:</strong> $25-$45</p>
<p>Good lighting is non-negotiable.</p>
<p><a href="https://www.amazon.com/s?k=led+desk+lamp+usb+charging&tag=shelzysdesigns-20" target="_blank">Shop Desk Lamps on Amazon</a></p>
<hr>
<h2>8. Ring Light for Video Calls</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Look professional on every Zoom call.</p>
<p><a href="https://www.amazon.com/s?k=ring+light+desk&tag=shelzysdesigns-20" target="_blank">Shop Ring Lights on Amazon</a></p>
<hr>
<h2>9. Desktop Plant</h2>
<p><strong>Price:</strong> $10-$25</p>
<p>Plants boost mood and productivity.</p>
<p><a href="https://www.amazon.com/s?k=small+fake+plants+for+desk&tag=shelzysdesigns-20" target="_blank">Shop Desktop Plants on Amazon</a></p>
<hr>
<h2>10. Noise-Cancelling Headphones</h2>
<p><strong>Price:</strong> $25-$80</p>
<p>Block out distractions and get in the zone.</p>
<p><a href="https://www.amazon.com/s?k=noise+cancelling+headphones+work&tag=shelzysdesigns-20" target="_blank">Shop Headphones on Amazon</a></p>
<hr>
<h2>11. White Noise Machine</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Masks distracting noises.</p>
<p><a href="https://www.amazon.com/s?k=white+noise+machine+office&tag=shelzysdesigns-20" target="_blank">Shop White Noise Machines on Amazon</a></p>
<hr>
<h2>12. Desk Pad</h2>
<p><strong>Price:</strong> $10-$25</p>
<p>Protects your desk and looks polished.</p>
<p><a href="https://www.amazon.com/s?k=desk+pad+large+leather&tag=shelzysdesigns-20" target="_blank">Shop Desk Pads on Amazon</a></p>
<hr>
<h2>13. Insulated Tumbler</h2>
<p><strong>Price:</strong> $15-$30</p>
<p>Stay hydrated during long work sessions.</p>
<p><a href="https://www.amazon.com/s?k=insulated+tumbler+with+straw&tag=shelzysdesigns-20" target="_blank">Shop Tumblers on Amazon</a></p>
<hr>
<h2>14. Under-Desk Footrest</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Improves circulation and reduces leg fatigue.</p>
<p><a href="https://www.amazon.com/s?k=under+desk+footrest&tag=shelzysdesigns-20" target="_blank">Shop Footrests on Amazon</a></p>
<hr>
<h2>15. Blue Light Blocking Glasses</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Reduce eye strain and sleep better.</p>
<p><a href="https://www.amazon.com/s?k=blue+light+blocking+glasses&tag=shelzysdesigns-20" target="_blank">Shop Blue Light Glasses on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`,

  "amazon-travel-essentials-2025": `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>Whether you're jetting off for a destination wedding, honeymoon, girls' trip, or vacation, having the right travel gear makes all the difference.</p>
<hr>
<h2>1. Packing Cubes</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>The #1 game-changer for organized packing.</p>
<p><a href="https://www.amazon.com/s?k=packing+cubes+6+set&tag=shelzysdesigns-20" target="_blank">Shop Packing Cubes on Amazon</a></p>
<hr>
<h2>2. Travel Jewelry Organizer</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Keep your jewelry tangle-free.</p>
<p><a href="https://www.amazon.com/s?k=travel+jewelry+organizer&tag=shelzysdesigns-20" target="_blank">Shop Jewelry Organizers on Amazon</a></p>
<hr>
<h2>3. Compression Bags</h2>
<p><strong>Price:</strong> $12-$20</p>
<p>Squeeze the air out of bulky items.</p>
<p><a href="https://www.amazon.com/s?k=compression+bags+travel&tag=shelzysdesigns-20" target="_blank">Shop Compression Bags on Amazon</a></p>
<hr>
<h2>4. TSA-Approved Toiletry Bag</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Makes security a breeze.</p>
<p><a href="https://www.amazon.com/s?k=toiletry+bag+tsa+approved&tag=shelzysdesigns-20" target="_blank">Shop Toiletry Bags on Amazon</a></p>
<hr>
<h2>5. Shoe Bags</h2>
<p><strong>Price:</strong> $8-$15</p>
<p>Keep dirty shoes separate from clean clothes.</p>
<p><a href="https://www.amazon.com/s?k=travel+shoe+bags&tag=shelzysdesigns-20" target="_blank">Shop Shoe Bags on Amazon</a></p>
<hr>
<h2>6. Memory Foam Neck Pillow</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Prevents that awful neck kink.</p>
<p><a href="https://www.amazon.com/s?k=travel+neck+pillow+memory+foam&tag=shelzysdesigns-20" target="_blank">Shop Neck Pillows on Amazon</a></p>
<hr>
<h2>7. Noise-Cancelling Earbuds</h2>
<p><strong>Price:</strong> $25-$50</p>
<p>Block out crying babies and engine noise.</p>
<p><a href="https://www.amazon.com/s?k=noise+cancelling+earbuds+travel&tag=shelzysdesigns-20" target="_blank">Shop Earbuds on Amazon</a></p>
<hr>
<h2>8. Silk Sleep Mask</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Block out light without creasing your face.</p>
<p><a href="https://www.amazon.com/s?k=silk+sleep+mask+travel&tag=shelzysdesigns-20" target="_blank">Shop Sleep Masks on Amazon</a></p>
<hr>
<h2>9. Compression Socks</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Reduce leg swelling on long flights.</p>
<p><a href="https://www.amazon.com/s?k=compression+socks+for+flying&tag=shelzysdesigns-20" target="_blank">Shop Compression Socks on Amazon</a></p>
<hr>
<h2>10. Collapsible Water Bottle</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Fill up after security.</p>
<p><a href="https://www.amazon.com/s?k=collapsible+water+bottle+travel&tag=shelzysdesigns-20" target="_blank">Shop Water Bottles on Amazon</a></p>
<hr>
<h2>11. Portable Charger</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Don't let your phone die mid-trip.</p>
<p><a href="https://www.amazon.com/s?k=portable+charger+power+bank&tag=shelzysdesigns-20" target="_blank">Shop Portable Chargers on Amazon</a></p>
<hr>
<h2>12. Universal Travel Adapter</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Works in every country.</p>
<p><a href="https://www.amazon.com/s?k=universal+travel+adapter&tag=shelzysdesigns-20" target="_blank">Shop Travel Adapters on Amazon</a></p>
<hr>
<h2>13. AirTag / Luggage Tracker</h2>
<p><strong>Price:</strong> $25-$35</p>
<p>Never lose your luggage again.</p>
<p><a href="https://www.amazon.com/s?k=luggage+tracker+airtag&tag=shelzysdesigns-20" target="_blank">Shop Luggage Trackers on Amazon</a></p>
<hr>
<h2>14. TSA-Approved Locks</h2>
<p><strong>Price:</strong> $8-$15</p>
<p>Secure your bags.</p>
<p><a href="https://www.amazon.com/s?k=tsa+approved+luggage+locks&tag=shelzysdesigns-20" target="_blank">Shop TSA Locks on Amazon</a></p>
<hr>
<h2>15. Facial Mist Spray</h2>
<p><strong>Price:</strong> $8-$15</p>
<p>Airplane air is incredibly drying.</p>
<p><a href="https://www.amazon.com/s?k=facial+mist+spray+travel&tag=shelzysdesigns-20" target="_blank">Shop Facial Mists on Amazon</a></p>
<hr>
<h2>16. Travel-Size Skincare</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Maintain your routine.</p>
<p><a href="https://www.amazon.com/s?k=travel+size+skincare+containers&tag=shelzysdesigns-20" target="_blank">Shop Travel Skincare on Amazon</a></p>
<hr>
<h2>17. Dry Shampoo</h2>
<p><strong>Price:</strong> $6-$12</p>
<p>Skip the wash after a long travel day.</p>
<p><a href="https://www.amazon.com/s?k=dry+shampoo+travel+size&tag=shelzysdesigns-20" target="_blank">Shop Dry Shampoo on Amazon</a></p>
<hr>
<h2>18. Foldable Tote Bag</h2>
<p><strong>Price:</strong> $10-$15</p>
<p>Extra bag for souvenirs.</p>
<p><a href="https://www.amazon.com/s?k=foldable+travel+tote+bag&tag=shelzysdesigns-20" target="_blank">Shop Tote Bags on Amazon</a></p>
<hr>
<h2>19. Wrinkle Release Spray</h2>
<p><strong>Price:</strong> $6-$10</p>
<p>No iron needed.</p>
<p><a href="https://www.amazon.com/s?k=wrinkle+release+spray+travel&tag=shelzysdesigns-20" target="_blank">Shop Wrinkle Release on Amazon</a></p>
<hr>
<h2>20. Reusable Snack Bags</h2>
<p><strong>Price:</strong> $10-$15</p>
<p>Pack snacks from home.</p>
<p><a href="https://www.amazon.com/s?k=reusable+snack+bags&tag=shelzysdesigns-20" target="_blank">Shop Reusable Bags on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`,

  "amazon-fitness-wellness-finds-2025": `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>Building a consistent fitness routine doesn't require a gym membership or expensive equipment.</p>
<hr>
<h2>1. Resistance Bands Set</h2>
<p><strong>Price:</strong> $10-$25</p>
<p>The most versatile workout tool you'll ever own.</p>
<p><a href="https://www.amazon.com/s?k=resistance+bands+set&tag=shelzysdesigns-20" target="_blank">Shop Resistance Bands on Amazon</a></p>
<hr>
<h2>2. Yoga Mat (Extra Thick)</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>A quality yoga mat is non-negotiable.</p>
<p><a href="https://www.amazon.com/s?k=yoga+mat+thick+non+slip&tag=shelzysdesigns-20" target="_blank">Shop Yoga Mats on Amazon</a></p>
<hr>
<h2>3. Adjustable Dumbbells</h2>
<p><strong>Price:</strong> $30-$60</p>
<p>One set replaces multiple weights.</p>
<p><a href="https://www.amazon.com/s?k=adjustable+dumbbells&tag=shelzysdesigns-20" target="_blank">Shop Dumbbells on Amazon</a></p>
<hr>
<h2>4. Booty Bands (Fabric)</h2>
<p><strong>Price:</strong> $12-$20</p>
<p>Specifically designed for lower body workouts.</p>
<p><a href="https://www.amazon.com/s?k=fabric+booty+bands&tag=shelzysdesigns-20" target="_blank">Shop Booty Bands on Amazon</a></p>
<hr>
<h2>5. Weighted Jump Rope</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Cardio without leaving your house.</p>
<p><a href="https://www.amazon.com/s?k=weighted+jump+rope&tag=shelzysdesigns-20" target="_blank">Shop Jump Ropes on Amazon</a></p>
<hr>
<h2>6. Foam Roller</h2>
<p><strong>Price:</strong> $15-$30</p>
<p>Recovery is just as important as the workout.</p>
<p><a href="https://www.amazon.com/s?k=foam+roller&tag=shelzysdesigns-20" target="_blank">Shop Foam Rollers on Amazon</a></p>
<hr>
<h2>7. Massage Gun</h2>
<p><strong>Price:</strong> $30-$60</p>
<p>Deep tissue massage at home.</p>
<p><a href="https://www.amazon.com/s?k=massage+gun+deep+tissue&tag=shelzysdesigns-20" target="_blank">Shop Massage Guns on Amazon</a></p>
<hr>
<h2>8. Yoga Blocks</h2>
<p><strong>Price:</strong> $10-$18</p>
<p>Help everyone deepen stretches safely.</p>
<p><a href="https://www.amazon.com/s?k=yoga+blocks+set+of+2&tag=shelzysdesigns-20" target="_blank">Shop Yoga Blocks on Amazon</a></p>
<hr>
<h2>9. Muscle Balm</h2>
<p><strong>Price:</strong> $12-$25</p>
<p>Soothes sore muscles.</p>
<p><a href="https://www.amazon.com/s?k=muscle+balm+recovery&tag=shelzysdesigns-20" target="_blank">Shop Muscle Balm on Amazon</a></p>
<hr>
<h2>10. Insulated Water Bottle</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Staying hydrated is half the battle.</p>
<p><a href="https://www.amazon.com/s?k=insulated+water+bottle+32+oz&tag=shelzysdesigns-20" target="_blank">Shop Water Bottles on Amazon</a></p>
<hr>
<h2>11. Protein Shaker Bottle</h2>
<p><strong>Price:</strong> $10-$15</p>
<p>Smooth, lump-free shakes every time.</p>
<p><a href="https://www.amazon.com/s?k=protein+shaker+bottle&tag=shelzysdesigns-20" target="_blank">Shop Shaker Bottles on Amazon</a></p>
<hr>
<h2>12. Glass Meal Prep Containers</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Meal prep = healthy eating success.</p>
<p><a href="https://www.amazon.com/s?k=glass+meal+prep+containers&tag=shelzysdesigns-20" target="_blank">Shop Meal Prep Containers on Amazon</a></p>
<hr>
<h2>13. Fitness Tracker</h2>
<p><strong>Price:</strong> $30-$60</p>
<p>Track steps, heart rate, sleep, and workouts.</p>
<p><a href="https://www.amazon.com/s?k=fitness+tracker&tag=shelzysdesigns-20" target="_blank">Shop Fitness Trackers on Amazon</a></p>
<hr>
<h2>14. Workout Journal</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Track your workouts and see progress.</p>
<p><a href="https://www.amazon.com/s?k=fitness+journal+workout+log&tag=shelzysdesigns-20" target="_blank">Shop Workout Journals on Amazon</a></p>
<hr>
<h2>15. Waterproof Bluetooth Speaker</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Good music makes every workout better.</p>
<p><a href="https://www.amazon.com/s?k=bluetooth+speaker+waterproof+small&tag=shelzysdesigns-20" target="_blank">Shop Bluetooth Speakers on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`,

  "amazon-dog-mom-essentials-2025": `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>Being a dog mom is a whole lifestyle—and it requires the right gear!</p>
<hr>
<h2>1. Self-Cleaning Slicker Brush</h2>
<p><strong>Price:</strong> $12-$20</p>
<p>One click and the bristles retract, dropping all that fur.</p>
<p><a href="https://www.amazon.com/s?k=self+cleaning+slicker+brush+dog&tag=shelzysdesigns-20" target="_blank">Shop Slicker Brushes on Amazon</a></p>
<hr>
<h2>2. Paw Cleaner Cup</h2>
<p><strong>Price:</strong> $10-$18</p>
<p>Cleans all four paws in seconds.</p>
<p><a href="https://www.amazon.com/s?k=dog+paw+cleaner&tag=shelzysdesigns-20" target="_blank">Shop Paw Cleaners on Amazon</a></p>
<hr>
<h2>3. Dog Nail Grinder</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Less scary for nervous pups than clippers.</p>
<p><a href="https://www.amazon.com/s?k=dog+nail+grinder&tag=shelzysdesigns-20" target="_blank">Shop Nail Grinders on Amazon</a></p>
<hr>
<h2>4. Oatmeal Dog Shampoo</h2>
<p><strong>Price:</strong> $10-$18</p>
<p>Gentle on sensitive skin.</p>
<p><a href="https://www.amazon.com/s?k=dog+shampoo+oatmeal+gentle&tag=shelzysdesigns-20" target="_blank">Shop Dog Shampoo on Amazon</a></p>
<hr>
<h2>5. Slow Feeder Bowl</h2>
<p><strong>Price:</strong> $10-$18</p>
<p>Makes them work for each bite.</p>
<p><a href="https://www.amazon.com/s?k=slow+feeder+dog+bowl&tag=shelzysdesigns-20" target="_blank">Shop Slow Feeders on Amazon</a></p>
<hr>
<h2>6. Elevated Dog Bowls</h2>
<p><strong>Price:</strong> $15-$30</p>
<p>Easier on joints and helps with digestion.</p>
<p><a href="https://www.amazon.com/s?k=elevated+dog+bowls&tag=shelzysdesigns-20" target="_blank">Shop Elevated Bowls on Amazon</a></p>
<hr>
<h2>7. Kong Treat-Dispensing Toy</h2>
<p><strong>Price:</strong> $10-$20</p>
<p>Keep your dog entertained for hours.</p>
<p><a href="https://www.amazon.com/s?k=kong+dog+toy+treat&tag=shelzysdesigns-20" target="_blank">Shop Kong Toys on Amazon</a></p>
<hr>
<h2>8. No-Pull Harness</h2>
<p><strong>Price:</strong> $20-$35</p>
<p>Game-changer for strong pullers.</p>
<p><a href="https://www.amazon.com/s?k=no+pull+dog+harness&tag=shelzysdesigns-20" target="_blank">Shop Harnesses on Amazon</a></p>
<hr>
<h2>9. Retractable Leash</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Freedom to explore while maintaining control.</p>
<p><a href="https://www.amazon.com/s?k=retractable+dog+leash&tag=shelzysdesigns-20" target="_blank">Shop Leashes on Amazon</a></p>
<hr>
<h2>10. Portable Dog Water Bottle</h2>
<p><strong>Price:</strong> $12-$20</p>
<p>Built-in bowl for easy drinking.</p>
<p><a href="https://www.amazon.com/s?k=portable+water+bottle+for+dogs&tag=shelzysdesigns-20" target="_blank">Shop Dog Water Bottles on Amazon</a></p>
<hr>
<h2>11. Car Seat Cover Hammock</h2>
<p><strong>Price:</strong> $25-$40</p>
<p>Protect your car seats from fur and dirt.</p>
<p><a href="https://www.amazon.com/s?k=dog+car+seat+cover+hammock&tag=shelzysdesigns-20" target="_blank">Shop Car Seat Covers on Amazon</a></p>
<hr>
<h2>12. Orthopedic Dog Bed</h2>
<p><strong>Price:</strong> $30-$60</p>
<p>Supports joints and helps your dog rest well.</p>
<p><a href="https://www.amazon.com/s?k=orthopedic+dog+bed&tag=shelzysdesigns-20" target="_blank">Shop Dog Beds on Amazon</a></p>
<hr>
<h2>13. Calming Blanket</h2>
<p><strong>Price:</strong> $15-$30</p>
<p>Comfort during storms and fireworks.</p>
<p><a href="https://www.amazon.com/s?k=dog+calming+blanket+anxiety&tag=shelzysdesigns-20" target="_blank">Shop Calming Blankets on Amazon</a></p>
<hr>
<h2>14. Pet Hair Remover</h2>
<p><strong>Price:</strong> $15-$25</p>
<p>Gets fur off couches, beds, and clothes.</p>
<p><a href="https://www.amazon.com/s?k=pet+hair+remover+furniture&tag=shelzysdesigns-20" target="_blank">Shop Hair Removers on Amazon</a></p>
<hr>
<h2>15. Waste Bag Holder</h2>
<p><strong>Price:</strong> $8-$15</p>
<p>Clips to your leash so you never forget bags.</p>
<p><a href="https://www.amazon.com/s?k=dog+waste+bag+holder+dispenser&tag=shelzysdesigns-20" target="_blank">Shop Waste Bag Holders on Amazon</a></p>
<hr>
<h2>Affiliate Disclosure</h2>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`
};

// Helper function to make API requests
function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 Shopify Blog Publisher');
  console.log('=========================\n');

  // Step 1: Get blog ID
  console.log('📋 Getting blog ID...');
  const blogsResponse = await apiRequest('GET', '/blogs.json');

  if (blogsResponse.status !== 200 || !blogsResponse.data.blogs?.length) {
    console.error('❌ Could not fetch blogs:', blogsResponse.data);
    process.exit(1);
  }

  const blogId = blogsResponse.data.blogs[0].id;
  console.log(`✅ Found blog: "${blogsResponse.data.blogs[0].title}" (ID: ${blogId})\n`);

  // Step 2: Publish each post
  let published = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`📝 Publishing: ${post.title}`);

    const articleData = {
      article: {
        title: post.title,
        handle: post.handle,
        body_html: postContent[post.handle],
        tags: post.tags,
        published: true,
        metafields: [
          {
            namespace: "global",
            key: "description_tag",
            value: post.metaDescription,
            type: "single_line_text_field"
          }
        ]
      }
    };

    try {
      const response = await apiRequest('POST', `/blogs/${blogId}/articles.json`, articleData);

      if (response.status === 201 || response.status === 200) {
        console.log(`   ✅ Published! URL: https://shelzysdesigns.com/blogs/news/${post.handle}`);
        published++;
      } else {
        console.log(`   ❌ Failed: ${JSON.stringify(response.data.errors || response.data)}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n========================================');
  console.log('🎉 PUBLISHING COMPLETE!');
  console.log('========================================\n');
  console.log(`✅ Published: ${published}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nView your posts at: https://shelzysdesigns.com/blogs/news`);
}

main().catch(console.error);
