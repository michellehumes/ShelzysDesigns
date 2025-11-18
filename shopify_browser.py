import os
from browserbase import Browserbase
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def main():
    # --- 1. Authenticate with Browserbase ---
    api_key = os.getenv("BROWSERBASE_API_KEY")
    project_id = os.getenv("BROWSERBASE_PROJECT_ID")

    if not api_key:
        raise ValueError("BROWSERBASE_API_KEY environment variable is required")

    if not project_id:
        raise ValueError("BROWSERBASE_PROJECT_ID environment variable is required")

    bb = Browserbase(api_key=api_key)

    # --- 2. Create a browser session ---
    session = bb.sessions.create(project_id=project_id)
    session_id = session.id

    print(f"Browserbase session created: {session_id}")
    print("Opening browser...")

    # --- 3. Connect to the session using Playwright ---
    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(bb.sessions.connect(session_id))
        context = browser.contexts[0]
        page = context.pages[0] if context.pages else context.new_page()

        # --- 4. Navigate to Shopify Admin ---
        page.goto("https://accounts.shopify.com/store-login")

        print("Shopify login page loaded.")
        print("Session URL: https://browserbase.com/sessions/" + session_id)
        print("\nWaiting for your instructions... you can now tell Claude what action to take.")

        # Keep the session alive for interaction
        input("\nPress Enter to close the browser session...")

        browser.close()

    print("Browser session closed.")

if __name__ == "__main__":
    main()
