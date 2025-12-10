"""
Amazon Advertising API Client

Handles authentication and requests to Amazon Advertising API for:
- Campaign management
- Ad group management
- Keyword management
- Performance reporting
- Bid optimization
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
import requests

from ..utils.logger import LoggerMixin


class AdvertisingClient(LoggerMixin):
    """
    Client for Amazon Advertising API operations.

    Handles campaign creation, keyword management, and bid optimization.
    """

    BASE_URL = "https://advertising-api.amazon.com"
    TOKEN_URL = "https://api.amazon.com/auth/o2/token"

    def __init__(
        self,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        refresh_token: Optional[str] = None,
        profile_id: Optional[str] = None,
        region: str = "na",
    ):
        """
        Initialize the Advertising API client.

        Args:
            client_id: Amazon Advertising client ID
            client_secret: Amazon Advertising client secret
            refresh_token: OAuth refresh token
            profile_id: Advertising profile ID
            region: API region (na, eu, fe)
        """
        self.client_id = client_id or os.getenv("AMAZON_ADS_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("AMAZON_ADS_CLIENT_SECRET")
        self.refresh_token = refresh_token or os.getenv("AMAZON_ADS_REFRESH_TOKEN")
        self.profile_id = profile_id or os.getenv("AMAZON_ADS_PROFILE_ID")
        self.region = region

        self._access_token = None
        self._token_expires_at = None

        # Set base URL based on region
        if region == "eu":
            self.BASE_URL = "https://advertising-api-eu.amazon.com"
        elif region == "fe":
            self.BASE_URL = "https://advertising-api-fe.amazon.com"

    def _get_access_token(self) -> str:
        """
        Get or refresh the OAuth access token.

        Returns:
            Valid access token
        """
        # Return cached token if still valid
        if self._access_token and self._token_expires_at:
            if datetime.utcnow() < self._token_expires_at - timedelta(minutes=5):
                return self._access_token

        # Request new token
        response = requests.post(
            self.TOKEN_URL,
            data={
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token,
            },
        )
        response.raise_for_status()
        data = response.json()

        self._access_token = data["access_token"]
        self._token_expires_at = datetime.utcnow() + timedelta(
            seconds=data.get("expires_in", 3600)
        )

        return self._access_token

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests."""
        return {
            "Authorization": f"Bearer {self._get_access_token()}",
            "Amazon-Advertising-API-ClientId": self.client_id,
            "Amazon-Advertising-API-Scope": self.profile_id,
            "Content-Type": "application/vnd.spCampaign.v3+json",
            "Accept": "application/vnd.spCampaign.v3+json",
        }

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        content_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Make an authenticated request to the Advertising API.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint path
            data: Request body data
            params: Query parameters
            content_type: Override content type header

        Returns:
            API response data
        """
        url = f"{self.BASE_URL}{endpoint}"
        headers = self._get_headers()

        if content_type:
            headers["Content-Type"] = content_type
            headers["Accept"] = content_type

        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=data,
            params=params,
        )

        if response.status_code >= 400:
            self.logger.error(
                f"API error: {response.status_code} - {response.text}"
            )
            response.raise_for_status()

        if response.text:
            return response.json()
        return {}

    # ==================== Profile Operations ====================

    def get_profiles(self) -> List[Dict[str, Any]]:
        """Get all advertising profiles."""
        headers = {
            "Authorization": f"Bearer {self._get_access_token()}",
            "Amazon-Advertising-API-ClientId": self.client_id,
        }

        response = requests.get(
            f"{self.BASE_URL}/v2/profiles",
            headers=headers,
        )
        response.raise_for_status()
        return response.json()

    # ==================== Campaign Operations ====================

    def create_campaign(
        self,
        name: str,
        campaign_type: str = "sponsoredProducts",
        targeting_type: str = "auto",
        daily_budget: float = 10.0,
        start_date: Optional[str] = None,
        state: str = "enabled",
        bidding_strategy: str = "legacyForSales",
    ) -> Dict[str, Any]:
        """
        Create a new Sponsored Products campaign.

        Args:
            name: Campaign name
            campaign_type: Type of campaign (sponsoredProducts)
            targeting_type: auto or manual
            daily_budget: Daily budget in dollars
            start_date: Start date (YYYYMMDD format) or None for today
            state: Campaign state (enabled, paused, archived)
            bidding_strategy: Bidding strategy

        Returns:
            Created campaign data
        """
        if start_date is None:
            start_date = datetime.utcnow().strftime("%Y%m%d")

        campaign_data = {
            "campaigns": [
                {
                    "name": name,
                    "targetingType": targeting_type.upper(),
                    "state": state,
                    "dynamicBidding": {
                        "strategy": bidding_strategy.upper()
                    },
                    "budget": {
                        "budgetType": "DAILY",
                        "budget": daily_budget,
                    },
                    "startDate": start_date,
                }
            ]
        }

        self.logger.info(f"Creating campaign: {name}")
        return self._make_request(
            "POST",
            "/sp/campaigns",
            data=campaign_data,
        )

    def get_campaigns(
        self,
        state_filter: Optional[str] = None,
        name_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get all campaigns with optional filters.

        Args:
            state_filter: Filter by state (enabled, paused, archived)
            name_filter: Filter by name (contains)

        Returns:
            List of campaigns
        """
        params = {"maxResults": 100}

        if state_filter:
            params["stateFilter"] = state_filter

        response = self._make_request(
            "POST",
            "/sp/campaigns/list",
            data={
                "maxResults": 100,
                "stateFilter": {"include": [state_filter]} if state_filter else None,
                "nameFilter": {"queryTermMatchType": "BROAD_MATCH", "include": [name_filter]} if name_filter else None,
            },
        )

        return response.get("campaigns", [])

    def update_campaign(
        self,
        campaign_id: str,
        state: Optional[str] = None,
        daily_budget: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Update a campaign.

        Args:
            campaign_id: Campaign ID
            state: New state (enabled, paused, archived)
            daily_budget: New daily budget

        Returns:
            Update response
        """
        update_data = {"campaignId": campaign_id}

        if state:
            update_data["state"] = state
        if daily_budget:
            update_data["budget"] = {"budget": daily_budget, "budgetType": "DAILY"}

        return self._make_request(
            "PUT",
            "/sp/campaigns",
            data={"campaigns": [update_data]},
        )

    # ==================== Ad Group Operations ====================

    def create_ad_group(
        self,
        campaign_id: str,
        name: str,
        default_bid: float = 0.75,
        state: str = "enabled",
    ) -> Dict[str, Any]:
        """
        Create an ad group within a campaign.

        Args:
            campaign_id: Parent campaign ID
            name: Ad group name
            default_bid: Default bid amount
            state: Ad group state

        Returns:
            Created ad group data
        """
        ad_group_data = {
            "adGroups": [
                {
                    "campaignId": campaign_id,
                    "name": name,
                    "defaultBid": default_bid,
                    "state": state,
                }
            ]
        }

        self.logger.info(f"Creating ad group: {name}")
        return self._make_request(
            "POST",
            "/sp/adGroups",
            data=ad_group_data,
        )

    def get_ad_groups(self, campaign_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get ad groups, optionally filtered by campaign."""
        filter_data = {"maxResults": 100}
        if campaign_id:
            filter_data["campaignIdFilter"] = {"include": [campaign_id]}

        response = self._make_request(
            "POST",
            "/sp/adGroups/list",
            data=filter_data,
        )
        return response.get("adGroups", [])

    # ==================== Product Ad Operations ====================

    def create_product_ad(
        self,
        campaign_id: str,
        ad_group_id: str,
        sku: str,
        asin: str,
        state: str = "enabled",
    ) -> Dict[str, Any]:
        """
        Create a product ad within an ad group.

        Args:
            campaign_id: Campaign ID
            ad_group_id: Ad group ID
            sku: Product SKU
            asin: Product ASIN
            state: Ad state

        Returns:
            Created product ad data
        """
        ad_data = {
            "productAds": [
                {
                    "campaignId": campaign_id,
                    "adGroupId": ad_group_id,
                    "sku": sku,
                    "asin": asin,
                    "state": state,
                }
            ]
        }

        self.logger.info(f"Creating product ad for ASIN: {asin}")
        return self._make_request(
            "POST",
            "/sp/productAds",
            data=ad_data,
        )

    # ==================== Keyword Operations ====================

    def create_keywords(
        self,
        campaign_id: str,
        ad_group_id: str,
        keywords: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Create keywords for an ad group.

        Args:
            campaign_id: Campaign ID
            ad_group_id: Ad group ID
            keywords: List of keyword dicts with text, match_type, bid

        Returns:
            Created keywords data
        """
        keyword_data = {
            "keywords": [
                {
                    "campaignId": campaign_id,
                    "adGroupId": ad_group_id,
                    "keywordText": kw["text"],
                    "matchType": kw["match_type"].upper(),
                    "bid": kw.get("bid", 0.75),
                    "state": "enabled",
                }
                for kw in keywords
            ]
        }

        self.logger.info(f"Creating {len(keywords)} keywords")
        return self._make_request(
            "POST",
            "/sp/keywords",
            data=keyword_data,
        )

    def get_keywords(
        self,
        campaign_id: Optional[str] = None,
        ad_group_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get keywords with optional filters."""
        filter_data = {"maxResults": 1000}

        if campaign_id:
            filter_data["campaignIdFilter"] = {"include": [campaign_id]}
        if ad_group_id:
            filter_data["adGroupIdFilter"] = {"include": [ad_group_id]}

        response = self._make_request(
            "POST",
            "/sp/keywords/list",
            data=filter_data,
        )
        return response.get("keywords", [])

    def update_keyword(
        self,
        keyword_id: str,
        bid: Optional[float] = None,
        state: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Update a keyword bid or state.

        Args:
            keyword_id: Keyword ID
            bid: New bid amount
            state: New state (enabled, paused, archived)

        Returns:
            Update response
        """
        update_data = {"keywordId": keyword_id}

        if bid is not None:
            update_data["bid"] = bid
        if state:
            update_data["state"] = state

        return self._make_request(
            "PUT",
            "/sp/keywords",
            data={"keywords": [update_data]},
        )

    def batch_update_keywords(
        self,
        updates: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Batch update multiple keywords.

        Args:
            updates: List of update dicts with keywordId, bid, state

        Returns:
            Batch update response
        """
        return self._make_request(
            "PUT",
            "/sp/keywords",
            data={"keywords": updates},
        )

    # ==================== Negative Keyword Operations ====================

    def create_negative_keywords(
        self,
        campaign_id: str,
        ad_group_id: Optional[str],
        keywords: List[Dict[str, Any]],
        level: str = "campaign",
    ) -> Dict[str, Any]:
        """
        Create negative keywords.

        Args:
            campaign_id: Campaign ID
            ad_group_id: Ad group ID (for ad group level negatives)
            keywords: List of keyword dicts with text and match_type
            level: campaign or adGroup

        Returns:
            Created negative keywords data
        """
        if level == "campaign":
            endpoint = "/sp/campaignNegativeKeywords"
            neg_data = {
                "campaignNegativeKeywords": [
                    {
                        "campaignId": campaign_id,
                        "keywordText": kw["text"],
                        "matchType": kw["match_type"].replace("negative_", "").upper(),
                        "state": "enabled",
                    }
                    for kw in keywords
                ]
            }
        else:
            endpoint = "/sp/negativeKeywords"
            neg_data = {
                "negativeKeywords": [
                    {
                        "campaignId": campaign_id,
                        "adGroupId": ad_group_id,
                        "keywordText": kw["text"],
                        "matchType": kw["match_type"].replace("negative_", "").upper(),
                        "state": "enabled",
                    }
                    for kw in keywords
                ]
            }

        self.logger.info(f"Creating {len(keywords)} negative keywords at {level} level")
        return self._make_request("POST", endpoint, data=neg_data)

    # ==================== Targeting Operations (Auto Campaigns) ====================

    def create_auto_targeting(
        self,
        campaign_id: str,
        ad_group_id: str,
        targeting_groups: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Create auto targeting groups for an auto campaign.

        Args:
            campaign_id: Campaign ID
            ad_group_id: Ad group ID
            targeting_groups: List of targeting dicts with type and bid

        Returns:
            Created targeting data
        """
        targeting_data = {
            "targetingClauses": [
                {
                    "campaignId": campaign_id,
                    "adGroupId": ad_group_id,
                    "expression": [{"type": tg["type"]}],
                    "expressionType": "auto",
                    "bid": tg.get("bid", 0.75),
                    "state": "enabled",
                }
                for tg in targeting_groups
            ]
        }

        return self._make_request(
            "POST",
            "/sp/targets",
            data=targeting_data,
        )

    # ==================== Reporting Operations ====================

    def request_report(
        self,
        report_type: str = "spCampaigns",
        metrics: Optional[List[str]] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> str:
        """
        Request a performance report.

        Args:
            report_type: Report type (spCampaigns, spTargeting, spSearchTerm)
            metrics: List of metrics to include
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)

        Returns:
            Report ID for status checking
        """
        if metrics is None:
            metrics = [
                "impressions", "clicks", "cost", "purchases1d",
                "sales1d", "costPerClick", "clickThroughRate"
            ]

        if start_date is None:
            start_date = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
        if end_date is None:
            end_date = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")

        report_data = {
            "reportDate": end_date,
            "metrics": ",".join(metrics),
        }

        # Use v2 reporting endpoint
        headers = self._get_headers()
        headers["Content-Type"] = "application/json"
        headers["Accept"] = "application/json"

        response = requests.post(
            f"{self.BASE_URL}/v2/sp/{report_type}/report",
            headers=headers,
            json=report_data,
        )
        response.raise_for_status()
        return response.json().get("reportId")

    def get_report_status(self, report_id: str) -> Dict[str, Any]:
        """Check status of a report request."""
        headers = self._get_headers()
        headers["Content-Type"] = "application/json"
        headers["Accept"] = "application/json"

        response = requests.get(
            f"{self.BASE_URL}/v2/reports/{report_id}",
            headers=headers,
        )
        response.raise_for_status()
        return response.json()

    def download_report(self, report_url: str) -> List[Dict[str, Any]]:
        """Download and parse a completed report."""
        import gzip
        import io

        response = requests.get(report_url)
        response.raise_for_status()

        # Reports are gzipped JSON
        with gzip.GzipFile(fileobj=io.BytesIO(response.content)) as f:
            return json.loads(f.read().decode("utf-8"))

    def get_keyword_performance(
        self,
        lookback_days: int = 7,
    ) -> List[Dict[str, Any]]:
        """
        Get keyword performance metrics.

        Args:
            lookback_days: Number of days to look back

        Returns:
            List of keyword performance data
        """
        end_date = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
        start_date = (datetime.utcnow() - timedelta(days=lookback_days)).strftime("%Y-%m-%d")

        # Request targeting report
        report_id = self.request_report(
            report_type="spTargeting",
            metrics=[
                "impressions", "clicks", "cost", "purchases1d",
                "sales1d", "campaignId", "adGroupId", "targetId",
            ],
            start_date=start_date,
            end_date=end_date,
        )

        # Poll for completion
        for _ in range(30):
            status = self.get_report_status(report_id)
            if status["status"] == "SUCCESS":
                return self.download_report(status["location"])
            elif status["status"] == "FAILURE":
                raise Exception(f"Report failed: {status}")
            time.sleep(10)

        raise Exception("Report timed out")

    def get_search_term_report(
        self,
        lookback_days: int = 7,
    ) -> List[Dict[str, Any]]:
        """
        Get search term report for negative keyword analysis.

        Args:
            lookback_days: Number of days to look back

        Returns:
            List of search term data
        """
        end_date = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
        start_date = (datetime.utcnow() - timedelta(days=lookback_days)).strftime("%Y-%m-%d")

        report_id = self.request_report(
            report_type="spSearchTerm",
            metrics=[
                "impressions", "clicks", "cost", "purchases1d",
                "sales1d", "query", "campaignId", "adGroupId",
            ],
            start_date=start_date,
            end_date=end_date,
        )

        # Poll for completion
        for _ in range(30):
            status = self.get_report_status(report_id)
            if status["status"] == "SUCCESS":
                return self.download_report(status["location"])
            elif status["status"] == "FAILURE":
                raise Exception(f"Report failed: {status}")
            time.sleep(10)

        raise Exception("Report timed out")
