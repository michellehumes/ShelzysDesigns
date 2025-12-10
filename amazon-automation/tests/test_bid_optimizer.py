"""
Tests for Bid Optimizer Module
"""

import pytest
from unittest.mock import Mock, patch
from src.automation.bid_optimizer import BidOptimizer


class TestBidOptimizer:
    """Test suite for BidOptimizer class."""

    @pytest.fixture
    def optimizer(self):
        """Create a BidOptimizer with mocked API client."""
        with patch('src.automation.bid_optimizer.AdvertisingClient'):
            with patch('src.automation.bid_optimizer.ConfigLoader') as mock_config:
                # Setup mock config
                mock_config.return_value.get_bid_rules.return_value = {
                    "increase_bid": {
                        "adjustment_percent": 15,
                        "max_bid": 3.00
                    },
                    "decrease_bid": {
                        "adjustment_percent": -20,
                        "min_bid": 0.20
                    },
                    "pause_keyword": {},
                    "add_negative": {}
                }
                return BidOptimizer()

    def test_calculate_acos_normal(self, optimizer):
        """Test ACoS calculation with normal values."""
        acos = optimizer.calculate_acos(cost=10.0, sales=50.0)
        assert acos == 20.0

    def test_calculate_acos_zero_sales(self, optimizer):
        """Test ACoS calculation with zero sales."""
        acos = optimizer.calculate_acos(cost=10.0, sales=0)
        assert acos == float("inf")

    def test_calculate_acos_zero_cost(self, optimizer):
        """Test ACoS calculation with zero cost."""
        acos = optimizer.calculate_acos(cost=0, sales=50.0)
        assert acos == 0

    def test_analyze_keyword_increase_bid(self, optimizer):
        """Test keyword analysis recommends bid increase."""
        keyword_data = {
            "keywordId": "kw123",
            "keywordText": "bridesmaid gift",
            "clicks": 50,
            "cost": 15.0,
            "sales1d": 100.0,  # 15% ACoS
            "purchases1d": 5,  # 5 conversions
            "bid": 1.00,
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "increase_bid"
        assert result["new_bid"] == 1.15  # 15% increase
        assert "ACoS 15.0% < 20%" in result["reason"]

    def test_analyze_keyword_decrease_bid(self, optimizer):
        """Test keyword analysis recommends bid decrease."""
        keyword_data = {
            "keywordId": "kw456",
            "keywordText": "wedding favor",
            "clicks": 25,
            "cost": 25.0,
            "sales1d": 50.0,  # 50% ACoS
            "purchases1d": 1,
            "bid": 1.00,
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "decrease_bid"
        assert result["new_bid"] == 0.80  # 20% decrease
        assert "ACoS 50.0% > 40%" in result["reason"]

    def test_analyze_keyword_pause(self, optimizer):
        """Test keyword analysis recommends pause."""
        keyword_data = {
            "keywordId": "kw789",
            "keywordText": "custom tumbler",
            "clicks": 30,
            "cost": 20.0,
            "sales1d": 25.0,  # 80% ACoS
            "purchases1d": 0,  # 0 conversions
            "bid": 0.75,
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "pause"
        assert "ACoS 80.0% > 60%" in result["reason"]

    def test_analyze_keyword_no_action(self, optimizer):
        """Test keyword analysis with no action needed."""
        keyword_data = {
            "keywordId": "kw000",
            "keywordText": "personalized bottle",
            "clicks": 10,
            "cost": 5.0,
            "sales1d": 20.0,  # 25% ACoS
            "purchases1d": 2,  # 2 conversions (not enough for increase)
            "bid": 0.50,
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "none"
        assert result["new_bid"] is None

    def test_analyze_keyword_respects_max_bid(self, optimizer):
        """Test bid increase respects max bid limit."""
        keyword_data = {
            "keywordId": "kw_max",
            "keywordText": "expensive keyword",
            "clicks": 100,
            "cost": 50.0,
            "sales1d": 500.0,  # 10% ACoS
            "purchases1d": 10,
            "bid": 2.80,  # Close to max
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "increase_bid"
        assert result["new_bid"] == 3.00  # Capped at max

    def test_analyze_keyword_respects_min_bid(self, optimizer):
        """Test bid decrease respects min bid limit."""
        keyword_data = {
            "keywordId": "kw_min",
            "keywordText": "cheap keyword",
            "clicks": 50,
            "cost": 10.0,
            "sales1d": 15.0,  # ~67% ACoS
            "purchases1d": 1,
            "bid": 0.22,  # Close to min
        }

        result = optimizer.analyze_keyword_performance(keyword_data)

        assert result["action"] == "decrease_bid"
        assert result["new_bid"] == 0.20  # Capped at min

    def test_analyze_search_term_add_negative(self, optimizer):
        """Test search term analysis recommends adding as negative."""
        search_term_data = {
            "query": "free water bottle",
            "clicks": 20,
            "cost": 15.0,
            "purchases1d": 0,
            "campaignId": "camp123",
            "adGroupId": "ag456",
        }

        result = optimizer.analyze_search_term(search_term_data)

        assert result["add_as_negative"] is True
        assert "20 clicks" in result["reason"]
        assert "$15.00 spent" in result["reason"]

    def test_analyze_search_term_no_negative(self, optimizer):
        """Test search term with good performance not added as negative."""
        search_term_data = {
            "query": "bridesmaid proposal gift",
            "clicks": 10,
            "cost": 8.0,
            "purchases1d": 2,
            "campaignId": "camp123",
            "adGroupId": "ag456",
        }

        result = optimizer.analyze_search_term(search_term_data)

        assert result["add_as_negative"] is False


class TestBidOptimizerRules:
    """Test bid optimization rules match requirements."""

    @pytest.fixture
    def optimizer(self):
        """Create optimizer with default rules."""
        with patch('src.automation.bid_optimizer.AdvertisingClient'):
            with patch('src.automation.bid_optimizer.ConfigLoader') as mock_config:
                mock_config.return_value.get_bid_rules.return_value = {}
                return BidOptimizer()

    def test_increase_rule_threshold(self, optimizer):
        """Verify increase rule: ACoS < 20%, 3+ conversions."""
        assert optimizer.increase_acos_threshold == 20
        assert optimizer.increase_conversions_min == 3
        assert optimizer.increase_percent == 15

    def test_decrease_rule_threshold(self, optimizer):
        """Verify decrease rule: ACoS > 40%, 20+ clicks."""
        assert optimizer.decrease_acos_threshold == 40
        assert optimizer.decrease_clicks_min == 20
        assert optimizer.decrease_percent == 20

    def test_pause_rule_threshold(self, optimizer):
        """Verify pause rule: ACoS > 60%, $15+ spent, 0 conversions."""
        assert optimizer.pause_acos_threshold == 60
        assert optimizer.pause_spend_min == 15
        assert optimizer.pause_conversions_max == 0

    def test_negative_rule_threshold(self, optimizer):
        """Verify negative rule: 15+ clicks, $10+ spent, 0 conversions."""
        assert optimizer.negative_clicks_min == 15
        assert optimizer.negative_spend_min == 10
        assert optimizer.negative_conversions_max == 0
