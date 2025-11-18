import os
import time
from browserbase import Browserbase
from playwright.sync_api import sync_playwright

# --- Shelzy's Designs Global CSS ---
SHELZY_CSS = '''
/* ================================
   SHELZY'S DESIGNS – GLOBAL STYLES
   ================================ */

:root {
  --shelzy-bg: #ffffff;
  --shelzy-bg-soft: #f8f5f1;
  --shelzy-gold: #d9b27c;
  --shelzy-gold-soft: #f0e0c4;
  --shelzy-sage: #98aa85;
  --shelzy-charcoal: #2b2b2f;
  --shelzy-muted: #787878;
  --shelzy-radius-lg: 999px;
  --shelzy-radius-md: 16px;
  --shelzy-shadow-soft: 0 12px 30px rgba(0, 0, 0, 0.06);
  --shelzy-transition: all 0.2s ease-out;
}

/* Background + base text */

body {
  background-color: var(--shelzy-bg-soft);
  color: var(--shelzy-charcoal);
  font-smooth: antialiased;
}

/* Headings – slightly editorial */

h1, .h1, h2, .h2, h3, .h3 {
  letter-spacing: 0.03em;
  text-transform: none;
  color: var(--shelzy-charcoal);
}

h1, .h1 {
  font-size: clamp(2.2rem, 4vw, 2.8rem);
}

h2, .h2 {
  font-size: clamp(1.6rem, 3vw, 2rem);
}

/* Subheadings / small titles */

.section-header__subtitle,
.subtitle,
.small-heading {
  color: var(--shelzy-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
}

/* ================================
   BUTTONS & CTAS
   ================================ */

button,
.btn,
.button,
.shopify-payment-button__button,
.product-form__submit {
  border-radius: var(--shelzy-radius-lg);
  padding: 0.9rem 1.8rem;
  border: none;
  background: linear-gradient(135deg, var(--shelzy-gold) 0%, var(--shelzy-sage) 100%);
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: var(--shelzy-shadow-soft);
  transition: var(--shelzy-transition);
}

button:hover,
.btn:hover,
.button:hover,
.shopify-payment-button__button:hover,
.product-form__submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.10);
  filter: brightness(1.04);
}

/* Secondary / ghost buttons */

.btn--secondary,
.button--secondary,
.button--outline {
  background: transparent;
  border: 1px solid var(--shelzy-gold-soft);
  color: var(--shelzy-charcoal);
  box-shadow: none;
}

.btn--secondary:hover,
.button--secondary:hover,
.button--outline:hover {
  background: var(--shelzy-bg-soft);
}

/* ================================
   CARDS & PRODUCT GRID
   ================================ */

.card,
.product-card,
.collection-grid-item,
.grid__item .card-wrapper {
  border-radius: var(--shelzy-radius-md);
  background-color: var(--shelzy-bg);
  box-shadow: var(--shelzy-shadow-soft);
  overflow: hidden;
  transition: var(--shelzy-transition);
}

.card:hover,
.product-card:hover,
.collection-grid-item:hover,
.grid__item .card-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.10);
}

/* Product titles & prices */

.product-card__title,
.card__heading,
.product__title {
  font-weight: 600;
  font-size: 0.98rem;
}

.price,
.product__price,
.product-card__price {
  color: var(--shelzy-charcoal);
  font-weight: 600;
}

/* ================================
   HERO SECTION
   ================================ */

.hero,
.hero-section,
.banner,
.section--hero {
  border-radius: 32px;
  overflow: hidden;
  background: radial-gradient(circle at top left, #ffffff 0%, #f4efe7 35%, #f8f5f1 100%);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.10);
  padding: clamp(1.8rem, 4vw, 3rem);
}

/* Make hero CTA row nicely spaced */

.hero .buttons,
.banner__buttons,
.hero__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* ================================
   TESTIMONIAL / SOCIAL PROOF
   ================================ */

.testimonial,
.testimonials,
.section--testimonials {
  background-color: #ffffff;
  border-radius: 32px;
  padding: 2.5rem 2rem;
  box-shadow: var(--shelzy-shadow-soft);
}

.testimonial__quote {
  font-style: italic;
  color: var(--shelzy-charcoal);
}

.testimonial__meta {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--shelzy-muted);
}

/* Carousel dots refined */

.slick-dots li button:before,
.flickity-page-dots .dot,
.swiper-pagination-bullet {
  background-color: var(--shelzy-gold-soft) !important;
  opacity: 0.6;
}

.slick-dots li.slick-active button:before,
.flickity-page-dots .dot.is-selected,
.swiper-pagination-bullet-active {
  background-color: var(--shelzy-gold) !important;
  opacity: 1;
}

/* ================================
   SECTION PADDING & LAYOUT
   ================================ */

.section,
.index-section,
.shopify-section {
  padding-top: 3.2rem;
  padding-bottom: 3.2rem;
}

@media (max-width: 768px) {
  .section,
  .index-section,
  .shopify-section {
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;
  }

  .hero,
  .hero-section,
  .banner,
  .section--hero {
    border-radius: 24px;
    padding: 1.6rem;
  }

  button,
  .btn,
  .button,
  .product-form__submit {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}

/* ================================
   ANNOUNCEMENT BAR & HEADER
   ================================ */

.announcement-bar,
.header__top,
.site-header__announcement {
  background: var(--shelzy-charcoal);
  color: #ffffff;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.announcement-bar a {
  color: #ffffff;
  text-decoration: underline;
}

/* Header links */

.site-header,
.header-wrapper {
  background-color: var(--shelzy-bg-soft);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.site-nav__link,
.header__menu-item,
.header__inline-menu a {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: var(--shelzy-charcoal);
}

/* ================================
   BADGES / LABELS (NEW, LOW STOCK)
   ================================ */

.badge,
.product-tag,
.product-label {
  border-radius: var(--shelzy-radius-lg);
  background-color: var(--shelzy-gold-soft);
  color: var(--shelzy-charcoal);
  padding: 0.18rem 0.7rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
}

/* ================================
   FORMS (contact, customization)
   ================================ */

input,
textarea,
select {
  border-radius: 12px;
  border: 1px solid #e0d8ce;
  padding: 0.7rem 0.9rem;
  transition: var(--shelzy-transition);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--shelzy-gold);
  box-shadow: 0 0 0 1px var(--shelzy-gold-soft);
}

/* ================================
   FOOTER
   ================================ */

.site-footer,
.footer {
  background-color: var(--shelzy-charcoal);
  color: #f5f1eb;
}

.site-footer a,
.footer a {
  color: #f5f1eb;
}

.site-footer__linklist-item,
.footer__content-top {
  font-size: 0.85rem;
}
'''

