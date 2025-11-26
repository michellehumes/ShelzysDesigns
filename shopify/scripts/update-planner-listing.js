#!/usr/bin/env node

/**
 * Update Digital Wedding Planner product with detailed description
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const PRODUCT_ID = process.argv[2] || '14959351693680';

if (!ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

const API_VERSION = '2024-01';

const updatedDescription = `
<div class="wedding-planner-listing">

<style>
.wedding-planner-listing {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  line-height: 1.7;
}
.wedding-planner-listing h2 {
  font-size: 24px;
  color: #d4a574;
  margin: 30px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0e6dc;
}
.wedding-planner-listing h3 {
  font-size: 18px;
  color: #2d2d2d;
  margin: 20px 0 10px;
}
.wedding-planner-listing ul {
  margin: 15px 0 15px 20px;
}
.wedding-planner-listing li {
  margin-bottom: 8px;
}
.highlight-box {
  background: #fdf8f5;
  border-left: 4px solid #d4a574;
  padding: 20px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 20px 0;
}
.feature-item {
  background: #fff;
  border: 1px solid #e8e0d8;
  padding: 15px;
  border-radius: 8px;
}
.feature-item strong {
  color: #d4a574;
  display: block;
  margin-bottom: 5px;
}
.steps-list {
  counter-reset: steps;
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}
.steps-list li {
  counter-increment: steps;
  padding-left: 45px;
  position: relative;
  margin-bottom: 15px;
}
.steps-list li:before {
  content: counter(steps);
  position: absolute;
  left: 0;
  width: 30px;
  height: 30px;
  background: #d4a574;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.guarantee-box {
  background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  margin: 30px 0;
}
.guarantee-box h3 {
  color: white;
  margin-top: 0;
}
@media (max-width: 600px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<p style="font-size: 18px; color: #666;">Plan your dream wedding stress-free with our comprehensive 34+ page digital planner. Everything you need from "Yes!" to "I Do!" - beautifully designed and instantly downloadable.</p>

<div class="highlight-box">
  <strong style="font-size: 16px;">✨ INSTANT DOWNLOAD</strong><br>
  Receive your planner immediately after purchase. Start planning today!
</div>

<h2>📋 What's Included (34+ Pages)</h2>

<h3>Planning Checklists</h3>
<ul>
  <li><strong>12-Month Timeline</strong> - Complete countdown with checkboxes</li>
  <li><strong>9-Month Checklist</strong> - Vendor booking & save-the-dates</li>
  <li><strong>6-Month Checklist</strong> - Menu tastings & fittings</li>
  <li><strong>4-Month Checklist</strong> - Invitations & honeymoon planning</li>
  <li><strong>3-Month Checklist</strong> - Finalize details & order rings</li>
  <li><strong>2-Month Checklist</strong> - RSVPs & marriage license</li>
  <li><strong>1-Month Checklist</strong> - Final fittings & vendor confirmations</li>
  <li><strong>2-Week Checklist</strong> - Emergency kit & final prep</li>
  <li><strong>Final Week Checklist</strong> - Last-minute details</li>
  <li><strong>Day-Of Checklist</strong> - Your wedding day guide</li>
</ul>

<h3>Budget & Finance Trackers</h3>
<ul>
  <li><strong>Master Wedding Budget</strong> - Track all expenses by category</li>
  <li><strong>Vendor Payments Dashboard</strong> - Monitor deposits & balances</li>
  <li><strong>Deposit Calendar</strong> - Never miss a payment deadline</li>
  <li><strong>Expense Log</strong> - Record every purchase</li>
  <li><strong>Gift Tracking Page</strong> - Track gifts & thank you notes</li>
</ul>

<h3>Guest Management</h3>
<ul>
  <li><strong>Guest List Master</strong> - Names, addresses, RSVPs, meal choices</li>
  <li><strong>Save-the-Date Tracker</strong> - Track who's been notified</li>
  <li><strong>Invitation Tracker</strong> - Monitor sends & responses</li>
  <li><strong>RSVP Master</strong> - Meal preferences & special requirements</li>
  <li><strong>Seating Chart Planner</strong> - Visual table layout templates</li>
  <li><strong>Hotel Room Block Tracker</strong> - Guest accommodations</li>
</ul>

<h3>Vendor Management</h3>
<ul>
  <li><strong>Vendor Contacts Sheet</strong> - All vendor info in one place</li>
  <li><strong>Venue Comparison Sheet</strong> - Compare venues side-by-side</li>
  <li><strong>Photographer Comparison</strong> - Evaluate photo packages</li>
  <li><strong>Florist Comparison</strong> - Compare floral quotes</li>
  <li><strong>Catering Comparison</strong> - Menu & pricing comparison</li>
  <li><strong>Entertainment Comparison</strong> - DJ/band evaluation</li>
  <li><strong>Contracts & Invoices Log</strong> - Track all agreements</li>
  <li><strong>Vendor Gratuity Checklist</strong> - Suggested tips guide</li>
</ul>

<h3>Ceremony & Reception</h3>
<ul>
  <li><strong>Ceremony Timeline</strong> - Minute-by-minute schedule</li>
  <li><strong>Processional Order</strong> - Who walks when</li>
  <li><strong>Recessional Order</strong> - Exit order guide</li>
  <li><strong>Ceremony Music Planner</strong> - Song selections</li>
  <li><strong>Vows Worksheet</strong> - Write your personal vows</li>
  <li><strong>Reception Timeline</strong> - Full reception schedule</li>
  <li><strong>Music Playlist</strong> - Must-play & do-not-play lists</li>
</ul>

<h3>Style & Design</h3>
<ul>
  <li><strong>Color Palette Worksheet</strong> - Plan your colors</li>
  <li><strong>Inspiration Board</strong> - Collect your vision</li>
  <li><strong>3 Mood Board Templates</strong> - Visual planning pages</li>
  <li><strong>Décor Planning Sheet</strong> - Centerpieces & details</li>
</ul>

<h3>Day-Of Essentials</h3>
<ul>
  <li><strong>Wedding Weekend Overview</strong> - Full weekend schedule</li>
  <li><strong>Beauty Schedule</strong> - Hair & makeup timeline</li>
  <li><strong>Bridal Packing Checklist</strong> - Don't forget anything</li>
  <li><strong>Emergency Kit Checklist</strong> - Be prepared for anything</li>
  <li><strong>Honeymoon Packing List</strong> - Travel essentials</li>
</ul>

<h3>Plus:</h3>
<ul>
  <li>Bridal Party Contact Page</li>
  <li>Master Contacts Sheet</li>
  <li>Multiple Notes Pages</li>
  <li>Beautiful cover page</li>
</ul>

<h2>🎀 Features</h2>

<div class="feature-grid">
  <div class="feature-item">
    <strong>Instant Download</strong>
    Start planning immediately after purchase
  </div>
  <div class="feature-item">
    <strong>Print at Home</strong>
    Use your own printer or local print shop
  </div>
  <div class="feature-item">
    <strong>Digital Friendly</strong>
    Use on iPad, tablet, or computer
  </div>
  <div class="feature-item">
    <strong>Beautifully Designed</strong>
    Elegant aesthetic matches your style
  </div>
</div>

<h2>📱 How to Use Your Planner</h2>

<ul class="steps-list">
  <li><strong>Download Your File</strong><br>After purchase, you'll receive an email with your download link. Click to download the PDF file to your device.</li>
  <li><strong>Choose Your Method</strong><br><strong>Print it:</strong> Print at home or at a local print shop. We recommend cardstock for the cover!<br><strong>Use digitally:</strong> Open in any PDF reader, GoodNotes, Notability, or similar app.</li>
  <li><strong>Start Planning</strong><br>Begin with the 12-month timeline and work your way through. Check off tasks as you complete them!</li>
  <li><strong>Stay Organized</strong><br>Keep all your wedding info in one place. No more scattered notes or forgotten details.</li>
</ul>

<h2>💕 Perfect For</h2>
<ul>
  <li>Newly engaged couples</li>
  <li>DIY brides planning their own wedding</li>
  <li>Organized planners who love checklists</li>
  <li>Budget-conscious couples</li>
  <li>Anyone who wants stress-free wedding planning</li>
</ul>

<div class="guarantee-box">
  <h3>💯 Satisfaction Guaranteed</h3>
  <p>Love your planner or contact us for a full refund. We want your planning experience to be perfect!</p>
</div>

<h2>❓ FAQ</h2>

<p><strong>Is this a physical product?</strong><br>
No, this is a digital download (PDF file). No physical item will be shipped.</p>

<p><strong>When will I receive my planner?</strong><br>
Instantly! You'll receive a download link immediately after purchase.</p>

<p><strong>Can I print this at home?</strong><br>
Yes! The planner is designed to print on standard 8.5" x 11" paper.</p>

<p><strong>Can I use this on my iPad/tablet?</strong><br>
Absolutely! Open the PDF in any annotation app like GoodNotes, Notability, or Adobe Acrobat.</p>

<p><strong>Can I edit the planner?</strong><br>
The PDF is fillable for typing, or you can print and write by hand.</p>

<p style="text-align: center; margin-top: 30px; color: #666; font-style: italic;">
  Questions? Contact us at hello@shelzysdesigns.com
</p>

</div>
`;

async function updateProduct() {
  console.log('Updating product description...');
  console.log('Product ID: ' + PRODUCT_ID);

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      product: {
        id: PRODUCT_ID,
        body_html: updatedDescription
      }
    });

    const options = {
      hostname: STORE_URL,
      port: 443,
      path: '/admin/api/' + API_VERSION + '/products/' + PRODUCT_ID + '.json',
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('[OK] Product description updated!');
          console.log('');
          console.log('View: https://shelzysdesigns.com/products/modern-wedding-planner-kit-digital-download-1');
          resolve();
        } else {
          console.log('[FAIL] Status: ' + res.statusCode);
          console.log(body);
          reject(new Error('Update failed'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

updateProduct().catch(console.error);
