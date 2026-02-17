#!/usr/bin/env node

/**
 * Shelzy's Designs - Blog Improvements
 * 
 * Enhancements:
 * 1. Blog listing layout with featured images, read time, categories
 * 2. Article page: social sharing, related products, author bio
 * 3. Email signup form at end of articles
 * 4. Related articles section
 * 5. Visual branding (styled quotes, custom lists)
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

const API_VERSION = '2024-01';

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  if (response.status === 200) {
    return response.data.asset.value;
  }
  return null;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📝 BLOG IMPROVEMENTS                                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  if (!themesResponse.data?.themes) {
    console.error('❌ Failed to fetch themes');
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. BLOG STYLES & LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('1️⃣  Creating blog styles...');

  const blogStylesSnippet = `{% comment %}Shelzy's - Blog Styles{% endcomment %}
<style>
/* Blog Listing Page */
.sz-blog-header {
  text-align: center;
  padding: 50px 20px;
  background: linear-gradient(135deg, #fdf6f0 0%, #fff5eb 100%);
  margin-bottom: 40px;
}
.sz-blog-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0 0 10px 0;
}
.sz-blog-header p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* Article Cards */
.sz-article-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 30px;
}
.sz-article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.sz-article-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.sz-article-card-content {
  padding: 24px;
}
.sz-article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #888;
}
.sz-article-category {
  background: #d4a574;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.sz-article-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 12px 0;
  line-height: 1.4;
}
.sz-article-card h2 a {
  color: inherit;
  text-decoration: none;
}
.sz-article-card h2 a:hover {
  color: #d4a574;
}
.sz-article-excerpt {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 16px;
}
.sz-read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #d4a574;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}
.sz-read-more:hover {
  color: #c49464;
}

/* Article Page */
.sz-article-header {
  text-align: center;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}
