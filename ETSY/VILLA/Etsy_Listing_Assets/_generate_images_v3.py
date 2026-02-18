#!/usr/bin/env python3
"""
Villa Vibes Bachelorette Bundle — Etsy Listing Images v3
Tropical Miami pastel aesthetic with frosted glass cards, glowing orbs, gradients.
Palette: hot pink, orange, coral, gold, off-white (NO blue/teal).
"""

import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── Dimensions ──────────────────────────────────────────────────────────────
W, H = 2000, 2000
PAD = int(W * 0.05)  # 5 % safe zone

# ── Brand colours ───────────────────────────────────────────────────────────
HOT_PINK   = (251, 88, 135)
ORANGE     = (254, 140, 67)
CORAL      = (255, 127, 127)
GOLD       = (240, 184, 96)
OFF_WHITE  = (254, 254, 254)
DARK_TEXT  = (60, 40, 50)
MED_TEXT   = (100, 70, 80)
LIGHT_TEXT = (160, 130, 140)
WHITE      = (255, 255, 255)

ACCENT_CYCLE = [HOT_PINK, ORANGE, CORAL, GOLD]

# ── Fonts ───────────────────────────────────────────────────────────────────
MONT_BOLD = "/usr/share/fonts/truetype/montserrat/Montserrat-Bold.ttf"
MONT_SEMI = "/usr/share/fonts/truetype/montserrat/Montserrat-SemiBold.ttf"
MONT_MED  = "/usr/share/fonts/truetype/montserrat/Montserrat-Medium.ttf"
MONT_REG  = "/usr/share/fonts/truetype/montserrat/Montserrat-Regular.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

# ── Output paths ────────────────────────────────────────────────────────────
OUT_DIR = "/mnt/user-data/outputs"
ASSET_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUT_DIR, exist_ok=True)

# ── Gradient helpers (numpy-accelerated) ────────────────────────────────────

def _lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))

def make_gradient(w, h, colors, direction="vertical"):
    """Return an RGBA numpy array with a smooth multi-stop gradient."""
    arr = np.zeros((h, w, 4), dtype=np.uint8)
    n = len(colors)
    for y in range(h):
        if direction == "vertical":
            t = y / max(h - 1, 1)
        else:
            t = 0.5  # horizontal handled per-pixel below
        seg = t * (n - 1)
        idx = min(int(seg), n - 2)
        local_t = seg - idx
        c1, c2 = colors[idx], colors[idx + 1]
        r = int(c1[0] + (c2[0] - c1[0]) * local_t)
        g = int(c1[1] + (c2[1] - c1[1]) * local_t)
        b = int(c1[2] + (c2[2] - c1[2]) * local_t)
        arr[y, :, 0] = r
        arr[y, :, 1] = g
        arr[y, :, 2] = b
        arr[y, :, 3] = 255
    return arr

def make_diagonal_gradient(w, h, colors, angle_deg=135):
    """Diagonal multi-stop gradient."""
    arr = np.zeros((h, w, 4), dtype=np.uint8)
    n = len(colors)
    rad = math.radians(angle_deg)
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    # precompute t for each pixel
    ys = np.arange(h).reshape(h, 1)
    xs = np.arange(w).reshape(1, w)
    proj = xs * cos_a + ys * sin_a
    mn, mx = proj.min(), proj.max()
    t_map = (proj - mn) / max(mx - mn, 1)
    seg_map = t_map * (n - 1)
    idx_map = np.clip(seg_map.astype(int), 0, n - 2)
    local_t = seg_map - idx_map
    for ch in range(3):
        c_arr = np.array([c[ch] for c in colors], dtype=np.float64)
        c1 = c_arr[idx_map]
        c2 = c_arr[np.clip(idx_map + 1, 0, n - 1)]
        arr[:, :, ch] = (c1 + (c2 - c1) * local_t).astype(np.uint8)
    arr[:, :, 3] = 255
    return arr

# ── Gradient presets per image ──────────────────────────────────────────────

GRAD_PRESETS = {
    1:  dict(colors=[(255, 200, 210), (255, 225, 200), (240, 200, 230)], angle=135),
    2:  dict(colors=[(255, 210, 200), (255, 230, 210), (250, 210, 230)], angle=120),
    3:  dict(colors=[(255, 195, 215), (255, 220, 195), (245, 200, 225)], angle=150),
    4:  dict(colors=[(255, 220, 200), (255, 200, 210), (250, 215, 230)], angle=110),
    5:  dict(colors=[(250, 210, 220), (255, 225, 200), (245, 205, 225)], angle=140),
    6:  dict(colors=[(255, 205, 215), (255, 230, 205), (248, 210, 230)], angle=125),
    7:  dict(colors=[(255, 215, 205), (255, 200, 215), (252, 215, 225)], angle=145),
    8:  dict(colors=[(255, 200, 220), (255, 225, 210), (245, 210, 228)], angle=130),
    9:  dict(colors=[(252, 210, 210), (255, 228, 205), (248, 208, 225)], angle=115),
    10: dict(colors=[(255, 200, 215), (255, 222, 200), (250, 205, 230)], angle=155),
}

