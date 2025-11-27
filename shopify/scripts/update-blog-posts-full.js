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

// Post 1: Luxurious Bridesmaid Robes
const post1Html = `<p>Picture this: It is your wedding morning and your bridesmaids are getting ready alongside you, sipping champagne in matching luxurious robes. Those getting-ready photos will be treasured forever, and the right bridesmaid robes make all the difference. Here is everything you need to know about choosing the perfect robes for your bridal party.</p>

<h2>Why Bridesmaid Robes Are Essential</h2>
<p>Bridesmaid robes serve multiple purposes on your wedding day. They are practical (they protect hair and makeup while everyone is getting dressed), photogenic (they create those dreamy getting-ready shots), and meaningful (they double as a thoughtful gift your bridesmaids will actually use). The right robes set the tone for a relaxed, luxurious morning.</p>

<h2>Top Bridesmaid Robe Picks</h2>

<h3>1. Silky Satin Bridesmaid Robes with Lace Trim (Amazon)</h3>
<p>Silky satin robes with lace trim are a classic for a reason. They are available in soft shades like blush pink, champagne and white, and the lace details photograph beautifully. Look for styles that have great reviews and plenty of color options so you can match your wedding palette.</p>
<p>
  <a href="https://www.amazon.com/s?k=silky+satin+bridesmaid+robes+lace+trim&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop silky satin bridesmaid robes on Amazon (affiliate link)
  </a>
</p>

<h3>2. Personalized Water Bottles from Shelzy's Designs</h3>
<p>Pair your bridesmaid robes with a gift that your bridal party will use long after the wedding. Our
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    personalized water bottles from Shelzy's Designs
  </a>
  are a perfect match for wedding morning photos and the rest of the weekend. Each bottle can be customized with your bridesmaid's name, title or a short phrase so it feels like a true keepsake.
</p>

<h2>Choosing the Right Color Palette</h2>
<p>Match your robes to your wedding colors for cohesive getting-ready photos:</p>
<ul>
  <li><strong>Classic White:</strong> Timeless and elegant for any wedding style.</li>
  <li><strong>Blush Pink:</strong> Romantic and soft, perfect for feminine celebrations.</li>
  <li><strong>Champagne Gold:</strong> Luxe and polished for formal weddings.</li>
  <li><strong>Mixed Pastels:</strong> Each bridesmaid in a different soft shade for a playful but coordinated look.</li>
</ul>

<h2>What to Look for in Quality Bridesmaid Robes</h2>
<ul>
  <li><strong>Fabric:</strong> Satin or silk for that luxe look and feel.</li>
  <li><strong>Length:</strong> Knee-length or mid-thigh tends to photograph best.</li>
  <li><strong>Lace Details:</strong> A pretty lace sleeve or hem adds a feminine touch.</li>
  <li><strong>Comfort:</strong> Your bridesmaids will wear them for several hours.</li>
  <li><strong>Care:</strong> Check if the robes are machine-washable or require gentle care.</li>
</ul>

<h2>Personalization Options</h2>
<p>Consider adding names, initials or titles like "Bridesmaid" or "Maid of Honor" to make each robe feel special. Many Amazon sellers offer embroidery or printed personalization right on the robe. Pair personalized robes with our
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    Shelzy's Designs bridesmaid water bottles
  </a>
  for a coordinated set that looks amazing in photos.
</p>

<h2>Timing Your Bridesmaid Robe Gift</h2>
<p>You can gift robes at your bridesmaid proposals, at the bachelorette party or on the morning of your wedding. Many brides include them in custom gift boxes alongside items like jewelry, eye masks, and a
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    personalized water bottle
  </a>.
</p>

<h2>Budget-Friendly Tips</h2>
<ul>
  <li>Shop Amazon for affordable robe sets under $20 each.</li>
  <li>Buy during Black Friday, Prime Day or seasonal sales.</li>
  <li>Order sets for larger bridal parties to unlock better pricing.</li>
  <li>Choose one beautiful robe style and skip extra add-ons if you are on a tight budget.</li>
</ul>
<p>
  <a href="https://www.amazon.com/s?k=bridesmaid+silk+robes&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Browse more bridesmaid robes on Amazon (affiliate link)
  </a>
</p>

<h2>Creating Picture-Perfect Getting-Ready Moments</h2>
<p>When it is time for photos, style your getting-ready room with:</p>
<ul>
  <li>Matching champagne flutes or
    <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
      personalized water bottles
    </a>
  </li>
  <li>Fresh flowers or your bouquets displayed nearby.</li>
  <li>Natural window light if possible.</li>
  <li>Coordinated hair and makeup stations for a clean visual.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Bridesmaid robes turn your wedding morning into a relaxed and luxurious experience. A silky robe with lace trim looks beautiful in photos and feels just as good to wear. When you pair those robes with
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    personalized water bottles from Shelzy's Designs
  </a>, you create a coordinated bridesmaid gift that your bridal party will use long after the last toast.</p>
<p>
  <a href="https://www.amazon.com/s?k=silky+satin+bridesmaid+robes+lace+trim&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop bridesmaid robes on Amazon (affiliate link)
  </a>
</p>`;

