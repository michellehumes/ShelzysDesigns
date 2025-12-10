#!/usr/bin/env python3
"""
Shelzy's Designs - Amazon Seller Automation
Main entry point for running automation tasks locally.

Usage:
    python main.py <command> [options]

Commands:
    listings    - Sync all product listings to Amazon
    campaigns   - Deploy PPC campaigns from configuration
    optimize    - Run bid optimization
    reviews     - Request reviews for delivered orders
    validate    - Validate all configurations without making changes
    status      - Check current campaign and listing status
"""

import argparse
import sys
import os
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.utils.logger import setup_logger
from src.utils.config_loader import ConfigLoader


def cmd_listings(args):
    """Sync product listings to Amazon."""
    from src.automation.listing_manager import ListingManager

    logger = setup_logger("listings")
    manager = ListingManager()

    if args.validate_only:
        logger.info("Validating listings (dry run)...")
        results = manager.validate_all_listings()

        print("\n" + "=" * 50)
        print("LISTING VALIDATION RESULTS")
        print("=" * 50)
        print(f"Total: {results['total']}")
        print(f"Valid: {len(results['valid'])}")
        print(f"Invalid: {len(results['invalid'])}")

        for item in results['valid']:
            print(f"\n✓ {item['sku']}")
            for warning in item.get('warnings', []):
                print(f"  ⚠ {warning}")

        for item in results['invalid']:
            print(f"\n✗ {item['sku']}")
            for error in item['errors']:
                print(f"  ✗ {error}")

        return 0 if not results['invalid'] else 1

    logger.info("Syncing all listings to Amazon...")
    results = manager.sync_listings()

    print(f"\nSuccessful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")

    return 0 if not results['failed'] else 1


def cmd_campaigns(args):
    """Deploy PPC campaigns."""
    from src.automation.campaign_manager import CampaignManager

    logger = setup_logger("campaigns")
    manager = CampaignManager()
    config = ConfigLoader()

    # Validate first
    campaigns_config = config.load_campaigns()

    print("Validating campaign configurations...")
    all_valid = True
    for campaign_config in campaigns_config.get('campaigns', []):
        validation = manager.validate_campaign_config(campaign_config)
        status = '✓' if validation['valid'] else '✗'
        print(f"  {status} {campaign_config['name']}")

        if not validation['valid']:
            all_valid = False
            for error in validation['errors']:
                print(f"      Error: {error}")

    if not all_valid:
        print("\nFix validation errors before deploying.")
        return 1

    if args.dry_run:
        print("\nDry run - no campaigns deployed")
        return 0

    # Deploy
    print("\nDeploying campaigns...")
    results = manager.deploy_all_campaigns()

    print(f"\nSuccessful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")

    if results['successful']:
        print("\nCreated campaigns:")
        for success in results['successful']:
            print(f"  - {success['name']} (ID: {success['campaign_id']})")

    return 0 if not results['failed'] else 1


def cmd_optimize(args):
    """Run bid optimization."""
    from src.automation.bid_optimizer import BidOptimizer

    logger = setup_logger("optimize")
    optimizer = BidOptimizer()

    print(f"Running bid optimization...")
    print(f"  Lookback days: {args.lookback_days}")
    print(f"  Dry run: {args.dry_run}")

    results = optimizer.run_optimization(
        lookback_days=args.lookback_days,
        dry_run=args.dry_run,
    )

    print("\n" + "=" * 50)
    print("OPTIMIZATION RESULTS")
    print("=" * 50)
    print(f"Bid increases: {len(results['bid_increases'])}")
    print(f"Bid decreases: {len(results['bid_decreases'])}")
    print(f"Paused keywords: {len(results['paused_keywords'])}")
    print(f"New negatives: {len(results['new_negatives'])}")

    if results['errors']:
        print(f"\nErrors: {len(results['errors'])}")
        for error in results['errors']:
            print(f"  - {error}")
        return 1

    return 0


def cmd_reviews(args):
    """Request reviews for delivered orders."""
    from src.automation.review_requester import ReviewRequester

    logger = setup_logger("reviews")
    requester = ReviewRequester()

    print("Running review request automation...")
    print(f"  Dry run: {args.dry_run}")
    print(f"  Max requests: {args.max_requests or 'unlimited'}")

    results = requester.run_review_requests(
        max_requests=args.max_requests,
        dry_run=args.dry_run,
    )

    print("\n" + "=" * 50)
    print("REVIEW REQUEST RESULTS")
    print("=" * 50)
    print(f"Eligible orders: {results['eligible_orders']}")
    print(f"Requests sent: {results['requests_sent']}")
    print(f"Successful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")

    return 0 if not results.get('error') else 1


