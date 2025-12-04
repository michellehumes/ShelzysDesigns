# Shopify URL Redirects

## How to Add These Redirects

1. Go to **Shopify Admin**
2. Navigate to **Online Store > Navigation**
3. Click **URL Redirects**
4. Click **Create URL redirect**
5. Add each redirect below

---

## Redirects to Add

| Old URL (Redirect from) | New URL (Redirect to) |
|------------------------|----------------------|
| /collections/stainless-steel | /collections/personalized-bottles |
| /collections/couples | /collections/bridesmaid-bridal |
| /collections/gifts | /collections/proposal-gift-boxes |

---

## Copy-Paste Format

### Redirect 1
- **Redirect from:** `/collections/stainless-steel`
- **Redirect to:** `/collections/personalized-bottles`

### Redirect 2
- **Redirect from:** `/collections/couples`
- **Redirect to:** `/collections/bridesmaid-bridal`

### Redirect 3
- **Redirect from:** `/collections/gifts`
- **Redirect to:** `/collections/proposal-gift-boxes`

---

## Bulk Import (CSV)

If you prefer to upload a CSV file:

```csv
Redirect from,Redirect to
/collections/stainless-steel,/collections/personalized-bottles
/collections/couples,/collections/bridesmaid-bridal
/collections/gifts,/collections/proposal-gift-boxes
```

Save as `redirects.csv` and import via:
**Online Store > Navigation > URL Redirects > Import**