def create_bg(idx):
    """Create RGBA background image with gradient for image index (1-10)."""
    p = GRAD_PRESETS[idx]
    arr = make_diagonal_gradient(W, H, p["colors"], p["angle"])
    return Image.fromarray(arr, "RGBA")

# ── Drawing helpers ─────────────────────────────────────────────────────────

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=0):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_frosted_card(img, bbox, radius=30, opacity=200, border_color=None, border_width=0, shadow=True):
    """Composite a frosted glass card onto img (RGBA)."""
    x0, y0, x1, y1 = bbox
    if shadow:
        shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        sd.rounded_rectangle((x0+6, y0+6, x1+6, y1+6), radius=radius, fill=(0, 0, 0, 50))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(12))
        img.alpha_composite(shadow_layer)

    card = Image.new("RGBA", img.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle(bbox, radius=radius, fill=(255, 255, 255, opacity))
    if border_color and border_width:
        cd.rounded_rectangle(bbox, radius=radius, fill=None, outline=(*border_color, 255), width=border_width)
    img.alpha_composite(card)

def draw_glow_circle(img, cx, cy, r, color, alpha=40):
    """Draw a soft glowing circle."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(r // 2))
    img.alpha_composite(layer)

def draw_pill(draw, bbox, fill, text="", text_color=WHITE, text_font=None):
    """Draw a pill-shaped button with centered text."""
    x0, y0, x1, y1 = bbox
    h = y1 - y0
    draw.rounded_rectangle(bbox, radius=h // 2, fill=fill)
    if text and text_font:
        tw = draw.textlength(text, font=text_font)
        tx = x0 + (x1 - x0 - tw) / 2
        ty = y0 + (h - text_font.size) / 2 - 2
        draw.text((tx, ty), text, fill=text_color, font=text_font)

def draw_numbered_circle(draw, cx, cy, r, number, color):
    """Draw a colored circle with a number centered inside."""
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
    f = font(MONT_BOLD, int(r * 1.2))
    txt = str(number)
    tw = draw.textlength(txt, font=f)
    draw.text((cx - tw / 2, cy - f.size / 2 - 2), txt, fill=WHITE, font=f)

def draw_brand_footer(draw):
    """Draw 'SHELZY'S DESIGNS' and shop URL at bottom."""
    f_brand = font(MONT_BOLD, 28)
    f_url = font(MONT_REG, 24)
    draw.text((W // 2, H - 80), "SHELZY'S DESIGNS", fill=HOT_PINK, font=f_brand, anchor="mm")
    draw.text((W // 2, H - 46), "shelzysdesigns.etsy.com", fill=LIGHT_TEXT, font=f_url, anchor="mm")

def draw_accent_line(draw, cx, y, length, color, thickness=4):
    """Draw a centered horizontal accent line."""
    draw.rounded_rectangle(
        (cx - length // 2, y, cx + length // 2, y + thickness),
        radius=thickness // 2, fill=color
    )

def draw_star_row(draw, cx, cy, count=5, size=32, color=GOLD):
    """Draw a row of filled stars."""
    spacing = size + 12
    sx = cx - (count * spacing) / 2 + spacing / 2
    for i in range(count):
        x = int(sx + i * spacing)
        _draw_star(draw, x, cy, size // 2, color)

def _draw_star(draw, cx, cy, r, color):
    """Draw a 5-pointed star."""
    pts = []
    for i in range(10):
        angle = math.radians(i * 36 - 90)
        rad = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rad * math.cos(angle), cy + rad * math.sin(angle)))
    draw.polygon(pts, fill=color)

def centered_text(draw, y, text, txt_font, color=DARK_TEXT):
    """Draw horizontally-centered text, return bottom y."""
    tw = draw.textlength(text, font=txt_font)
    draw.text((W // 2 - tw / 2, y), text, fill=color, font=txt_font)
    return y + txt_font.size + 8

def save_img(img, num):
    """Convert RGBA→RGB and save as JPG to both output dirs."""
    rgb = Image.new("RGB", img.size, OFF_WHITE)
    rgb.paste(img, mask=img.split()[3])
    name_out = f"{num:02d}.jpg"
    rgb.save(os.path.join(OUT_DIR, name_out), "JPEG", quality=95, subsampling=0)
    # Also save to asset dir with descriptive names
    names = {
        1: "VillaVibes_Image01_Hero.jpg",
        2: "VillaVibes_Image02_WhatsIncluded.jpg",
        3: "VillaVibes_Image03_PartyGames.jpg",
        4: "VillaVibes_Image04_SignsDecor.jpg",
        5: "VillaVibes_Image05_PlanningBonus.jpg",
        6: "VillaVibes_Image06_HowItWorks.jpg",
        7: "VillaVibes_Image07_Features.jpg",
        8: "VillaVibes_Image08_YourDownload.jpg",
        9: "VillaVibes_Image09_PrintingTips.jpg",
        10: "VillaVibes_Image10_ThankYou.jpg",
    }
    rgb.save(os.path.join(ASSET_DIR, names[num]), "JPEG", quality=95, subsampling=0)
    sz = os.path.getsize(os.path.join(OUT_DIR, name_out))
    print(f"  ✓ {name_out}  ({sz/1024:.0f} KB)")

# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 01 — HERO TITLE
# ═══════════════════════════════════════════════════════════════════════════
def img01():
    print("Generating 01-hero-title...")
    bg = create_bg(1)
    # Decorative glow orbs
    draw_glow_circle(bg, 180, 200, 220, HOT_PINK, 35)
    draw_glow_circle(bg, 1820, 250, 180, ORANGE, 30)
    draw_glow_circle(bg, 200, 1750, 200, CORAL, 28)
    draw_glow_circle(bg, 1800, 1700, 240, GOLD, 25)
    draw_glow_circle(bg, 1000, 100, 150, HOT_PINK, 20)
    draw_glow_circle(bg, 950, 1850, 160, ORANGE, 22)

    # Main frosted card
    draw_frosted_card(bg, (200, 280, 1800, 1600), radius=40, opacity=210)

    d = ImageDraw.Draw(bg)

    # Title
    f_villa = font(MONT_BOLD, 130)
    d.text((W // 2, 420), "VILLA VIBES", fill=HOT_PINK, font=f_villa, anchor="mm")

    f_bach = font(MONT_BOLD, 62)
    d.text((W // 2, 520), "BACHELORETTE PARTY BUNDLE", fill=DARK_TEXT, font=f_bach, anchor="mm")

    draw_accent_line(d, W // 2, 570, 400, ORANGE, 5)

    f_sub = font(MONT_MED, 46)
    d.text((W // 2, 620), "23 Editable Canva Templates", fill=MED_TEXT, font=f_sub, anchor="mm")

    # Category line
    f_cat = font(MONT_REG, 36)
    d.text((W // 2, 700), "Games  •  Signs  •  Decor  •  Planning", fill=LIGHT_TEXT, font=f_cat, anchor="mm")

    # Decorative divider
    draw_accent_line(d, W // 2, 760, 600, CORAL, 3)

    # Template preview hint — frosted mini-cards
    card_w, card_h = 320, 180
    card_y = 830
    spacing = 60
    total_w = 4 * card_w + 3 * spacing
    start_x = (W - total_w) // 2
    labels = ["Party Games", "Signs & Decor", "Planning", "Bonus Extras"]
    counts = ["8 Templates", "7 Templates", "4 Templates", "4 Templates"]
    for i in range(4):
        cx = start_x + i * (card_w + spacing)
        col = ACCENT_CYCLE[i]
        draw_frosted_card(bg, (cx, card_y, cx + card_w, card_y + card_h),
                          radius=20, opacity=180, border_color=col, border_width=3, shadow=False)
        d = ImageDraw.Draw(bg)
        f_lbl = font(MONT_BOLD, 26)
        f_cnt = font(MONT_REG, 22)
        d.text((cx + card_w // 2, card_y + 65), labels[i], fill=col, font=f_lbl, anchor="mm")
        d.text((cx + card_w // 2, card_y + 105), counts[i], fill=MED_TEXT, font=f_cnt, anchor="mm")

    # CTA pill button
    draw_pill(d, (550, 1100, 1450, 1180), HOT_PINK,
              "INSTANT DOWNLOAD", WHITE, font(MONT_BOLD, 42))

    # Bottom helper text
    f_help = font(MONT_REG, 32)
    d.text((W // 2, 1240), "Edit in Canva (Free!)  •  Print at Home", fill=MED_TEXT, font=f_help, anchor="mm")

    # Small value badges
    badge_y = 1340
    badges = ["Fully Editable", "US Letter Size", "Instant Access"]
    badge_w = 340
    badge_spacing = 50
    total_bw = 3 * badge_w + 2 * badge_spacing
    bx = (W - total_bw) // 2
    for i, btxt in enumerate(badges):
        x = bx + i * (badge_w + badge_spacing)
        draw_pill(d, (x, badge_y, x + badge_w, badge_y + 55), (*ACCENT_CYCLE[i], 40),
                  btxt, ACCENT_CYCLE[i], font(MONT_SEMI, 24))

    draw_brand_footer(d)
    save_img(bg, 1)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 02 — WHAT'S INCLUDED
# ═══════════════════════════════════════════════════════════════════════════
def img02():
    print("Generating 02-whats-included...")
    bg = create_bg(2)
    draw_glow_circle(bg, 150, 150, 200, ORANGE, 30)
    draw_glow_circle(bg, 1850, 180, 180, HOT_PINK, 28)
    draw_glow_circle(bg, 200, 1800, 160, GOLD, 25)
    draw_glow_circle(bg, 1820, 1780, 200, CORAL, 30)

    d = ImageDraw.Draw(bg)

    # Heading
    f_head = font(MONT_BOLD, 82)
    d.text((W // 2, 180), "WHAT'S INCLUDED", fill=DARK_TEXT, font=f_head, anchor="mm")
    f_sub = font(MONT_MED, 42)
    d.text((W // 2, 250), "23 Editable Templates", fill=HOT_PINK, font=f_sub, anchor="mm")
    draw_accent_line(d, W // 2, 295, 300, ORANGE, 4)

    # 2x2 category grid
    gw, gh = 720, 550
    gx_left = 170
    gx_right = W - 170 - gw
    gy_top = 360
    gy_bot = gy_top + gh + 60

    categories = [
        ("PARTY GAMES", "8 Templates", HOT_PINK, [
            "Drink If...", "Who Knows the Bride Best",
            "Scavenger Hunt", "Would She Rather",
            "Groom Trivia", "Never Have I Ever",
            "Bridal Bingo", "Over or Under"
        ]),
        ("SIGNS & DECOR", "7 Templates", ORANGE, [
            "Welcome Sign", "Bar Menu Sign",
            "Photo Prop Frame", "Directional Sign",
            "Door Hanger", "Table Numbers", "Hashtag Sign"
        ]),
        ("PLANNING", "4 Templates", CORAL, [
            "Weekend Itinerary", "Invitation",
            "Packing List", "House Rules"
        ]),
        ("BONUS EXTRAS", "4 Templates", GOLD, [
            "Name Tags", "Paddle Signs",
            "Instagram Story Templates", "Cocktail Recipe Cards"
        ]),
    ]
    positions = [(gx_left, gy_top), (gx_right, gy_top), (gx_left, gy_bot), (gx_right, gy_bot)]

    for i, (title, count, color, items) in enumerate(categories):
        px, py = positions[i]
        # Card with colored top border
        draw_frosted_card(bg, (px, py, px + gw, py + gh), radius=25, opacity=200, shadow=True)
        # Color top bar
        bar_layer = Image.new("RGBA", bg.size, (0, 0, 0, 0))
        bd = ImageDraw.Draw(bar_layer)
        bd.rounded_rectangle((px, py, px + gw, py + 8), radius=4, fill=(*color, 255))
        bg.alpha_composite(bar_layer)

        d = ImageDraw.Draw(bg)
        f_title = font(MONT_BOLD, 36)
        f_count = font(MONT_MED, 26)
        f_item = font(MONT_REG, 27)

        d.text((px + 40, py + 30), title, fill=color, font=f_title)
        d.text((px + 40, py + 75), count, fill=MED_TEXT, font=f_count)
        draw_accent_line(d, px + gw // 2, py + 110, gw - 80, (*color, 60), 2)

        for j, item in enumerate(items):
            iy = py + 135 + j * 48
            # Small dot
            d.ellipse((px + 45, iy + 10, px + 57, iy + 22), fill=color)
            d.text((px + 70, iy), item, fill=DARK_TEXT, font=f_item)

    # Bottom CTA
    draw_pill(d, (450, 1510, 1550, 1590), HOT_PINK,
              "ALL FULLY EDITABLE IN CANVA", WHITE, font(MONT_BOLD, 36))

    f_btm = font(MONT_REG, 28)
    d.text((W // 2, 1650), "Free Canva Account  •  US Letter Size  •  Instant Download",
           fill=MED_TEXT, font=f_btm, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 2)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 03 — PARTY GAMES
# ═══════════════════════════════════════════════════════════════════════════
def img03():
    print("Generating 03-party-games...")
    bg = create_bg(3)
    draw_glow_circle(bg, 160, 300, 200, HOT_PINK, 30)
    draw_glow_circle(bg, 1840, 400, 180, CORAL, 25)
    draw_glow_circle(bg, 300, 1750, 170, ORANGE, 28)
    draw_glow_circle(bg, 1700, 1700, 200, GOLD, 22)

    d = ImageDraw.Draw(bg)

    # Header pill
    draw_pill(d, (500, 130, 1500, 220), HOT_PINK,
              "PARTY GAMES", WHITE, font(MONT_BOLD, 48))
    f_sub = font(MONT_MED, 38)
    d.text((W // 2, 275), "8 Editable Templates", fill=MED_TEXT, font=f_sub, anchor="mm")
    draw_accent_line(d, W // 2, 320, 300, HOT_PINK, 4)

    # Big frosted card for list
    draw_frosted_card(bg, (250, 380, 1750, 1600), radius=35, opacity=210)
    d = ImageDraw.Draw(bg)

    games = [
        "Drink If...",
        "Who Knows the Bride Best",
        "Scavenger Hunt",
        "Would She Rather",
        "Groom Trivia",
        "Never Have I Ever",
        "Bridal Bingo",
        "Over or Under"
    ]

    f_item = font(MONT_SEMI, 44)
    start_y = 440
    row_h = 140

    for i, game in enumerate(games):
        y = start_y + i * row_h
        col = ACCENT_CYCLE[i % 4]
        # Number circle
        draw_numbered_circle(d, 400, y + 35, 38, i + 1, col)
        # Game name
        d.text((480, y + 8), game, fill=DARK_TEXT, font=f_item)
        # Subtle divider line
        if i < len(games) - 1:
            draw_accent_line(d, 1000, y + 95, 1200, (*LIGHT_TEXT, 40), 1)

    # Bottom text
    f_btm = font(MONT_REG, 30)
    d.text((W // 2, 1680), "All games are fully editable — change questions, add your own!",
           fill=MED_TEXT, font=f_btm, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 3)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 04 — SIGNS & DECOR
# ═══════════════════════════════════════════════════════════════════════════
def img04():
    print("Generating 04-signs-decor...")
    bg = create_bg(4)
    draw_glow_circle(bg, 180, 250, 200, ORANGE, 32)
    draw_glow_circle(bg, 1820, 350, 180, GOLD, 28)
    draw_glow_circle(bg, 250, 1750, 180, HOT_PINK, 26)
    draw_glow_circle(bg, 1750, 1720, 200, CORAL, 24)

    d = ImageDraw.Draw(bg)

    draw_pill(d, (500, 130, 1500, 220), ORANGE,
              "SIGNS & DECOR", WHITE, font(MONT_BOLD, 48))
    f_sub = font(MONT_MED, 38)
    d.text((W // 2, 275), "7 Editable Templates", fill=MED_TEXT, font=f_sub, anchor="mm")
    draw_accent_line(d, W // 2, 320, 300, ORANGE, 4)

    draw_frosted_card(bg, (250, 380, 1750, 1450), radius=35, opacity=210)
    d = ImageDraw.Draw(bg)

    signs = [
        "Welcome Sign", "Bar Menu Sign", "Photo Prop Frame",
        "Directional Sign", "Door Hanger", "Table Numbers", "Hashtag Sign"
    ]

    f_item = font(MONT_SEMI, 44)
    start_y = 430
    row_h = 140

    for i, sign in enumerate(signs):
        y = start_y + i * row_h
        col = ACCENT_CYCLE[i % 4]
        draw_numbered_circle(d, 400, y + 35, 38, i + 1, col)
        d.text((480, y + 8), sign, fill=DARK_TEXT, font=f_item)
        if i < len(signs) - 1:
            draw_accent_line(d, 1000, y + 95, 1200, (*LIGHT_TEXT, 40), 1)

    # Extra tip at bottom
    draw_frosted_card(bg, (300, 1520, 1700, 1630), radius=20, opacity=190, shadow=False)
    d = ImageDraw.Draw(bg)
    f_tip = font(MONT_MED, 30)
    d.text((W // 2, 1575), "Edit text, swap colors & photos to match your theme!",
           fill=HOT_PINK, font=f_tip, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 4)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 05 — PLANNING + BONUS
# ═══════════════════════════════════════════════════════════════════════════
def img05():
    print("Generating 05-planning-bonus...")
    bg = create_bg(5)
    draw_glow_circle(bg, 170, 200, 210, CORAL, 30)
    draw_glow_circle(bg, 1830, 250, 190, HOT_PINK, 28)
    draw_glow_circle(bg, 200, 1780, 180, GOLD, 25)
    draw_glow_circle(bg, 1800, 1750, 200, ORANGE, 27)

    d = ImageDraw.Draw(bg)

    draw_pill(d, (350, 130, 1650, 220), CORAL,
              "PLANNING  +  BONUS", WHITE, font(MONT_BOLD, 48))
    f_sub = font(MONT_MED, 38)
    d.text((W // 2, 275), "8 Editable Templates", fill=MED_TEXT, font=f_sub, anchor="mm")
    draw_accent_line(d, W // 2, 320, 300, CORAL, 4)

    # Planning section
    draw_frosted_card(bg, (200, 400, 1800, 900), radius=30, opacity=210)
    d = ImageDraw.Draw(bg)
    f_sec = font(MONT_BOLD, 40)
    d.text((350, 430), "PLANNING", fill=CORAL, font=f_sec)
    f_count = font(MONT_MED, 28)
    d.text((640, 438), "4 Templates", fill=MED_TEXT, font=f_count)

    planning = ["Weekend Itinerary", "Invitation", "Packing List", "House Rules"]
    f_item = font(MONT_SEMI, 40)
    for i, item in enumerate(planning):
        y = 510 + i * 90
        col = ACCENT_CYCLE[i % 4]
        draw_numbered_circle(d, 370, y + 25, 32, i + 1, col)
        d.text((430, y), item, fill=DARK_TEXT, font=f_item)

    # Bonus section
    draw_frosted_card(bg, (200, 970, 1800, 1480), radius=30, opacity=210)
    d = ImageDraw.Draw(bg)
    d.text((350, 1000), "BONUS EXTRAS", fill=GOLD, font=f_sec)
    d.text((700, 1008), "4 Templates", fill=MED_TEXT, font=f_count)

    bonus = ["Name Tags", "Paddle Signs", "Instagram Story Templates", "Cocktail Recipe Cards"]
    for i, item in enumerate(bonus):
        y = 1080 + i * 90
        col = ACCENT_CYCLE[i % 4]
        draw_numbered_circle(d, 370, y + 25, 32, i + 1, col)
        d.text((430, y), item, fill=DARK_TEXT, font=f_item)

    # Bottom tip
    f_btm = font(MONT_REG, 30)
    d.text((W // 2, 1560), "Everything you need for the perfect bachelorette weekend!",
           fill=MED_TEXT, font=f_btm, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 5)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 06 — HOW IT WORKS
# ═══════════════════════════════════════════════════════════════════════════
def img06():
    print("Generating 06-how-it-works...")
    bg = create_bg(6)
    draw_glow_circle(bg, 160, 300, 190, HOT_PINK, 28)
    draw_glow_circle(bg, 1840, 280, 200, ORANGE, 30)
    draw_glow_circle(bg, 250, 1750, 160, GOLD, 22)
    draw_glow_circle(bg, 1780, 1700, 180, CORAL, 26)

    d = ImageDraw.Draw(bg)

    f_head = font(MONT_BOLD, 82)
    d.text((W // 2, 170), "HOW IT WORKS", fill=DARK_TEXT, font=f_head, anchor="mm")
    f_sub = font(MONT_MED, 36)
    d.text((W // 2, 240), "Super easy — no design skills needed!", fill=HOT_PINK, font=f_sub, anchor="mm")
    draw_accent_line(d, W // 2, 285, 350, ORANGE, 4)

    steps = [
        ("PURCHASE", "Download your files instantly from Etsy"),
        ("OPEN IN CANVA", "Click the link — a free account works!"),
        ("CUSTOMIZE", "Edit text, colors, photos & more"),
        ("DOWNLOAD", "Save as PDF or PNG when you're done"),
        ("PRINT & PARTY!", "At home or any print shop — it's that easy"),
    ]

    start_y = 370
    step_h = 230
    card_margin = 250

    for i, (title, desc) in enumerate(steps):
        y = start_y + i * step_h
        col = ACCENT_CYCLE[i % 4]

        # Frosted row card
        draw_frosted_card(bg, (card_margin, y, W - card_margin, y + step_h - 30),
                          radius=25, opacity=200, shadow=True)
        d = ImageDraw.Draw(bg)

        # Large numbered circle
        circle_x = card_margin + 90
        circle_y = y + (step_h - 30) // 2
        draw_numbered_circle(d, circle_x, circle_y, 52, i + 1, col)

        # Step text
        f_title = font(MONT_BOLD, 42)
        f_desc = font(MONT_REG, 32)
        tx = card_margin + 180
        d.text((tx, y + 40), title, fill=col, font=f_title)
        d.text((tx, y + 100), desc, fill=MED_TEXT, font=f_desc)

    # Bottom text
    f_btm = font(MONT_MED, 30)
    d.text((W // 2, 1560), "From purchase to party-ready in minutes!",
           fill=HOT_PINK, font=f_btm, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 6)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 07 — WHY YOU'LL LOVE IT
# ═══════════════════════════════════════════════════════════════════════════
def img07():
    print("Generating 07-features...")
    bg = create_bg(7)
    draw_glow_circle(bg, 150, 250, 200, CORAL, 28)
    draw_glow_circle(bg, 1850, 300, 180, HOT_PINK, 25)
    draw_glow_circle(bg, 200, 1750, 170, ORANGE, 27)
    draw_glow_circle(bg, 1780, 1730, 200, GOLD, 24)

    d = ImageDraw.Draw(bg)

    f_head = font(MONT_BOLD, 82)
    d.text((W // 2, 170), "WHY YOU'LL LOVE IT", fill=DARK_TEXT, font=f_head, anchor="mm")
    draw_accent_line(d, W // 2, 235, 350, HOT_PINK, 4)

    features = [
        "No design skills needed",
        "Works with FREE Canva",
        "US Letter size (8.5 x 11\")",
        "Instant download",
        "Tropical villa theme",
        "Fully customizable",
        "Print unlimited copies",
        "Perfect for any bach party",
    ]

    start_y = 320
    row_h = 155
    card_margin = 250

    for i, feat in enumerate(features):
        y = start_y + i * row_h
        col = ACCENT_CYCLE[i % 4]

        draw_frosted_card(bg, (card_margin, y, W - card_margin, y + row_h - 20),
                          radius=22, opacity=195, shadow=True)
        d = ImageDraw.Draw(bg)

        # Checkmark circle
        cx = card_margin + 85
        cy = y + (row_h - 20) // 2
        d.ellipse((cx - 32, cy - 32, cx + 32, cy + 32), fill=col)
        # Checkmark
        f_check = font(MONT_BOLD, 38)
        d.text((cx, cy), "✓", fill=WHITE, font=f_check, anchor="mm")

        f_feat = font(MONT_SEMI, 42)
        d.text((card_margin + 160, y + (row_h - 20) // 2 - 22), feat, fill=DARK_TEXT, font=f_feat)

    draw_brand_footer(d)
    save_img(bg, 7)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 08 — YOUR DOWNLOAD INCLUDES
# ═══════════════════════════════════════════════════════════════════════════
def img08():
    print("Generating 08-your-download...")
    bg = create_bg(8)
    draw_glow_circle(bg, 170, 200, 200, HOT_PINK, 30)
    draw_glow_circle(bg, 1830, 300, 190, GOLD, 26)
    draw_glow_circle(bg, 200, 1780, 170, ORANGE, 24)
    draw_glow_circle(bg, 1800, 1720, 200, CORAL, 28)

    d = ImageDraw.Draw(bg)

    f_head = font(MONT_BOLD, 72)
    d.text((W // 2, 170), "YOUR DOWNLOAD INCLUDES", fill=DARK_TEXT, font=f_head, anchor="mm")
    draw_accent_line(d, W // 2, 235, 350, HOT_PINK, 4)

    files = [
        ("Bundle Access", "Your Canva template link + QR code", HOT_PINK),
        ("Quick Start Guide", "Step-by-step editing instructions", ORANGE),
        ("Template Preview", "Visual gallery of all 23 templates", CORAL),
        ("Printing Guide", "Paper sizes & printer settings tips", GOLD),
        ("Thank You Card", "Discount code & support contact info", HOT_PINK),
    ]

    start_y = 330
    row_h = 230
    card_margin = 220

    for i, (title, desc, col) in enumerate(files):
        y = start_y + i * row_h
        # Card
        draw_frosted_card(bg, (card_margin, y, W - card_margin, y + row_h - 25),
                          radius=25, opacity=200, shadow=True)
        # Colored left stripe
        stripe = Image.new("RGBA", bg.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(stripe)
        sd.rounded_rectangle((card_margin, y, card_margin + 12, y + row_h - 25),
                             radius=6, fill=(*col, 255))
        bg.alpha_composite(stripe)

        d = ImageDraw.Draw(bg)

        # File icon circle
        icon_x = card_margin + 90
        icon_y = y + (row_h - 25) // 2
        d.ellipse((icon_x - 38, icon_y - 38, icon_x + 38, icon_y + 38), fill=col)
        f_icon = font(MONT_BOLD, 30)
        d.text((icon_x, icon_y), "PDF", fill=WHITE, font=f_icon, anchor="mm")

        f_title = font(MONT_BOLD, 42)
        f_desc = font(MONT_REG, 32)
        tx = card_margin + 165
        d.text((tx, y + 45), title, fill=DARK_TEXT, font=f_title)
        d.text((tx, y + 105), desc, fill=MED_TEXT, font=f_desc)

    # Bottom note
    f_btm = font(MONT_REG, 28)
    d.text((W // 2, 1530), "5 PDF files included in your Etsy download",
           fill=MED_TEXT, font=f_btm, anchor="mm")
    f_btm2 = font(MONT_MED, 28)
    d.text((W // 2, 1575), "All under 1MB — fast download, works everywhere!",
           fill=HOT_PINK, font=f_btm2, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 8)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 09 — PRINTING TIPS
# ═══════════════════════════════════════════════════════════════════════════
def img09():
    print("Generating 09-printing-tips...")
    bg = create_bg(9)
    draw_glow_circle(bg, 160, 280, 190, ORANGE, 28)
    draw_glow_circle(bg, 1840, 250, 200, HOT_PINK, 26)
    draw_glow_circle(bg, 220, 1770, 180, CORAL, 24)
    draw_glow_circle(bg, 1780, 1740, 200, GOLD, 27)

    d = ImageDraw.Draw(bg)

    f_head = font(MONT_BOLD, 82)
    d.text((W // 2, 170), "PRINTING TIPS", fill=DARK_TEXT, font=f_head, anchor="mm")
    draw_accent_line(d, W // 2, 235, 300, ORANGE, 4)

    tips = [
        ("Print on cardstock for best results", HOT_PINK),
        ("US Letter size — 8.5 x 11 inches", ORANGE),
        ("Use color printing for full effect", CORAL),
        ("Print at 100% scale (don't fit to page)", GOLD),
        ("Use paper cutter for clean edges", HOT_PINK),
        ("FedEx, Staples, or any print shop works", ORANGE),
    ]

    start_y = 320
    row_h = 175
    card_margin = 230

    for i, (tip, col) in enumerate(tips):
        y = start_y + i * row_h
        draw_frosted_card(bg, (card_margin, y, W - card_margin, y + row_h - 25),
                          radius=22, opacity=200, shadow=True)
        d = ImageDraw.Draw(bg)

        # Emoji-like icon circle
        icons = ["🖨", "📐", "🎨", "💯", "✂", "🏪"]
        icon_x = card_margin + 85
        icon_y = y + (row_h - 25) // 2
        d.ellipse((icon_x - 36, icon_y - 36, icon_x + 36, icon_y + 36), fill=col)
        f_ico = font(MONT_BOLD, 28)
        d.text((icon_x, icon_y), str(i + 1), fill=WHITE, font=f_ico, anchor="mm")

        f_tip = font(MONT_SEMI, 38)
        d.text((card_margin + 160, icon_y - 20), tip, fill=DARK_TEXT, font=f_tip)

    # Pro tip box
    draw_frosted_card(bg, (300, 1400, 1700, 1530), radius=25, opacity=220,
                      border_color=HOT_PINK, border_width=3, shadow=True)
    d = ImageDraw.Draw(bg)
    f_pro = font(MONT_BOLD, 32)
    f_pro_txt = font(MONT_REG, 28)
    d.text((W // 2, 1435), "PRO TIP:", fill=HOT_PINK, font=f_pro, anchor="mm")
    d.text((W // 2, 1480), "Always do a test print of one page first!", fill=MED_TEXT, font=f_pro_txt, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 9)


# ═══════════════════════════════════════════════════════════════════════════
# IMAGE 10 — THANK YOU + CTA
# ═══════════════════════════════════════════════════════════════════════════
def img10():
    print("Generating 10-thank-you-cta...")
    bg = create_bg(10)
    # Extra glow for warm feel
    draw_glow_circle(bg, 200, 250, 250, HOT_PINK, 35)
    draw_glow_circle(bg, 1800, 200, 220, ORANGE, 32)
    draw_glow_circle(bg, 150, 1750, 200, GOLD, 28)
    draw_glow_circle(bg, 1850, 1780, 230, CORAL, 30)
    draw_glow_circle(bg, 1000, 200, 180, HOT_PINK, 18)
    draw_glow_circle(bg, 1000, 1800, 160, GOLD, 20)

    # Main frosted card
    draw_frosted_card(bg, (250, 300, 1750, 1550), radius=40, opacity=215)
    d = ImageDraw.Draw(bg)

    # Thank you text
    f_thanks = font(MONT_BOLD, 120)
    d.text((W // 2, 470), "THANK YOU", fill=HOT_PINK, font=f_thanks, anchor="mm")

    f_for = font(MONT_BOLD, 50)
    d.text((W // 2, 560), "FOR SHOPPING WITH US!", fill=ORANGE, font=f_for, anchor="mm")

    draw_accent_line(d, W // 2, 610, 400, CORAL, 5)

    f_msg = font(MONT_MED, 36)
    d.text((W // 2, 680), "We hope you love your Villa Vibes templates!", fill=MED_TEXT, font=f_msg, anchor="mm")

    # Stars
    draw_star_row(d, W // 2, 770, count=5, size=50, color=GOLD)

    f_review = font(MONT_REG, 34)
    d.text((W // 2, 840), "A 5-star review means the world to us", fill=MED_TEXT, font=f_review, anchor="mm")

    # Divider
    draw_accent_line(d, W // 2, 910, 500, GOLD, 3)

    # CTA button
    draw_pill(d, (480, 960, 1520, 1050), HOT_PINK,
              "VISIT OUR SHOP FOR MORE!", WHITE, font(MONT_BOLD, 38))

    # Shop info
    f_shop = font(MONT_SEMI, 34)
    d.text((W // 2, 1120), "shelzysdesigns.etsy.com", fill=HOT_PINK, font=f_shop, anchor="mm")

    f_handle = font(MONT_REG, 30)
    d.text((W // 2, 1175), "@shelzysdesigns", fill=MED_TEXT, font=f_handle, anchor="mm")

    # Small support note
    draw_frosted_card(bg, (400, 1240, 1600, 1340), radius=20, opacity=180,
                      border_color=GOLD, border_width=2, shadow=False)
    d = ImageDraw.Draw(bg)
    f_support = font(MONT_REG, 28)
    d.text((W // 2, 1275), "Questions? Message us anytime — we respond within 24hrs!",
           fill=MED_TEXT, font=f_support, anchor="mm")

    # Warm sign-off
    f_love = font(MONT_MED, 30)
    d.text((W // 2, 1420), "Made with love by Shelzy's Designs", fill=CORAL, font=f_love, anchor="mm")

    draw_brand_footer(d)
    save_img(bg, 10)


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("Villa Vibes — Etsy Listing Images v3 (Miami Pastel)")
    print("=" * 60)
    img01()
    img02()
    img03()
    img04()
    img05()
    img06()
    img07()
    img08()
    img09()
    img10()
    print("=" * 60)
    print(f"All 10 images saved to: {OUT_DIR}/")
    print(f"Also saved to: {ASSET_DIR}/")
    print("=" * 60)
