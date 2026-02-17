const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path) {
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
    req.end();
  });
}

function findAmazonLinks(html) {
  const amazonPatterns = [
    /https?:\/\/(?:www\.)?amazon\.com[^\s"'<>]*/gi,
    /https?:\/\/amzn\.to[^\s"'<>]*/gi,
    /https?:\/\/(?:www\.)?amazon\.[\w.]+\/[^\s"'<>]*/gi
  ];

  const links = [];
  for (const pattern of amazonPatterns) {
    const matches = html.match(pattern) || [];
    links.push(...matches);
  }
  return [...new Set(links)];
}

async function main() {
  console.log('================================================================');
  console.log('  BLOG AMAZON LINKS - FOR TESTING');
  console.log('================================================================\n');

  try {
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    for (const blog of blogs) {
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const amazonLinks = findAmazonLinks(article.body_html || '');

        if (amazonLinks.length > 0) {
          console.log(`\n📝 ${article.title}`);
          console.log(`   Blog URL: https://shelzysdesigns.com/blogs/${blog.handle}/${article.handle}\n`);

          amazonLinks.forEach((link, i) => {
            console.log(`   ${i + 1}. ${link}`);
          });
        }
      }
    }

    console.log('\n================================================================');
    console.log('  Copy any link above to test in your browser');
    console.log('================================================================\n');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
