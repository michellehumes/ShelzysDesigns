"""
Review Requester Module

Automatically requests reviews for delivered orders via SP-API Solicitations endpoint.
Targets orders delivered 5-25 days ago.
"""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
import time

from ..api.sp_api_client import SPAPIClient
from ..utils.config_loader import ConfigLoader
from ..utils.logger import LoggerMixin


class ReviewRequester(LoggerMixin):
    """
    Automates review request solicitations.

    Finds eligible orders (delivered 5-25 days ago) and sends
    review requests via the Solicitations API.
    """

    def __init__(
        self,
        sp_api_client: Optional[SPAPIClient] = None,
        config_loader: Optional[ConfigLoader] = None,
    ):
        """
        Initialize the Review Requester.

        Args:
            sp_api_client: SP-API client instance
            config_loader: Configuration loader instance
        """
        self.sp_api = sp_api_client or SPAPIClient()
        self.config = config_loader or ConfigLoader()

        # Load settings
        settings = self.config.load_settings()
        review_settings = settings.get("automation", {}).get("review_requests", {})

        self.min_days = review_settings.get("min_days_after_delivery", 5)
        self.max_days = review_settings.get("max_days_after_delivery", 25)
        self.batch_size = review_settings.get("batch_size", 50)
        self.delay_ms = review_settings.get("delay_between_requests_ms", 1000)

    def get_eligible_orders(self) -> List[Dict[str, Any]]:
        """
        Get orders eligible for review requests.

        Returns:
            List of eligible orders with order IDs
        """
        self.logger.info(
            f"Finding orders delivered {self.min_days}-{self.max_days} days ago"
        )

        try:
            orders = self.sp_api.get_delivered_orders(
                min_days_ago=self.min_days,
                max_days_ago=self.max_days,
            )

            self.logger.info(f"Found {len(orders)} eligible orders")
            return orders

        except Exception as e:
            self.logger.error(f"Error fetching eligible orders: {e}")
            raise

    def request_review(self, order_id: str) -> Dict[str, Any]:
        """
        Request a review for a single order.

        Args:
            order_id: Amazon order ID

        Returns:
            Request result with status
        """
        return self.sp_api.request_review(order_id)

    def run_review_requests(
        self,
        max_requests: Optional[int] = None,
        dry_run: bool = False,
    ) -> Dict[str, Any]:
        """
        Run the review request process.

        Args:
            max_requests: Maximum number of requests to send (None = no limit)
            dry_run: If True, find orders but don't send requests

        Returns:
            Summary of results
        """
        self.logger.info(
            f"Starting review request process (dry_run: {dry_run})"
        )

        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "dry_run": dry_run,
            "eligible_orders": 0,
            "requests_sent": 0,
            "successful": [],
            "failed": [],
            "skipped": [],
        }

        try:
            # Get eligible orders
            eligible_orders = self.get_eligible_orders()
            results["eligible_orders"] = len(eligible_orders)

            if not eligible_orders:
                self.logger.info("No eligible orders found")
                return results

            # Apply batch size limit
            if self.batch_size:
                eligible_orders = eligible_orders[: self.batch_size]

            # Apply max requests limit
            if max_requests:
                eligible_orders = eligible_orders[:max_requests]

            self.logger.info(f"Processing {len(eligible_orders)} orders")

            # Process each order
            for order in eligible_orders:
                order_id = order.get("AmazonOrderId")

                if not order_id:
                    continue

                if dry_run:
                    results["skipped"].append({
                        "order_id": order_id,
                        "reason": "dry_run",
                    })
                    continue

                # Send review request
                result = self.request_review(order_id)
                results["requests_sent"] += 1

                if result.get("status") == "success":
                    results["successful"].append(order_id)
                else:
                    results["failed"].append({
                        "order_id": order_id,
                        "error": result.get("error"),
                    })

                # Rate limiting
                time.sleep(self.delay_ms / 1000)

        except Exception as e:
            self.logger.error(f"Review request process error: {e}")
            results["error"] = str(e)

        # Log summary
        self._log_summary(results)

        return results

    def _log_summary(self, results: Dict[str, Any]):
        """Log a summary of the review request process."""
        self.logger.info("=" * 50)
        self.logger.info("REVIEW REQUEST SUMMARY")
        self.logger.info("=" * 50)
        self.logger.info(f"Dry run: {results['dry_run']}")
        self.logger.info(f"Eligible orders found: {results['eligible_orders']}")
        self.logger.info(f"Requests sent: {results['requests_sent']}")
        self.logger.info(f"Successful: {len(results['successful'])}")
        self.logger.info(f"Failed: {len(results['failed'])}")
        self.logger.info(f"Skipped: {len(results['skipped'])}")
        self.logger.info("=" * 50)

        if results["failed"]:
            self.logger.warning("\nFailed requests:")
            for fail in results["failed"][:10]:
                self.logger.warning(f"  {fail['order_id']}: {fail['error']}")

    def get_request_history(self, days: int = 30) -> Dict[str, Any]:
        """
        Get summary of review request activity.

        Note: This is a placeholder - actual implementation would require
        tracking requests in a database or file.

        Args:
            days: Number of days of history to retrieve

        Returns:
            Request history summary
        """
        # This would typically query a database of past requests
        return {
            "notice": "Request history tracking requires database implementation",
            "days_requested": days,
        }


