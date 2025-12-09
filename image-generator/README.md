# Shelzys Designs - Automated Image Generator

Generate 50 professional product images for Shelzys Designs using OpenAI's DALL-E 3 API.

## Overview

This script generates product photography images for:
- **Amazon** (main images, infographics, group shots)
- **Pinterest** (lifestyle, flat lays, aesthetic scenes)
- **TikTok** (vertical video frames, UGC-style content)
- **Instagram** (feed posts, minimal aesthetic)
- **Kids Sports** (team, tournament, sideline scenes)
- **Palm Beach 1964** (Slim Aarons-inspired editorial)
- **Hero Banners** (website headers with negative space)

## Prerequisites

- Node.js 18+
- OpenAI API key with DALL-E 3 access

## Setup

```bash
cd image-generator
npm install
```

## Usage

### Set your API key

```bash
export OPENAI_API_KEY=sk-your-api-key-here
```

### Generate all images

```bash
npm run generate
```

### Dry run (list images without generating)

```bash
npm run generate:dry-run
```

### Generate a range of images

```bash
# Generate images 1-10 only
START_ID=1 END_ID=10 npm run generate

# Resume from image 25
START_ID=25 npm run generate
```

## Output

Images are saved to `./shelzys_images/` with filenames:
```
shelzys_{id}_{category}_{aspect_ratio}.png
```

Examples:
- `shelzys_1_amazon_main_1x1.png`
- `shelzys_11_pinterest_2x3.png`
- `shelzys_19_tiktok_ad_9x16.png`

## Aspect Ratios

| Ratio | Use Case | DALL-E Size |
|-------|----------|-------------|
| 1:1   | Amazon main, Instagram | 1024x1024 |
| 4:5   | Amazon secondary, Instagram | 1024x1792 |
| 2:3   | Pinterest pins | 1024x1792 |
| 3:2   | Palm Beach editorial | 1792x1024 |
| 16:9  | Hero banners, kids sports | 1792x1024 |
| 9:16  | TikTok vertical | 1024x1792 |
| 21:9  | Ultra-wide banners | 1792x1024 |

## Rate Limits

DALL-E 3 has rate limits. The script:
- Waits 10 seconds between requests
- Auto-retries after rate limit errors (60s wait)
- Skips existing files (safe to re-run)

## Cost Estimate

DALL-E 3 HD pricing (as of 2024):
- 1024x1024: $0.080/image
- 1024x1792 or 1792x1024: $0.120/image

Estimated total for 50 images: ~$5-6 USD

## Prompts

All 50 prompts are embedded in `generate-images.ts` with:
- Detailed product specifications
- Platform-specific composition guidelines
- Lighting and styling instructions
- Typography and personalization details

## Troubleshooting

**Rate limit errors**: The script handles these automatically, but you can also:
- Run in smaller batches: `START_ID=1 END_ID=10 npm run generate`
- Wait and resume: existing files are skipped

**API key issues**: Ensure your key has DALL-E 3 access enabled.

**Missing images**: Re-run the script - it only generates missing files.