def cmd_validate(args):
    """Validate all configurations."""
    from src.automation.listing_manager import ListingManager
    from src.automation.campaign_manager import CampaignManager

    config = ConfigLoader()
    listing_manager = ListingManager()
    campaign_manager = CampaignManager()

    print("=" * 50)
    print("CONFIGURATION VALIDATION")
    print("=" * 50)

    all_valid = True

    # Validate products
    print("\n📦 Products:")
    products = config.load_products()
    for product in products.get('products', []):
        print(f"  ✓ {product['asin']} - {product['name']}")

    # Validate listings
    print("\n📝 Listings:")
    listing_results = listing_manager.validate_all_listings()
    for item in listing_results['valid']:
        print(f"  ✓ {item['sku']}")
    for item in listing_results['invalid']:
        print(f"  ✗ {item['sku']}: {item['errors']}")
        all_valid = False

    # Validate campaigns
    print("\n📈 Campaigns:")
    campaigns_config = config.load_campaigns()
    for campaign in campaigns_config.get('campaigns', []):
        validation = campaign_manager.validate_campaign_config(campaign)
        if validation['valid']:
            print(f"  ✓ {campaign['name']} (${campaign['daily_budget']}/day)")
        else:
            print(f"  ✗ {campaign['name']}: {validation['errors']}")
            all_valid = False

    # Validate negative keywords
    print("\n🚫 Negative Keywords:")
    negatives = config.get_negative_keywords()
    print(f"  {len(negatives)} campaign-level negatives configured")

    # Validate bid rules
    print("\n⚙️ Bid Optimization Rules:")
    rules = config.get_bid_rules()
    for rule_name in ['increase_bid', 'decrease_bid', 'pause_keyword', 'add_negative']:
        if rule_name in rules:
            print(f"  ✓ {rule_name}")

    print("\n" + "=" * 50)
    if all_valid:
        print("✓ All configurations valid!")
    else:
        print("✗ Some configurations have errors")
    print("=" * 50)

    return 0 if all_valid else 1


def cmd_status(args):
    """Check current status of campaigns and listings."""
    from src.api.advertising_client import AdvertisingClient
    from src.automation.campaign_manager import CampaignManager

    print("=" * 50)
    print("SHELZY'S DESIGNS - AMAZON AUTOMATION STATUS")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

    try:
        manager = CampaignManager()

        print("\n📈 Active Campaigns:")
        campaigns = manager.get_existing_campaigns(name_filter="Shelzys")

        if campaigns:
            total_budget = 0
            for campaign in campaigns:
                budget = campaign.get('budget', {}).get('budget', 0)
                total_budget += budget
                state = campaign.get('state', 'unknown')
                state_icon = '✓' if state == 'enabled' else '⏸' if state == 'paused' else '?'
                print(f"  {state_icon} {campaign['name']}: ${budget}/day ({state})")
            print(f"\n  Total Daily Budget: ${total_budget}")
        else:
            print("  No Shelzys campaigns found")
            print("  Run 'python main.py campaigns' to deploy")

    except Exception as e:
        print(f"\n⚠️ Could not fetch campaign status: {e}")
        print("  Make sure API credentials are configured in .env")

    return 0


def check_credentials():
    """Check if required credentials are set."""
    required_sp_api = [
        'SP_API_REFRESH_TOKEN',
        'LWA_APP_ID',
        'LWA_CLIENT_SECRET',
    ]

    required_ads = [
        'AMAZON_ADS_CLIENT_ID',
        'AMAZON_ADS_CLIENT_SECRET',
        'AMAZON_ADS_REFRESH_TOKEN',
        'AMAZON_ADS_PROFILE_ID',
    ]

    missing = []

    for var in required_sp_api:
        if not os.getenv(var):
            missing.append(f"SP-API: {var}")

    for var in required_ads:
        if not os.getenv(var):
            missing.append(f"Advertising: {var}")

    if missing:
        print("⚠️  Missing credentials:")
        for m in missing:
            print(f"    - {m}")
        print("\nSet these in .env or as environment variables")
        print("See .env.example for details\n")


def main():
    parser = argparse.ArgumentParser(
        description="Shelzy's Designs - Amazon Seller Automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py validate              # Validate all configurations
  python main.py listings --validate   # Validate listings only
  python main.py listings              # Sync listings to Amazon
  python main.py campaigns --dry-run   # Validate campaigns without deploying
  python main.py campaigns             # Deploy PPC campaigns
  python main.py optimize --dry-run    # Preview bid optimizations
  python main.py optimize              # Run bid optimization
  python main.py reviews --dry-run     # Preview review requests
  python main.py reviews               # Send review requests
  python main.py status                # Check current status
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='Command to run')

    # Listings command
    listings_parser = subparsers.add_parser('listings', help='Sync product listings')
    listings_parser.add_argument('--validate', '--validate-only', dest='validate_only',
                                 action='store_true', help='Only validate, do not sync')

    # Campaigns command
    campaigns_parser = subparsers.add_parser('campaigns', help='Deploy PPC campaigns')
    campaigns_parser.add_argument('--dry-run', action='store_true',
                                  help='Validate only, do not deploy')

    # Optimize command
    optimize_parser = subparsers.add_parser('optimize', help='Run bid optimization')
    optimize_parser.add_argument('--dry-run', action='store_true',
                                 help='Preview changes without applying')
    optimize_parser.add_argument('--lookback-days', type=int, default=7,
                                 help='Days of data to analyze (default: 7)')

    # Reviews command
    reviews_parser = subparsers.add_parser('reviews', help='Request reviews')
    reviews_parser.add_argument('--dry-run', action='store_true',
                                help='Find orders but do not request reviews')
    reviews_parser.add_argument('--max-requests', type=int, default=None,
                                help='Maximum number of requests to send')

    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate all configurations')

    # Status command
    status_parser = subparsers.add_parser('status', help='Check current status')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 0

    # Load .env if present
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass

    # Check credentials (warning only)
    if args.command not in ['validate']:
        check_credentials()

    # Route to command
    commands = {
        'listings': cmd_listings,
        'campaigns': cmd_campaigns,
        'optimize': cmd_optimize,
        'reviews': cmd_reviews,
        'validate': cmd_validate,
        'status': cmd_status,
    }

    return commands[args.command](args)


if __name__ == '__main__':
    sys.exit(main())
