import os
from browserbase import Browserbase
from playwright.sync_api import sync_playwright

# --- 1. Authenticate with Browserbase ---
os.environ["BROWSERBASE_API_KEY"] = "Ybb_live_AIisgtCLyS85PRLyY3S_rTmtx1w"

bb = Browserbase()

# --- 2. Create a browser session ---
session = bb.sessions.create({"projectId": None})
session_id = session["id"]

print("Browserbase session created:", session_id)
print("Opening browser...")

# --- 3. Connect to the session using Playwright ---
with sync_playwright() as pw:
    browser = pw.chromium.connect_over_cdp(bb.connect(session_id))
    page = browser.new_page()

    # --- 4. Navigate to Shopify Admin ---
    page.goto("https://accounts.shopify.com/store-login")

    print("Shopify login page loaded.")
    print("Waiting for your instructions... you can now tell Claude what action to take.")