// Post 2: Travel Jewelry Organizers
const post2Html = `<p>Traveling for your destination wedding or honeymoon should feel exciting, not stressful. Keeping your jewelry organized, tangle free and secure is a big part of that. In this guide, we are sharing the best travel jewelry organizers that combine style, function and affordability, plus one must-have from Shelzy's Designs that completes your carry-on packing list.</p>

<h2>Why You Need a Travel Jewelry Organizer</h2>
<p>Nothing ruins a trip faster than tangled necklaces, missing earrings or a damaged bracelet. A good travel jewelry organizer keeps every piece in its own place so you can get ready quickly and protect your favorites. Whether you are jetting off for your destination wedding or heading out on your honeymoon, the right organizer helps your jewelry arrive just as polished as you are.</p>

<h2>Top Travel Jewelry Organizers</h2>

<h3>1. BAGSMART Travel Jewelry Organizer (Amazon)</h3>
<p>The
  <a href="https://www.amazon.com/BAGSMART-Jewellery-Organiser-Journey-Rings-Necklaces/dp/B07K2VBHNH?tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    BAGSMART Travel Jewelry Organizer in soft pink
  </a>
  is an Amazon favorite for a reason. It has dedicated zones for rings, necklaces, earrings and bracelets in a compact, foldable design that fits into almost any carry-on. The soft pink color photographs beautifully for wedding content and social media.
</p>
<p>
  <a href="https://www.amazon.com/BAGSMART-Jewellery-Organiser-Journey-Rings-Necklaces/dp/B07K2VBHNH?tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop the BAGSMART Travel Jewelry Organizer on Amazon (affiliate link)
  </a>
</p>

<h3>2. Personalized Water Bottles from Shelzy's Designs</h3>
<p>While you are planning your travel essentials, do not forget hydration. Our
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/customizable-stainless-steel-water-bottle-personalized" target="_blank">
    personalized stainless steel water bottles
  </a>
  are perfect for airport days, long flights and poolside afternoons. You can customize each bottle with your name or wedding date, which makes them ideal for brides, grooms and bridesmaids traveling to the celebration.
</p>

<h3>3. Compact Jewelry Roll (Amazon)</h3>
<p>If you are a minimalist packer, a slim jewelry roll is a great option. It protects your jewelry without taking up much suitcase space. Look for velvet-lined compartments that keep delicate pieces from rubbing or scratching.</p>
<p>
  <a href="https://www.amazon.com/s?k=compact+jewelry+roll&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop compact jewelry rolls on Amazon (affiliate link)
  </a>
</p>

<h3>4. Hard-Shell Jewelry Case (Amazon)</h3>
<p>For especially valuable pieces, a hard-shell jewelry case offers the most protection. These cases are crush resistant, often water resistant and are perfect if your destination wedding or honeymoon involves multiple stops or a lot of movement.</p>
<p>
  <a href="https://www.amazon.com/s?k=hard+shell+jewelry+case&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop hard-shell jewelry cases on Amazon (affiliate link)
  </a>
</p>

<h2>What to Look for in a Travel Jewelry Organizer</h2>
<ul>
  <li><strong>Size:</strong> Compact enough to fit in your personal item or carry-on.</li>
  <li><strong>Compartments:</strong> Separate sections for necklaces, rings, earrings and bracelets to prevent tangling.</li>
  <li><strong>Material:</strong> Soft, padded lining that will not scratch delicate pieces.</li>
  <li><strong>Closure:</strong> A secure zipper or snap closure so nothing slips out in transit.</li>
  <li><strong>Style:</strong> Colors and finishes that feel like you and match your travel aesthetic.</li>
</ul>

<h2>Packing Tips for Wedding Jewelry</h2>
<ol>
  <li>Always pack jewelry in your carry-on instead of checked bags.</li>
  <li>Take quick photos of each piece before traveling for insurance or peace of mind.</li>
  <li>Use individual mini pouches inside your case for very delicate items.</li>
  <li>Remove jewelry before swimming, spa treatments and workouts.</li>
  <li>Use the hotel safe for any fine jewelry when you are not wearing it.</li>
</ol>

<h2>Perfect for Destination Weddings</h2>
<p>If you are a bride planning a destination wedding, travel jewelry organizers make amazing gifts for your bridal party. You can even tuck a pair of earrings or a bracelet inside as part of their gift. The soft pink
  <a href="https://www.amazon.com/BAGSMART-Jewellery-Organiser-Journey-Rings-Necklaces/dp/B07K2VBHNH?tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    BAGSMART organizer
  </a>
  looks especially pretty in getting-ready photos.
</p>

<h2>Honeymoon Essentials</h2>
<p>Your honeymoon is the trip you will talk about for years. A travel jewelry case helps you pack statement pieces for dinners, plus simple studs and hoops for beach days, without worrying about tangles. Pair it with a
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/customizable-stainless-steel-water-bottle-personalized" target="_blank">
    Shelzy's Designs personalized bottle
  </a>
  so you always have water with you on flights, day trips and excursions.
</p>

<h2>Budget-Friendly Luxury</h2>
<p>The best part is that these organizers feel expensive but are surprisingly budget friendly. Many options on Amazon are under $25, including the
  <a href="https://www.amazon.com/BAGSMART-Jewellery-Organiser-Journey-Rings-Necklaces/dp/B07K2VBHNH?tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    BAGSMART Travel Jewelry Organizer
  </a>. You can comfortably buy one for yourself and extras as gifts for bridesmaids or family members traveling with you.</p>

<h2>Final Thoughts</h2>
<p>Whether you are planning a destination wedding, heading off on your honeymoon or just love to travel in style, the right jewelry organizer keeps your pieces safe and easy to access. Pair a pretty travel case from Amazon with a
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/customizable-stainless-steel-water-bottle-personalized" target="_blank">
    personalized Shelzy's Designs water bottle
  </a>
  and you will be set for travel days, wedding events and everything in between.</p>
<p>
  <a href="https://www.amazon.com/s?k=travel+jewelry+organizer+soft+pink&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop travel jewelry organizers on Amazon (affiliate link)
  </a>
</p>`;

