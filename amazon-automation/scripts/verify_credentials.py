#!/usr/bin/env python3
"""
Credential Verification Script

Verifies that all required Amazon API credentials are configured correctly
and can successfully authenticate.

Usage:
    python scripts/verify_credentials.py
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def check_env_vars():
    """Check that all required environment variables are set."""
    print("\n" + "=" * 60)
    print("CHECKING ENVIRONMENT VARIABLES")
    print("=" * 60)

    sp_api_vars = {
        "AMAZON_SELLER_ID": "Amazon Seller ID",
        "LWA_APP_ID": "LWA Application ID",
        "LWA_CLIENT_SECRET": "LWA Client Secret",
        "SP_API_REFRESH_TOKEN": "SP-API Refresh Token",
    }

    sp_api_optional = {
        "SP_API_AWS_ACCESS_KEY": "AWS Access Key (optional for some setups)",
        "SP_API_AWS_SECRET_KEY": "AWS Secret Key (optional for some setups)",
        "SP_API_ROLE_ARN": "IAM Role ARN (optional for some setups)",
    }

    ads_vars = {
        "AMAZON_ADS_CLIENT_ID": "Advertising Client ID",
        "AMAZON_ADS_CLIENT_SECRET": "Advertising Client Secret",
        "AMAZON_ADS_REFRESH_TOKEN": "Advertising Refresh Token",
        "AMAZON_ADS_PROFILE_ID": "Advertising Profile ID",
    }

    all_valid = True

    print("\n📦 SP-API Required Credentials:")
    for var, desc in sp_api_vars.items():
        value = os.getenv(var)
        if value:
            masked = value[:8] + "..." + value[-4:] if len(value) > 16 else "****"
            print(f"  ✓ {var}: {masked}")
        else:
            print(f"  ✗ {var}: NOT SET ({desc})")
            all_valid = False

    print("\n📦 SP-API Optional Credentials:")
    for var, desc in sp_api_optional.items():
        value = os.getenv(var)
        if value:
            masked = value[:8] + "..." + value[-4:] if len(value) > 16 else "****"
            print(f"  ✓ {var}: {masked}")
        else:
            print(f"  - {var}: not set ({desc})")

    print("\n📈 Advertising API Credentials:")
    for var, desc in ads_vars.items():
        value = os.getenv(var)
        if value:
            masked = value[:8] + "..." + value[-4:] if len(value) > 16 else "****"
            print(f"  ✓ {var}: {masked}")
        else:
            print(f"  ✗ {var}: NOT SET ({desc})")
            all_valid = False

    return all_valid


def test_sp_api_auth():
    """Test SP-API authentication."""
    print("\n" + "=" * 60)
    print("TESTING SP-API AUTHENTICATION")
    print("=" * 60)

    try:
        from src.api.sp_api_client import SPAPIClient

        client = SPAPIClient()
        print("\n  Attempting to authenticate...")

        # Try to get seller info (simple auth test)
        # Note: This might fail if we don't have the right permissions,
        # but it will tell us if auth is working
        try:
            from sp_api.api import Sellers
            from sp_api.base import Marketplaces

            sellers_api = Sellers(
                credentials=client.credentials,
                marketplace=Marketplaces.US,
            )
            response = sellers_api.get_marketplace_participations()
            print("  ✓ SP-API authentication successful!")
            print(f"  ✓ Found {len(response.payload)} marketplace participations")
            return True

        except Exception as e:
            error_str = str(e)
            if "401" in error_str or "Unauthorized" in error_str:
                print("  ✗ Authentication failed - invalid credentials")
                print(f"    Error: {e}")
            elif "403" in error_str or "Forbidden" in error_str:
                print("  ✓ Authentication works (403 = authorized but lacks permission)")
                return True
            else:
                print(f"  ? Unexpected error: {e}")
            return False

    except ImportError as e:
        print(f"  ✗ Missing dependency: {e}")
        print("    Run: pip install python-amazon-sp-api")
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_advertising_api_auth():
    """Test Advertising API authentication."""
    print("\n" + "=" * 60)
    print("TESTING ADVERTISING API AUTHENTICATION")
    print("=" * 60)

    try:
        from src.api.advertising_client import AdvertisingClient

        client = AdvertisingClient()
        print("\n  Attempting to authenticate...")

        try:
            profiles = client.get_profiles()
            print("  ✓ Advertising API authentication successful!")
            print(f"  ✓ Found {len(profiles)} advertising profiles")

            for profile in profiles:
                profile_id = profile.get("profileId")
                account_info = profile.get("accountInfo", {})
                marketplace = account_info.get("marketplaceStringId", "Unknown")
                name = account_info.get("name", "Unnamed")
                print(f"    - {name} ({marketplace}): {profile_id}")

            # Check if configured profile ID exists
            configured_id = os.getenv("AMAZON_ADS_PROFILE_ID")
            if configured_id:
                profile_ids = [str(p.get("profileId")) for p in profiles]
                if configured_id in profile_ids:
                    print(f"\n  ✓ Configured profile ID {configured_id} is valid")
                else:
                    print(f"\n  ⚠ Configured profile ID {configured_id} not found!")
                    print(f"    Valid IDs: {', '.join(profile_ids)}")

            return True

        except Exception as e:
            error_str = str(e)
            if "401" in error_str or "Unauthorized" in error_str:
                print("  ✗ Authentication failed - invalid credentials")
            elif "403" in error_str or "Forbidden" in error_str:
                print("  ✗ Access forbidden - check API permissions")
            else:
                print(f"  ✗ Error: {e}")
            return False

    except ImportError as e:
        print(f"  ✗ Missing dependency: {e}")
        print("    Run: pip install requests")
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def main():
    print("\n" + "=" * 60)
    print("SHELZY'S DESIGNS - CREDENTIAL VERIFICATION")
    print("=" * 60)

    # Check environment variables
    env_valid = check_env_vars()

    if not env_valid:
        print("\n" + "=" * 60)
        print("RESULT: Missing required credentials")
        print("=" * 60)
        print("\nPlease set the missing environment variables.")
        print("See .env.example for details.\n")
        return 1

    # Test SP-API
    sp_api_ok = test_sp_api_auth()

    # Test Advertising API
    ads_ok = test_advertising_api_auth()

    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    print(f"\n  Environment Variables: {'✓ OK' if env_valid else '✗ Missing'}")
    print(f"  SP-API Authentication: {'✓ OK' if sp_api_ok else '✗ Failed'}")
    print(f"  Advertising API Auth:  {'✓ OK' if ads_ok else '✗ Failed'}")

    if env_valid and sp_api_ok and ads_ok:
        print("\n✓ All credentials verified successfully!")
        print("  You can now run the automation scripts.\n")
        return 0
    else:
        print("\n✗ Some verifications failed.")
        print("  Please fix the issues above before running automation.\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
