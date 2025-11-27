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

// Product-specific Amazon search links
const amazonProductLinks = {
  'spa robe': `https://www.amazon.com/s?k=luxury+spa+robe+women&tag=${AFFILIATE_TAG}`,
  'silk sleep mask': `https://www.amazon.com/s?k=silk+sleep+mask&tag=${AFFILIATE_TAG}`,
  'silk eye mask': `https://www.amazon.com/s?k=silk+eye+mask&tag=${AFFILIATE_TAG}`,
  'power bank': `https://www.amazon.com/s?k=wireless+charging+power+bank&tag=${AFFILIATE_TAG}`,
  'travel hairdryer': `https://www.amazon.com/s?k=travel+hair+dryer&tag=${AFFILIATE_TAG}`,
  'travel hair dryer': `https://www.amazon.com/s?k=travel+hair+dryer&tag=${AFFILIATE_TAG}`,
  'sashes and veils': `https://www.amazon.com/s?k=bachelorette+sash+veil&tag=${AFFILIATE_TAG}`,
  'tiara': `https://www.amazon.com/s?k=bachelorette+tiara+rhinestone&tag=${AFFILIATE_TAG}`,
  'cricut': `https://www.amazon.com/s?k=cricut+machine&tag=${AFFILIATE_TAG}`,
  'cricut machine': `https://www.amazon.com/s?k=cricut+machine&tag=${AFFILIATE_TAG}`,
};

// Shelzy's product links
const shelzyLinks = {
  'bachelorette box': '/collections/bachelorette-water-bottles',
  'bachelorette celebration box': '/collections/bachelorette-water-bottles',
  'personalized water bottle': '/collections/all',
  'custom water bottle': '/collections/all',
  'shelzy\'s designs': '/',
  'order from shelzy': '/collections/all',
};

function fixBlogPost(html, title) {
  let updated = html;
  let changes = [];

  // 1. Convert plain Amazon URLs to clickable links
  // Match: https://www.amazon.com?tag=... followed by text
  updated = updated.replace(
    /https:\/\/www\.amazon\.com\?tag=shelzysdesigns-20\s*\(affiliate link\)/gi,
    `<a href="https://www.amazon.com/s?k=best+sellers&tag=${AFFILIATE_TAG}" target="_blank" rel="noopener">Shop on Amazon</a>`
  );

  updated = updated.replace(
    /https:\/\/www\.amazon\.com\?tag=shelzysdesigns-20\s+has excellent options\./gi,
    `<a href="https://www.amazon.com/s?k=best+sellers&tag=${AFFILIATE_TAG}" target="_blank" rel="noopener">Shop on Amazon</a>.`
  );

  updated = updated.replace(
    /https:\/\/www\.cricut\.com\s*\(affiliate link\)/gi,
    `<a href="https://www.amazon.com/s?k=cricut+machine&tag=${AFFILIATE_TAG}" target="_blank" rel="noopener">Shop Cricut on Amazon</a>`
  );

  // 2. Add links to specific product mentions
  // Luxury Spa Robe
  if (updated.includes('Luxury Spa Robe') && !updated.includes('href=')) {
    updated = updated.replace(
      /Luxury Spa Robe(?!\s*<\/a>)/gi,
      `<a href="${amazonProductLinks['spa robe']}" target="_blank" rel="noopener">Luxury Spa Robe</a>`
    );
    changes.push('spa robe');
  }

  // Silk Sleep Mask
  if (updated.includes('Silk Sleep Mask') && !updated.includes('silk sleep mask</a>')) {
    updated = updated.replace(
      /(?:High-Quality\s+)?Silk Sleep Mask(?!\s*<\/a>)/gi,
      `<a href="${amazonProductLinks['silk sleep mask']}" target="_blank" rel="noopener">Silk Sleep Mask</a>`
    );
    changes.push('sleep mask');
  }

  // 3. Add links to Shelzy's product mentions
  // "Order from Shelzy's Designs" or similar
  updated = updated.replace(
    /Order from Shelzy['']s Designs\.?/gi,
    `<a href="/collections/all">Shop at Shelzy's Designs</a>.`
  );

  // "Shelzy's Designs Bachelorette Box"
  updated = updated.replace(
    /Shelzy['']s Designs Bachelorette (?:Box|Celebration Box)/gi,
    `<a href="/collections/bachelorette-water-bottles">Shelzy's Designs Bachelorette Collection</a>`
  );

  // "Featured from Shelzy's Designs"
  updated = updated.replace(
    /Featured from Shelzy['']s Designs,\s*our custom water bottles/gi,
    `From <a href="/collections/all">Shelzy's Designs</a>, our custom water bottles`
  );

  // "Shelzy's Designs Custom Templates"
  updated = updated.replace(
    /Shelzy['']s Designs Custom Templates/gi,
    `<a href="/pages/fonts-colors">Shelzy's Designs Custom Templates</a>`
  );

  // Count changes
  if (updated !== html) {
    const linkCount = (updated.match(/<a\s+href/gi) || []).length - (html.match(/<a\s+href/gi) || []).length;
    return { html: updated, linkCount };
  }

  return { html: updated, linkCount: 0 };
}

async function main() {
  console.log('================================================================');
  console.log('  FIXING ALL BLOG LINKS (Amazon + Shelzy\'s)');
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

        // Check if post needs fixing
        const hasPlainAmazonUrl = /https:\/\/www\.amazon\.com\?tag=/.test(originalHtml);
        const hasPlainCricutUrl = /https:\/\/www\.cricut\.com/.test(originalHtml);
        const hasShelzyMention = /shelzy['']s designs/i.test(originalHtml);
        const hasNoLinks = !/<a\s+href/i.test(originalHtml);

        if ((hasPlainAmazonUrl || hasPlainCricutUrl || (hasShelzyMention && hasNoLinks))) {
          console.log(`📝 "${article.title}"`);

          const { html: updatedHtml, linkCount } = fixBlogPost(originalHtml, article.title);

          if (updatedHtml !== originalHtml) {
            await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
              article: {
                id: article.id,
                body_html: updatedHtml
              }
            });

            console.log(`   ✓ Added ${linkCount} clickable link(s)`);
            totalFixed += linkCount;
          } else {
            console.log(`   • No changes needed`);
          }
        }
      }
    }

    console.log('\n================================================================');
    console.log('  LINK FIXES COMPLETE');
    console.log('================================================================');
    console.log(`\n✓ Added ${totalFixed} clickable link(s)`);
    console.log('\nAmazon links → Product search pages with affiliate tag');
    console.log('Shelzy\'s mentions → Your store collections/pages');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
