"""
Amazon Selling Partner API (SP-API) Client

Handles authentication and requests to Amazon SP-API for:
- Listing management (Listings Items API)
- Order retrieval
- Review solicitation (Solicitations API)
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from sp_api.api import (
    ListingsItems,
    Orders,
    Solicitations,
    CatalogItems,
)
from sp_api.base import Marketplaces, SellingApiException

from ..utils.logger import LoggerMixin


class SPAPIClient(LoggerMixin):
    """
    Client for Amazon Selling Partner API operations.

    Handles listing updates, order retrieval, and review solicitations.
    """

    def __init__(
        self,
        refresh_token: Optional[str] = None,
        lwa_app_id: Optional[str] = None,
        lwa_client_secret: Optional[str] = None,
        aws_access_key: Optional[str] = None,
        aws_secret_key: Optional[str] = None,
        role_arn: Optional[str] = None,
        marketplace: Marketplaces = Marketplaces.US,
    ):
        """
        Initialize the SP-API client.

        Credentials can be passed directly or loaded from environment variables.

        Args:
            refresh_token: LWA refresh token
            lwa_app_id: LWA application ID
            lwa_client_secret: LWA client secret
            aws_access_key: AWS access key
            aws_secret_key: AWS secret key
            role_arn: AWS IAM role ARN for SP-API access
            marketplace: Amazon marketplace (default: US)
        """
        self.credentials = {
            "refresh_token": refresh_token or os.getenv("SP_API_REFRESH_TOKEN"),
            "lwa_app_id": lwa_app_id or os.getenv("LWA_APP_ID"),
            "lwa_client_secret": lwa_client_secret or os.getenv("LWA_CLIENT_SECRET"),
            "aws_access_key": aws_access_key or os.getenv("SP_API_AWS_ACCESS_KEY"),
            "aws_secret_key": aws_secret_key or os.getenv("SP_API_AWS_SECRET_KEY"),
            "role_arn": role_arn or os.getenv("SP_API_ROLE_ARN"),
        }
        self.marketplace = marketplace
        self.seller_id = os.getenv("AMAZON_SELLER_ID")

        self._validate_credentials()

    def _validate_credentials(self):
        """Validate that all required credentials are present."""
        required = ["refresh_token", "lwa_app_id", "lwa_client_secret"]
        missing = [k for k in required if not self.credentials.get(k)]

        if missing:
            self.logger.warning(
                f"Missing credentials: {missing}. "
                "API calls may fail without proper authentication."
            )

    def _get_api_instance(self, api_class):
        """
        Create an API instance with current credentials.

        Args:
            api_class: The SP-API class to instantiate

        Returns:
            Configured API instance
        """
        return api_class(
            credentials=self.credentials,
            marketplace=self.marketplace,
        )

    # ==================== Listing Operations ====================

    def update_listing(
        self,
        sku: str,
        product_type: str,
        attributes: Dict[str, Any],
        requirements: str = "LISTING",
        mode: str = "VALIDATION_PREVIEW",
    ) -> Dict[str, Any]:
        """
        Update or create a listing using the Listings Items API.

        Args:
            sku: Seller SKU for the listing
            product_type: Amazon product type
            attributes: Listing attributes including title, bullets, etc.
            requirements: LISTING or LISTING_OFFER_ONLY
            mode: VALIDATION_PREVIEW or VALIDATION_ONLY

        Returns:
            API response containing status and any issues
        """
        listings_api = self._get_api_instance(ListingsItems)

        try:
            self.logger.info(f"Updating listing for SKU: {sku}")

            response = listings_api.put_listings_item(
                sellerId=self.seller_id,
                sku=sku,
                marketplaceIds=[self.marketplace.marketplace_id],
                body={
                    "productType": product_type,
                    "requirements": requirements,
                    "attributes": attributes,
                },
            )

            self.logger.info(f"Listing update response for {sku}: {response.payload}")
            return response.payload

        except SellingApiException as e:
            self.logger.error(f"SP-API error updating listing {sku}: {e}")
            raise

    def update_listing_attributes(
        self,
        sku: str,
        title: str,
        bullet_points: List[str],
        description: str,
        search_terms: str,
        brand: str = "Shelzy's Designs",
    ) -> Dict[str, Any]:
        """
        Update listing with optimized content.

        Args:
            sku: Seller SKU
            title: Optimized product title
            bullet_points: List of bullet point strings
            description: Product description
            search_terms: Backend search terms (space-separated)
            brand: Brand name

        Returns:
            API response
        """
        # Format attributes for SP-API Listings Items format
        attributes = {
            "item_name": [{"value": title, "marketplace_id": self.marketplace.marketplace_id}],
            "brand": [{"value": brand, "marketplace_id": self.marketplace.marketplace_id}],
            "bullet_point": [
                {"value": bp, "marketplace_id": self.marketplace.marketplace_id}
                for bp in bullet_points
            ],
            "product_description": [
                {"value": description, "marketplace_id": self.marketplace.marketplace_id}
            ],
            "generic_keyword": [
                {"value": search_terms, "marketplace_id": self.marketplace.marketplace_id}
            ],
        }

        return self.update_listing(
            sku=sku,
            product_type="DRINKING_CUP",
            attributes=attributes,
            mode="VALIDATION_PREVIEW",
        )

    def get_listing(self, sku: str) -> Dict[str, Any]:
        """
        Get current listing information.

        Args:
            sku: Seller SKU

        Returns:
            Listing data
        """
        listings_api = self._get_api_instance(ListingsItems)

        try:
            response = listings_api.get_listings_item(
                sellerId=self.seller_id,
                sku=sku,
                marketplaceIds=[self.marketplace.marketplace_id],
            )
            return response.payload

        except SellingApiException as e:
            self.logger.error(f"Error getting listing {sku}: {e}")
            raise

    # ==================== Order Operations ====================

    def get_orders(
        self,
        created_after: Optional[datetime] = None,
        order_statuses: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get orders from Amazon.

        Args:
            created_after: Only return orders created after this date
            order_statuses: Filter by order status (e.g., Shipped, Delivered)

        Returns:
            List of order dictionaries
        """
        orders_api = self._get_api_instance(Orders)

        if created_after is None:
            created_after = datetime.utcnow() - timedelta(days=30)

        if order_statuses is None:
            order_statuses = ["Shipped"]

        try:
            response = orders_api.get_orders(
                MarketplaceIds=[self.marketplace.marketplace_id],
                CreatedAfter=created_after.isoformat(),
                OrderStatuses=order_statuses,
            )
            return response.payload.get("Orders", [])

        except SellingApiException as e:
            self.logger.error(f"Error getting orders: {e}")
            raise

    def get_delivered_orders(
        self,
        min_days_ago: int = 5,
        max_days_ago: int = 25,
    ) -> List[Dict[str, Any]]:
        """
        Get orders delivered within a specified date range.
        Used for review request automation.

        Args:
            min_days_ago: Minimum days since delivery
            max_days_ago: Maximum days since delivery

        Returns:
            List of eligible orders
        """
        # Calculate date range
        end_date = datetime.utcnow() - timedelta(days=min_days_ago)
        start_date = datetime.utcnow() - timedelta(days=max_days_ago)

        orders = self.get_orders(
            created_after=start_date,
            order_statuses=["Shipped"],
        )

        # Filter to orders that have been delivered
        eligible_orders = []
        for order in orders:
            # Check if order has been delivered and is within the window
            latest_delivery = order.get("LatestDeliveryDate")
            if latest_delivery:
                try:
                    delivery_date = datetime.fromisoformat(
                        latest_delivery.replace("Z", "+00:00")
                    )
                    if start_date <= delivery_date <= end_date:
                        eligible_orders.append(order)
                except (ValueError, TypeError):
                    continue

        self.logger.info(
            f"Found {len(eligible_orders)} orders eligible for review requests"
        )
        return eligible_orders

    # ==================== Review Solicitation ====================

    def request_review(self, order_id: str) -> Dict[str, Any]:
        """
        Send a review request for an order via Solicitations API.

        Args:
            order_id: Amazon order ID

        Returns:
            API response
        """
        solicitations_api = self._get_api_instance(Solicitations)

        try:
            self.logger.info(f"Requesting review for order: {order_id}")

            response = solicitations_api.create_product_review_and_seller_feedback_solicitation(
                amazonOrderId=order_id,
                marketplaceIds=[self.marketplace.marketplace_id],
            )

            self.logger.info(f"Review request sent for order {order_id}")
            return {"status": "success", "order_id": order_id}

        except SellingApiException as e:
            error_code = getattr(e, "code", "UNKNOWN")
            self.logger.warning(
                f"Could not request review for {order_id}: {error_code} - {e}"
            )
            return {"status": "failed", "order_id": order_id, "error": str(e)}

    def batch_request_reviews(
        self,
        order_ids: List[str],
        delay_ms: int = 1000,
    ) -> Dict[str, Any]:
        """
        Send review requests for multiple orders with rate limiting.

        Args:
            order_ids: List of order IDs
            delay_ms: Delay between requests in milliseconds

        Returns:
            Summary of results
        """
        results = {"successful": [], "failed": [], "total": len(order_ids)}

        for order_id in order_ids:
            result = self.request_review(order_id)

            if result["status"] == "success":
                results["successful"].append(order_id)
            else:
                results["failed"].append(
                    {"order_id": order_id, "error": result.get("error")}
                )

            # Rate limiting
            time.sleep(delay_ms / 1000)

        self.logger.info(
            f"Review requests complete: {len(results['successful'])} successful, "
            f"{len(results['failed'])} failed"
        )
        return results