class ReviewRequestTracker:
    """
    Tracks review request history to avoid duplicate requests.

    Stores request history in a JSON file.
    """

    def __init__(self, history_file: str = "review_request_history.json"):
        """
        Initialize the tracker.

        Args:
            history_file: Path to history file
        """
        import json
        from pathlib import Path

        self.history_file = Path(history_file)
        self._history: Dict[str, Any] = {}

        self._load_history()

    def _load_history(self):
        """Load history from file."""
        import json

        if self.history_file.exists():
            with open(self.history_file, "r") as f:
                self._history = json.load(f)
        else:
            self._history = {"requests": {}}

    def _save_history(self):
        """Save history to file."""
        import json

        with open(self.history_file, "w") as f:
            json.dump(self._history, f, indent=2)

    def has_been_requested(self, order_id: str) -> bool:
        """Check if an order has already been requested."""
        return order_id in self._history.get("requests", {})

    def record_request(
        self,
        order_id: str,
        status: str,
        error: Optional[str] = None,
    ):
        """Record a review request."""
        if "requests" not in self._history:
            self._history["requests"] = {}

        self._history["requests"][order_id] = {
            "timestamp": datetime.utcnow().isoformat(),
            "status": status,
            "error": error,
        }

        self._save_history()

    def get_recent_requests(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get requests from the last N days."""
        cutoff = datetime.utcnow() - timedelta(days=days)
        recent = []

        for order_id, data in self._history.get("requests", {}).items():
            try:
                request_time = datetime.fromisoformat(data["timestamp"])
                if request_time >= cutoff:
                    recent.append({
                        "order_id": order_id,
                        **data,
                    })
            except (ValueError, KeyError):
                continue

        return recent

    def cleanup_old_requests(self, days: int = 90):
        """Remove requests older than N days."""
        cutoff = datetime.utcnow() - timedelta(days=days)
        cleaned = 0

        requests = self._history.get("requests", {}).copy()
        for order_id, data in requests.items():
            try:
                request_time = datetime.fromisoformat(data["timestamp"])
                if request_time < cutoff:
                    del self._history["requests"][order_id]
                    cleaned += 1
            except (ValueError, KeyError):
                continue

        if cleaned:
            self._save_history()

        return cleaned


def run_daily_review_requests():
    """Entry point for daily review request automation (GitHub Action)."""
    import sys
    import os

    requester = ReviewRequester()

    # Check for dry run mode
    dry_run = os.getenv("DRY_RUN", "false").lower() == "true"
    max_requests = int(os.getenv("MAX_REQUESTS", "0")) or None

    print("Running review request automation...")
    print(f"  Min days after delivery: {requester.min_days}")
    print(f"  Max days after delivery: {requester.max_days}")
    print(f"  Batch size: {requester.batch_size}")
    print(f"  Dry run: {dry_run}")
    if max_requests:
        print(f"  Max requests: {max_requests}")
    print()

    results = requester.run_review_requests(
        max_requests=max_requests,
        dry_run=dry_run,
    )

    # Print summary
    print("\n" + "=" * 50)
    print("REVIEW REQUESTS COMPLETE")
    print("=" * 50)
    print(f"Eligible orders: {results['eligible_orders']}")
    print(f"Requests sent: {results['requests_sent']}")
    print(f"Successful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")

    if results["failed"]:
        print("\nFailed requests:")
        for fail in results["failed"]:
            print(f"  {fail['order_id']}: {fail['error']}")

    # Output for GitHub Actions
    if os.getenv("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"eligible_orders={results['eligible_orders']}\n")
            f.write(f"requests_sent={results['requests_sent']}\n")
            f.write(f"successful={len(results['successful'])}\n")
            f.write(f"failed={len(results['failed'])}\n")

    if results.get("error"):
        print(f"\nError: {results['error']}")
        sys.exit(1)

    print("\nReview request automation completed successfully!")


if __name__ == "__main__":
    run_daily_review_requests()
