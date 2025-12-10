"""
Listing Manager Module

Handles pushing optimized listing content to Amazon via SP-API.
"""

import json
from typing import Any, Dict, List, Optional

from ..api.sp_api_client import SPAPIClient
from ..utils.config_loader import ConfigLoader
from ..utils.logger import LoggerMixin


class ListingManager(LoggerMixin):
    """
    Manages Amazon product listings.

    Pushes optimized content from config files to Amazon listings
    via the Selling Partner API.
    """

    def __init__(
        self,
        sp_api_client: Optional[SPAPIClient] = None,
        config_loader: Optional[ConfigLoader] = None,
    ):
        """
        Initialize the Listing Manager.

        Args:
            sp_api_client: SP-API client instance
            config_loader: Configuration loader instance
        """
        self.sp_api = sp_api_client or SPAPIClient()
        self.config = config_loader or ConfigLoader()

    def update_listing(self, sku: str) -> Dict[str, Any]:
        """
        Update a single listing with optimized content from config.

        Args:
            sku: Product SKU to update

        Returns:
            Update result with status and any issues
        """
        product = self.config.get_product_by_sku(sku)

        if not product:
            raise ValueError(f"Product with SKU {sku} not found in config")

        listing = product.get("listing", {})
        products_config = self.config.load_products()
        brand = products_config.get("brand", "Shelzy's Designs")

        self.logger.info(f"Updating listing for SKU: {sku} ({product['name']})")

        try:
            result = self.sp_api.update_listing_attributes(
                sku=sku,
                title=listing.get("title", ""),
                bullet_points=listing.get("bullet_points", []),
                description=listing.get("description", ""),
                search_terms=listing.get("search_terms", ""),
                brand=brand,
            )

            self.logger.info(f"Successfully updated listing for {sku}")
            return {
                "sku": sku,
                "asin": product["asin"],
                "status": "success",
                "result": result,
            }

        except Exception as e:
            self.logger.error(f"Failed to update listing for {sku}: {e}")
            return {
                "sku": sku,
                "asin": product.get("asin"),
                "status": "failed",
                "error": str(e),
            }

    def update_listing_by_asin(self, asin: str) -> Dict[str, Any]:
        """
        Update a listing by ASIN.

        Args:
            asin: Product ASIN to update

        Returns:
            Update result
        """
        product = self.config.get_product_by_asin(asin)

        if not product:
            raise ValueError(f"Product with ASIN {asin} not found in config")

        return self.update_listing(product["sku"])

    def update_all_listings(self) -> Dict[str, Any]:
        """
        Update all product listings from config.

        Returns:
            Summary of all update operations
        """
        products_config = self.config.load_products()
        products = products_config.get("products", [])

        results = {
            "total": len(products),
            "successful": [],
            "failed": [],
        }

        for product in products:
            sku = product.get("sku")
            if not sku:
                continue

            result = self.update_listing(sku)

            if result["status"] == "success":
                results["successful"].append(result)
            else:
                results["failed"].append(result)

        self.logger.info(
            f"Listing update complete: {len(results['successful'])} successful, "
            f"{len(results['failed'])} failed"
        )

        return results

    def sync_listings(self) -> Dict[str, Any]:
        """
        Sync all listings to ensure content matches config.
        Same as update_all_listings but intended for scheduled runs.

        Returns:
            Sync results
        """
        self.logger.info("Starting scheduled listing sync")
        self.config.reload_all()  # Reload config to get latest changes
        return self.update_all_listings()

    def validate_listing_content(self, sku: str) -> Dict[str, Any]:
        """
        Validate listing content without pushing to Amazon.

        Args:
            sku: Product SKU to validate

        Returns:
            Validation results with any warnings
        """
        product = self.config.get_product_by_sku(sku)

        if not product:
            return {"valid": False, "errors": [f"SKU {sku} not found in config"]}

        listing = product.get("listing", {})
        errors = []
        warnings = []

        # Title validation
        title = listing.get("title", "")
        if not title:
            errors.append("Missing title")
        elif len(title) > 200:
            warnings.append(f"Title is {len(title)} chars (Amazon limit is 200)")

        # Bullet points validation
        bullets = listing.get("bullet_points", [])
        if not bullets:
            errors.append("Missing bullet points")
        elif len(bullets) < 5:
            warnings.append(f"Only {len(bullets)} bullet points (5 recommended)")
        for i, bullet in enumerate(bullets):
            if len(bullet) > 500:
                warnings.append(f"Bullet {i+1} is {len(bullet)} chars (500 max)")

        # Description validation
        description = listing.get("description", "")
        if not description:
            warnings.append("Missing description")
        elif len(description) > 2000:
            warnings.append(f"Description is {len(description)} chars (2000 max)")

        # Search terms validation
        search_terms = listing.get("search_terms", "")
        if not search_terms:
            warnings.append("Missing backend search terms")
        elif len(search_terms) > 249:
            warnings.append(f"Search terms are {len(search_terms)} chars (249 max)")

        return {
            "sku": sku,
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
        }

    def validate_all_listings(self) -> Dict[str, Any]:
        """
        Validate all listing content without pushing.

        Returns:
            Validation results for all products
        """
        products_config = self.config.load_products()
        products = products_config.get("products", [])

        results = {
            "total": len(products),
            "valid": [],
            "invalid": [],
        }

        for product in products:
            sku = product.get("sku")
            if not sku:
                continue

            validation = self.validate_listing_content(sku)

            if validation["valid"]:
                results["valid"].append(validation)
            else:
                results["invalid"].append(validation)

        return results

    def get_listing_status(self, sku: str) -> Dict[str, Any]:
        """
        Get current listing status from Amazon.

        Args:
            sku: Product SKU

        Returns:
            Current listing data from Amazon
        """
        try:
            return self.sp_api.get_listing(sku)
        except Exception as e:
            self.logger.error(f"Failed to get listing status for {sku}: {e}")
            return {"sku": sku, "status": "error", "error": str(e)}


def run_listing_sync():
    """Entry point for scheduled listing sync."""
    import sys

    manager = ListingManager()

    # Validate first
    validation = manager.validate_all_listings()
    if validation["invalid"]:
        print("Validation errors found:")
        for item in validation["invalid"]:
            print(f"  {item['sku']}: {item['errors']}")
        sys.exit(1)

    # Perform sync
    results = manager.sync_listings()

    print(f"\nListing Sync Complete")
    print(f"  Successful: {len(results['successful'])}")
    print(f"  Failed: {len(results['failed'])}")

    if results["failed"]:
        print("\nFailed updates:")
        for fail in results["failed"]:
            print(f"  {fail['sku']}: {fail['error']}")
        sys.exit(1)

    print("\nAll listings synced successfully!")


if __name__ == "__main__":
    run_listing_sync()
