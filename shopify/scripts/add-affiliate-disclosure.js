const https = require('https');

const SHOP = 'shelzysdesigns.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const disclosure = `
<hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">
<p style="font-size: 13px; color: #666; font-style: italic;">
<strong>Disclosure:</strong> This post contains affiliate links. If you purchase through these links, I may earn a small commission at no extra cost to you. Thank you for supporting Shelzy's Designs!
</p>
`;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOP,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json'
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

async function addDisclosureToPosts() {
  console.log('\n📝 Adding affiliate disclosure to blog posts...\n');

  // Get all blogs
  const blogsData = await shopifyRequest('GET', '/blogs.json');

  let updated = 0;

  for (const blog of blogsData.blogs) {
    const articlesData = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json`);

    for (const article of articlesData.articles) {
      // Skip if already has disclosure
      if (article.body_html && article.body_html.includes('This post contains affiliate links')) {
        console.log(`⏭️  "${article.title}" - already has disclosure`);
        continue;
      }

      // Add disclosure to the end
      const newHtml = (article.body_html || '') + disclosure;

      await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
        article: { id: article.id, body_html: newHtml }
      });

      console.log(`✅ "${article.title}" - disclosure added`);
      updated++;
    }
  }

  console.log(`\n✅ Done! Added disclosure to ${updated} post(s)\n`);
}

addDisclosureToPosts().catch(console.error);
