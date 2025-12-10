# Shelzy's Designs - Amazon Seller Automation

Comprehensive automation system for managing Amazon listings, PPC campaigns, bid optimization, and review requests for Shelzy's Designs personalized water bottles.

## Overview

This automation system handles:

1. **Listing Optimization** - Push optimized content to Amazon listings via SP-API
2. **PPC Campaign Deployment** - Create and manage Sponsored Products campaigns
3. **Daily Bid Optimization** - Automatically adjust bids based on performance
4. **Automated Review Requests** - Request reviews for delivered orders
5. **Weekly Listing Sync** - Prevent content drift with scheduled updates

## Products Managed

| ASIN | SKU | Product |
|------|-----|---------|
| B0DGFD4LX4 | 1M-GGRA-VBRF | Clear Plastic Water Bottle |
| B0D92Q5R1P | 2A-PQ74-FWLU | Stainless Steel Water Bottle |
| B0FH3T8QHD | BLANK-TMBLR | Sublimation Blank Tumbler |

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shelzys-amazon-automation.git
cd shelzys-amazon-automation
```

### 2. Set Up Python Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Credentials

```bash
cp .env.example .env
# Edit .env with your Amazon API credentials
```

### 4. Configure GitHub Secrets

Add these secrets to your repository (Settings > Secrets and variables > Actions):

**SP-API Secrets:**
- `AMAZON_SELLER_ID`
- `LWA_APP_ID`
- `LWA_CLIENT_SECRET`
- `SP_API_REFRESH_TOKEN`
- `SP_API_AWS_ACCESS_KEY`
- `SP_API_AWS_SECRET_KEY`
- `SP_API_ROLE_ARN`

**Advertising API Secrets:**
- `AMAZON_ADS_CLIENT_ID`
- `AMAZON_ADS_CLIENT_SECRET`
- `AMAZON_ADS_REFRESH_TOKEN`
- `AMAZON_ADS_PROFILE_ID`

## Project Structure

```
shelzys-amazon-automation/
├── .github/
│   └── workflows/
│       ├── daily-bid-optimization.yml    # 6 AM ET daily
│       ├── daily-review-requests.yml     # 2 PM ET daily
│       ├── weekly-listing-sync.yml       # Monday 8 AM ET
│       └── deploy-campaigns.yml          # Manual trigger
├── config/
│   ├── products.json      # Product listings & content
│   ├── campaigns.json     # PPC campaign definitions
│   └── settings.json      # Automation settings
├── src/
│   ├── api/
│   │   ├── sp_api_client.py        # SP-API integration
│   │   └── advertising_client.py    # Advertising API
│   ├── automation/
│   │   ├── listing_manager.py       # Listing updates
│   │   ├── campaign_manager.py      # PPC deployment
│   │   ├── bid_optimizer.py         # Bid optimization
│   │   └── review_requester.py      # Review requests
│   └── utils/
│       ├── config_loader.py         # Config management
│       └── logger.py                # Logging setup
├── tests/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Automation Schedules

| Workflow | Schedule | Description |
|----------|----------|-------------|
| Bid Optimization | Daily 6 AM ET | Adjust bids based on ACoS/conversions |
| Review Requests | Daily 2 PM ET | Request reviews for delivered orders |
| Listing Sync | Monday 8 AM ET | Re-push listing content to prevent drift |
| Campaign Deploy | Manual | Deploy PPC campaigns from config |

## Bid Optimization Rules

The daily bid optimization applies these rules:

| Condition | Action |
|-----------|--------|
| ACoS < 20% AND 3+ conversions | Increase bid 15% (max $3.00) |
| ACoS > 40% AND 20+ clicks | Decrease bid 20% (min $0.20) |
| ACoS > 60% AND $15+ spent AND 0 conversions | Pause keyword |
| 15+ clicks AND $10+ spent AND 0 conversions | Add as negative |

## PPC Campaigns

### Campaign Structure

1. **Shelzys-Auto-Discovery** ($20/day)
   - Auto targeting
   - Products: Clear Plastic, Stainless Steel

