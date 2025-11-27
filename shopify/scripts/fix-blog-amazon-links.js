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

// Convert plain Amazon URLs to clickable links
function fixAmazonLinks(html) {
  // Pattern to find Amazon URLs that are NOT already inside href=""
  // This matches URLs that are plain text (not inside an anchor tag)

  let updated = html;
  let fixCount = 0;

  // Find all Amazon URLs (including amzn.to)
  const amazonPatterns = [
    // Plain amazon.com URLs not in href
    /(?<!href=["'])(?<!href=["'][^"']*)(https?:\/\/(?:www\.)?amazon\.com\/[^\s<>"']+)/gi,
    // Plain amzn.to URLs not in href
    /(?<!href=["'])(?<!href=["'][^"']*)(https?:\/\/amzn\.to\/[^\s<>"']+)/gi
  ];

  for (const pattern of amazonPatterns) {
    updated = updated.replace(pattern, (match, url) => {
      // Skip if already in an anchor tag (check surrounding context)
      // Clean up the URL
      let cleanUrl = url.replace(/&amp;/g, '&').replace(/\)$/, '');

      // Add affiliate tag if not present
      if (!cleanUrl.includes('tag=')) {
        cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + `tag=${AFFILIATE_TAG}`;
      }

      fixCount++;
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">Shop on Amazon</a>`;
    });
  }

  return { html: updated, fixes: fixCount };
}

// Also fix URLs that might have broken formatting like "https://www.amazon.com)?tag=..."
function fixMalformedUrls(html) {
  let updated = html;

  // Fix URLs with ) before ?
  updated = updated.replace(/amazon\.com\)\?tag=/g, 'amazon.com?tag=');

  // Fix double tags
  updated = updated.replace(/tag=spinshoespe0a-20&amp;tag=shelzysdesigns-20/g, `tag=${AFFILIATE_TAG}`);
  updated = updated.replace(/tag=spinshoespe0a-20&tag=shelzysdesigns-20/g, `tag=${AFFILIATE_TAG}`);

  return updated;
}

async function main() {
  console.log('================================================================');
  console.log('  FIXING BLOG POST AMAZON LINKS');
  console.log('================================================================\n');

  try {
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    let totalFixed = 0;

    for (const blog of blogs) {
      console.log(`--- Blog: ${blog.title} ---\n`);

      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const originalHtml = article.body_html || '';

        // Check if this post has plain-text Amazon URLs
        const hasPlainAmazonUrls = /(?<!href=["'])(https?:\/\/(?:www\.)?amazon\.com\/[^\s<>"']+)/i.test(originalHtml) ||
                                    /(?<!href=["'])(https?:\/\/amzn\.to\/[^\s<>"']+)/i.test(originalHtml);

        // Check for malformed URLs
        const hasMalformedUrls = originalHtml.includes('amazon.com)?tag=') ||
                                  originalHtml.includes('tag=spinshoespe0a-20');

        if (hasPlainAmazonUrls || hasMalformedUrls) {
          console.log(`📝 "${article.title}"`);

          let updatedHtml = originalHtml;

          // First fix malformed URLs
          updatedHtml = fixMalformedUrls(updatedHtml);

          // Then convert plain URLs to links
          const { html: finalHtml, fixes } = fixAmazonLinks(updatedHtml);

          if (finalHtml !== originalHtml) {
            await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
              article: {
                id: article.id,
                body_html: finalHtml
              }
            });

            console.log(`   ✓ Fixed ${fixes} link(s)`);
            totalFixed += fixes;
          } else {
            console.log(`   • No changes needed`);
          }
        }
      }
    }

    console.log('\n================================================================');
    console.log('  LINK FIXES COMPLETE');
    console.log('================================================================');
    console.log(`\n✓ Fixed ${totalFixed} Amazon link(s)`);
    console.log('\nAll Amazon URLs should now be clickable with your affiliate tag.');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
