# Shelzy's Designs - Amazon Automation Makefile
# Usage: make <target>

.PHONY: help install dev-install test lint format validate run-listings run-campaigns run-optimize run-reviews status clean

# Default target
help:
	@echo "Shelzy's Designs - Amazon Automation"
	@echo ""
	@echo "Setup:"
	@echo "  make install        Install production dependencies"
	@echo "  make dev-install    Install dev dependencies (includes testing)"
	@echo ""
	@echo "Validation:"
	@echo "  make validate       Validate all configurations"
	@echo "  make test           Run test suite"
	@echo "  make lint           Run linters (flake8, mypy)"
	@echo "  make format         Format code with black and isort"
	@echo ""
	@echo "Automation (dry-run):"
	@echo "  make dry-listings   Preview listing updates"
	@echo "  make dry-campaigns  Preview campaign deployment"
	@echo "  make dry-optimize   Preview bid optimizations"
	@echo "  make dry-reviews    Preview review requests"
	@echo ""
	@echo "Automation (live):"
	@echo "  make run-listings   Sync listings to Amazon"
	@echo "  make run-campaigns  Deploy PPC campaigns"
	@echo "  make run-optimize   Run bid optimization"
	@echo "  make run-reviews    Send review requests"
	@echo ""
	@echo "Status:"
	@echo "  make status         Check current campaign status"
	@echo ""
	@echo "Other:"
	@echo "  make clean          Remove cached files"

# Setup
install:
	pip install -r requirements.txt

dev-install:
	pip install -r requirements.txt
	pip install pytest pytest-cov pytest-mock black isort flake8 mypy

# Testing and quality
test:
	pytest tests/ -v --tb=short

test-cov:
	pytest tests/ -v --cov=src --cov-report=html --cov-report=term

lint:
	flake8 src/ tests/ --max-line-length=100 --ignore=E501
	mypy src/ --ignore-missing-imports

format:
	black src/ tests/ main.py
	isort src/ tests/ main.py

# Validation
validate:
	python main.py validate

# Dry runs (preview only)
dry-listings:
	python main.py listings --validate

dry-campaigns:
	python main.py campaigns --dry-run

dry-optimize:
	python main.py optimize --dry-run --lookback-days 7

dry-reviews:
	python main.py reviews --dry-run

# Live runs
run-listings:
	python main.py listings

run-campaigns:
	@echo "WARNING: This will create live PPC campaigns!"
	@read -p "Type 'DEPLOY' to confirm: " confirm && [ "$$confirm" = "DEPLOY" ] || exit 1
	python main.py campaigns

run-optimize:
	python main.py optimize --lookback-days 7

run-reviews:
	python main.py reviews --max-requests 50

# Status
status:
	python main.py status

# Cleanup
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true