2. **Shelzys-Bridesmaid-Exact** ($15/day)
   - Exact match keywords
   - "personalized bridesmaid water bottle"
   - "custom bridesmaid tumbler"
   - "bridesmaid proposal gift"
   - "bridesmaid gift ideas"
   - "personalized water bottle with name"

3. **Shelzys-Bachelorette-Exact** ($15/day)
   - Exact match keywords
   - "bachelorette party favors personalized"
   - "bachelorette party water bottles"
   - "bach party favors"
   - "bride tribe cups"

4. **Shelzys-Wedding-Broad** ($10/day)
   - Broad match keywords
   - "wedding party favors"
   - "bridal shower gifts"
   - "wedding gifts personalized"

5. **Shelzys-Sublimation-Blanks** ($10/day)
   - Blank tumbler only
   - "sublimation blanks tumbler"
   - "sublimation water bottle blank"
   - "white tumbler for sublimation"
   - "heat press tumbler blank"

### Campaign-Level Negatives

All campaigns exclude:
- free, cheap, wholesale lot, used, refurbished
- stanley cup, yeti tumbler, hydro flask, contigo

## Manual Operations

### Update Listings

```bash
# Update all listings
python -m src.automation.listing_manager

# Validate without updating
python -c "
from src.automation.listing_manager import ListingManager
manager = ListingManager()
print(manager.validate_all_listings())
"
```

### Deploy Campaigns

```bash
# Deploy all campaigns
python -m src.automation.campaign_manager

# Or use GitHub Actions (requires typing "DEPLOY" to confirm)
```

### Run Bid Optimization

```bash
# Dry run (analyze without changes)
DRY_RUN=true python -m src.automation.bid_optimizer

# Live run
python -m src.automation.bid_optimizer
```

### Request Reviews

```bash
# Dry run
DRY_RUN=true python -m src.automation.review_requester

# Live run (max 50 requests)
MAX_REQUESTS=50 python -m src.automation.review_requester
```

## Configuration

### Products (config/products.json)

```json
{
  "products": [
    {
      "asin": "B0DGFD4LX4",
      "sku": "1M-GGRA-VBRF",
      "listing": {
        "title": "Optimized product title...",
        "bullet_points": ["Bullet 1", "Bullet 2", ...],
        "description": "Product description...",
        "search_terms": "backend search terms..."
      }
    }
  ]
}
```

### Campaigns (config/campaigns.json)

```json
{
  "campaigns": [
    {
      "name": "Campaign-Name",
      "targeting_type": "manual",
      "daily_budget": 15.00,
      "products": ["ASIN1", "ASIN2"],
      "ad_groups": [
        {
          "name": "AdGroup-Name",
          "keywords": [
            {"text": "keyword", "match_type": "exact", "bid": 1.00}
          ]
        }
      ]
    }
  ]
}
```

## API Setup

### SP-API Setup

1. Register as a developer in Seller Central
2. Create an application with required permissions:
   - Listings
   - Orders
   - Solicitations
3. Get LWA credentials and refresh token
4. Set up AWS IAM user/role

### Advertising API Setup

1. Request API access at advertising.amazon.com
2. Create an application
3. Get OAuth credentials
4. Authenticate and get profile ID

## Monitoring

### GitHub Actions

All workflows create job summaries with results:
- Navigate to Actions tab
- Click on workflow run
- View Summary for metrics

### Logs

Local runs write to `logs/automation.log` (when configured).

## Troubleshooting

### Common Issues

**API Authentication Errors**
- Verify all credentials in `.env` are correct
- Check refresh tokens haven't expired
- Ensure IAM permissions are configured

**Bid Optimization Not Running**
- Check GitHub Actions secrets are set
- Verify workflow is enabled
- Review action logs for errors

**Listings Not Updating**
- Validate listing content meets Amazon requirements
- Check character limits (title: 200, bullets: 500 each)
- Ensure seller has catalog permissions

### Getting Help

1. Check GitHub Actions logs
2. Review `logs/automation.log`
3. Test with `DRY_RUN=true`

## License

Private - Shelzy's Designs

## Support

For issues or questions, contact the development team.
