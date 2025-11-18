# ShelzysDesigns

Browserbase + Playwright automation for Shopify store management.

## Setup

### Prerequisites

- Python 3.8+
- A Browserbase account ([sign up](https://browserbase.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/michellehumes/ShelzysDesigns.git
   cd ShelzysDesigns
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Browserbase credentials:
   - `BROWSERBASE_API_KEY`: Get from [Browserbase API Keys](https://browserbase.com/settings/api-keys)
   - `BROWSERBASE_PROJECT_ID`: Get from [Browserbase Projects](https://browserbase.com/settings/projects)

## Usage

Run the Shopify browser automation:

```bash
python shopify_browser.py
```

This will:
1. Create a new Browserbase session
2. Open a browser connected to the session
3. Navigate to the Shopify login page
4. Wait for your instructions

You can view the live browser session at the Browserbase dashboard URL printed in the console.

## Security

- Never commit your `.env` file with real credentials
- Keep your API keys secure
- The `.env` file is gitignored by default
