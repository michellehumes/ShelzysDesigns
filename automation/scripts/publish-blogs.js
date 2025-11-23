/**
 * Publish Blog Posts to Shopify
 *
 * Creates 6 SEO-optimized blog posts for Shelzy's Designs
 * Run: node publish-blogs.js
 *
 * Requires: SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN environment variables
 */

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  console.error('   Set it with: export SHOPIFY_ACCESS_TOKEN=your_token_here');
  process.exit(1);
}

const BASE_URL = `https://${STORE_URL}/admin/api/2024-01`;

// ============================================================
// BLOG POSTS CONTENT
// ============================================================

const BLOG_POSTS = [
  {
    title: "Sublimation vs Vinyl: Why Your Personalized Bottle Matters",
    tags: "sublimation, vinyl, water bottles, personalization, quality",
    body_html: `
<p>When shopping for personalized water bottles, you'll encounter two main printing methods: <strong>sublimation</strong> and <strong>vinyl decals</strong>. Understanding the difference can save you from disappointment—and wasted money.</p>

<h2>What is Vinyl?</h2>
<p>Vinyl decals are essentially stickers applied to the bottle's surface. They're cheap to produce and look nice initially, but here's what happens over time:</p>
<ul>
<li>❌ Edges start to peel after washing</li>
<li>❌ Colors fade with sun exposure</li>
<li>❌ Cracks appear in the design</li>
<li>❌ Raised edges trap dirt and bacteria</li>
<li>❌ Dishwasher destroys them quickly</li>
</ul>

<h2>What is Sublimation?</h2>
<p>Sublimation is a completely different process. Here's how it works:</p>
<ol>
<li>Your design is printed on special sublimation paper</li>
<li>The paper is wrapped around the bottle</li>
<li>Under high heat (400°F) and pressure, the ink turns into a gas</li>
<li>The gas penetrates the bottle's coating and bonds at a molecular level</li>
<li>The ink becomes a <em>permanent part</em> of the bottle</li>
</ol>

<h2>The Results Speak for Themselves</h2>
<p>With sublimation printing:</p>
<ul>
<li>✅ Completely smooth finish—no raised edges</li>
<li>✅ Won't peel, ever</li>
<li>✅ Won't crack or fade</li>
<li>✅ Dishwasher friendly</li>
<li>✅ Looks the same after years of use</li>
</ul>

<h2>Why We Only Use Sublimation</h2>
<p>At Shelzy's Designs, we made a choice: we only use sublimation printing. Yes, it costs more. Yes, it takes longer. But when you give someone a personalized bottle, it should last—not peel off after a few weeks.</p>

<p>Your name doesn't sit ON the bottle. It becomes PART of the bottle.</p>

<p><a href="/collections/all">Shop our sublimation bottles →</a></p>
`,
  },
  {
    title: "The Ultimate Bridesmaid Proposal Gift Guide (2025)",
    tags: "bridesmaid, wedding, gifts, proposal, bridal party",
    body_html: `
<p>Asking your best friends to be your bridesmaids is one of the most exciting parts of wedding planning. But forget the Pinterest-perfect proposal boxes filled with items destined for the donation bin. Here's how to ask with a gift they'll actually use.</p>

<h2>The Problem with Traditional Proposal Gifts</h2>
<p>Let's be honest about what usually happens to bridesmaid proposal gifts:</p>
<ul>
<li>The candle gets regifted</li>
<li>The "Bridesmaid" wine glass breaks</li>
<li>The bath bombs sit unused</li>
<li>The face mask expires</li>
<li>The cheap robe falls apart</li>
</ul>

<h2>A Better Approach: Useful + Personal</h2>
<p>The best bridesmaid gifts combine two things:</p>
<ol>
<li><strong>Personalization</strong> - Her name, not just "Bridesmaid"</li>
<li><strong>Daily utility</strong> - Something she'll reach for every day</li>
</ol>

<h2>Why Personalized Water Bottles Work</h2>
<p>Think about it: your bridesmaids need to stay hydrated. They go to the gym, the office, run errands, travel. A personalized water bottle is:</p>
<ul>
<li>✅ Used daily (not stuffed in a drawer)</li>
<li>✅ A reminder of you every time she uses it</li>
<li>✅ Perfect for wedding day getting-ready photos</li>
<li>✅ Useful long after the wedding</li>
</ul>

<h2>Pro Tips for Bridesmaid Proposals</h2>
<ol>
<li><strong>Use her actual name</strong>, not "Bridesmaid" or "MOH"</li>
<li><strong>Match her style</strong> - know her favorite colors</li>
<li><strong>Time it right</strong> - propose 8-12 months before the wedding</li>
<li><strong>Include a personal note</strong> - the words matter more than the gift</li>
</ol>

<h2>Shop Bridesmaid Gifts</h2>
<p>Our bridesmaid bottles come in gift-ready packaging with your personalization permanently printed (sublimation, not vinyl that peels).</p>

<p><a href="/collections/weddings">Shop Bridal Collection →</a></p>
`,
  },
  {
    title: "How to Care for Your Sublimation Water Bottle",
    tags: "care, cleaning, sublimation, water bottle, tips",
    body_html: `
<p>Your sublimation water bottle is built to last—but a little care goes a long way. Here's how to keep it looking beautiful for years.</p>

<h2>Daily Care</h2>
<ul>
<li>Rinse with warm water after each use</li>
<li>Use a bottle brush for thorough cleaning</li>
<li>Leave the lid off when drying to prevent odors</li>
</ul>

<h2>Deep Cleaning (Weekly)</h2>
<p>For a thorough clean:</p>
<ol>
<li>Fill with warm water and a drop of dish soap</li>
<li>Let sit for 15-30 minutes</li>
<li>Scrub with a bottle brush</li>
<li>Rinse thoroughly</li>
<li>Air dry upside down</li>
</ol>

<h2>Removing Odors</h2>
<p>If your bottle develops an odor:</p>
<ul>
<li><strong>Baking soda method:</strong> Add 1 tbsp baking soda + warm water, let sit overnight, rinse</li>
<li><strong>Vinegar method:</strong> Fill with 1/4 cup white vinegar + water, let sit 15 minutes, rinse well</li>
</ul>

<h2>Dishwasher: Yes or No?</h2>
<p>Our sublimation bottles are dishwasher safe—the printing won't peel or fade. However, we recommend hand washing for maximum longevity because:</p>
<ul>
<li>Harsh dishwasher detergents can dull the finish over time</li>
<li>High heat cycles may affect the lid seal</li>
<li>Hand washing is gentler on the insulation</li>
</ul>
<p><strong>Bottom line:</strong> Occasional dishwasher use is fine. Regular hand washing is better.</p>

<h2>What NOT to Do</h2>
<ul>
<li>❌ Don't use bleach or chlorine cleaners</li>
<li>❌ Don't microwave your bottle</li>
<li>❌ Don't freeze with liquid inside (expansion can damage insulation)</li>
<li>❌ Don't use abrasive scrubbers on the printed surface</li>
</ul>

<h2>The Sublimation Advantage</h2>
<p>Unlike vinyl decals that peel with washing, sublimation printing is <em>part of the bottle</em>. You can scrub, wash, and use your bottle daily without worrying about damaging the design. That's the whole point.</p>

<p><a href="/pages/why-sublimation">Learn more about sublimation →</a></p>
`,
  },
  {
    title: "5 Reasons Personalized Bottles Make the Best Corporate Gifts",
    tags: "corporate, business, gifts, employee, branding",
    body_html: `
<p>Looking for corporate gifts that don't end up in the trash? Here's why personalized water bottles outperform traditional promotional items.</p>

<h2>1. They Actually Get Used</h2>
<p>Be honest: when was the last time you used a branded stress ball or foam finger? Personalized water bottles are different because:</p>
<ul>
<li>People need to hydrate daily</li>
<li>Bottles go to meetings, gyms, and desks</li>
<li>They become part of the daily routine</li>
</ul>
<p>A gift that gets used = brand visibility every single day.</p>

<h2>2. Personal + Professional</h2>
<p>The magic combination: your company logo AND individual employee names. This shows:</p>
<ul>
<li>You care about each person, not just the company image</li>
<li>Attention to detail in your gifting</li>
<li>Willingness to invest in quality</li>
</ul>

<h2>3. Premium Perception</h2>
<p>Cheap promo items reflect poorly on your brand. A high-quality sublimation bottle with permanent printing says:</p>
<ul>
<li>"We invest in quality"</li>
<li>"We value our employees/clients"</li>
<li>"We think long-term"</li>
</ul>

<h2>4. Wellness Messaging</h2>
<p>Water bottles align with wellness initiatives:</p>
<ul>
<li>Encourage hydration</li>
<li>Support healthy habits</li>
<li>Reduce single-use plastic</li>
<li>Show you care about employee health</li>
</ul>

<h2>5. They Last for Years</h2>
<p>With sublimation printing (not vinyl), your branding:</p>
<ul>
<li>Won't peel at company events</li>
<li>Won't fade in the sun</li>
<li>Won't crack or wear off</li>
<li>Looks professional years later</li>
</ul>

<h2>Perfect For</h2>
<ul>
<li>Employee appreciation gifts</li>
<li>Client thank-you gifts</li>
<li>Trade show giveaways</li>
<li>Team building events</li>
<li>New hire welcome kits</li>
<li>Company milestones</li>
</ul>

<h2>Volume Discounts Available</h2>
<p>We offer bulk pricing for corporate orders:</p>
<ul>
<li>10-24 bottles: 10% off</li>
<li>25-49 bottles: 15% off</li>
<li>50+ bottles: 20% off</li>
</ul>

<p><a href="/collections/corporate">Shop Corporate Bottles →</a></p>
`,
  },
  {
    title: "Wedding Day Timeline: When to Give Bridesmaid Gifts",
    tags: "wedding, bridesmaid, gifts, timeline, planning",
    body_html: `
<p>You've bought the perfect bridesmaid gifts, but when should you actually give them? Here's your complete timeline.</p>

<h2>Option 1: The Proposal (8-12 Months Before)</h2>
<p><strong>Best for:</strong> "Will you be my bridesmaid?" gifts</p>
<p>This is the most popular time for personalized bottles because:</p>
<ul>
<li>Sets the tone for the whole wedding journey</li>
<li>Gives them something to use during planning</li>
<li>Creates excitement early</li>
</ul>
<p><strong>Gift idea:</strong> Personalized bottle with her name (save the "Bridesmaid" title for later)</p>

<h2>Option 2: The Bridal Shower</h2>
<p><strong>Best for:</strong> Thank-you gifts to the hostess and bridal party</p>
<p>If someone hosts your shower, this is a perfect thank-you moment.</p>

<h2>Option 3: The Bachelorette Party</h2>
<p><strong>Best for:</strong> Matching squad bottles</p>
<p>Personalized bottles are perfect for bachelorette weekends:</p>
<ul>
<li>Keep everyone hydrated</li>
<li>Look amazing in photos</li>
<li>Easy to identify whose drink is whose</li>
<li>Become trip souvenirs</li>
</ul>

<h2>Option 4: The Rehearsal Dinner</h2>
<p><strong>Best for:</strong> Formal thank-you gifts</p>
<p>A more intimate setting to express gratitude before the big day.</p>

<h2>Option 5: Wedding Morning (Most Popular!)</h2>
<p><strong>Best for:</strong> Getting-ready gifts</p>
<p>This is the #1 time brides give bridesmaid gifts because:</p>
<ul>
<li>Everyone is together in one place</li>
<li>Bottles can be used during hair/makeup</li>
<li>Perfect for "getting ready" photos</li>
<li>Sets a beautiful tone for the day</li>
<li>Creates a special shared moment</li>
</ul>

<h2>Option 6: The Reception</h2>
<p><strong>Best for:</strong> Formal gifts with speeches</p>
<p>Some brides prefer to give gifts during the reception, either at the head table or during toasts.</p>

<h2>Our Recommendation</h2>
<p>Give personalized bottles on <strong>wedding morning</strong>. Here's why:</p>
<ol>
<li>Everyone needs to stay hydrated during prep</li>
<li>Bottles photograph beautifully in matching robes</li>
<li>It's a calm moment before the chaos</li>
<li>Creates lasting memories</li>
</ol>

<p><a href="/collections/weddings">Shop Wedding Day Bottles →</a></p>
`,
  },
  {
    title: "Why Cheap Personalized Bottles Cost More in the Long Run",
    tags: "quality, value, comparison, vinyl, sublimation",
    body_html: `
<p>That $12 personalized bottle on Amazon looks tempting. Here's why it'll actually cost you more.</p>

<h2>The True Cost of Cheap</h2>
<p>Let's break down what you're really getting with budget personalized bottles:</p>

<h3>The $12 Amazon Bottle</h3>
<ul>
<li>Vinyl decal printing (sticker)</li>
<li>Thin single-wall construction</li>
<li>Generic fonts and limited colors</li>
<li>3-6 month lifespan before peeling</li>
<li>Embarrassing when it falls apart as a gift</li>
</ul>

<h3>What Actually Happens</h3>
<ol>
<li><strong>Month 1:</strong> Looks great, you're happy</li>
<li><strong>Month 2:</strong> Edges start lifting slightly</li>
<li><strong>Month 3:</strong> Noticeable peeling, but you keep using it</li>
<li><strong>Month 4:</strong> Peeling is embarrassing, bottle gets hidden</li>
<li><strong>Month 5:</strong> Bottle goes in a drawer</li>
<li><strong>Month 6:</strong> You buy another one</li>
</ol>

<h2>The Math</h2>
<table>
<tr><th>Option</th><th>Cost</th><th>Lifespan</th><th>Cost Per Year</th></tr>
<tr><td>Cheap vinyl bottle</td><td>$12</td><td>6 months</td><td>$24/year</td></tr>
<tr><td>Quality sublimation bottle</td><td>$30</td><td>5+ years</td><td>$6/year</td></tr>
</table>

<p><strong>The "expensive" bottle is actually 4x cheaper.</strong></p>

<h2>The Gift Factor</h2>
<p>If you're giving personalized bottles as gifts, cheap quality reflects on YOU:</p>
<ul>
<li>❌ "She got me a bottle and the name already peeled off"</li>
<li>❌ "It was cute but now it looks terrible"</li>
<li>❌ "I can't use it anymore, it's embarrassing"</li>
</ul>

<p>vs.</p>

<ul>
<li>✅ "I still use this bottle every day, 2 years later"</li>
<li>✅ "The quality is amazing, it still looks brand new"</li>
<li>✅ "Best bridesmaid gift I've ever received"</li>
</ul>

<h2>What to Look For</h2>
<p>When buying personalized bottles, check for:</p>
<ol>
<li><strong>Sublimation printing</strong> (not vinyl/decal)</li>
<li><strong>Double-wall insulation</strong> (keeps drinks cold/hot)</li>
<li><strong>Stainless steel</strong> (not plastic)</li>
<li><strong>BPA-free certification</strong></li>
<li><strong>Satisfaction guarantee</strong></li>
</ol>

<h2>Our Promise</h2>
<p>Every Shelzy's Designs bottle uses permanent sublimation printing on premium double-wall stainless steel. If you're not happy, we'll make it right.</p>

<p><a href="/collections/all">Shop Quality Bottles →</a></p>
`,
  },
];