// Post 3: Bridal Party Gifts Under $50
const post3Html = `<p>Planning a bridal party on a budget does not mean your gifts have to feel basic. With a little strategy, you can find thoughtful, elevated gifts under $50 that your bridesmaids will actually use and love. This guide mixes our favorite picks from Shelzy's Designs with carefully chosen Amazon finds that you can shop with a single click.</p>

<h2>Why Budget-Friendly Gifts Work</h2>
<p>Your bridesmaids are already investing a lot of time and money into your wedding. A meaningful gift in the $30–50 range can feel just as special as something more expensive if it is practical, personalized or a little bit luxe. The goal is to choose items that feel useful, beautiful and tailored to each person.</p>

<h2>Top Bridal Party Gifts Under $50</h2>

<h3>1. Personalized Water Bottles from Shelzy's Designs ($35–45)</h3>
<p>Our
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    personalized water bottles
  </a>
  are a perfect blend of practical and personal. Each bridesmaid gets her name or title on a premium stainless steel bottle that she can use long after the wedding weekend is over. You can match colors to your wedding palette and they look amazing in getting-ready and reception photos.</p>

<h3>2. Silk Pillowcase Set (Amazon)</h3>
<p>A silk pillowcase feels like a small luxury but makes a big difference for hair and skin. It helps reduce frizz and sleep creases and feels cool and smooth at night.</p>
<p>
  <a href="https://www.amazon.com/s?k=silk+pillowcase+set&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop silk pillowcase sets on Amazon (affiliate link)
  </a>
</p>

<h3>3. Luxury Candle (Amazon)</h3>
<p>A beautiful candle with a sophisticated scent always feels like a treat. Look for soy or coconut wax candles with minimalist packaging that your bridesmaids will want to display.</p>
<p>
  <a href="https://www.amazon.com/s?k=luxury+soy+candle&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop luxury candles on Amazon (affiliate link)
  </a>
</p>

<h3>4. Personalized Spa Robe (Amazon)</h3>
<p>A cozy spa robe is both practical and indulgent. Many Amazon sellers offer robes with monogram or name personalization that tie perfectly into a bridal party theme.</p>
<p>
  <a href="https://www.amazon.com/s?k=personalized+spa+robe&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop personalized spa robes on Amazon (affiliate link)
  </a>
</p>

<h3>5. Premium Hand Cream Gift Set (Amazon)</h3>
<p>Premium hand cream sets feel like a mini spa moment. They are a great add-on inside a bridesmaid gift box, especially for travel-heavy wedding weekends.</p>
<p>
  <a href="https://www.amazon.com/s?k=premium+hand+cream+gift+set&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop hand cream gift sets on Amazon (affiliate link)
  </a>
</p>

<h3>6. Silk Scrunchie Set (Amazon)</h3>
<p>Silk scrunchies are gentle on hair and look cute on a wrist. They are a small but thoughtful item to round out a gift box.</p>
<p>
  <a href="https://www.amazon.com/s?k=silk+scrunchie+set&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop silk scrunchie sets on Amazon (affiliate link)
  </a>
</p>

<h3>7. Personalized Coffee Mug (Amazon)</h3>
<p>A personalized mug with a fun bridesmaid message is something they can use every day and remember your wedding by.</p>
<p>
  <a href="https://www.amazon.com/s?k=personalized+coffee+mug+bridesmaid&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop personalized bridesmaid mugs on Amazon (affiliate link)
  </a>
</p>

<h3>8. Bath Bombs or Bath Salts (Amazon)</h3>
<p>Luxury bath products are perfect for bridesmaids who need a little relaxation before or after the big day. Look for sets with pretty packaging that fits your color story.</p>
<p>
  <a href="https://www.amazon.com/s?k=luxury+bath+bombs+set&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop bath bomb and bath salt sets on Amazon (affiliate link)
  </a>
</p>

<h3>9. Beaded Bracelet or Jewelry (Amazon)</h3>
<p>Delicate bracelets or small jewelry sets are easy to personalize to each bridesmaid's style. They are also light and easy to pack for destination weddings.</p>
<p>
  <a href="https://www.amazon.com/s?k=bridesmaid+bracelet+set&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop bridesmaid jewelry on Amazon (affiliate link)
  </a>
</p>

<h3>10. Personalized Tumbler (Amazon)</h3>
<p>If your bridal party loves iced coffee or mocktails, a personalized tumbler is a fun and functional gift. You can coordinate colors with your
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    Shelzy's Designs water bottles
  </a>
  for a cohesive look.</p>
<p>
  <a href="https://www.amazon.com/s?k=personalized+tumbler&tag=shelzysdesigns-20" target="_blank" rel="noopener noreferrer">
    Shop personalized tumblers on Amazon (affiliate link)
  </a>
</p>

<h2>Mixing Shelzy's Designs with Amazon Finds</h2>
<p>One of the best strategies is to pair one "hero" item from Shelzy's Designs with one or two smaller Amazon finds. For example:</p>
<ul>
  <li>
    <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
      Shelzy's Designs Personalized Water Bottle
    </a> ($35–45)
  </li>
  <li>Luxury candle from Amazon ($20–25)</li>
  <li>Silk scrunchie set from Amazon ($12–20)</li>
</ul>
<p>This creates a curated gift box that feels elevated and personal without pushing you far past the $50–80 range per person.</p>

<h2>Budget Shopping Tips</h2>
<ol>
  <li>Shop off season to find better prices and markdowns.</li>
  <li>Use Amazon Prime to save on shipping and speed up delivery.</li>
  <li>Buy in bulk whenever possible for better unit pricing.</li>
  <li>Look for gift sets that combine several items for a lower price per piece.</li>
  <li>Compare Amazon options to traditional retail to make sure you are getting the best value.</li>
</ol>

<h2>Personalization Matters Most</h2>
<p>Whether you choose a
  <a href="https://shelzysdesigns.com/collections/best-sellers/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift" target="_blank">
    Shelzy's Designs personalized bottle
  </a>
  or a custom mug from Amazon, personalization is what turns a simple item into a keepsake. Adding names, initials or inside jokes makes your bridesmaids feel seen and appreciated.</p>

<h2>Final Thoughts</h2>
<p>Thoughtful bridal party gifts do not require a huge budget. By mixing premium personalized pieces from Shelzy's Designs with well-chosen Amazon finds, you can create gift sets that feel luxurious and meaningful while still staying under $50 per item. Your bridesmaids will remember how cared for they felt, not the exact price tag.</p>
<p>Start building your gift sets now so you can relax and enjoy celebrating with your bridal party.</p>`;

