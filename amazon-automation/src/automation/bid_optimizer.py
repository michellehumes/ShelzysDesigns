"""
Bid Optimizer Module

Automatically adjusts keyword bids based on performance rules:
- Increase bids 15% when ACoS < 20% and 3+ conversions
- Decrease bids 20% when ACoS > 40% and 20+ clicks
- Pause keywords when ACoS > 60%, $15+ spent, 0 conversions
- Add negatives when 15+ clicks, $10+ spent, 0 conversions
"""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from ..api.advertising_client import AdvertisingClient
from ..utils.config_loader import ConfigLoader
from ..utils.logger import LoggerMixin


class BidOptimizer(LoggerMixin):
    """
    Optimizes PPC bids based on performance data.

    Implements automated bid adjustments and negative keyword
    management according to defined rules.
    """

    def __init__(
        self,
        advertising_client: Optional[AdvertisingClient] = None,
        config_loader: Optional[ConfigLoader] = None,
    ):
        """
        Initialize the Bid Optimizer.

        Args:
            advertising_client: Advertising API client instance
            config_loader: Configuration loader instance
        """
        self.ads_client = advertising_client or AdvertisingClient()
        self.config = config_loader or ConfigLoader()

        # Load optimization rules
        self.rules = self.config.get_bid_rules()

        # Set rule parameters with defaults
        self._setup_rules()

    def _setup_rules(self):
        """Set up optimization rule parameters."""
        # Increase bid rule: ACoS < 20%, 3+ conversions
        increase_rule = self.rules.get("increase_bid", {})
        self.increase_acos_threshold = 20
        self.increase_conversions_min = 3
        self.increase_percent = increase_rule.get("adjustment_percent", 15)
        self.max_bid = increase_rule.get("max_bid", 3.00)

        # Decrease bid rule: ACoS > 40%, 20+ clicks
        decrease_rule = self.rules.get("decrease_bid", {})
        self.decrease_acos_threshold = 40
        self.decrease_clicks_min = 20
        self.decrease_percent = abs(decrease_rule.get("adjustment_percent", -20))
        self.min_bid = decrease_rule.get("min_bid", 0.20)

        # Pause keyword rule: ACoS > 60%, $15+ spent, 0 conversions
        pause_rule = self.rules.get("pause_keyword", {})
        self.pause_acos_threshold = 60
        self.pause_spend_min = 15
        self.pause_conversions_max = 0

        # Add negative rule: 15+ clicks, $10+ spent, 0 conversions
        negative_rule = self.rules.get("add_negative", {})
        self.negative_clicks_min = 15
        self.negative_spend_min = 10
        self.negative_conversions_max = 0

    def calculate_acos(self, cost: float, sales: float) -> float:
        """Calculate ACoS (Advertising Cost of Sales)."""
        if sales <= 0:
            return float("inf") if cost > 0 else 0
        return (cost / sales) * 100

    def analyze_keyword_performance(
        self,
        keyword_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Analyze a keyword's performance and determine action.

        Args:
            keyword_data: Keyword performance data from report

        Returns:
            Analysis result with recommended action
        """
        clicks = keyword_data.get("clicks", 0)
        cost = keyword_data.get("cost", 0)
        sales = keyword_data.get("sales1d", 0) or keyword_data.get("sales", 0)
        conversions = keyword_data.get("purchases1d", 0) or keyword_data.get("conversions", 0)
        current_bid = keyword_data.get("bid", 0)

        acos = self.calculate_acos(cost, sales)

        result = {
            "keyword_id": keyword_data.get("keywordId") or keyword_data.get("targetId"),
            "keyword_text": keyword_data.get("keywordText") or keyword_data.get("targetingExpression"),
            "clicks": clicks,
            "cost": cost,
            "sales": sales,
            "conversions": conversions,
            "acos": acos,
            "current_bid": current_bid,
            "action": "none",
            "new_bid": None,
            "reason": None,
        }

        # Check rules in priority order

        # 1. Pause rule: ACoS > 60%, $15+ spent, 0 conversions
        if (
            acos > self.pause_acos_threshold
            and cost >= self.pause_spend_min
            and conversions == self.pause_conversions_max
        ):
            result["action"] = "pause"
            result["reason"] = (
                f"ACoS {acos:.1f}% > {self.pause_acos_threshold}%, "
                f"${cost:.2f} spent, {conversions} conversions"
            )
            return result

        # 2. Increase rule: ACoS < 20%, 3+ conversions
        if acos < self.increase_acos_threshold and conversions >= self.increase_conversions_min:
            new_bid = min(
                current_bid * (1 + self.increase_percent / 100),
                self.max_bid
            )
            if new_bid > current_bid:
                result["action"] = "increase_bid"
                result["new_bid"] = round(new_bid, 2)
                result["reason"] = (
                    f"ACoS {acos:.1f}% < {self.increase_acos_threshold}%, "
                    f"{conversions} conversions"
                )
                return result

        # 3. Decrease rule: ACoS > 40%, 20+ clicks
        if acos > self.decrease_acos_threshold and clicks >= self.decrease_clicks_min:
            new_bid = max(
                current_bid * (1 - self.decrease_percent / 100),
                self.min_bid
            )
            if new_bid < current_bid:
                result["action"] = "decrease_bid"
                result["new_bid"] = round(new_bid, 2)
                result["reason"] = (
                    f"ACoS {acos:.1f}% > {self.decrease_acos_threshold}%, "
                    f"{clicks} clicks"
                )
                return result

        return result

    def analyze_search_term(
        self,
        search_term_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Analyze a search term for negative keyword potential.

        Args:
            search_term_data: Search term performance data

        Returns:
            Analysis result with recommendation
        """
        clicks = search_term_data.get("clicks", 0)
        cost = search_term_data.get("cost", 0)
        conversions = search_term_data.get("purchases1d", 0) or search_term_data.get("conversions", 0)
        query = search_term_data.get("query", "")

        result = {
            "search_term": query,
            "clicks": clicks,
            "cost": cost,
            "conversions": conversions,
            "campaign_id": search_term_data.get("campaignId"),
            "ad_group_id": search_term_data.get("adGroupId"),
            "add_as_negative": False,
            "reason": None,
        }

        # Check negative keyword rule: 15+ clicks, $10+ spent, 0 conversions
        if (
            clicks >= self.negative_clicks_min
            and cost >= self.negative_spend_min
            and conversions == self.negative_conversions_max
        ):
            result["add_as_negative"] = True
            result["reason"] = (
                f"{clicks} clicks, ${cost:.2f} spent, {conversions} conversions"
            )

        return result

    def run_optimization(
        self,
        lookback_days: int = 7,
        dry_run: bool = False,
    ) -> Dict[str, Any]:
        """
        Run the full bid optimization process.

        Args:
            lookback_days: Number of days of data to analyze
            dry_run: If True, analyze but don't make changes

        Returns:
            Optimization summary with all actions taken
        """
        self.logger.info(
            f"Starting bid optimization (lookback: {lookback_days} days, "
            f"dry_run: {dry_run})"
        )

        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "lookback_days": lookback_days,
            "dry_run": dry_run,
            "bid_increases": [],
            "bid_decreases": [],
            "paused_keywords": [],
            "new_negatives": [],
            "errors": [],
        }

        try:
            # Get keyword performance data
            self.logger.info("Fetching keyword performance data...")
            keyword_data = self.ads_client.get_keyword_performance(
                lookback_days=lookback_days
            )
            self.logger.info(f"Retrieved performance data for {len(keyword_data)} keywords")

            # Analyze and process keywords
            bid_updates = []

            for kw in keyword_data:
                analysis = self.analyze_keyword_performance(kw)

                if analysis["action"] == "increase_bid":
                    results["bid_increases"].append(analysis)
                    if not dry_run:
                        bid_updates.append({
                            "keywordId": analysis["keyword_id"],
                            "bid": analysis["new_bid"],
                        })

                elif analysis["action"] == "decrease_bid":
                    results["bid_decreases"].append(analysis)
                    if not dry_run:
                        bid_updates.append({
                            "keywordId": analysis["keyword_id"],
                            "bid": analysis["new_bid"],
                        })

                elif analysis["action"] == "pause":
                    results["paused_keywords"].append(analysis)
                    if not dry_run:
                        self.ads_client.update_keyword(
                            keyword_id=analysis["keyword_id"],
                            state="paused",
                        )

            # Apply bid updates in batch
            if bid_updates and not dry_run:
                self.logger.info(f"Applying {len(bid_updates)} bid updates...")
                self.ads_client.batch_update_keywords(bid_updates)

            # Get search term data for negative keyword analysis
            self.logger.info("Fetching search term report...")
            search_term_data = self.ads_client.get_search_term_report(
                lookback_days=lookback_days
            )
            self.logger.info(f"Retrieved {len(search_term_data)} search terms")

            # Analyze search terms
            for st in search_term_data:
                analysis = self.analyze_search_term(st)

                if analysis["add_as_negative"]:
                    results["new_negatives"].append(analysis)
                    if not dry_run and analysis["campaign_id"]:
                        self.ads_client.create_negative_keywords(
                            campaign_id=analysis["campaign_id"],
                            ad_group_id=analysis["ad_group_id"],
                            keywords=[{
                                "text": analysis["search_term"],
                                "match_type": "negative_exact",
                            }],
                            level="adGroup" if analysis["ad_group_id"] else "campaign",
                        )

        except Exception as e:
            self.logger.error(f"Optimization error: {e}")
            results["errors"].append(str(e))

        # Log summary
        self._log_summary(results)

        return results

    def _log_summary(self, results: Dict[str, Any]):
        """Log a summary of optimization results."""
        self.logger.info("=" * 50)
        self.logger.info("BID OPTIMIZATION SUMMARY")
        self.logger.info("=" * 50)
        self.logger.info(f"Dry run: {results['dry_run']}")
        self.logger.info(f"Bid increases: {len(results['bid_increases'])}")
        self.logger.info(f"Bid decreases: {len(results['bid_decreases'])}")
        self.logger.info(f"Paused keywords: {len(results['paused_keywords'])}")
        self.logger.info(f"New negatives: {len(results['new_negatives'])}")
        self.logger.info(f"Errors: {len(results['errors'])}")
        self.logger.info("=" * 50)

        # Log details for each action
        if results["bid_increases"]:
            self.logger.info("\nBid Increases:")
            for item in results["bid_increases"][:10]:  # Limit output
                self.logger.info(
                    f"  {item['keyword_text']}: ${item['current_bid']:.2f} -> "
                    f"${item['new_bid']:.2f} ({item['reason']})"
                )

        if results["bid_decreases"]:
            self.logger.info("\nBid Decreases:")
            for item in results["bid_decreases"][:10]:
                self.logger.info(
                    f"  {item['keyword_text']}: ${item['current_bid']:.2f} -> "
                    f"${item['new_bid']:.2f} ({item['reason']})"
                )

        if results["paused_keywords"]:
            self.logger.info("\nPaused Keywords:")
            for item in results["paused_keywords"][:10]:
                self.logger.info(
                    f"  {item['keyword_text']}: {item['reason']}"
                )

        if results["new_negatives"]:
            self.logger.info("\nNew Negative Keywords:")
            for item in results["new_negatives"][:10]:
                self.logger.info(
                    f"  '{item['search_term']}': {item['reason']}"
                )

    def get_optimization_report(
        self,
        lookback_days: int = 7,
    ) -> Dict[str, Any]:
        """
        Generate an optimization report without making changes.

        Args:
            lookback_days: Number of days of data to analyze

        Returns:
            Detailed report of recommended optimizations
        """
        return self.run_optimization(lookback_days=lookback_days, dry_run=True)