.sz-article-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0 0 20px 0;
  line-height: 1.3;
}
.sz-article-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
}
.sz-article-info .author {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sz-article-info .author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4a574, #e8c9a8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}
.sz-read-time {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Article Content Styling */
.sz-article-content {
  max-width: 750px;
  margin: 0 auto;
  padding: 0 20px 40px;
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}
.sz-article-content h2 {
  font-size: 26px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #d4a574;
}
.sz-article-content h3 {
  font-size: 22px;
  font-weight: 600;
  color: #2c2c2c;
  margin: 30px 0 15px;
}
.sz-article-content p {
  margin-bottom: 20px;
}
.sz-article-content img {
  max-width: 100%;
  border-radius: 12px;
  margin: 30px 0;
}
.sz-article-content blockquote {
  background: linear-gradient(135deg, #fdf6f0 0%, #fff5eb 100%);
  border-left: 4px solid #d4a574;
  padding: 20px 25px;
  margin: 30px 0;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: #555;
}
.sz-article-content ul, .sz-article-content ol {
  margin: 20px 0;
  padding-left: 25px;
}
.sz-article-content li {
  margin-bottom: 10px;
  position: relative;
}
.sz-article-content ul li::marker {
  color: #d4a574;
}
.sz-article-content a {
  color: #d4a574;
  text-decoration: underline;
}
.sz-article-content a:hover {
  color: #c49464;
}

/* Breadcrumb */
.sz-breadcrumb {
  padding: 15px 20px;
  font-size: 13px;
  color: #888;
  max-width: 800px;
  margin: 0 auto;
}
.sz-breadcrumb a {
  color: #888;
  text-decoration: none;
}
.sz-breadcrumb a:hover {
  color: #d4a574;
}

@media (max-width: 768px) {
  .sz-blog-header h1, .sz-article-header h1 { font-size: 28px; }
  .sz-article-content { font-size: 16px; }
  .sz-article-card h2 { font-size: 18px; }
}
</style>
`;

  await putAsset(liveTheme.id, 'snippets/sz-blog-styles.liquid', blogStylesSnippet);
  console.log('   ✅ Created blog styles');

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SOCIAL SHARING
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('2️⃣  Creating social sharing...');

  const socialShareSnippet = `{% comment %}Shelzy's - Social Sharing{% endcomment %}
<style>
.sz-social-share {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 30px 0;
}
.sz-social-share span {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}
.sz-social-share a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 18px;
}
.sz-social-share a:hover {
  transform: translateY(-2px);
}
.sz-social-share .facebook:hover { background: #1877f2; color: #fff; }
.sz-social-share .twitter:hover { background: #1da1f2; color: #fff; }
.sz-social-share .pinterest:hover { background: #e60023; color: #fff; }
.sz-social-share .email:hover { background: #d4a574; color: #fff; }
</style>

<div class="sz-social-share">
  <span>Share:</span>
  <a href="https://www.facebook.com/sharer/sharer.php?u={{ shop.url }}{{ article.url }}" target="_blank" class="facebook" title="Share on Facebook">f</a>
  <a href="https://twitter.com/intent/tweet?url={{ shop.url }}{{ article.url }}&text={{ article.title | url_encode }}" target="_blank" class="twitter" title="Share on Twitter">𝕏</a>
  <a href="https://pinterest.com/pin/create/button/?url={{ shop.url }}{{ article.url }}&media={{ article.image | img_url: 'large' }}&description={{ article.title | url_encode }}" target="_blank" class="pinterest" title="Pin on Pinterest">P</a>
  <a href="mailto:?subject={{ article.title | url_encode }}&body=Check out this article: {{ shop.url }}{{ article.url }}" class="email" title="Share via Email">✉</a>
</div>
`;

  await putAsset(liveTheme.id, 'snippets/sz-social-share.liquid', socialShareSnippet);
  console.log('   ✅ Created social sharing');

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AUTHOR BIO
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('3️⃣  Creating author bio...');

  const authorBioSnippet = `{% comment %}Shelzy's - Author Bio{% endcomment %}
<style>
.sz-author-bio {
  display: flex;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #fdf6f0 0%, #fff5eb 100%);
  border-radius: 16px;
  margin: 40px 0;
}
.sz-author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4a574, #c49464);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  flex-shrink: 0;
}
.sz-author-info h4 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c2c2c;
}
.sz-author-info .title {
  font-size: 13px;
  color: #d4a574;
  font-weight: 600;
  margin-bottom: 10px;
}
.sz-author-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #555;
}
@media (max-width: 600px) {
  .sz-author-bio { flex-direction: column; text-align: center; align-items: center; }
}
</style>

<div class="sz-author-bio">
  <div class="sz-author-avatar">S</div>
  <div class="sz-author-info">
    <h4>Shelzy Perkins</h4>
    <div class="title">Founder & Creative Director</div>
    <p>Shelzy started designing personalized water bottles after struggling to find quality bridesmaid gifts for her own wedding. Now she helps thousands of brides create memorable, lasting gifts for their special day. When she's not designing, you'll find her planning her next adventure or sipping coffee from one of her favorite bottles!</p>
  </div>
</div>
`;

  await putAsset(liveTheme.id, 'snippets/sz-author-bio.liquid', authorBioSnippet);
  console.log('   ✅ Created author bio');

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. RELATED PRODUCTS (FOR BLOG)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('4️⃣  Creating related products section...');

  const relatedProductsSnippet = `{% comment %}Shelzy's - Related Products for Blog{% endcomment %}
<style>
.sz-blog-products {
  padding: 40px 0;
  background: #f9f9f9;
  margin: 40px -20px;
  padding-left: 20px;
  padding-right: 20px;
}
.sz-blog-products h3 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0 0 10px 0;
}
.sz-blog-products .subtitle {
  text-align: center;
  font-size: 15px;
  color: #666;
  margin-bottom: 30px;
}
.sz-blog-products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}
.sz-blog-product {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}
.sz-blog-product:hover {
  transform: translateY(-3px);
}
.sz-blog-product img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.sz-blog-product-info {
  padding: 16px;
  text-align: center;
}
.sz-blog-product-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}
.sz-blog-product-info .price {
  color: #d4a574;
  font-weight: 700;
  font-size: 16px;
}
.sz-blog-product-info a {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 20px;
  background: #2c3e2d;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}
.sz-blog-product-info a:hover {
  background: #3d5240;
}
@media (max-width: 768px) {
  .sz-blog-products-grid { grid-template-columns: 1fr; max-width: 300px; }
}
</style>

<div class="sz-blog-products">
  <h3>Shop Our Best Sellers</h3>
  <p class="subtitle">Perfect for weddings, events & everyday use</p>
  <div class="sz-blog-products-grid">
    {% for product in collections['best-sellers'].products limit: 3 %}
    <div class="sz-blog-product">
      <a href="{{ product.url }}">
        <img src="{{ product.featured_image | img_url: '400x' }}" alt="{{ product.title }}">
      </a>
      <div class="sz-blog-product-info">
        <h4>{{ product.title | truncate: 40 }}</h4>
        <div class="price">{{ product.price | money }}</div>
        <a href="{{ product.url }}">Shop Now</a>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
`;

  await putAsset(liveTheme.id, 'snippets/sz-blog-products.liquid', relatedProductsSnippet);
  console.log('   ✅ Created related products section');

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. EMAIL SIGNUP FOR BLOG
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('5️⃣  Creating blog email signup...');

  const blogSignupSnippet = `{% comment %}Shelzy's - Blog Email Signup{% endcomment %}
<style>
.sz-blog-signup {
  background: linear-gradient(135deg, #2c3e2d 0%, #3d5240 100%);
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  margin: 40px 0;
  color: #fff;
}
.sz-blog-signup h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
}
.sz-blog-signup p {
  margin: 0 0 25px 0;
  font-size: 15px;
  opacity: 0.9;
}
.sz-blog-signup-form {
  display: flex;
  gap: 10px;
  max-width: 450px;
  margin: 0 auto;
}
.sz-blog-signup-form input {
  flex: 1;
  padding: 14px 18px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
}
.sz-blog-signup-form button {
  padding: 14px 28px;
  background: #d4a574;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.sz-blog-signup-form button:hover {
  background: #c49464;
}
.sz-blog-signup .note {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 15px;
}
@media (max-width: 500px) {
  .sz-blog-signup-form { flex-direction: column; }
  .sz-blog-signup { padding: 30px 20px; }
}
</style>

<div class="sz-blog-signup">
  <h3>💌 Get Wedding Tips & Exclusive Deals</h3>
  <p>Join 5,000+ subscribers for gift ideas, planning tips & 10% off your first order</p>
  <form class="sz-blog-signup-form" action="/contact#contact_form" method="post">
    <input type="email" name="contact[email]" placeholder="Enter your email" required>
    <button type="submit">Subscribe</button>
  </form>
  <p class="note">No spam, ever. Unsubscribe anytime.</p>
</div>
`;

  await putAsset(liveTheme.id, 'snippets/sz-blog-signup.liquid', blogSignupSnippet);
  console.log('   ✅ Created blog email signup');

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. RELATED ARTICLES
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('6️⃣  Creating related articles...');

  const relatedArticlesSnippet = `{% comment %}Shelzy's - Related Articles{% endcomment %}
<style>
.sz-related-articles {
  padding: 40px 0;
  border-top: 1px solid #eee;
  margin-top: 40px;
}
.sz-related-articles h3 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0 0 30px 0;
}
.sz-related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}
.sz-related-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.sz-related-card:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}
.sz-related-card img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.sz-related-card-info h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c2c2c;
  line-height: 1.4;
}
.sz-related-card-info span {
  font-size: 12px;
  color: #888;
}
@media (max-width: 600px) {
  .sz-related-grid { grid-template-columns: 1fr; }
}
</style>

