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

// Normalize title for comparison (lowercase, remove extra spaces, common variations)
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Normalize spaces
    .replace(/\d{4}/g, '')   // Remove years
    .replace(/guide/gi, '')
    .replace(/essentials/gi, 'essential')
    .replace(/must haves/gi, 'musthave')
    .replace(/musthaves/gi, 'musthave')
    .replace(/finds/gi, 'find')
    .trim();
}

// Check if two titles are similar enough to be duplicates
function areSimilar(title1, title2) {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // Check if one contains the other (for slight variations)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // Calculate similarity (simple word overlap)
  const words1 = norm1.split(' ').filter(w => w.length > 3);
  const words2 = norm2.split(' ').filter(w => w.length > 3);

  const commonWords = words1.filter(w => words2.includes(w));
  const similarity = commonWords.length / Math.min(words1.length, words2.length);

  return similarity > 0.7; // 70% word overlap = duplicate
}

async function main() {
  console.log('================================================================');
  console.log('  REMOVING DUPLICATE BLOG POSTS');
  console.log('================================================================\n');

  try {
    // Get all blogs
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    let totalDeleted = 0;

    for (const blog of blogs) {
      console.log(`--- Blog: ${blog.title} ---\n`);

      // Get all articles for this blog
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      console.log(`Found ${articles.length} article(s)\n`);

      // Group similar articles
      const groups = [];
      const processed = new Set();

      for (let i = 0; i < articles.length; i++) {
        if (processed.has(articles[i].id)) continue;

        const group = [articles[i]];
        processed.add(articles[i].id);

        for (let j = i + 1; j < articles.length; j++) {
          if (processed.has(articles[j].id)) continue;

          if (areSimilar(articles[i].title, articles[j].title)) {
            group.push(articles[j]);
            processed.add(articles[j].id);
          }
        }

        if (group.length > 1) {
          groups.push(group);
        }
      }

      // Process duplicate groups
      for (const group of groups) {
        console.log(`📋 Found ${group.length} similar posts:`);
        group.forEach((article, idx) => {
          console.log(`   ${idx + 1}. "${article.title}" (ID: ${article.id})`);
          console.log(`      Created: ${article.created_at}`);
        });

        // Keep the most recent one (or the one with longest content)
        const sorted = group.sort((a, b) => {
          // Prefer longer content
          const lenA = (a.body_html || '').length;
          const lenB = (b.body_html || '').length;
          if (lenA !== lenB) return lenB - lenA;
          // If same length, prefer newer
          return new Date(b.created_at) - new Date(a.created_at);
        });

        const keep = sorted[0];
        const toDelete = sorted.slice(1);

        console.log(`   ✓ Keeping: "${keep.title}"`);

        for (const article of toDelete) {
          console.log(`   🗑️  Deleting: "${article.title}"`);
          await shopifyRequest('DELETE', `/blogs/${blog.id}/articles/${article.id}.json`);
          totalDeleted++;
        }
        console.log('');
      }
    }

    console.log('================================================================');
    console.log('  CLEANUP COMPLETE');
    console.log('================================================================');
    console.log(`\n🗑️  Deleted ${totalDeleted} duplicate post(s)`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
