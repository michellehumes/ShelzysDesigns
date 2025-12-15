"""
Order Downloader Module

Downloads Amazon orders from the last 24 hours and organizes them by:
- Listing (product)
- Font
- Font Color
- Customer Name

This makes it easy to batch-create personalized orders.
"""

import json
import os
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

from sp_api.api import Orders
from sp_api.base import Marketplaces, SellingApiException

from ..api.sp_api_client import SPAPIClient
from ..utils.config_loader import ConfigLoader
from ..utils.logger import LoggerMixin


class OrderDownloader(LoggerMixin):
    """
    Downloads and organizes Amazon orders for easy fulfillment.

    Fetches orders from the last 24 hours and groups them by:
    listing → font → font color → customer name
    """

    def __init__(
        self,
        sp_api_client: Optional[SPAPIClient] = None,
        config_loader: Optional[ConfigLoader] = None,
        output_dir: str = "orders",
    ):
        """
        Initialize the Order Downloader.

        Args:
            sp_api_client: SP-API client instance
            config_loader: Configuration loader instance
            output_dir: Directory to save order reports
        """
        self.sp_api = sp_api_client or SPAPIClient()
        self.config = config_loader or ConfigLoader()
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Load settings
        settings = self.config.load_settings()
        order_settings = settings.get("automation", {}).get("order_download", {})

        self.hours_lookback = order_settings.get("hours_lookback", 24)
        self.include_statuses = order_settings.get(
            "order_statuses",
            ["Unshipped", "PartiallyShipped", "Pending"]
        )

    def _get_orders_api(self):
        """Get an Orders API instance."""
        return Orders(
            credentials=self.sp_api.credentials,
            marketplace=self.sp_api.marketplace,
        )

    def get_recent_orders(
        self,
        hours: Optional[int] = None,
        statuses: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get orders from the last N hours.

        Args:
            hours: Hours to look back (default: 24)
            statuses: Order statuses to include

        Returns:
            List of order dictionaries
        """
        hours = hours or self.hours_lookback
        statuses = statuses or self.include_statuses

        created_after = datetime.utcnow() - timedelta(hours=hours)

        self.logger.info(
            f"Fetching orders from the last {hours} hours "
            f"(since {created_after.isoformat()})"
        )

        orders_api = self._get_orders_api()
        all_orders = []
        next_token = None

        try:
            while True:
                if next_token:
                    response = orders_api.get_orders(
                        MarketplaceIds=[self.sp_api.marketplace.marketplace_id],
                        NextToken=next_token,
                    )
                else:
                    response = orders_api.get_orders(
                        MarketplaceIds=[self.sp_api.marketplace.marketplace_id],
                        CreatedAfter=created_after.isoformat(),
                        OrderStatuses=statuses,
                    )

                orders = response.payload.get("Orders", [])
                all_orders.extend(orders)

                next_token = response.payload.get("NextToken")
                if not next_token:
                    break

            self.logger.info(f"Found {len(all_orders)} orders")
            return all_orders

        except SellingApiException as e:
            self.logger.error(f"Error fetching orders: {e}")
            raise

    def get_order_items(self, order_id: str) -> List[Dict[str, Any]]:
        """
        Get items for a specific order.

        Args:
            order_id: Amazon order ID

        Returns:
            List of order item dictionaries
        """
        orders_api = self._get_orders_api()

        try:
            response = orders_api.get_order_items(order_id=order_id)
            return response.payload.get("OrderItems", [])

        except SellingApiException as e:
            self.logger.error(f"Error fetching items for order {order_id}: {e}")
            return []

    def extract_customization(self, order_item: Dict[str, Any]) -> Dict[str, str]:
        """
        Extract customization details (font, color, name) from an order item.

        Amazon stores customization in various fields depending on how the
        listing is configured. This method checks multiple locations.

        Args:
            order_item: Order item dictionary

        Returns:
            Dictionary with font, font_color, and custom_text
        """
        customization = {
            "font": "Not Specified",
            "font_color": "Not Specified",
            "custom_text": "Not Specified",
        }

        # Check BuyerCustomizedInfo (for Amazon Custom products)
        buyer_info = order_item.get("BuyerCustomizedInfo", {})
        customized_url = buyer_info.get("CustomizedURL", "")

        # Check ProductInfo for variation attributes
        product_info = order_item.get("ProductInfo", {})

        # Check item title for customization hints
        title = order_item.get("Title", "")

        # Check SellerSKU for variant info
        sku = order_item.get("SellerSKU", "")

        # Parse customization from various sources
        # Option 1: Look in item attributes/variation attributes
        item_attrs = order_item.get("ItemAttributes", {})

        # Option 2: Check for custom text in order item
        customization_info = order_item.get("BuyerCustomizedInfo", {})
        if customization_info:
            # Amazon Custom provides a URL to fetch customization data
            customization["has_customization_url"] = True
            customization["customization_url"] = customization_info.get("CustomizedURL", "")

        # Option 3: Parse from variation/option fields
        # These fields vary by listing type
        variation_attrs = order_item.get("VariationAttributes", [])
        for attr in variation_attrs:
            attr_name = attr.get("Name", "").lower()
            attr_value = attr.get("Value", "")

            if "font" in attr_name and "color" not in attr_name:
                customization["font"] = attr_value
            elif "color" in attr_name or "colour" in attr_name:
                customization["font_color"] = attr_value
            elif "text" in attr_name or "name" in attr_name or "personalization" in attr_name:
                customization["custom_text"] = attr_value

        # Option 4: Check for gift message (sometimes used for personalization)
        gift_info = order_item.get("BuyerInfo", {})
        gift_message = gift_info.get("GiftMessageText", "")
        if gift_message and customization["custom_text"] == "Not Specified":
            customization["custom_text"] = gift_message

        # Store raw data for debugging
        customization["raw_sku"] = sku
        customization["raw_title"] = title

        return customization

    def organize_orders(
        self,
        orders: List[Dict[str, Any]]
    ) -> Dict[str, Dict[str, Dict[str, List[Dict[str, Any]]]]]:
        """
        Organize orders by listing → font → font color → customer details.

        Args:
            orders: List of order dictionaries

        Returns:
            Nested dictionary organized by listing/font/color
        """
        organized = defaultdict(
            lambda: defaultdict(
                lambda: defaultdict(list)
            )
        )

        for order in orders:
            order_id = order.get("AmazonOrderId", "Unknown")

            # Get customer/shipping info
            shipping_address = order.get("ShippingAddress", {})
            customer_name = shipping_address.get("Name", "Unknown Customer")

            # Get order items
            items = self.get_order_items(order_id)

            for item in items:
                # Get listing/product info
                asin = item.get("ASIN", "Unknown")
                sku = item.get("SellerSKU", "Unknown")
                title = item.get("Title", "Unknown Product")
                quantity = item.get("QuantityOrdered", 1)

                # Create a short listing key
                listing_key = f"{title[:50]}... ({asin})" if len(title) > 50 else f"{title} ({asin})"

                # Extract customization
                customization = self.extract_customization(item)

                font = customization.get("font", "Not Specified")
                font_color = customization.get("font_color", "Not Specified")
                custom_text = customization.get("custom_text", "Not Specified")

                # Create order entry
                order_entry = {
                    "order_id": order_id,
                    "customer_name": customer_name,
                    "custom_text": custom_text,
                    "quantity": quantity,
                    "sku": sku,
                    "asin": asin,
                    "order_date": order.get("PurchaseDate", ""),
                    "ship_by": order.get("LatestShipDate", ""),
                    "shipping_address": shipping_address,
                    "customization_url": customization.get("customization_url", ""),
                }

                # Add to organized structure
                organized[listing_key][font][font_color].append(order_entry)

        return dict(organized)

    def generate_report(
        self,
        organized_orders: Dict[str, Any],
        include_addresses: bool = False,
    ) -> str:
        """
        Generate a human-readable report of organized orders.

        Args:
            organized_orders: Orders organized by listing/font/color
            include_addresses: Whether to include shipping addresses

        Returns:
            Formatted report string
        """
        lines = []
        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")

        lines.append("=" * 70)
        lines.append(f"AMAZON ORDERS REPORT - {timestamp}")
        lines.append(f"Orders from the last {self.hours_lookback} hours")
        lines.append("=" * 70)
        lines.append("")

        total_orders = 0
        total_items = 0

        for listing, fonts in organized_orders.items():
            lines.append("─" * 70)
            lines.append(f"📦 LISTING: {listing}")
            lines.append("─" * 70)

            for font, colors in fonts.items():
                lines.append(f"\n  🔤 FONT: {font}")

                for color, orders in colors.items():
                    lines.append(f"\n    🎨 COLOR: {color}")
                    lines.append(f"    {'─' * 50}")

                    for order in orders:
                        total_orders += 1
                        total_items += order.get("quantity", 1)

                        lines.append(f"\n      👤 Customer: {order['customer_name']}")
                        lines.append(f"         Custom Text: {order['custom_text']}")
                        lines.append(f"         Quantity: {order['quantity']}")
                        lines.append(f"         Order ID: {order['order_id']}")
                        lines.append(f"         Ship By: {order['ship_by'][:10] if order['ship_by'] else 'N/A'}")

                        if order.get("customization_url"):
                            lines.append(f"         Customization URL: {order['customization_url']}")

                        if include_addresses and order.get("shipping_address"):
                            addr = order["shipping_address"]
                            lines.append(f"         Ship To: {addr.get('City', '')}, {addr.get('StateOrRegion', '')} {addr.get('PostalCode', '')}")

            lines.append("")

        # Summary
        lines.append("")
        lines.append("=" * 70)
        lines.append("SUMMARY")
        lines.append("=" * 70)
        lines.append(f"Total Listings: {len(organized_orders)}")
        lines.append(f"Total Orders: {total_orders}")
        lines.append(f"Total Items: {total_items}")
        lines.append("=" * 70)

        return "\n".join(lines)

    def save_report(
        self,
        report: str,
        organized_orders: Dict[str, Any],
        filename_prefix: str = "orders",
    ) -> Dict[str, str]:
        """
        Save the report to files.

        Args:
            report: Text report content
            organized_orders: Organized orders data
            filename_prefix: Prefix for output files

        Returns:
            Dictionary with paths to saved files
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")

        # Save text report
        txt_path = self.output_dir / f"{filename_prefix}_{timestamp}.txt"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(report)

        # Save JSON data (for programmatic access)
        json_path = self.output_dir / f"{filename_prefix}_{timestamp}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(organized_orders, f, indent=2, default=str)

        self.logger.info(f"Saved text report to: {txt_path}")
        self.logger.info(f"Saved JSON data to: {json_path}")

        return {
            "text_report": str(txt_path),
            "json_data": str(json_path),
        }

    def run_download(
        self,
        hours: Optional[int] = None,
        dry_run: bool = False,
        include_addresses: bool = False,
    ) -> Dict[str, Any]:
        """
        Run the full order download and organization process.

        Args:
            hours: Hours to look back (default: 24)
            dry_run: If True, don't save files
            include_addresses: Include shipping addresses in report

        Returns:
            Results including report and file paths
        """
        self.logger.info(
            f"Starting order download (hours: {hours or self.hours_lookback}, dry_run: {dry_run})"
        )

        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "dry_run": dry_run,
            "hours_lookback": hours or self.hours_lookback,
            "orders_found": 0,
            "items_found": 0,
            "listings": 0,
            "report": "",
            "files": {},
            "organized_data": {},
        }

        try:
            # Fetch orders
            orders = self.get_recent_orders(hours=hours)
            results["orders_found"] = len(orders)

            if not orders:
                self.logger.info("No orders found in the specified time range")
                results["report"] = "No orders found in the specified time range."
                return results

            # Organize orders
            organized = self.organize_orders(orders)
            results["organized_data"] = organized
            results["listings"] = len(organized)

            # Count total items
            for listing, fonts in organized.items():
                for font, colors in fonts.items():
                    for color, order_list in colors.items():
                        results["items_found"] += len(order_list)

            # Generate report
            report = self.generate_report(organized, include_addresses)
            results["report"] = report

            # Print to console
            print(report)

            # Save files (unless dry run)
            if not dry_run:
                files = self.save_report(report, organized)
                results["files"] = files

        except Exception as e:
            self.logger.error(f"Order download error: {e}")
            results["error"] = str(e)
            raise

        self._log_summary(results)
        return results

    def _log_summary(self, results: Dict[str, Any]):
        """Log a summary of the download process."""
        self.logger.info("=" * 50)
        self.logger.info("ORDER DOWNLOAD SUMMARY")
        self.logger.info("=" * 50)
        self.logger.info(f"Hours lookback: {results['hours_lookback']}")
        self.logger.info(f"Orders found: {results['orders_found']}")
        self.logger.info(f"Total items: {results['items_found']}")
        self.logger.info(f"Unique listings: {results['listings']}")
        if results.get("files"):
            self.logger.info(f"Text report: {results['files'].get('text_report')}")
            self.logger.info(f"JSON data: {results['files'].get('json_data')}")
        self.logger.info("=" * 50)