// Post titles to match
const postUpdates = [
  {
    searchTitle: 'luxurious bridesmaid robes',
    newHtml: post1Html,
    name: 'Luxurious Bridesmaid Robes'
  },
  {
    searchTitle: 'travel jewelry organizers',
    newHtml: post2Html,
    name: 'Travel Jewelry Organizers'
  },
  {
    searchTitle: 'bridal party gifts under $50',
    newHtml: post3Html,
    name: 'Bridal Party Gifts Under $50'
  }
];

async function main() {
  console.log('================================================================');
  console.log('  UPDATING BLOG POSTS WITH NEW CONTENT');
  console.log('================================================================\n');

  try {
    const blogsResponse = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResponse.blogs || [];

    let updated = 0;

    for (const blog of blogs) {
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResponse.articles || [];

      for (const article of articles) {
        const titleLower = article.title.toLowerCase();

        for (const post of postUpdates) {
          if (titleLower.includes(post.searchTitle)) {
            console.log(`📝 Updating: "${article.title}"`);

            await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
              article: {
                id: article.id,
                body_html: post.newHtml
              }
            });

            console.log(`   ✓ Updated with new content`);
            console.log(`   ✓ Amazon links: tag=shelzysdesigns-20`);
            console.log(`   ✓ Internal links: shelzysdesigns.com products\n`);
            updated++;
          }
        }
      }
    }

    console.log('================================================================');
    console.log('  BLOG UPDATES COMPLETE');
    console.log('================================================================');
    console.log(`\n✓ Updated ${updated} blog post(s)`);

    console.log('\n📋 LINKS ADDED:');
    console.log('\n  Post 1 - Bridesmaid Robes:');
    console.log('    • Amazon: silky satin bridesmaid robes');
    console.log('    • Amazon: bridesmaid silk robes');
    console.log('    • Shelzy\'s: premium personalized water bottle');

    console.log('\n  Post 2 - Travel Jewelry:');
    console.log('    • Amazon: BAGSMART Travel Jewelry Organizer (specific product)');
    console.log('    • Amazon: compact jewelry roll');
    console.log('    • Amazon: hard shell jewelry case');
    console.log('    • Shelzy\'s: customizable stainless steel water bottle');

    console.log('\n  Post 3 - Bridal Gifts Under $50:');
    console.log('    • Amazon: silk pillowcase set');
    console.log('    • Amazon: luxury soy candle');
    console.log('    • Amazon: personalized spa robe');
    console.log('    • Amazon: premium hand cream gift set');
    console.log('    • Amazon: silk scrunchie set');
    console.log('    • Amazon: personalized coffee mug bridesmaid');
    console.log('    • Amazon: luxury bath bombs set');
    console.log('    • Amazon: bridesmaid bracelet set');
    console.log('    • Amazon: personalized tumbler');
    console.log('    • Shelzy\'s: premium personalized water bottle');

    console.log('\n✅ Check your blog posts at shelzysdesigns.com/blogs/news');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
