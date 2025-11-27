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

async function getAsset(themeId, key) {
  try {
    const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return response.asset ? response.asset.value : null;
  } catch (e) {
    return null;
  }
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// ============================================================================
// 1. TRUST BAR ("Loved by Customers Nationwide")
// ============================================================================
const trustBar = `{% comment %}
  Shelzy's Trust Bar - Social proof strip below hero
{% endcomment %}

<section class="sz-trust-bar">
  <div class="sz-trust-bar__inner">
    <div class="sz-trust-bar__item">
      <span class="sz-trust-bar__stars">★★★★★</span>
      <span class="sz-trust-bar__text">4.9 Rating</span>
    </div>
    <div class="sz-trust-bar__divider"></div>
    <div class="sz-trust-bar__item">
      <span class="sz-trust-bar__number">2,500+</span>
      <span class="sz-trust-bar__text">Happy Customers</span>
    </div>
    <div class="sz-trust-bar__divider"></div>
    <div class="sz-trust-bar__item">
      <span class="sz-trust-bar__number">5,000+</span>
      <span class="sz-trust-bar__text">Bottles Personalized</span>
    </div>
  </div>
</section>

<style>
.sz-trust-bar {
  background: var(--sz-sage, #A6B8A0);
  padding: 16px 24px;
}

.sz-trust-bar__inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.sz-trust-bar__item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.sz-trust-bar__stars {
  color: #FFD700;
  font-size: 14px;
  letter-spacing: 1px;
}

.sz-trust-bar__number {
  font-weight: 700;
  font-size: 18px;
}

.sz-trust-bar__text {
  font-size: 13px;
  font-weight: 500;
  opacity: 0.95;
}

.sz-trust-bar__divider {
  width: 1px;
  height: 24px;
  background: rgba(255,255,255,0.3);
}

@media (max-width: 749px) {
  .sz-trust-bar {
    padding: 14px 16px;
  }

  .sz-trust-bar__inner {
    gap: 16px 24px;
  }

  .sz-trust-bar__divider {
    display: none;
  }

  .sz-trust-bar__number {
    font-size: 16px;
  }
}
</style>`;

// ============================================================================
// 2. BUNDLES / SETS SECTION
// ============================================================================
const bundlesSection = `{% comment %}
  Shelzy's Bundle Highlight Section
{% endcomment %}

<section class="sz-bundles-section">
  <div class="page-width">
    <header class="sz-section-header">
      <h2 class="sz-section-title">Perfect Sets for Weddings & Events</h2>
      <p class="sz-section-subtitle">Curated bundles that make gifting easy and instantly cohesive.</p>
    </header>

    <div class="sz-bundles-grid">
      {% assign bundle_handles = "bridal-party-set-of-6-personalized-water-bottles,bachelorette-party-set-of-6-personalized-water-bottles,wedding-party-deluxe-set-of-10-personalized-water-bottles" | split: "," %}

      {% for handle in bundle_handles %}
        {% assign bundle_product = all_products[handle] %}
        {% if bundle_product %}
          <a href="{{ bundle_product.url }}" class="sz-bundle-card">
            <div class="sz-bundle-card__image">
              {% if bundle_product.featured_image %}
                {{ bundle_product.featured_image | image_url: width: 600 | image_tag: loading: 'lazy' }}
              {% endif %}
              {% if bundle_product.compare_at_price > bundle_product.price %}
                <span class="sz-bundle-card__badge">Save {{ bundle_product.compare_at_price | minus: bundle_product.price | money }}</span>
              {% endif %}
            </div>
            <div class="sz-bundle-card__content">
              <h3 class="sz-bundle-card__title">{{ bundle_product.title }}</h3>
              <p class="sz-bundle-card__price">
                {{ bundle_product.price | money }}
                {% if bundle_product.compare_at_price > bundle_product.price %}
                  <span class="sz-bundle-card__compare">{{ bundle_product.compare_at_price | money }}</span>
                {% endif %}
              </p>
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>

    <div class="sz-bundles-cta">
      <a href="/collections/bundles" class="sz-btn sz-btn--secondary">View All Sets</a>
    </div>
  </div>
</section>

<style>
.sz-bundles-section {
  padding: 64px 0;
  background: white;
}

.sz-section-header {
  text-align: center;
  margin-bottom: 40px;
}

.sz-section-title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin: 0 0 12px 0;
}

.sz-section-subtitle {
  font-size: 16px;
  color: var(--sz-gray, #666666);
  margin: 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.sz-bundles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.sz-bundle-card {
  background: var(--sz-beige, #F7F3EC);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sz-bundle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}

.sz-bundle-card__image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.sz-bundle-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.sz-bundle-card:hover .sz-bundle-card__image img {
  transform: scale(1.05);
}

.sz-bundle-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--sz-sage, #A6B8A0);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.sz-bundle-card__content {
  padding: 20px;
  text-align: center;
}

.sz-bundle-card__title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.sz-bundle-card__price {
  font-size: 17px;
  font-weight: 600;
  color: var(--sz-sage, #A6B8A0);
  margin: 0;
}

.sz-bundle-card__compare {
  font-size: 14px;
  color: var(--sz-gray-light, #999999);
  text-decoration: line-through;
  margin-left: 8px;
  font-weight: 400;
}

.sz-bundles-cta {
  text-align: center;
  margin-top: 32px;
}

.sz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 14px 32px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.sz-btn--secondary {
  background: white;
  color: var(--sz-sage, #A6B8A0);
  border: 2px solid var(--sz-sage, #A6B8A0);
}

.sz-btn--secondary:hover {
  background: var(--sz-sage, #A6B8A0);
  color: white;
}

@media (max-width: 749px) {
  .sz-bundles-section {
    padding: 48px 0;
  }

  .sz-bundles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }

  .sz-bundle-card__content {
    padding: 16px;
  }
}
</style>

{% schema %}
{
  "name": "Bundle Highlights",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Perfect Sets for Weddings & Events"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading",
      "default": "Curated bundles that make gifting easy and instantly cohesive."
    }
  ],
  "presets": [
    {
      "name": "Bundle Highlights"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 3. SOCIAL PROOF / TESTIMONIALS (Refined)
// ============================================================================
const socialProof = `{% comment %}
  Shelzy's Social Proof Section - Curated testimonials
{% endcomment %}

<section class="sz-social-proof">
  <div class="page-width">
    <header class="sz-section-header">
      <div class="sz-social-proof__rating">
        <span class="sz-social-proof__stars">★★★★★</span>
        <span class="sz-social-proof__score">4.9 out of 5</span>
      </div>
      <h2 class="sz-section-title">Why Customers Love Us</h2>
    </header>

    <div class="sz-testimonials-grid">
      <div class="sz-testimonial-card">
        <div class="sz-testimonial-card__stars">★★★★★</div>
        <blockquote class="sz-testimonial-card__quote">
          "The bottles were absolutely perfect for my bridesmaids. The personalization was exactly as requested and they arrived so quickly!"
        </blockquote>
        <cite class="sz-testimonial-card__author">
          <strong>Sarah M.</strong>
          <span>Bride, Austin TX</span>
        </cite>
      </div>

      <div class="sz-testimonial-card">
        <div class="sz-testimonial-card__stars">★★★★★</div>
        <blockquote class="sz-testimonial-card__quote">
          "We ordered 50 bottles for our company retreat. Professional quality, great communication, and the team loved them."
        </blockquote>
        <cite class="sz-testimonial-card__author">
          <strong>Michael T.</strong>
          <span>Corporate Event Planner</span>
        </cite>
      </div>

      <div class="sz-testimonial-card">
        <div class="sz-testimonial-card__stars">★★★★★</div>
        <blockquote class="sz-testimonial-card__quote">
          "Best team gift ever! The print quality is amazing and they keep drinks cold all day during tournaments."
        </blockquote>
        <cite class="sz-testimonial-card__author">
          <strong>Jessica R.</strong>
          <span>Soccer Team Mom</span>
        </cite>
      </div>
    </div>
  </div>
</section>

<style>
.sz-social-proof {
  padding: 64px 0;
  background: var(--sz-beige, #F7F3EC);
}

.sz-social-proof__rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.sz-social-proof__stars {
  color: #FFD700;
  font-size: 20px;
  letter-spacing: 2px;
}

.sz-social-proof__score {
  font-size: 15px;
  font-weight: 600;
  color: var(--sz-black, #111111);
}

.sz-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.sz-testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  text-align: center;
}

.sz-testimonial-card__stars {
  color: #FFD700;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.sz-testimonial-card__quote {
  font-size: 15px;
  line-height: 1.6;
  color: var(--sz-gray-dark, #333333);
  margin: 0 0 20px 0;
  font-style: italic;
}

.sz-testimonial-card__author {
  font-style: normal;
}

.sz-testimonial-card__author strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin-bottom: 2px;
}

.sz-testimonial-card__author span {
  font-size: 12px;
  color: var(--sz-gray, #666666);
}

@media (max-width: 749px) {
  .sz-social-proof {
    padding: 48px 0;
  }

  .sz-testimonials-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }

  .sz-testimonial-card {
    padding: 24px 20px;
  }
}
</style>

{% schema %}
{
  "name": "Social Proof",
  "settings": [],
  "presets": [
    {
      "name": "Social Proof"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 4. HOW IT WORKS (Refined)
// ============================================================================
const howItWorks = `{% comment %}
  Shelzy's How It Works - Scannable steps
{% endcomment %}

<section class="sz-how-it-works">
  <div class="page-width">
    <header class="sz-section-header">
      <h2 class="sz-section-title">How It Works</h2>
      <p class="sz-section-subtitle">From click to doorstep in 3 simple steps.</p>
    </header>

    <div class="sz-steps-grid">
      <div class="sz-step">
        <div class="sz-step__number">1</div>
        <h3 class="sz-step__title">Choose Your Bottles</h3>
        <p class="sz-step__text">Pick your style, size, and quantity. Singles or sets — we've got you.</p>
      </div>

      <div class="sz-step">
        <div class="sz-step__number">2</div>
        <h3 class="sz-step__title">Add Your Names</h3>
        <p class="sz-step__text">Enter names, pick fonts and colors. We'll print exactly what you enter.</p>
      </div>

      <div class="sz-step">
        <div class="sz-step__number">3</div>
        <h3 class="sz-step__title">We Ship Fast</h3>
        <p class="sz-step__text">Orders ship in 3–5 business days. Free shipping on orders over $50.</p>
      </div>
    </div>
  </div>
</section>

<style>
.sz-how-it-works {
  padding: 64px 0;
  background: white;
}

.sz-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 40px;
}

.sz-step {
  text-align: center;
}

.sz-step__number {
  width: 48px;
  height: 48px;
  background: var(--sz-sage, #A6B8A0);
  color: white;
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: 20px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.sz-step__title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin: 0 0 8px 0;
}

.sz-step__text {
  font-size: 14px;
  color: var(--sz-gray, #666666);
  line-height: 1.5;
  margin: 0;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 749px) {
  .sz-how-it-works {
    padding: 48px 0;
  }

  .sz-steps-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 16px;
  }
}
</style>

{% schema %}
{
  "name": "How It Works",
  "settings": [],
  "presets": [
    {
      "name": "How It Works"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 5. WHY SUBLIMATION (Refined)
// ============================================================================
const whySublimation = `{% comment %}
  Shelzy's Why Sublimation Section
{% endcomment %}

<section class="sz-sublimation">
  <div class="page-width">
    <div class="sz-sublimation__grid">
      <div class="sz-sublimation__content">
        <h2 class="sz-section-title">Why Sublimation Beats Vinyl</h2>
        <p class="sz-section-subtitle">Your bottles deserve better than peeling stickers.</p>

        <ul class="sz-sublimation__list">
          <li>
            <strong>Permanent print</strong> — fused into the coating, not stuck on top
          </li>
          <li>
            <strong>No peeling or fading</strong> — survives daily use, dishwashers, and travel
          </li>
          <li>
            <strong>Smooth finish</strong> — no raised edges to catch or peel
          </li>
          <li>
            <strong>Vibrant colors</strong> — crisp text and graphics that stay sharp
          </li>
        </ul>
      </div>

      <div class="sz-sublimation__visual">
        <div class="sz-sublimation__compare">
          <div class="sz-sublimation__compare-item sz-sublimation__compare-item--bad">
            <span class="sz-sublimation__compare-label">Vinyl</span>
            <span class="sz-sublimation__compare-text">Peels, fades, lifts at edges</span>
          </div>
          <div class="sz-sublimation__compare-item sz-sublimation__compare-item--good">
            <span class="sz-sublimation__compare-label">Sublimation</span>
            <span class="sz-sublimation__compare-text">Permanent, smooth, vibrant</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.sz-sublimation {
  padding: 64px 0;
  background: var(--sz-beige, #F7F3EC);
}

.sz-sublimation__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.sz-sublimation__content .sz-section-title {
  text-align: left;
  margin-bottom: 8px;
}

.sz-sublimation__content .sz-section-subtitle {
  text-align: left;
  margin: 0 0 24px 0;
}

.sz-sublimation__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sz-sublimation__list li {
  font-size: 15px;
  color: var(--sz-gray-dark, #333333);
  line-height: 1.5;
  margin-bottom: 12px;
  padding-left: 28px;
  position: relative;
}

.sz-sublimation__list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--sz-sage, #A6B8A0);
  font-weight: 600;
}

.sz-sublimation__list li strong {
  color: var(--sz-black, #111111);
}

.sz-sublimation__compare {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sz-sublimation__compare-item {
  padding: 20px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sz-sublimation__compare-item--bad {
  background: #FEE;
  border: 1px solid #FCC;
}

.sz-sublimation__compare-item--good {
  background: #E8F5E9;
  border: 1px solid #C8E6C9;
}

.sz-sublimation__compare-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--sz-black, #111111);
}

.sz-sublimation__compare-text {
  font-size: 13px;
  color: var(--sz-gray, #666666);
}

@media (max-width: 749px) {
  .sz-sublimation {
    padding: 48px 0;
  }

  .sz-sublimation__grid {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 16px;
  }
}
</style>

{% schema %}
{
  "name": "Why Sublimation",
  "settings": [],
  "presets": [
    {
      "name": "Why Sublimation"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 6. NEWSLETTER / EMAIL CAPTURE
// ============================================================================
const newsletter = `{% comment %}
  Shelzy's Newsletter Section
{% endcomment %}

<section class="sz-newsletter">
  <div class="page-width">
    <div class="sz-newsletter__inner">
      <h2 class="sz-newsletter__title">Get 10% Off Bridal & Event Bottles</h2>
      <p class="sz-newsletter__subtitle">Join our list for early access to new fonts, colors, and limited-edition bottle drops.</p>

      <form class="sz-newsletter__form" action="/contact#contact_form" method="post" accept-charset="UTF-8">
        <input type="hidden" name="form_type" value="customer">
        <input type="hidden" name="contact[tags]" value="newsletter">

        <div class="sz-newsletter__field">
          <input
            type="email"
            name="contact[email]"
            class="sz-newsletter__input"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
          <button type="submit" class="sz-newsletter__btn">
            Get 10% Off
          </button>
        </div>

        <p class="sz-newsletter__note">No spam, ever. Unsubscribe anytime.</p>
      </form>
    </div>
  </div>
</section>

<style>
.sz-newsletter {
  padding: 64px 0;
  background: var(--sz-sage, #A6B8A0);
}

.sz-newsletter__inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.sz-newsletter__title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 600;
  color: white;
  margin: 0 0 12px 0;
}

.sz-newsletter__subtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.9);
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.sz-newsletter__form {
  margin: 0;
}

.sz-newsletter__field {
  display: flex;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}

.sz-newsletter__input {
  flex: 1;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 15px;
  padding: 16px 20px;
  border: none;
  border-radius: 999px;
  background: white;
  color: var(--sz-black, #111111);
}

.sz-newsletter__input::placeholder {
  color: var(--sz-gray-light, #999999);
}

.sz-newsletter__input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}

.sz-newsletter__btn {
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 16px 28px;
  border: none;
  border-radius: 999px;
  background: var(--sz-black, #111111);
  color: white;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.sz-newsletter__btn:hover {
  background: #333;
  transform: translateY(-2px);
}

.sz-newsletter__note {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  margin: 16px 0 0 0;
}

@media (max-width: 749px) {
  .sz-newsletter {
    padding: 48px 0;
  }

  .sz-newsletter__inner {
    padding: 0 16px;
  }

  .sz-newsletter__field {
    flex-direction: column;
  }

  .sz-newsletter__btn {
    width: 100%;
  }
}
</style>

{% schema %}
{
  "name": "Newsletter",
  "settings": [],
  "presets": [
    {
      "name": "Newsletter"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 7. MOBILE OPTIMIZATION CSS
// ============================================================================
const mobileOptimization = `{% comment %}
  Shelzy's Mobile Optimization - Global mobile fixes
{% endcomment %}

<style>
/* ============================================
   MOBILE OPTIMIZATION
   ============================================ */

/* Minimum tap target size */
@media (max-width: 749px) {
  button,
  .btn,
  a.btn,
  input[type="submit"],
  .site-nav__link,
  .mobile-nav__link {
    min-height: 44px;
    min-width: 44px;
  }

  /* Better section spacing on mobile */
  .shopify-section,
  section {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  /* Prevent text from being too small */
  body {
    font-size: 16px;
  }

  p, li {
    font-size: 15px;
    line-height: 1.6;
  }

  /* Better padding for content areas */
  .page-width {
    padding-left: 16px;
    padding-right: 16px;
  }

  /* Ensure images don't overflow */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Fix sticky header overlap */
  .site-header,
  .header {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  /* Ensure announcement bar doesn't overlap */
  .sz-announcement-bar {
    position: relative;
    z-index: 999;
  }

  /* Better form inputs on mobile */
  input,
  textarea,
  select {
    font-size: 16px; /* Prevents iOS zoom */
  }

  /* Ensure buttons are full width on mobile where appropriate */
  .product-form__cart-submit,
  .cart__submit {
    width: 100%;
  }

  /* Better card spacing */
  .grid__item {
    margin-bottom: 20px;
  }

  /* Hero text readability */
  .sz-hero__title {
    font-size: 28px;
    line-height: 1.2;
  }

  .sz-hero__subtitle {
    font-size: 15px;
  }

  /* Collection grid on mobile */
  .collection-grid,
  .grid--uniform {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* Single column for certain content */
  .sz-testimonials-grid,
  .sz-bundles-grid,
  .sz-steps-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet adjustments */
@media (min-width: 750px) and (max-width: 989px) {
  .sz-bundles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sz-testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sz-steps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Ensure proper stacking context */
.site-header { z-index: 1000; }
.announcement-bar, .sz-announcement-bar { z-index: 999; }
.modal, .drawer { z-index: 1001; }
.sz-sticky-atc { z-index: 998; }

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better focus states for accessibility */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--sz-sage, #A6B8A0);
  outline-offset: 2px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>`;

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================
async function main() {
  console.log('================================================================');
  console.log('  HOMEPAGE SECTIONS & MOBILE OPTIMIZATION');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Deploy all sections
    console.log('--- Creating Homepage Sections ---\n');

    await createAsset(themeId, 'snippets/sz-trust-bar.liquid', trustBar);
    console.log('✓ Created snippets/sz-trust-bar.liquid');

    await createAsset(themeId, 'sections/sz-bundles.liquid', bundlesSection);
    console.log('✓ Created sections/sz-bundles.liquid');

    await createAsset(themeId, 'sections/sz-social-proof.liquid', socialProof);
    console.log('✓ Created sections/sz-social-proof.liquid');

    await createAsset(themeId, 'sections/sz-how-it-works.liquid', howItWorks);
    console.log('✓ Created sections/sz-how-it-works.liquid');

    await createAsset(themeId, 'sections/sz-sublimation.liquid', whySublimation);
    console.log('✓ Created sections/sz-sublimation.liquid');

    await createAsset(themeId, 'sections/sz-newsletter.liquid', newsletter);
    console.log('✓ Created sections/sz-newsletter.liquid');

    await createAsset(themeId, 'snippets/sz-mobile-optimization.liquid', mobileOptimization);
    console.log('✓ Created snippets/sz-mobile-optimization.liquid');

    // Update theme.liquid
    console.log('\n--- Updating theme.liquid ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      let updated = themeLiquid;
      let changes = [];

      // Add trust bar after announcement bar
      if (!updated.includes('sz-trust-bar')) {
        if (updated.includes('sz-announcement-bar-new')) {
          updated = updated.replace(
            "{% render 'sz-announcement-bar-new' %}",
            "{% render 'sz-announcement-bar-new' %}\n{% render 'sz-trust-bar' %}"
          );
        } else {
          updated = updated.replace(/<body[^>]*>/i, (match) => match + "\n{% render 'sz-trust-bar' %}");
        }
        changes.push('trust bar');
      }

      // Add mobile optimization to head
      if (!updated.includes('sz-mobile-optimization')) {
        updated = updated.replace('</head>', "{% render 'sz-mobile-optimization' %}\n</head>");
        changes.push('mobile optimization');
      }

      if (changes.length > 0) {
        await createAsset(themeId, 'layout/theme.liquid', updated);
        console.log(`✓ Added to theme.liquid: ${changes.join(', ')}`);
      } else {
        console.log('• Theme.liquid already has all snippets');
      }
    }

    // Update homepage template with new section order
    console.log('\n--- Updating Homepage Template ---\n');

    const homepageTemplate = await getAsset(themeId, 'templates/index.json');
    if (homepageTemplate) {
      try {
        let template = JSON.parse(homepageTemplate);

        if (!template.sections) template.sections = {};

        // Add new sections
        template.sections['sz-bundles'] = {
          type: 'sz-bundles',
          settings: {}
        };

        template.sections['sz-social-proof'] = {
          type: 'sz-social-proof',
          settings: {}
        };

        template.sections['sz-how-it-works'] = {
          type: 'sz-how-it-works',
          settings: {}
        };

        template.sections['sz-sublimation'] = {
          type: 'sz-sublimation',
          settings: {}
        };

        template.sections['sz-newsletter'] = {
          type: 'sz-newsletter',
          settings: {}
        };

        // Set recommended order
        const recommendedOrder = [
          'sz-hero-main',           // 1. Hero
          // Trust bar is in theme.liquid
          'best-sellers',           // 2. Best Sellers (keep existing ID)
          'shop-by-occasion',       // 3. Shop by Occasion (keep existing)
          'sz-bundles',             // 4. Bundle Highlights (NEW)
          'sz-how-it-works',        // 5. How It Works
          'sz-social-proof',        // 6. Why Customers Love Us
          'sz-sublimation',         // 7. Why Sublimation
          'blog',                   // 8. Blog / Shelzy Edit
          'sz-newsletter'           // 9. Newsletter
        ];

        // Merge with existing order, keeping sections that exist
        const existingOrder = template.order || [];
        const newOrder = [];

        for (const sectionId of recommendedOrder) {
          if (template.sections[sectionId] || existingOrder.includes(sectionId)) {
            newOrder.push(sectionId);
          }
        }

        // Add any remaining existing sections not in recommended order
        for (const sectionId of existingOrder) {
          if (!newOrder.includes(sectionId)) {
            newOrder.push(sectionId);
          }
        }

        template.order = newOrder;

        await createAsset(themeId, 'templates/index.json', JSON.stringify(template, null, 2));
        console.log('✓ Updated templates/index.json with new sections and order');
      } catch (e) {
        console.log('• Could not update index.json:', e.message);
      }
    }

    // Summary
    console.log('\n================================================================');
    console.log('  HOMEPAGE & MOBILE OPTIMIZATION COMPLETE!');
    console.log('================================================================');

    console.log('\n📱 HOMEPAGE SECTION ORDER:');
    console.log('  1. Hero - "Luxury Personalized Water Bottles..."');
    console.log('  2. Trust Bar - "★★★★★ 4.9 Rating • 2,500+ Happy Customers"');
    console.log('  3. Best Sellers');
    console.log('  4. Shop by Occasion');
    console.log('  5. Bundle Highlights - "Perfect Sets for Weddings & Events"');
    console.log('  6. How It Works - "From click to doorstep in 3 simple steps"');
    console.log('  7. Social Proof - "Why Customers Love Us" (3 testimonials)');
    console.log('  8. Why Sublimation - "Why Sublimation Beats Vinyl"');
    console.log('  9. Blog / The Shelzy Edit');
    console.log('  10. Newsletter - "Get 10% Off Bridal & Event Bottles"');

    console.log('\n📦 SECTIONS CREATED:');
    console.log('  • sz-trust-bar.liquid');
    console.log('  • sz-bundles.liquid');
    console.log('  • sz-social-proof.liquid');
    console.log('  • sz-how-it-works.liquid');
    console.log('  • sz-sublimation.liquid');
    console.log('  • sz-newsletter.liquid');
    console.log('  • sz-mobile-optimization.liquid');

    console.log('\n📱 MOBILE OPTIMIZATIONS:');
    console.log('  • 44px minimum tap targets');
    console.log('  • 16px base font (prevents iOS zoom)');
    console.log('  • Proper section spacing');
    console.log('  • Sticky header z-index fixes');
    console.log('  • Responsive grids');
    console.log('  • Reduced motion support');

    console.log('\n✅ QA CHECKLIST:');
    console.log('  □ Announcement bar visible on mobile');
    console.log('  □ Hero text not cropped');
    console.log('  □ Nav opens/closes cleanly');
    console.log('  □ Add to Cart works');
    console.log('  □ Personalization saves to cart');
    console.log('  □ No overlapping elements');

    console.log('\n🎉 Refresh your store to see all changes!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