def run_daily_optimization():
    """Entry point for daily bid optimization (GitHub Action)."""
    import sys
    import os
    import json

    optimizer = BidOptimizer()

    # Check for dry run mode
    dry_run = os.getenv("DRY_RUN", "false").lower() == "true"
    lookback_days = int(os.getenv("LOOKBACK_DAYS", "7"))

    print(f"Running bid optimization...")
    print(f"  Lookback days: {lookback_days}")
    print(f"  Dry run: {dry_run}")
    print()

    results = optimizer.run_optimization(
        lookback_days=lookback_days,
        dry_run=dry_run,
    )

    # Print summary
    print("\n" + "=" * 50)
    print("OPTIMIZATION COMPLETE")
    print("=" * 50)
    print(f"Bid increases: {len(results['bid_increases'])}")
    print(f"Bid decreases: {len(results['bid_decreases'])}")
    print(f"Paused keywords: {len(results['paused_keywords'])}")
    print(f"New negatives: {len(results['new_negatives'])}")

    if results["errors"]:
        print(f"\nErrors: {len(results['errors'])}")
        for error in results["errors"]:
            print(f"  - {error}")
        sys.exit(1)

    # Output for GitHub Actions
    if os.getenv("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"bid_increases={len(results['bid_increases'])}\n")
            f.write(f"bid_decreases={len(results['bid_decreases'])}\n")
            f.write(f"paused_keywords={len(results['paused_keywords'])}\n")
            f.write(f"new_negatives={len(results['new_negatives'])}\n")

    print("\nOptimization completed successfully!")


if __name__ == "__main__":
    run_daily_optimization()
