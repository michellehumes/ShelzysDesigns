# Shelzy's Designs

Premium personalized sublimation water bottles e-commerce business. Multi-channel: Shopify storefront + Amazon seller automation.

## Project Structure

- `shopify/` - Shopify theme (Liquid templates, CSS/JS assets, sections, snippets, config)
- `amazon-automation/` - Python automation for Amazon SP-API (listings, PPC campaigns, bid optimization, reviews)
- `amazon-affiliate/` - Affiliate content (blog, Pinterest, SOPs)
- `IMPLEMENTATION/` - Ready-to-deploy resources (blog posts, email templates, Liquid snippets)
- `brand/` - Brand guide and color system
- `products/` - Product catalog (8 core products)
- `copy/` - Website copy bank
- `.github/workflows/` - CI/CD (theme check, CSS lint, markdown lint, Amazon automation schedules)

## Conventions

- Shopify snippets use `shelzys-` prefix (e.g., `shelzys-hero-premium.liquid`)
- Python code (in `amazon-automation/`) targets Python 3.9+, uses black/isort/flake8/mypy
- Python tests use pytest, located in `amazon-automation/tests/`
- CSS is linted with Stylelint

## Key Commands

```bash
# Python (from amazon-automation/)
pip install -r requirements.txt
pytest tests/ -v
black src/ tests/
flake8 src/ tests/

# Shopify theme validation (requires theme-check)
theme-check shopify/
```

## Agent Teams

Agent teams are enabled for this project. Useful team configurations:

- **Shopify + Amazon**: One teammate on Shopify theme work, another on Amazon automation
- **Frontend + Backend**: One on Liquid/CSS/JS, another on Python automation
- **Content + Code**: One on copy/documentation, another on implementation
