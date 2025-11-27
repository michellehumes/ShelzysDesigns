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
      let html = article.body_html || '';
      let changes = [];

      // Remove "(affiliate link)" text variations
      const originalHtml = html;
      html = html.replace(/\s*\(affiliate link\)/gi, '');
      html = html.replace(/\s*\(affiliate\)/gi, '');
      html = html.replace(/\s*\[affiliate link\]/gi, '');

      if (html !== originalHtml) {
        changes.push('removed (affiliate link) markers');
      }

      // Add disclosure if not already present
      if (!html.includes('This post contains affiliate links')) {
        html = html + disclosure;
        changes.push('added disclosure');
      }

      // Skip if no changes needed
      if (changes.length === 0) {
        console.log(`⏭️  "${article.title}" - no changes needed`);
        continue;
      }

      const newHtml = html;

      await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
        article: { id: article.id, body_html: newHtml }
      });

      console.log(`✅ "${article.title}" - ${changes.join(', ')}`);
      updated++;
    }
  }

  console.log(`\n✅ Done! Added disclosure to ${updated} post(s)\n`);
}

addDisclosureToPosts().catch(console.error);