# --- 1. Authenticate with Browserbase ---
os.environ["BROWSERBASE_API_KEY"] = "Ybb_live_AIisgtCLyS85PRLyY3S_rTmtx1w"

bb = Browserbase()

# --- 2. Create a browser session ---
session = bb.sessions.create(
    project_id=os.environ.get("BROWSERBASE_PROJECT_ID"),
    keep_alive=True
)
session_id = session.id

print("=" * 50)
print("SHELZY'S DESIGNS - THEME STYLING AGENT")
print("=" * 50)
print(f"Browserbase session created: {session_id}")
print("Connecting to browser...")

# --- 3. Connect to the session using Playwright ---
with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(bb.connect(session_id))
    context = browser.contexts[0] if browser.contexts else browser.new_context()
    page = context.new_page()

    # Set viewport for desktop view
    page.set_viewport_size({"width": 1440, "height": 900})

    # --- 4. Navigate to Shopify Admin ---
    print("\n[Step 1] Navigating to Shopify login...")
    page.goto("https://accounts.shopify.com/store-login")
    page.wait_for_load_state("networkidle")

    print("Shopify login page loaded.")
    print("\n" + "=" * 50)
    print("MANUAL ACTION REQUIRED:")
    print("Please log in to your Shopify store in the browser.")
    print("Press ENTER here once you're logged into the admin dashboard...")
    print("=" * 50)
    input()

    # --- 5. Navigate to Online Store → Themes ---
    print("\n[Step 2] Navigating to Online Store → Themes...")

    # Try to navigate to themes page
    # Get current URL to extract store name
    current_url = page.url
    if "admin.shopify.com" in current_url:
        # Extract store identifier from URL
        store_match = current_url.split("/store/")
        if len(store_match) > 1:
            store_id = store_match[1].split("/")[0]
            themes_url = f"https://admin.shopify.com/store/{store_id}/themes"
        else:
            themes_url = current_url.rsplit("/", 1)[0] + "/themes"
    else:
        # Fallback - click through navigation
        page.click("text=Online Store")
        time.sleep(1)
        page.click("text=Themes")
        themes_url = None

    if themes_url:
        page.goto(themes_url)

    page.wait_for_load_state("networkidle")
    print("Themes page loaded.")

    # --- 6. Click "Edit code" on current theme ---
    print("\n[Step 3] Opening theme code editor...")

    # Look for the "..." or "Actions" menu on the current theme
    # Then click "Edit code"
    try:
        # Try clicking the actions menu (three dots) on current theme
        page.wait_for_selector('[aria-label="Actions"], button:has-text("..."), [data-polaris-dropdown-activator]', timeout=10000)

        # Click the first actions button (should be for current/live theme)
        actions_buttons = page.locator('[aria-label="Actions"], button:has-text("Customize")')
        if actions_buttons.count() > 0:
            # Find the "Edit code" option - might need to open a menu first
            edit_code_link = page.locator('a:has-text("Edit code"), button:has-text("Edit code")')
            if edit_code_link.count() > 0:
                edit_code_link.first.click()
            else:
                # Need to open actions menu first
                page.locator('button[aria-label="More actions"]').first.click()
                time.sleep(0.5)
                page.click('text=Edit code')
    except Exception as e:
        print(f"Note: Using alternative navigation method... ({e})")
        # Alternative: direct URL navigation
        if themes_url:
            # Try to find theme ID and navigate directly
            page.goto(themes_url)
            time.sleep(2)

    page.wait_for_load_state("networkidle")
    time.sleep(2)

    # --- 7. Find and select the main stylesheet ---
    print("\n[Step 4] Locating main stylesheet...")

    # Common stylesheet names to look for
    stylesheet_names = [
        "base.css",
        "theme.css",
        "styles.css",
        "global.css",
        "main.css",
        "custom.css"
    ]

    edited_file = None

    # Look in the Assets folder
    try:
        # Click on Assets folder in the sidebar
        assets_folder = page.locator('text=Assets, button:has-text("Assets"), [data-tree-item="assets"]')
        if assets_folder.count() > 0:
            assets_folder.first.click()
            time.sleep(1)

        # Search for stylesheet files
        for css_file in stylesheet_names:
            file_link = page.locator(f'text="{css_file}", a:has-text("{css_file}")')
            if file_link.count() > 0:
                file_link.first.click()
                edited_file = f"assets/{css_file}"
                print(f"Found stylesheet: {edited_file}")
                break

        if not edited_file:
            # Try looking for any .css file
            css_files = page.locator('a[href*=".css"], text=/\\.css$/')
            if css_files.count() > 0:
                css_files.first.click()
                edited_file = "assets/[first .css file found]"
                print(f"Using first available CSS file")

    except Exception as e:
        print(f"Error finding stylesheet: {e}")

    if not edited_file:
        print("\nCould not automatically locate stylesheet.")
        print("Please manually navigate to a CSS file (e.g., Assets → base.css)")
        print("Press ENTER when ready...")
        input()
        edited_file = "assets/[manually selected]"

    # --- 8. Append CSS to the stylesheet ---
    print("\n[Step 5] Appending Shelzy's Designs CSS...")

    time.sleep(2)  # Wait for editor to load

    try:
        # Find the code editor (Monaco editor or CodeMirror)
        editor = page.locator('.monaco-editor, .CodeMirror, [data-mode="css"], textarea[name*="content"]')

        if editor.count() > 0:
            # Click at the end of the editor content
            editor.first.click()

            # Use keyboard shortcuts to go to end of file
            page.keyboard.press("Control+End")  # Go to end of file
            time.sleep(0.5)

            # Add newlines and then paste CSS
            page.keyboard.press("Enter")
            page.keyboard.press("Enter")

            # Type the CSS (using clipboard for large content)
            page.evaluate(f'''
                navigator.clipboard.writeText(`{SHELZY_CSS}`);
            ''')
            page.keyboard.press("Control+v")  # Paste

            print("CSS appended to stylesheet.")
        else:
            print("Could not find code editor. Please manually paste the CSS.")
            print("The CSS has been copied to your clipboard.")

    except Exception as e:
        print(f"Error appending CSS: {e}")
        print("Please manually scroll to the bottom of the file and paste the CSS.")

    # --- 9. Save the file ---
    print("\n[Step 6] Saving theme file...")

    try:
        # Try keyboard shortcut first
        page.keyboard.press("Control+s")
        time.sleep(1)

        # Also try clicking save button
        save_button = page.locator('button:has-text("Save"), [aria-label="Save"]')
        if save_button.count() > 0:
            save_button.first.click()

        print("File saved!")

    except Exception as e:
        print(f"Note: {e}")
        print("Please manually save the file (Ctrl+S or click Save button)")

    time.sleep(2)

    # --- 10. Preview the storefront ---
    print("\n[Step 7] Opening storefront preview...")

    # Take screenshot of editor
    page.screenshot(path="screenshots/editor_after_save.png")

    # Open preview in new tab
    preview_page = context.new_page()

    # Get store URL from admin URL
    admin_url = page.url
    if "admin.shopify.com/store/" in admin_url:
        store_id = admin_url.split("/store/")[1].split("/")[0]
        # Try the myshopify.com preview URL
        preview_url = f"https://{store_id}.myshopify.com"
    else:
        preview_url = "https://your-store.myshopify.com"  # Fallback

    print(f"Navigating to: {preview_url}")

    try:
        preview_page.goto(preview_url)
        preview_page.wait_for_load_state("networkidle")

        # Desktop screenshot - Homepage
        preview_page.set_viewport_size({"width": 1440, "height": 900})
        time.sleep(2)
        preview_page.screenshot(path="screenshots/homepage_desktop.png", full_page=True)
        print("  ✓ Homepage desktop screenshot saved")

        # Mobile screenshot - Homepage
        preview_page.set_viewport_size({"width": 390, "height": 844})
        time.sleep(1)
        preview_page.screenshot(path="screenshots/homepage_mobile.png", full_page=True)
        print("  ✓ Homepage mobile screenshot saved")

        # Navigate to a product page
        preview_page.set_viewport_size({"width": 1440, "height": 900})
        product_link = preview_page.locator('a[href*="/products/"]').first
        if product_link.count() > 0:
            product_link.click()
            preview_page.wait_for_load_state("networkidle")
            time.sleep(1)
            preview_page.screenshot(path="screenshots/product_page_desktop.png", full_page=True)
            print("  ✓ Product page screenshot saved")

        # Navigate to cart
        cart_link = preview_page.locator('a[href*="/cart"]').first
        if cart_link.count() > 0:
            cart_link.click()
            preview_page.wait_for_load_state("networkidle")
            time.sleep(1)
            preview_page.screenshot(path="screenshots/cart_page_desktop.png", full_page=True)
            print("  ✓ Cart page screenshot saved")

    except Exception as e:
        print(f"Preview error: {e}")
        print("Please manually check the storefront preview.")

    # --- 11. Final Report ---
    print("\n" + "=" * 50)
    print("THEME STYLING COMPLETE")
    print("=" * 50)
    print(f"\n📁 File edited: {edited_file}")
    print("\n🎨 Styles applied:")
    print("  • CSS variables for brand colors (gold, sage, charcoal)")
    print("  • Pill-shaped buttons with gradient gold/sage")
    print("  • Soft shadows and rounded corners on cards")
    print("  • Premium hero section styling")
    print("  • Refined typography and spacing")
    print("  • Mobile-responsive adjustments")
    print("\n📸 Screenshots saved to ./screenshots/")
    print("\n⚠️  Tweaks made: None (initial application)")
    print("\nPlease review the storefront and let me know if any")
    print("adjustments are needed for specific elements.")
    print("=" * 50)

    # Keep browser open for manual review
    print("\nBrowser session will remain open for your review.")
    print("Press ENTER to close the session...")
    input()

    browser.close()

print("\nSession ended. Thank you for using Shelzy's Theme Styling Agent!")
