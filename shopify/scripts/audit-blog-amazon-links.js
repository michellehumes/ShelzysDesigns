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
  return [...new Set(links)]; // Remove duplicates
}

function hasAffiliateTag(url, tag) {
  return url.includes(`tag=${tag}`) || url.includes(`&tag=${tag}`);
}

function addAffiliateTag(url, tag) {
  // Remove existing tag if present
  let cleanUrl = url.replace(/[?&]tag=[^&]*/g, '');

  // Add new tag
  if (cleanUrl.includes('?')) {
    return cleanUrl + `&tag=${tag}`;
  } else {
    return cleanUrl + `?tag=${tag}`;
  }
}

async function main() {
  console.log('================================================================');
  console.log('  BLOG AMAZON AFFILIATE LINK AUDIT');
  console.log('================================================================\n');

  try {
    // Get all blogs
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    console.log(`Found ${blogs.length} blog(s)\n`);

    const articlesToUpdate = [];
    const allIssues = [];

    for (const blog of blogs) {
      console.log(`\n--- Blog: ${blog.title} (ID: ${blog.id}) ---\n`);

      // Get all articles for this blog
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      console.log(`Found ${articles.length} article(s)\n`);

      for (const article of articles) {
        const amazonLinks = findAmazonLinks(article.body_html || '');

        if (amazonLinks.length > 0) {
          console.log(`📝 "${article.title}"`);
          console.log(`   URL: /blogs/${blog.handle}/${article.handle}`);
          console.log(`   Amazon links found: ${amazonLinks.length}`);

          const linksNeedingUpdate = [];
          const linksOk = [];

          for (const link of amazonLinks) {
            if (hasAffiliateTag(link, AFFILIATE_TAG)) {
              linksOk.push(link);
            } else {
              linksNeedingUpdate.push({
                original: link,
                fixed: addAffiliateTag(link, AFFILIATE_TAG)
              });
            }
          }

          if (linksOk.length > 0) {
            console.log(`   ✓ ${linksOk.length} link(s) already have affiliate tag`);
          }

          if (linksNeedingUpdate.length > 0) {
            console.log(`   ⚠ ${linksNeedingUpdate.length} link(s) NEED affiliate tag:`);
            for (const { original, fixed } of linksNeedingUpdate) {
              console.log(`     - ${original.substring(0, 60)}...`);
            }

            articlesToUpdate.push({
              blogId: blog.id,
              articleId: article.id,
              title: article.title,
              body: article.body_html,
              linksToFix: linksNeedingUpdate
            });

            allIssues.push({
              article: article.title,
              url: `/blogs/${blog.handle}/${article.handle}`,
              linksNeedingFix: linksNeedingUpdate.length
            });
          }

          console.log('');
        }
      }
    }

    // Summary
    console.log('\n================================================================');
    console.log('  AUDIT SUMMARY');
    console.log('================================================================\n');

    if (allIssues.length === 0) {
      console.log('✅ All Amazon links already have the affiliate tag!');
    } else {
      console.log(`⚠ Found ${allIssues.length} article(s) with Amazon links needing affiliate tags:\n`);
      for (const issue of allIssues) {
        console.log(`  • "${issue.article}" - ${issue.linksNeedingFix} link(s)`);
      }

      console.log('\n--- Fixing Links ---\n');

      // Fix the links
      for (const item of articlesToUpdate) {
        let updatedBody = item.body;

        for (const { original, fixed } of item.linksToFix) {
          // Escape special regex characters in the URL
          const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          updatedBody = updatedBody.replace(new RegExp(escapedOriginal, 'g'), fixed);
        }

        // Update the article
        await shopifyRequest('PUT', `/blogs/${item.blogId}/articles/${item.articleId}.json`, {
          article: {
            id: item.articleId,
            body_html: updatedBody
          }
        });

        console.log(`✓ Updated: "${item.title}"`);
      }

      console.log('\n✅ All Amazon links now have affiliate tag: ' + AFFILIATE_TAG);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
