"""
Configuration Loader Module

Handles loading and validation of JSON configuration files.
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional


class ConfigLoader:
    """Loads and manages configuration files for the automation system."""

    def __init__(self, config_dir: Optional[str] = None):
        """
        Initialize the configuration loader.

        Args:
            config_dir: Path to the config directory. Defaults to project's config folder.
        """
        if config_dir:
            self.config_dir = Path(config_dir)
        else:
            # Default to the config directory relative to this file
            self.config_dir = Path(__file__).parent.parent.parent / "config"

        self._cache: Dict[str, Any] = {}

    def load(self, config_name: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Load a configuration file.

        Args:
            config_name: Name of the config file (without .json extension)
            use_cache: Whether to use cached config if available

        Returns:
            Dictionary containing the configuration

        Raises:
            FileNotFoundError: If config file doesn't exist
            json.JSONDecodeError: If config file is invalid JSON
        """
        if use_cache and config_name in self._cache:
            return self._cache[config_name]

        config_path = self.config_dir / f"{config_name}.json"

        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")

        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)

        if use_cache:
            self._cache[config_name] = config

        return config

    def load_products(self) -> Dict[str, Any]:
        """Load the products configuration."""
        return self.load("products")

    def load_campaigns(self) -> Dict[str, Any]:
        """Load the campaigns configuration."""
        return self.load("campaigns")

    def load_settings(self) -> Dict[str, Any]:
        """Load the settings configuration."""
        return self.load("settings")

    def get_product_by_asin(self, asin: str) -> Optional[Dict[str, Any]]:
        """
        Get product configuration by ASIN.

        Args:
            asin: The Amazon Standard Identification Number

        Returns:
            Product configuration dictionary or None if not found
        """
        products_config = self.load_products()
        for product in products_config.get("products", []):
            if product.get("asin") == asin:
                return product
        return None

    def get_product_by_sku(self, sku: str) -> Optional[Dict[str, Any]]:
        """
        Get product configuration by SKU.

        Args:
            sku: The Stock Keeping Unit

        Returns:
            Product configuration dictionary or None if not found
        """
        products_config = self.load_products()
        for product in products_config.get("products", []):
            if product.get("sku") == sku:
                return product
        return None

    def get_personalized_products(self) -> list:
        """Get all personalized (non-blank) products."""
        products_config = self.load_products()
        return [
            p for p in products_config.get("products", [])
            if p.get("type") == "personalized"
        ]

    def get_blank_products(self) -> list:
        """Get all blank/sublimation products."""
        products_config = self.load_products()
        return [
            p for p in products_config.get("products", [])
            if p.get("type") == "blank"
        ]

    def get_campaign_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get campaign configuration by name.

        Args:
            name: The campaign name

        Returns:
            Campaign configuration dictionary or None if not found
        """
        campaigns_config = self.load_campaigns()
        for campaign in campaigns_config.get("campaigns", []):
            if campaign.get("name") == name:
                return campaign
        return None

    def get_negative_keywords(self) -> list:
        """Get campaign-level negative keywords."""
        campaigns_config = self.load_campaigns()
        return campaigns_config.get("negative_keywords", {}).get("campaign_level", [])

    def get_bid_rules(self) -> Dict[str, Any]:
        """Get bid optimization rules."""
        campaigns_config = self.load_campaigns()
        return campaigns_config.get("bid_optimization_rules", {})

    def clear_cache(self):
        """Clear the configuration cache."""
        self._cache.clear()

    def reload_all(self):
        """Reload all configurations from disk."""
        self.clear_cache()
        self.load_products()
        self.load_campaigns()
        self.load_settings()