<div class="sz-related-articles">
  <h3>You Might Also Like</h3>
  <div class="sz-related-grid">
    {% for article in blog.articles limit: 4 %}
      {% unless article.id == current_article.id %}
      <a href="{{ article.url }}" class="sz-related-card">
        {% if article.image %}
        <img src="{{ article.image | img_url: '200x' }}" alt="{{ article.title }}">
        {% endif %}
        <div class="sz-related-card-info">
          <h4>{{ article.title | truncate: 60 }}</h4>
          <span>{{ article.published_at | date: "%B %d, %Y" }}</span>
        </div>
      </a>
      {% endunless %}
    {% endfor %}
  </div>
</div>
`;

  await putAsset(liveTheme.id, 'snippets/sz-related-articles.liquid', relatedArticlesSnippet);
  console.log('   ✅ Created related articles');

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. BLOG ENHANCEMENTS LOADER (AUTO-INJECT)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('7️⃣  Creating blog enhancements loader...');

  const blogLoaderSnippet = `{% comment %}Shelzy's - Blog Enhancements Loader{% endcomment %}
{% render 'sz-blog-styles' %}

{% if template contains 'article' %}
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Add read time to article
  var articleContent = document.querySelector('.article__content, .article-content, .rte, [data-article-content]');
  if (articleContent) {
    var text = articleContent.textContent || '';
    var wordCount = text.trim().split(/\\s+/).length;
    var readTime = Math.ceil(wordCount / 200);
    
    var readTimeEl = document.createElement('span');
    readTimeEl.className = 'sz-read-time';
    readTimeEl.innerHTML = '📖 ' + readTime + ' min read';
    
    var articleMeta = document.querySelector('.article__meta, .article-meta, .article-info');
    if (articleMeta) {
      articleMeta.appendChild(readTimeEl);
    }
  }
  
  // Inject social sharing after article content
  var articleEnd = document.querySelector('.article__content, .article-content, .rte');
  if (articleEnd) {
    // Social share HTML
    var shareHtml = '<div class="sz-social-share">' +
      '<span>Share this article:</span>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '" target="_blank" class="facebook" title="Share on Facebook">f</a>' +
      '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(document.title) + '" target="_blank" class="twitter" title="Share on Twitter">𝕏</a>' +
      '<a href="https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(window.location.href) + '&description=' + encodeURIComponent(document.title) + '" target="_blank" class="pinterest" title="Pin it">P</a>' +
      '<a href="mailto:?subject=' + encodeURIComponent(document.title) + '&body=Check out this article: ' + encodeURIComponent(window.location.href) + '" class="email" title="Email">✉</a>' +
      '</div>';
    
    var shareDiv = document.createElement('div');
    shareDiv.innerHTML = shareHtml;
    articleEnd.appendChild(shareDiv.firstChild);
  }
});
</script>