// ============================================================
// API FUNCTIONS
// ============================================================

async function shopifyRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify API Error (${response.status}): ${error}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getBlogId() {
  // Get existing blogs
  const data = await shopifyRequest('/blogs.json');

  if (data.blogs && data.blogs.length > 0) {
    // Use the first blog (usually "News" or main blog)
    return data.blogs[0].id;
  }

  // Create a blog if none exists
  const newBlog = await shopifyRequest('/blogs.json', {
    method: 'POST',
    body: JSON.stringify({
      blog: {
        title: 'Shelzy\'s Designs Blog',
        commentable: 'moderate',
      },
    }),
  });

  return newBlog.blog.id;
}

async function createArticle(blogId, post) {
  const article = {
    title: post.title,
    body_html: post.body_html,
    tags: post.tags,
    published: true,
    author: 'Shelzy\'s Designs',
  };

  const result = await shopifyRequest(`/blogs/${blogId}/articles.json`, {
    method: 'POST',
    body: JSON.stringify({ article }),
  });

  return result.article;
}

async function getExistingArticles(blogId) {
  const data = await shopifyRequest(`/blogs/${blogId}/articles.json?limit=250`);
  return data.articles || [];
}

// ============================================================
// MAIN FUNCTION
// ============================================================

async function publishBlogs() {
  console.log('📝 Publishing Blog Posts to Shopify...\n');
  console.log(`Store: ${STORE_URL}`);
  console.log('');

  try {
    // Get or create blog
    console.log('Finding blog...');
    const blogId = await getBlogId();
    console.log(`✅ Using blog ID: ${blogId}\n`);

    // Get existing articles to avoid duplicates
    const existingArticles = await getExistingArticles(blogId);
    const existingTitles = existingArticles.map(a => a.title.toLowerCase());

    let created = 0;
    let skipped = 0;

    for (const post of BLOG_POSTS) {
      // Check if article already exists
      if (existingTitles.includes(post.title.toLowerCase())) {
        console.log(`⏭️  Skipping (exists): ${post.title}`);
        skipped++;
        continue;
      }

      try {
        const article = await createArticle(blogId, post);
        console.log(`✅ Created: ${article.title}`);
        console.log(`   URL: /blogs/news/${article.handle}`);
        created++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Failed: ${post.title}`);
        console.error(`   Error: ${error.message}`);
      }
    }

    console.log('\n' + '═'.repeat(50));
    console.log('📊 RESULTS');
    console.log('═'.repeat(50));
    console.log(`Created: ${created}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total posts: ${BLOG_POSTS.length}`);
    console.log('\n✨ Blog publishing complete!');

  } catch (error) {
    console.error('❌ Failed to publish blogs:', error.message);
    process.exit(1);
  }
}

// Run
publishBlogs();
