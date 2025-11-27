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

function extractAllLinks(html) {
  const linkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function findAmazonLinks(html) {
  const amazonPatterns = [
    /https?:\/\/(?:www\.)?amazon\.com[^\s"'<>]*/gi,
    /https?:\/\/amzn\.to[^\s"'<>]*/gi
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
  console.log('  BLOG POST LINK AUDIT');
  console.log('================================================================\n');

  try {
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    for (const blog of blogs) {
      console.log(`--- Blog: ${blog.title} ---\n`);

      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const allLinks = extractAllLinks(article.body_html || '');
        const amazonLinks = findAmazonLinks(article.body_html || '');
        const bodyLength = (article.body_html || '').length;
        const textOnly = (article.body_html || '').replace(/<[^>]*>/g, '').trim();

        console.log(`📝 "${article.title}"`);
        console.log(`   HTML length: ${bodyLength} chars`);
        console.log(`   Text length: ${textOnly.length} chars`);
        console.log(`   Total links: ${allLinks.length}`);
        console.log(`   Amazon links: ${amazonLinks.length}`);

        if (amazonLinks.length > 0) {
          console.log(`   Amazon URLs:`);
          amazonLinks.forEach(link => {
            const hasTag = link.includes('tag=shelzysdesigns-20');
            console.log(`     ${hasTag ? '✓' : '✗'} ${link.substring(0, 80)}...`);
          });
        }

        if (allLinks.length > 0 && amazonLinks.length === 0) {
          console.log(`   Other links found:`);
          allLinks.slice(0, 5).forEach(link => {
            console.log(`     - ${link.substring(0, 60)}...`);
          });
          if (allLinks.length > 5) {
            console.log(`     ... and ${allLinks.length - 5} more`);
          }
        }

        if (allLinks.length === 0) {
          console.log(`   ⚠️  NO LINKS FOUND IN THIS POST`);

          // Show first 200 chars of content
          if (textOnly.length > 0) {
            console.log(`   Preview: "${textOnly.substring(0, 150)}..."`);
          } else {
            console.log(`   ⚠️  POST APPEARS TO BE EMPTY`);
          }
        }

        console.log('');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