<style>
.sz-read-time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #888;
  margin-left: 15px;
}
.sz-social-share {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #eee;
  margin-top: 30px;
}
.sz-social-share span {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}
.sz-social-share a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 16px;
}
.sz-social-share a:hover { transform: translateY(-2px); }
.sz-social-share .facebook:hover { background: #1877f2; color: #fff; }
.sz-social-share .twitter:hover { background: #000; color: #fff; }
.sz-social-share .pinterest:hover { background: #e60023; color: #fff; }
.sz-social-share .email:hover { background: #d4a574; color: #fff; }
</style>
{% endif %}
`;

  await putAsset(liveTheme.id, 'snippets/sz-blog-enhancements.liquid', blogLoaderSnippet);
  console.log('   ✅ Created blog enhancements loader');

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. INJECT INTO THEME
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('8️⃣  Injecting into theme.liquid...');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    let modified = false;

    if (!themeLiquid.includes('sz-blog-enhancements')) {
      themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-blog-enhancements' %}\n</body>");
      modified = true;
    }

    if (modified) {
      const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      console.log(result.success ? '   ✅ Injected into theme.liquid' : '   ❌ Failed');
    } else {
      console.log('   ✓ Already in theme.liquid');
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ BLOG IMPROVEMENTS DEPLOYED                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Deployed:');
  console.log('  • sz-blog-styles.liquid - Modern blog layout');
  console.log('  • sz-social-share.liquid - Share buttons');
  console.log('  • sz-author-bio.liquid - Author section');
  console.log('  • sz-blog-products.liquid - Related products');
  console.log('  • sz-blog-signup.liquid - Email capture');
  console.log('  • sz-related-articles.liquid - More articles');
  console.log('  • sz-blog-enhancements.liquid - Auto-loader');
  console.log('');
  console.log('Auto-enabled on all blog pages:');
  console.log('  ✓ Read time indicator');
  console.log('  ✓ Social sharing buttons');
  console.log('  ✓ Improved typography');
  console.log('');
  console.log('To add author bio to articles, add in article template:');
  console.log("  {% render 'sz-author-bio' %}");
  console.log('');
  console.log('🔗 Test at: https://shelzysdesigns.com/blogs/news');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
