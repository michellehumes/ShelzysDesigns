"""
Tests for Configuration Loader
"""

import pytest
from pathlib import Path
from src.utils.config_loader import ConfigLoader


class TestConfigLoader:
    """Test suite for ConfigLoader class."""

    @pytest.fixture
    def config_loader(self):
        """Create a ConfigLoader instance with test config directory."""
        config_dir = Path(__file__).parent.parent / "config"
        return ConfigLoader(config_dir=str(config_dir))

    def test_load_products(self, config_loader):
        """Test loading products configuration."""
        products = config_loader.load_products()

        assert "products" in products
        assert "brand" in products
        assert products["brand"] == "Shelzy's Designs"
        assert len(products["products"]) == 3

    def test_load_campaigns(self, config_loader):
        """Test loading campaigns configuration."""
        campaigns = config_loader.load_campaigns()

        assert "campaigns" in campaigns
        assert "negative_keywords" in campaigns
        assert len(campaigns["campaigns"]) == 5

    def test_load_settings(self, config_loader):
        """Test loading settings configuration."""
        settings = config_loader.load_settings()

        assert "amazon_marketplace" in settings
        assert "automation" in settings
        assert settings["amazon_marketplace"]["country"] == "US"

    def test_get_product_by_asin(self, config_loader):
        """Test retrieving product by ASIN."""
        product = config_loader.get_product_by_asin("B0DGFD4LX4")

        assert product is not None
        assert product["sku"] == "1M-GGRA-VBRF"
        assert product["name"] == "Clear Plastic Water Bottle"

    def test_get_product_by_asin_not_found(self, config_loader):
        """Test retrieving non-existent product."""
        product = config_loader.get_product_by_asin("INVALID_ASIN")
        assert product is None

    def test_get_product_by_sku(self, config_loader):
        """Test retrieving product by SKU."""
        product = config_loader.get_product_by_sku("2A-PQ74-FWLU")

        assert product is not None
        assert product["asin"] == "B0D92Q5R1P"
        assert product["name"] == "Stainless Steel Water Bottle"

    def test_get_personalized_products(self, config_loader):
        """Test getting personalized products only."""
        personalized = config_loader.get_personalized_products()

        assert len(personalized) == 2
        for product in personalized:
            assert product["type"] == "personalized"

    def test_get_blank_products(self, config_loader):
        """Test getting blank/sublimation products only."""
        blanks = config_loader.get_blank_products()

        assert len(blanks) == 1
        assert blanks[0]["asin"] == "B0FH3T8QHD"
        assert blanks[0]["type"] == "blank"

    def test_get_campaign_by_name(self, config_loader):
        """Test retrieving campaign by name."""
        campaign = config_loader.get_campaign_by_name("Shelzys-Auto-Discovery")

        assert campaign is not None
        assert campaign["targeting_type"] == "auto"
        assert campaign["daily_budget"] == 20.0

    def test_get_negative_keywords(self, config_loader):
        """Test retrieving negative keywords."""
        negatives = config_loader.get_negative_keywords()

        assert len(negatives) > 0
        texts = [n["text"] for n in negatives]
        assert "free" in texts
        assert "cheap" in texts
        assert "stanley cup" in texts

    def test_get_bid_rules(self, config_loader):
        """Test retrieving bid optimization rules."""
        rules = config_loader.get_bid_rules()

        assert "increase_bid" in rules
        assert "decrease_bid" in rules
        assert "pause_keyword" in rules
        assert "add_negative" in rules

    def test_config_caching(self, config_loader):
        """Test that configs are cached properly."""
        # Load twice
        products1 = config_loader.load_products()
        products2 = config_loader.load_products()

        # Should be same object due to caching
        assert products1 is products2

    def test_cache_clear(self, config_loader):
        """Test clearing the config cache."""
        products1 = config_loader.load_products()
        config_loader.clear_cache()
        products2 = config_loader.load_products()

        # Should be different objects after cache clear
        assert products1 is not products2
        # But content should be equal
        assert products1 == products2


class TestProductListings:
    """Test product listing content validation."""

    @pytest.fixture
    def config_loader(self):
        config_dir = Path(__file__).parent.parent / "config"
        return ConfigLoader(config_dir=str(config_dir))

    def test_all_products_have_required_fields(self, config_loader):
        """Verify all products have required listing fields."""
        products = config_loader.load_products()

        for product in products["products"]:
            assert "asin" in product
            assert "sku" in product
            assert "listing" in product

            listing = product["listing"]
            assert "title" in listing
            assert "bullet_points" in listing
            assert "description" in listing
            assert "search_terms" in listing

    def test_title_length(self, config_loader):
        """Verify titles are within Amazon's limit."""
        products = config_loader.load_products()

        for product in products["products"]:
            title = product["listing"]["title"]
            assert len(title) <= 200, f"Title too long for {product['sku']}"

    def test_bullet_points_count(self, config_loader):
        """Verify each product has 5 bullet points."""
        products = config_loader.load_products()

        for product in products["products"]:
            bullets = product["listing"]["bullet_points"]
            assert len(bullets) == 5, f"Expected 5 bullets for {product['sku']}"

    def test_bullet_points_length(self, config_loader):
        """Verify bullet points are within Amazon's limit."""
        products = config_loader.load_products()

        for product in products["products"]:
            for i, bullet in enumerate(product["listing"]["bullet_points"]):
                assert len(bullet) <= 500, \
                    f"Bullet {i+1} too long for {product['sku']}"

    def test_search_terms_length(self, config_loader):
        """Verify search terms are within Amazon's limit."""
        products = config_loader.load_products()

        for product in products["products"]:
            search_terms = product["listing"]["search_terms"]
            assert len(search_terms) <= 249, \
                f"Search terms too long for {product['sku']}"


class TestCampaignConfig:
    """Test campaign configuration validation."""

    @pytest.fixture
    def config_loader(self):
        config_dir = Path(__file__).parent.parent / "config"
        return ConfigLoader(config_dir=str(config_dir))

    def test_all_campaigns_have_required_fields(self, config_loader):
        """Verify all campaigns have required fields."""
        campaigns = config_loader.load_campaigns()

        for campaign in campaigns["campaigns"]:
            assert "name" in campaign
            assert "targeting_type" in campaign
            assert "daily_budget" in campaign
            assert "products" in campaign
            assert "ad_groups" in campaign

    def test_campaign_budgets_positive(self, config_loader):
        """Verify all budgets are positive."""
        campaigns = config_loader.load_campaigns()

        for campaign in campaigns["campaigns"]:
            assert campaign["daily_budget"] > 0

    def test_all_campaign_products_exist(self, config_loader):
        """Verify all campaign products exist in product config."""
        campaigns = config_loader.load_campaigns()

        for campaign in campaigns["campaigns"]:
            for asin in campaign["products"]:
                product = config_loader.get_product_by_asin(asin)
                assert product is not None, \
                    f"Product {asin} not found for campaign {campaign['name']}"

    def test_keyword_match_types_valid(self, config_loader):
        """Verify keyword match types are valid."""
        valid_types = {"exact", "phrase", "broad"}
        campaigns = config_loader.load_campaigns()

        for campaign in campaigns["campaigns"]:
            for ad_group in campaign["ad_groups"]:
                for keyword in ad_group.get("keywords", []):
                    assert keyword["match_type"] in valid_types, \
                        f"Invalid match type: {keyword['match_type']}"
