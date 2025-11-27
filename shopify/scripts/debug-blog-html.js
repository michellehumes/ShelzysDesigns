const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const AFFILIATE_TAG = 'shelzysdesigns-20';

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
  console.log('  ANALYZING BLOG POST HTML FOR AMAZON LINKS');
  console.log('================================================================\n');

  try {
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    // Posts we know have issues
    const problemPosts = [
      'luxurious-bridesmaid-robes',
      'the-best-travel-jewelry-organizers',
      'the-best-bridal-party-gifts-under-50',
      'top-25-bachelorette-weekend-essentials',
      'how-to-personalize-gifts-like-a-pro'
    ];

    for (const blog of blogs) {
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const handle = article.handle || '';

        // Check if this is one of the problem posts or has no links
        const html = article.body_html || '';
        const hasAnchorTags = /<a\s+[^>]*href/i.test(html);
        const hasAmazonText = /amazon\.com|amzn\.to/i.test(html);

        if (hasAmazonText && !hasAnchorTags) {
          console.log(`\n📝 "${article.title}"`);
          console.log(`   Handle: ${article.handle}`);
          console.log(`   Has anchor tags: ${hasAnchorTags}`);
          console.log(`   Has Amazon text: ${hasAmazonText}`);
          console.log(`\n   --- RAW HTML (first 2000 chars) ---`);
          console.log(html.substring(0, 2000));
          console.log(`\n   --- END ---\n`);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
