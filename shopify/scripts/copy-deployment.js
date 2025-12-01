const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getThemeId() {
  const response = await shopifyRequest('GET', '/themes.json');
  const mainTheme = response.themes.find(t => t.role === 'main');
  return mainTheme.id;
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// ============================================================
// HOMEPAGE HERO
// ============================================================

const szHero = `{% comment %}
  SZ Hero - Custom Personalized Water Bottles
{% endcomment %}

<style>
.sz-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 138, 128, 0.9) 0%, rgba(78, 199, 232, 0.85) 100%);
  padding: 60px 20px;
}

.sz-hero-inner {
  max-width: 800px;
  text-align: center;
  color: white;
}

.sz-hero h1 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.15);
}

.sz-hero-sub {
  font-size: 1.1rem;
  line-height: 1.65;
  opacity: 0.95;
  margin-bottom: 35px;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
}

.sz-hero-btns {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.sz-hero-btn {
  padding: 16px 32px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-block;
}

.sz-hero-btn-primary {
  background: white;
  color: #FF8A80;
}

.sz-hero-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.sz-hero-btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.sz-hero-btn-secondary:hover {
  background: white;
  color: #4EC7E8;
}

@media (min-width: 750px) {
  .sz-hero {
    min-height: 600px;
    padding: 100px 40px;
  }
  .sz-hero h1 {
    font-size: 3.2rem;
  }
  .sz-hero-sub {
    font-size: 1.25rem;
  }
}
</style>

<section class="sz-hero">
  <div class="sz-hero-inner">
    <h1>Custom Personalized Water Bottles for Every Occasion</h1>
    <p class="sz-hero-sub">Sun-soaked, gift-ready bottles personalized with your names, colors, and fonts — perfect for weddings, bachelorettes, bridal showers, bridesmaid gifts, birthdays, corporate events, and everyday hydration.</p>
    <div class="sz-hero-btns">
      <a href="/collections/all-water-bottles" class="sz-hero-btn sz-hero-btn-primary">Shop All Water Bottles</a>
      <a href="/collections/wedding-water-bottles" class="sz-hero-btn sz-hero-btn-secondary">Shop Wedding Bottles</a>
    </div>
  </div>
</section>`;

// ============================================================
// ANNOUNCEMENT BAR
// ============================================================

const szAnnouncement = `{% comment %}
  SZ Announcement Bar - Unified messaging
{% endcomment %}

<style>
.sz-announce {
  background: linear-gradient(90deg, #FF8A80 0%, #FFD9A0 50%, #4EC7E8 100%);
  color: white;
  text-align: center;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
}

.sz-announce-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.sz-announce-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sz-announce-dot {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0.7;
}

@media (max-width: 749px) {
  .sz-announce-inner {
    gap: 10px;
  }
  .sz-announce {
    font-size: 13px;
    padding: 10px 15px;
  }
  .sz-announce-dot {
    display: none;
  }
  .sz-announce-item:not(:first-child) {
    display: none;
  }
}
</style>

<div class="sz-announce">
  <div class="sz-announce-inner">
    <span class="sz-announce-item">Wedding-ready in 5–7 business days</span>
    <span class="sz-announce-dot"></span>
    <span class="sz-announce-item">Free personalization on every bottle</span>
    <span class="sz-announce-dot"></span>
    <span class="sz-announce-item">Free shipping on orders $50+</span>
  </div>
</div>`;

// ============================================================
// THE SHELZY'S DIFFERENCE
// ============================================================

const szDifference = `{% comment %}
  SZ The Shelzy's Difference - 6 feature cards
{% endcomment %}

<style>
.sz-difference {
  padding: 80px 20px;
  background: #FFF9F3;
}

.sz-difference-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
}

.sz-difference-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 15px;
}

.sz-difference-header p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.sz-difference-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.sz-diff-card {
  background: white;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sz-diff-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}

.sz-diff-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF8A80, #FFD9A0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 18px;
}

.sz-diff-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 10px;
}

.sz-diff-card p {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.55;
  margin: 0;
}

@media (min-width: 750px) {
  .sz-difference-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 990px) {
  .sz-difference-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .sz-difference-header h2 {
    font-size: 2.5rem;
  }
}
</style>

<section class="sz-difference">
  <div class="sz-difference-header">
    <h2>The Shelzy's Difference</h2>
    <p>Premium personalized bottles that feel like sunshine, made to be carried from your welcome party to your flight home — and every day after.</p>
  </div>

  <div class="sz-difference-grid">
    <div class="sz-diff-card">
      <div class="sz-diff-icon">🎨</div>
      <h3>Permanent Sublimation Printing</h3>
      <p>Names and designs are infused into the bottle coating — no vinyl, no peeling, no raised edges. Just a smooth, photo-ready finish that actually lasts.</p>
    </div>

    <div class="sz-diff-card">
      <div class="sz-diff-icon">🌴</div>
      <h3>Designed for Real Weekends Away</h3>
      <p>Every bottle is styled to match the energy of your event — weddings, bachelorettes, beach birthdays, team offsites — so your details look as good in photos as they do in person.</p>
    </div>

    <div class="sz-diff-card">
      <div class="sz-diff-icon">⚡</div>
      <h3>Wedding-Ready in 5–7 Business Days</h3>
      <p>Most orders are made to order in 3–5 business days and ship in 3–7 business days, so your bottles arrive on time for the weekend circled on your calendar.</p>
    </div>

    <div class="sz-diff-card">
      <div class="sz-diff-icon">✨</div>
      <h3>Free Personalization on Every Bottle</h3>
      <p>Add names, roles, dates, and inside jokes — personalization is always free. Free shipping kicks in at $50+, so it's easy to outfit the whole crew.</p>
    </div>

    <div class="sz-diff-card">
      <div class="sz-diff-icon">👀</div>
      <h3>Hand-Checked Before They Ship</h3>
      <p>Every bottle is checked by hand for spelling, placement, and quality before it leaves the studio. If it's not something we'd carry ourselves, it doesn't ship.</p>
    </div>

    <div class="sz-diff-card">
      <div class="sz-diff-icon">💪</div>
      <h3>Made to Be Used Long After the Weekend</h3>
      <p>Double-walled stainless steel keeps drinks cold, leak-resistant lids travel well, and minimal logos keep your bottles wearable at work, in the gym, or on vacation.</p>
    </div>
  </div>
</section>`;

// ============================================================
// BRIDAL PARTY BUNDLES
// ============================================================

const szBundles = `{% comment %}
  SZ Bridal Party Bundles
{% endcomment %}

<style>
.sz-bundles {
  padding: 80px 20px;
  background: white;
}

.sz-bundles-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
}

.sz-bundles-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 15px;
}

.sz-bundles-header p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.sz-bundles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.sz-bundle-card {
  background: #FFF9F3;
  border-radius: 20px;
  padding: 30px 24px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sz-bundle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}

.sz-bundle-size {
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF8A80;
  margin-bottom: 5px;
}

.sz-bundle-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
}

.sz-bundle-card p {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 20px;
}

.sz-bundle-btn {
  display: inline-block;
  background: #FF8A80;
  color: white;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.sz-bundle-btn:hover {
  background: #FF6A60;
  transform: translateY(-2px);
}

@media (min-width: 750px) {
  .sz-bundles-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

<section class="sz-bundles">
  <div class="sz-bundles-header">
    <h2>Bridal Party Bundles, Solved</h2>
    <p>Build a matching set for your bridal party in minutes — no spreadsheets, no guesswork, just perfectly coordinated bottles for everyone.</p>
  </div>

  <div class="sz-bundles-grid">
    <div class="sz-bundle-card">
      <div class="sz-bundle-size">3</div>
      <h3>Set of 3</h3>
      <p>Perfect for a maid of honor and two bridesmaids, or a bride + parents.</p>
      <a href="/collections/all-water-bottles?filter.v.option.size=Set+of+3" class="sz-bundle-btn">Shop Set of 3</a>
    </div>

    <div class="sz-bundle-card">
      <div class="sz-bundle-size">5</div>
      <h3>Set of 5</h3>
      <p>The classic bridal party bundle — ideal for a bride, maid of honor, and three bridesmaids.</p>
      <a href="/collections/all-water-bottles?filter.v.option.size=Set+of+5" class="sz-bundle-btn">Shop Set of 5</a>
    </div>

    <div class="sz-bundle-card">
      <div class="sz-bundle-size">6</div>
      <h3>Set of 6</h3>
      <p>For bigger crews and blended squads. Six bottles with matching fonts and colors for effortless, cohesive photos.</p>
      <a href="/collections/all-water-bottles?filter.v.option.size=Set+of+6" class="sz-bundle-btn">Shop Set of 6</a>
    </div>

    <div class="sz-bundle-card">
      <div class="sz-bundle-size">10</div>
      <h3>Set of 10</h3>
      <p>Built for full-out weekends — welcome bags, cousins, siblings, or VIPs. One order, ten perfectly personalized bottles.</p>
      <a href="/collections/all-water-bottles?filter.v.option.size=Set+of+10" class="sz-bundle-btn">Shop Set of 10</a>
    </div>
  </div>
</section>`;

// ============================================================
// SHOP BY OCCASION (Updated)
// ============================================================

const szOccasions = `{% comment %}
  SZ Shop by Occasion - Complete grid
{% endcomment %}

<style>
.sz-occasions {
  padding: 80px 20px;
  background: #FFECD1;
}

.sz-occasions-header {
  text-align: center;
  max-width: 500px;
  margin: 0 auto 50px;
}

.sz-occasions-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 12px;
}

.sz-occasions-header p {
  font-size: 1.05rem;
  color: #555;
}

.sz-occasions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  max-width: 1200px;
  margin: 0 auto;
}

.sz-occ-card {
  background: white;
  border-radius: 20px;
  padding: 28px 22px;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}

.sz-occ-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.sz-occ-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 15px;
}

.sz-occ-card:nth-child(1) .sz-occ-icon { background: linear-gradient(135deg, #FF8A80, #FFD9A0); }
.sz-occ-card:nth-child(2) .sz-occ-icon { background: linear-gradient(135deg, #F3C8FF, #FF8A80); }
.sz-occ-card:nth-child(3) .sz-occ-icon { background: linear-gradient(135deg, #4EC7E8, #F3C8FF); }
.sz-occ-card:nth-child(4) .sz-occ-icon { background: linear-gradient(135deg, #FFD9A0, #FF8A80); }
.sz-occ-card:nth-child(5) .sz-occ-icon { background: linear-gradient(135deg, #FF8A80, #4EC7E8); }
.sz-occ-card:nth-child(6) .sz-occ-icon { background: linear-gradient(135deg, #4EC7E8, #FFD9A0); }
.sz-occ-card:nth-child(7) .sz-occ-icon { background: linear-gradient(135deg, #FFD9A0, #4EC7E8); }
.sz-occ-card:nth-child(8) .sz-occ-icon { background: linear-gradient(135deg, #F3C8FF, #4EC7E8); }

.sz-occ-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 8px;
}

.sz-occ-card p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.45;
  margin: 0;
}

@media (min-width: 750px) {
  .sz-occasions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

<section class="sz-occasions">
  <div class="sz-occasions-header">
    <h2>Shop by Occasion</h2>
    <p>Start with your vibe, then pick the bottles to match.</p>
  </div>

  <div class="sz-occasions-grid">
    <a href="/collections/wedding-water-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">💒</div>
      <h3>Wedding Water Bottles</h3>
      <p>Classic, elegant bottles for the entire wedding weekend — from welcome bags to farewell brunch.</p>
    </a>

    <a href="/collections/bachelorette-party-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">🎉</div>
      <h3>Bachelorette Bottles</h3>
      <p>Bright, playful bottles for pool days, boat days, and late-night dance floors.</p>
    </a>

    <a href="/collections/bridal-shower-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">💐</div>
      <h3>Bridal Shower Bottles</h3>
      <p>Sweet, polished bottles that double as decor and take-home favors.</p>
    </a>

    <a href="/collections/bridesmaid-gift-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">💝</div>
      <h3>Bridesmaid Gift Bottles</h3>
      <p>Personalized thank-you gifts your bridesmaids will actually use after the weekend.</p>
    </a>

    <a href="/collections/birthday-party-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">🎂</div>
      <h3>Birthday Party Bottles</h3>
      <p>Colorful, custom bottles for milestone birthdays, girls' trips, and backyard celebrations.</p>
    </a>

    <a href="/collections/corporate-event-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">💼</div>
      <h3>Corporate & Event Bottles</h3>
      <p>Branded bottles that feel more like gifts than swag — perfect for retreats and client events.</p>
    </a>

    <a href="/collections/sports-team-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">⚽</div>
      <h3>Team & Club Bottles</h3>
      <p>Matching bottles for leagues, studios, and school teams so everyone shows up looking coordinated.</p>
    </a>

    <a href="/collections/everyday-bottles" class="sz-occ-card">
      <div class="sz-occ-icon">☀️</div>
      <h3>Everyday Bottles</h3>
      <p>Minimal, personalized bottles for your daily commute, workouts, or WFH desk.</p>
    </a>
  </div>
</section>`;

// ============================================================
// SUBLIMATION VS VINYL
// ============================================================

const szSublimation = `{% comment %}
  SZ Why Our Print Never Peels - Sublimation vs Vinyl
{% endcomment %}

<style>
.sz-sublimation {
  padding: 80px 20px;
  background: white;
}

.sz-sublimation-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
}

.sz-sublimation-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 15px;
}

.sz-sublimation-header p {
  font-size: 1.05rem;
  color: #555;
  line-height: 1.6;
}

.sz-sub-compare {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  max-width: 900px;
  margin: 0 auto;
}

.sz-sub-col {
  border-radius: 20px;
  padding: 30px 28px;
}

.sz-sub-good {
  background: linear-gradient(135deg, rgba(78, 199, 232, 0.1), rgba(255, 138, 128, 0.1));
  border: 2px solid #4EC7E8;
}

.sz-sub-bad {
  background: #f9f9f9;
  border: 2px solid #ddd;
}

.sz-sub-col h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sz-sub-good h3 {
  color: #4EC7E8;
}

.sz-sub-bad h3 {
  color: #888;
}

.sz-sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sz-sub-list li {
  padding: 10px 0;
  font-size: 0.95rem;
  color: #555;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.sz-sub-list li:last-child {
  border-bottom: none;
}

.sz-sub-good .sz-sub-list li::before {
  content: "✓";
  color: #4EC7E8;
  font-weight: 700;
}

.sz-sub-bad .sz-sub-list li::before {
  content: "✗";
  color: #ccc;
  font-weight: 700;
}

.sz-sub-closing {
  text-align: center;
  margin-top: 40px;
  font-size: 1.1rem;
  color: #555;
  font-style: italic;
}

@media (min-width: 750px) {
  .sz-sub-compare {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

<section class="sz-sublimation">
  <div class="sz-sublimation-header">
    <h2>Why Our Print Never Peels</h2>
    <p>We use permanent sublimation printing so your design becomes part of the bottle, not a sticker sitting on top.</p>
  </div>

  <div class="sz-sub-compare">
    <div class="sz-sub-col sz-sub-good">
      <h3>🎨 Sublimation Printing</h3>
      <ul class="sz-sub-list">
        <li>Ink is infused directly into the bottle's coating</li>
        <li>No raised edges, no cracking, no peeling</li>
        <li>Smooth to the touch and photo-ready</li>
        <li>Built to last through trips, dish drying racks, and daily use</li>
      </ul>
    </div>

    <div class="sz-sub-col sz-sub-bad">
      <h3>Stickers & Vinyl</h3>
      <ul class="sz-sub-list">
        <li>Can peel, bubble, and lift at the edges</li>
        <li>Collects dirt and makeup around the design</li>
        <li>Easy to scratch or chip</li>
        <li>Not ideal for long-term, everyday use</li>
      </ul>
    </div>
  </div>

  <p class="sz-sub-closing">Your bottles have a lot of places to be — they deserve a finish that keeps up.</p>
</section>`;

// ============================================================
// HOW IT WORKS
// ============================================================

const szHowItWorks = `{% comment %}
  SZ How It Works - 3 steps
{% endcomment %}

<style>
.sz-how {
  padding: 80px 20px;
  background: #FFF9F3;
}

.sz-how-header {
  text-align: center;
  margin-bottom: 50px;
}

.sz-how-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2C2C2C;
}

.sz-how-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.sz-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.sz-step-num {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF8A80, #4EC7E8);
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sz-step-content h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 8px;
}

.sz-step-content p {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.55;
  margin: 0;
}

@media (min-width: 750px) {
  .sz-how-steps {
    grid-template-columns: repeat(3, 1fr);
  }
  .sz-step {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}
</style>

<section class="sz-how">
  <div class="sz-how-header">
    <h2>How It Works</h2>
  </div>

  <div class="sz-how-steps">
    <div class="sz-step">
      <div class="sz-step-num">1</div>
      <div class="sz-step-content">
        <h3>Choose Your Bottle</h3>
        <p>Pick your size, lid style, and finish — from sleek everyday bottles to full bridal party sets.</p>
      </div>
    </div>

    <div class="sz-step">
      <div class="sz-step-num">2</div>
      <div class="sz-step-content">
        <h3>Personalize the Details</h3>
        <p>Add names, roles, dates, and choose your fonts and colors. We print exactly what you type, so double-check spelling.</p>
      </div>
    </div>

    <div class="sz-step">
      <div class="sz-step-num">3</div>
      <div class="sz-step-content">
        <h3>We Print, Pack, and Ship</h3>
        <p>Your order is made to order in 3–5 business days, ships in 3–7 business days, and arrives wedding-ready in about 5–7 business days depending on location.</p>
      </div>
    </div>
  </div>
</section>`;

// ============================================================
// SOCIAL PROOF BAND
// ============================================================

const szSocialProof = `{% comment %}
  SZ Social Proof - Testimonials band
{% endcomment %}

<style>
.sz-proof {
  padding: 60px 20px;
  background: linear-gradient(135deg, #FF8A80 0%, #4EC7E8 100%);
  color: white;
  text-align: center;
}

.sz-proof h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.sz-proof-rating {
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: 40px;
}

.sz-proof-quotes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  max-width: 1100px;
  margin: 0 auto;
}

.sz-proof-quote {
  background: rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 25px;
  font-size: 1rem;
  line-height: 1.6;
  font-style: italic;
}

.sz-proof-quote::before {
  content: '"';
  font-size: 2rem;
  opacity: 0.5;
  display: block;
  margin-bottom: 5px;
}

@media (min-width: 750px) {
  .sz-proof-quotes {
    grid-template-columns: repeat(3, 1fr);
  }
  .sz-proof h2 {
    font-size: 2rem;
  }
}
</style>

<section class="sz-proof">
  <h2>Loved by Brides, Best Friends, and Teams Nationwide</h2>
  <p class="sz-proof-rating">4.9★ average rating from hundreds of weddings, bachelorettes, teams, and events.</p>

  <div class="sz-proof-quotes">
    <div class="sz-proof-quote">
      The perfect welcome-bag moment — our guests carried them the entire weekend.
    </div>
    <div class="sz-proof-quote">
      My bridesmaids still use their bottles at work and the gym. The print hasn't budged.
    </div>
    <div class="sz-proof-quote">
      Our retreat bottles looked so premium that clients thought they were from a luxury brand.
    </div>
  </div>
</section>`;

// ============================================================
// TRUST STRIP
// ============================================================

const szTrustStrip = `{% comment %}
  SZ Trust Strip - Key benefits
{% endcomment %}

<style>
.sz-trust {
  padding: 18px 20px;
  background: #FFF9F3;
  border-top: 1px solid #f0e6dc;
  border-bottom: 1px solid #f0e6dc;
}

.sz-trust-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.sz-trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.sz-trust-item svg {
  width: 16px;
  height: 16px;
  color: #FF8A80;
}

@media (max-width: 749px) {
  .sz-trust-inner {
    gap: 12px;
    justify-content: flex-start;
  }
  .sz-trust-item {
    font-size: 12px;
  }
}
</style>

<div class="sz-trust">
  <div class="sz-trust-inner">
    <span class="sz-trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Permanent sublimation print
    </span>
    <span class="sz-trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Free personalization on every bottle
    </span>
    <span class="sz-trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Free shipping on orders $50+
    </span>
    <span class="sz-trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Wedding-ready in 5–7 business days
    </span>
    <span class="sz-trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Hand-checked before they ship
    </span>
  </div>
</div>`;

// ============================================================
// POPUP (Updated)
// ============================================================

const szPopup = `{% comment %}
  SZ Welcome Popup - WELCOME10
{% endcomment %}

<style>
.sz-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.sz-popup-overlay.active {
  display: flex;
}

.sz-popup-box {
  background: white;
  border-radius: 24px;
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  position: relative;
  animation: szPopIn 0.35s ease;
}

@keyframes szPopIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.sz-popup-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  z-index: 10;
  transition: background 0.2s;
}

.sz-popup-close:hover {
  background: white;
}

.sz-popup-top {
  background: linear-gradient(135deg, #FF8A80 0%, #4EC7E8 100%);
  padding: 45px 30px;
  text-align: center;
  color: white;
}

.sz-popup-top h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.sz-popup-top p {
  font-size: 0.95rem;
  opacity: 0.95;
  line-height: 1.5;
}

.sz-popup-bottom {
  padding: 30px;
}

.sz-popup-code {
  background: #FFF9F3;
  border: 2px dashed #FF8A80;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  margin-bottom: 20px;
}

.sz-popup-code-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.sz-popup-code-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #FF8A80;
  letter-spacing: 0.1em;
}

.sz-popup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sz-popup-input {
  padding: 14px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 16px;
}

.sz-popup-input:focus {
  border-color: #FF8A80;
  outline: none;
}

.sz-popup-btn {
  background: #FF8A80;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.sz-popup-btn:hover {
  background: #FF6A60;
  transform: translateY(-2px);
}

.sz-popup-note {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 12px;
}
</style>

<div class="sz-popup-overlay" id="szPopup">
  <div class="sz-popup-box">
    <button class="sz-popup-close" onclick="closeSzPopup()">×</button>

    <div class="sz-popup-top">
      <h3>Get 10% Off Bridal & Event Bottles</h3>
      <p>Join our list for early access to new fonts, colors, and limited-edition bottle drops — plus 10% off your first order.</p>
    </div>

    <div class="sz-popup-bottom">
      <div class="sz-popup-code">
        <div class="sz-popup-code-label">Your discount code</div>
        <div class="sz-popup-code-value">WELCOME10</div>
      </div>

      <form class="sz-popup-form" action="/contact#contact_form" method="post">
        <input type="email" name="contact[email]" class="sz-popup-input" placeholder="Enter your email" required>
        <button type="submit" class="sz-popup-btn">Get My 10% Off</button>
      </form>

      <p class="sz-popup-note">Use code <strong>WELCOME10</strong> at checkout on your first order.</p>
    </div>
  </div>
</div>

<script>
(function() {
  var shown = localStorage.getItem('szPopupShown');
  if (!shown) {
    setTimeout(function() {
      document.getElementById('szPopup').classList.add('active');
    }, 5000);
  }
})();

function closeSzPopup() {
  document.getElementById('szPopup').classList.remove('active');
  localStorage.setItem('szPopupShown', 'true');
}

document.getElementById('szPopup').addEventListener('click', function(e) {
  if (e.target === this) closeSzPopup();
});
</script>`;

// ============================================================
// FOOTER TAGLINE
// ============================================================

const szFooter = `{% comment %}
  SZ Footer Tagline
{% endcomment %}

<style>
.sz-footer-tagline {
  text-align: center;
  padding: 25px 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
  border-top: 1px solid #f0f0f0;
}
</style>

<div class="sz-footer-tagline">
  Premium personalized water bottles for weddings, parties, and everyday main-character moments — designed to be used long after the weekend.
</div>`;

// ============================================================
// MASTER HOMEPAGE LOADER
// ============================================================

const szHomepageLoader = `{% comment %}
  SZ Homepage Loader - Renders all homepage sections
{% endcomment %}

{% render 'sz-announcement' %}
{% render 'sz-hero' %}
{% render 'sz-trust-strip' %}
{% render 'sz-difference' %}
{% render 'sz-bundles' %}
{% render 'sz-occasions' %}
{% render 'sz-sublimation' %}
{% render 'sz-how-it-works' %}
{% render 'sz-social-proof' %}`;

// ============================================================
// COLLECTION DESCRIPTIONS
// ============================================================

const collectionDescriptions = {
  'all-water-bottles': {
    title: 'All Personalized Water Bottles',
    body: `<p>Start here if you just want the good stuff. This is every personalized bottle we make — from bridal party bundles and bachelorette sets to everyday bottles you'll grab on your way out the door. Choose your style, add your names, and build a bottle lineup that fits the exact season you're in.</p>`
  },
  'wedding-water-bottles': {
    title: 'Wedding Water Bottles',
    body: `<p>Build a matching lineup for the entire wedding weekend — welcome bags, getting-ready photos, rehearsal, reception, and brunch. Our personalized wedding bottles are designed to coordinate with your colors and photograph beautifully, from the first champagne pop to the last beach walk. Add names, roles, and dates so every guest feels like they're part of the inner circle.</p>`
  },
  'bachelorette-party-bottles': {
    title: 'Bachelorette Party Bottles',
    body: `<p>Plane, pool, boat, bar — these bottles are built for the full bachelorette schedule. Pick your color palette, choose a flirty font, and personalize each bottle with names or nicknames. They look amazing in photos and keep everyone's drinks cold while you bounce from brunch to late night.</p>`
  },
  'bridal-shower-bottles': {
    title: 'Bridal Shower Bottles',
    body: `<p>Soft, polished bottles that double as decor and take-home favors. Style them with neutrals or pastels, add each guest's name, and line them up by the mimosa bar. They're a sweet way to thank the people who showed up early in the planning process — and they'll use them long after the shower is over.</p>`
  },
  'bridesmaid-gift-bottles': {
    title: 'Bridesmaid Gift Bottles',
    body: `<p>These are the "thank you for carrying me through this" gifts. Personalize each bottle with your bridesmaid's name, role, or a small inside joke. Pair them with robes, pajamas, or a handwritten note and you've got a gift that's both sentimental and genuinely useful.</p>`
  },
  'birthday-party-bottles': {
    title: 'Birthday Party Bottles',
    body: `<p>Whether it's a milestone birthday or an "any excuse to celebrate" weekend, personalized bottles make everyone feel part of the plan. Choose fun colors and fonts to match the theme, add names or ages, and set them out as place settings or party favors. No more drink mix-ups — just cute bottles in every photo.</p>`
  },
  'corporate-event-bottles': {
    title: 'Corporate & Event Bottles',
    body: `<p>Branded bottles that feel more like gifts than swag. Perfect for retreats, offsites, client events, and VIP mailers, our personalized bottles put your logo in everyone's hands without sacrificing style. Choose your palette, add individual names or titles, and create a premium, useful takeaway that actually leaves the office.</p>`
  },
  'sports-team-bottles': {
    title: 'Team & Club Bottles',
    body: `<p>Keep everyone on the same page — and hydrated. These bottles are built for leagues, studios, school teams, and clubs that want a clean, matching look. Add your team name, numbers, or each player's name so there's no confusion on the sidelines or in the studio.</p>`
  },
  'everyday-bottles': {
    title: 'Everyday Bottles',
    body: `<p>Minimal, personalized bottles for your everyday life. Keep one at your desk, one in your gym bag, and one in your tote for errands. Choose a color and font that feels like you, add your name, and never lose your bottle in a pile of look-alikes again.</p>`
  }
};

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('================================================================');
  console.log('  SHELZYS DESIGNS - COPY DEPLOYMENT');
  console.log('  Deploying all homepage & collection copy');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // --------------------------------------------------------
    // HOMEPAGE SNIPPETS
    // --------------------------------------------------------
    console.log('--- Deploying Homepage Sections ---\n');

    await createAsset(themeId, 'snippets/sz-hero.liquid', szHero);
    console.log('✓ sz-hero.liquid');

    await createAsset(themeId, 'snippets/sz-announcement.liquid', szAnnouncement);
    console.log('✓ sz-announcement.liquid');

    await createAsset(themeId, 'snippets/sz-difference.liquid', szDifference);
    console.log('✓ sz-difference.liquid (6 features)');

    await createAsset(themeId, 'snippets/sz-bundles.liquid', szBundles);
    console.log('✓ sz-bundles.liquid (bridal party sets)');

    await createAsset(themeId, 'snippets/sz-occasions.liquid', szOccasions);
    console.log('✓ sz-occasions.liquid (8 occasions)');

    await createAsset(themeId, 'snippets/sz-sublimation.liquid', szSublimation);
    console.log('✓ sz-sublimation.liquid (vs vinyl comparison)');

    await createAsset(themeId, 'snippets/sz-how-it-works.liquid', szHowItWorks);
    console.log('✓ sz-how-it-works.liquid (3 steps)');

    await createAsset(themeId, 'snippets/sz-social-proof.liquid', szSocialProof);
    console.log('✓ sz-social-proof.liquid (testimonials)');

    await createAsset(themeId, 'snippets/sz-trust-strip.liquid', szTrustStrip);
    console.log('✓ sz-trust-strip.liquid');

    await createAsset(themeId, 'snippets/sz-popup.liquid', szPopup);
    console.log('✓ sz-popup.liquid (WELCOME10)');

    await createAsset(themeId, 'snippets/sz-footer-tagline.liquid', szFooter);
    console.log('✓ sz-footer-tagline.liquid');

    await createAsset(themeId, 'snippets/sz-homepage.liquid', szHomepageLoader);
    console.log('✓ sz-homepage.liquid (master loader)');

    // Remove old snippets
    const oldSnippets = [
      'snippets/sz-hero-content.liquid',
      'snippets/sz-occasion-grid.liquid',
      'snippets/sz-about-bottles.liquid',
      'snippets/sz-shipping-info.liquid',
      'snippets/sz-popup-welcome.liquid'
    ];

    for (const key of oldSnippets) {
      try {
        await shopifyRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
        console.log(`  (Removed old ${key})`);
      } catch (e) {}
    }

    // --------------------------------------------------------
    // UPDATE COLLECTIONS
    // --------------------------------------------------------
    console.log('\n--- Updating Collection Descriptions ---\n');

    // Get all collections
    const collectionsResponse = await shopifyRequest('GET', '/custom_collections.json?limit=50');
    const smartCollections = await shopifyRequest('GET', '/smart_collections.json?limit=50');
    const allCollections = [...(collectionsResponse.custom_collections || []), ...(smartCollections.smart_collections || [])];

    for (const [handle, data] of Object.entries(collectionDescriptions)) {
      const collection = allCollections.find(c => c.handle === handle);
      if (collection) {
        try {
          const endpoint = collection.rules ? '/smart_collections' : '/custom_collections';
          await shopifyRequest('PUT', `${endpoint}/${collection.id}.json`, {
            [collection.rules ? 'smart_collection' : 'custom_collection']: {
              id: collection.id,
              body_html: data.body
            }
          });
          console.log(`✓ Updated: ${data.title}`);
        } catch (e) {
          console.log(`  Warning: Could not update ${handle}`);
        }
      } else {
        console.log(`  (Collection ${handle} not found - create it first)`);
      }
    }

    // --------------------------------------------------------
    // UPDATE BRAND LOADER
    // --------------------------------------------------------
    console.log('\n--- Updating Brand Loader ---\n');

    const szBrandLoader = `{% comment %}
  SZ Brand Loader - Master theme loader
{% endcomment %}

{{ 'shelzys-brand.css' | asset_url | stylesheet_tag }}
{% render 'sz-popup' %}`;

    await createAsset(themeId, 'snippets/sz-brand-loader.liquid', szBrandLoader);
    console.log('✓ Updated sz-brand-loader.liquid');

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------
    console.log('\n================================================================');
    console.log('  COPY DEPLOYMENT COMPLETE!');
    console.log('================================================================');

    console.log('\n📄 SNIPPETS CREATED:');
    console.log('  • sz-hero.liquid - Hero with headline/subheadline/CTAs');
    console.log('  • sz-announcement.liquid - Announcement bar');
    console.log('  • sz-difference.liquid - 6 feature cards');
    console.log('  • sz-bundles.liquid - Bridal party bundles (3, 5, 6, 10)');
    console.log('  • sz-occasions.liquid - Shop by Occasion (8 cards)');
    console.log('  • sz-sublimation.liquid - Sublimation vs Vinyl');
    console.log('  • sz-how-it-works.liquid - 3 steps');
    console.log('  • sz-social-proof.liquid - Testimonials band');
    console.log('  • sz-trust-strip.liquid - 5 trust points');
    console.log('  • sz-popup.liquid - WELCOME10 popup');
    console.log('  • sz-footer-tagline.liquid - Footer copy');
    console.log('  • sz-homepage.liquid - Homepage section loader');

    console.log('\n📝 COLLECTIONS UPDATED:');
    console.log('  • All Water Bottles');
    console.log('  • Wedding Water Bottles');
    console.log('  • Bachelorette Party Bottles');
    console.log('  • Bridal Shower Bottles');
    console.log('  • Bridesmaid Gift Bottles');
    console.log('  • Birthday Party Bottles');
    console.log('  • Corporate & Event Bottles');
    console.log('  • Team & Club Bottles');
    console.log('  • Everyday Bottles');

    console.log('\n⚙️ TO ADD SECTIONS TO HOMEPAGE:');
    console.log('  Go to Online Store → Customize → Homepage');
    console.log('  Add "Custom Liquid" sections with:');
    console.log("    {% render 'sz-hero' %}");
    console.log("    {% render 'sz-trust-strip' %}");
    console.log("    {% render 'sz-difference' %}");
    console.log("    {% render 'sz-bundles' %}");
    console.log("    {% render 'sz-occasions' %}");
    console.log("    {% render 'sz-sublimation' %}");
    console.log("    {% render 'sz-how-it-works' %}");
    console.log("    {% render 'sz-social-proof' %}");

    console.log('\n✅ All copy has been deployed!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