def run_daily_order_download():
    """Entry point for daily order download automation (GitHub Action)."""
    import sys

    downloader = OrderDownloader()

    # Check environment variables for configuration
    dry_run = os.getenv("DRY_RUN", "false").lower() == "true"
    hours = int(os.getenv("HOURS_LOOKBACK", "24"))
    include_addresses = os.getenv("INCLUDE_ADDRESSES", "false").lower() == "true"

    print("=" * 60)
    print("SHELZY'S DESIGNS - AMAZON ORDER DOWNLOADER")
    print("=" * 60)
    print(f"  Hours lookback: {hours}")
    print(f"  Include addresses: {include_addresses}")
    print(f"  Dry run: {dry_run}")
    print("=" * 60)
    print()

    try:
        results = downloader.run_download(
            hours=hours,
            dry_run=dry_run,
            include_addresses=include_addresses,
        )

        # Output for GitHub Actions
        if os.getenv("GITHUB_OUTPUT"):
            with open(os.environ["GITHUB_OUTPUT"], "a") as f:
                f.write(f"orders_found={results['orders_found']}\n")
                f.write(f"items_found={results['items_found']}\n")
                f.write(f"listings={results['listings']}\n")
                if results.get("files"):
                    f.write(f"text_report={results['files'].get('text_report', '')}\n")
                    f.write(f"json_data={results['files'].get('json_data', '')}\n")

        if results.get("error"):
            print(f"\nError: {results['error']}")
            sys.exit(1)

        print("\n✅ Order download completed successfully!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    run_daily_order_download()
