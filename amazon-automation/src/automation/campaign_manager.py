"""
Campaign Manager Module

Handles PPC campaign creation and management via Amazon Advertising API.
"""

import time
from typing import Any, Dict, List, Optional

from ..api.advertising_client import AdvertisingClient
from ..utils.config_loader import ConfigLoader
from ..utils.logger import LoggerMixin


class CampaignManager(LoggerMixin):
    """
    Manages Amazon PPC campaigns.

    Creates and configures Sponsored Products campaigns,
    ad groups, keywords, and negative keywords.
    """

    def __init__(
        self,
        advertising_client: Optional[AdvertisingClient] = None,
        config_loader: Optional[ConfigLoader] = None,
    ):
        """
        Initialize the Campaign Manager.

        Args:
            advertising_client: Advertising API client instance
            config_loader: Configuration loader instance
        """
        self.ads_client = advertising_client or AdvertisingClient()
        self.config = config_loader or ConfigLoader()

        # Cache for created entity IDs
        self._campaign_ids: Dict[str, str] = {}
        self._ad_group_ids: Dict[str, str] = {}

    def create_campaign_from_config(
        self,
        campaign_config: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Create a campaign from configuration.

        Args:
            campaign_config: Campaign configuration dictionary

        Returns:
            Created campaign data with IDs
        """
        name = campaign_config["name"]

        self.logger.info(f"Creating campaign: {name}")

        # Create the campaign
        campaign_result = self.ads_client.create_campaign(
            name=name,
            campaign_type=campaign_config.get("type", "sponsoredProducts"),
            targeting_type=campaign_config.get("targeting_type", "auto"),
            daily_budget=campaign_config.get("daily_budget", 10.0),
            state=campaign_config.get("state", "enabled"),
            bidding_strategy=campaign_config.get("bidding_strategy", "legacyForSales"),
        )

        # Extract campaign ID from response
        campaign_id = self._extract_campaign_id(campaign_result)
        if not campaign_id:
            raise ValueError(f"Failed to get campaign ID for {name}")

        self._campaign_ids[name] = campaign_id
        self.logger.info(f"Created campaign {name} with ID: {campaign_id}")

        # Create ad groups
        ad_groups_created = []
        for ag_config in campaign_config.get("ad_groups", []):
            ag_result = self._create_ad_group(campaign_id, ag_config, campaign_config)
            ad_groups_created.append(ag_result)
            time.sleep(0.5)  # Rate limiting

        # Add negative keywords at campaign level
        neg_keywords = self.config.get_negative_keywords()
        if neg_keywords:
            self._add_campaign_negatives(campaign_id, neg_keywords)

        return {
            "name": name,
            "campaign_id": campaign_id,
            "ad_groups": ad_groups_created,
            "status": "success",
        }

    def _extract_campaign_id(self, result: Dict[str, Any]) -> Optional[str]:
        """Extract campaign ID from API response."""
        campaigns = result.get("campaigns", [])
        if campaigns:
            return campaigns[0].get("campaignId")

        # Try success response format
        success = result.get("success", [])
        if success:
            return success[0].get("campaignId")

        return None

    def _create_ad_group(
        self,
        campaign_id: str,
        ag_config: Dict[str, Any],
        campaign_config: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create an ad group with products and keywords."""
        name = ag_config["name"]

        self.logger.info(f"Creating ad group: {name}")

        # Create the ad group
        ag_result = self.ads_client.create_ad_group(
            campaign_id=campaign_id,
            name=name,
            default_bid=ag_config.get("default_bid", 0.75),
        )

        # Extract ad group ID
        ad_groups = ag_result.get("adGroups", [])
        if ad_groups:
            ad_group_id = ad_groups[0].get("adGroupId")
        else:
            success = ag_result.get("success", [])
            ad_group_id = success[0].get("adGroupId") if success else None

        if not ad_group_id:
            raise ValueError(f"Failed to get ad group ID for {name}")

        self._ad_group_ids[name] = ad_group_id

        # Add products to ad group
        products_config = self.config.load_products()
        product_asins = campaign_config.get("products", [])

        for asin in product_asins:
            product = self.config.get_product_by_asin(asin)
            if product:
                self.ads_client.create_product_ad(
                    campaign_id=campaign_id,
                    ad_group_id=ad_group_id,
                    sku=product["sku"],
                    asin=asin,
                )
                time.sleep(0.2)

        # Handle auto vs manual targeting
        targeting_type = campaign_config.get("targeting_type", "auto")

        if targeting_type == "auto":
            # Add auto targeting groups
            auto_groups = ag_config.get("auto_targeting_groups", [])
            if auto_groups:
                self.ads_client.create_auto_targeting(
                    campaign_id=campaign_id,
                    ad_group_id=ad_group_id,
                    targeting_groups=auto_groups,
                )
        else:
            # Add manual keywords
            keywords = ag_config.get("keywords", [])
            if keywords:
                self.ads_client.create_keywords(
                    campaign_id=campaign_id,
                    ad_group_id=ad_group_id,
                    keywords=keywords,
                )

        return {
            "name": name,
            "ad_group_id": ad_group_id,
            "products": product_asins,
        }

    def _add_campaign_negatives(
        self,
        campaign_id: str,
        negative_keywords: List[Dict[str, Any]],
    ):
        """Add negative keywords at campaign level."""
        self.logger.info(f"Adding {len(negative_keywords)} negative keywords")

        self.ads_client.create_negative_keywords(
            campaign_id=campaign_id,
            ad_group_id=None,
            keywords=negative_keywords,
            level="campaign",
        )

    def deploy_all_campaigns(self) -> Dict[str, Any]:
        """
        Deploy all campaigns from configuration.

        Returns:
            Deployment summary
        """
        campaigns_config = self.config.load_campaigns()
        campaigns = campaigns_config.get("campaigns", [])

        results = {
            "total": len(campaigns),
            "successful": [],
            "failed": [],
        }

        for campaign_config in campaigns:
            try:
                result = self.create_campaign_from_config(campaign_config)
                results["successful"].append(result)
                self.logger.info(f"Successfully created campaign: {campaign_config['name']}")
            except Exception as e:
                self.logger.error(
                    f"Failed to create campaign {campaign_config['name']}: {e}"
                )
                results["failed"].append({
                    "name": campaign_config["name"],
                    "error": str(e),
                })

            # Rate limiting between campaigns
            time.sleep(1)

        self.logger.info(
            f"Campaign deployment complete: {len(results['successful'])} successful, "
            f"{len(results['failed'])} failed"
        )

        return results

    def get_existing_campaigns(
        self,
        name_filter: Optional[str] = "Shelzys",
    ) -> List[Dict[str, Any]]:
        """
        Get existing campaigns, optionally filtered by name.

        Args:
            name_filter: Filter campaigns containing this string

        Returns:
            List of campaigns
        """
        return self.ads_client.get_campaigns(name_filter=name_filter)

    def pause_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Pause a campaign."""
        return self.ads_client.update_campaign(campaign_id, state="paused")

    def enable_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Enable a paused campaign."""
        return self.ads_client.update_campaign(campaign_id, state="enabled")

    def update_campaign_budget(
        self,
        campaign_id: str,
        daily_budget: float,
    ) -> Dict[str, Any]:
        """Update campaign daily budget."""
        return self.ads_client.update_campaign(
            campaign_id,
            daily_budget=daily_budget,
        )

    def check_campaign_exists(self, name: str) -> Optional[str]:
        """
        Check if a campaign with the given name exists.

        Args:
            name: Campaign name to check

        Returns:
            Campaign ID if exists, None otherwise
        """
        campaigns = self.get_existing_campaigns(name_filter=name)
        for campaign in campaigns:
            if campaign.get("name") == name:
                return campaign.get("campaignId")
        return None

    def validate_campaign_config(
        self,
        campaign_config: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Validate campaign configuration.

        Args:
            campaign_config: Campaign config to validate

        Returns:
            Validation results
        """
        errors = []
        warnings = []

        name = campaign_config.get("name")
        if not name:
            errors.append("Missing campaign name")

        budget = campaign_config.get("daily_budget", 0)
        if budget < 1:
            errors.append("Daily budget must be at least $1")
        elif budget > 100:
            warnings.append(f"High daily budget: ${budget}")

        products = campaign_config.get("products", [])
        if not products:
            errors.append("No products assigned to campaign")

        # Check products exist in config
        for asin in products:
            if not self.config.get_product_by_asin(asin):
                errors.append(f"Product ASIN {asin} not found in config")

        ad_groups = campaign_config.get("ad_groups", [])
        if not ad_groups:
            errors.append("No ad groups defined")

        return {
            "name": name,
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
        }


def run_campaign_deployment():
    """Entry point for campaign deployment."""
    import sys

    manager = CampaignManager()
    config = ConfigLoader()

    # Validate all campaigns first
    campaigns_config = config.load_campaigns()
    all_valid = True

    print("Validating campaign configurations...")
    for campaign_config in campaigns_config.get("campaigns", []):
        validation = manager.validate_campaign_config(campaign_config)
        if not validation["valid"]:
            print(f"\nErrors in {campaign_config['name']}:")
            for error in validation["errors"]:
                print(f"  - {error}")
            all_valid = False
        if validation["warnings"]:
            print(f"\nWarnings for {campaign_config['name']}:")
            for warning in validation["warnings"]:
                print(f"  - {warning}")

    if not all_valid:
        print("\nFix validation errors before deploying.")
        sys.exit(1)

    # Check for existing campaigns
    print("\nChecking for existing campaigns...")
    for campaign_config in campaigns_config.get("campaigns", []):
        existing_id = manager.check_campaign_exists(campaign_config["name"])
        if existing_id:
            print(f"  Campaign '{campaign_config['name']}' already exists (ID: {existing_id})")

    # Deploy campaigns
    print("\nDeploying campaigns...")
    results = manager.deploy_all_campaigns()

    print(f"\nDeployment Complete")
    print(f"  Successful: {len(results['successful'])}")
    print(f"  Failed: {len(results['failed'])}")

    if results["successful"]:
        print("\nCreated campaigns:")
        for success in results["successful"]:
            print(f"  - {success['name']} (ID: {success['campaign_id']})")

    if results["failed"]:
        print("\nFailed campaigns:")
        for fail in results["failed"]:
            print(f"  - {fail['name']}: {fail['error']}")
        sys.exit(1)


if __name__ == "__main__":
    run_campaign_deployment()
