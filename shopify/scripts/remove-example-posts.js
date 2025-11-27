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

async function main() {
  console.log('================================================================');
  console.log('  REMOVING EXAMPLE/PLACEHOLDER BLOG POSTS');
  console.log('================================================================\n');

  try {
    // Get all blogs
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    console.log(`Found ${blogs.length} blog(s)\n`);

    // Patterns that indicate placeholder/example posts
    const placeholderPatterns = [
      /example/i,
      /placeholder/i,
      /sample post/i,
      /test post/i,
      /lorem ipsum/i,
      /your first post/i,
      /welcome to our blog/i,
      /hello world/i
    ];

    let deletedCount = 0;

    for (const blog of blogs) {
      console.log(`--- Blog: ${blog.title} ---\n`);

      // Get all articles for this blog
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const titleLower = article.title.toLowerCase();
        const bodyLower = (article.body_html || '').toLowerCase();

        // Check if title or body matches placeholder patterns
        const isPlaceholder = placeholderPatterns.some(pattern =>
          pattern.test(article.title) || pattern.test(article.body_html || '')
        );

        // Also check for very short/empty content
        const bodyText = (article.body_html || '').replace(/<[^>]*>/g, '').trim();
        const isEmptyOrShort = bodyText.length < 50;

        if (isPlaceholder) {
          console.log(`  🗑️  Deleting: "${article.title}"`);
          console.log(`      Reason: Matches placeholder pattern`);

          await shopifyRequest('DELETE', `/blogs/${blog.id}/articles/${article.id}.json`);
          deletedCount++;
          console.log(`      ✓ Deleted\n`);
        } else {
          console.log(`  ✓ Keeping: "${article.title}"`);
        }
      }
    }

    console.log('\n================================================================');
    console.log('  CLEANUP COMPLETE');
    console.log('================================================================');
    console.log(`\n🗑️  Deleted ${deletedCount} placeholder post(s)`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
