#!/usr/bin/env python3
"""
Generate 10 Etsy listing images for Villa Vibes Bachelorette Bundle.
All images: 2000x2000 px, sRGB, JPG quality 95.
Brand colors from Shelzy's Designs brand guide, adapted for tropical party vibe.
"""

from PIL import Image, ImageDraw, ImageFont
import os, math

OUT = "/home/user/ShelzysDesigns/ETSY/VILLA/Etsy_Listing_Assets"
W, H = 2000, 2000

# === BRAND COLORS ===
SAGE        = (139, 170, 136)    # #8BAA88
DARK_SAGE   = (78, 95, 74)      # #4E5F4A
WARM_WHITE  = (250, 249, 246)   # #FAF9F6
CHARCOAL    = (43, 43, 43)      # #2B2B2B
WHITE       = (255, 255, 255)
GOLD        = (209, 199, 161)   # #D1C7A1
SOFT_BORDER = (199, 211, 197)   # #C7D3C5
LIGHT_BG    = (245, 243, 238)   # slightly warm

# Tropical accent (stays complementary to sage palette)
TROPICAL_SAGE  = (162, 198, 158)  # lighter sage for tropical feel
PALE_GOLD      = (235, 228, 206)  # soft gold wash

# === FONTS ===
SERIF_BOLD  = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_REG   = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS_BOLD   = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
SANS_REG    = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

def center_text(draw, text, y, fnt, fill, w=W):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    x = (w - tw) // 2
    draw.text((x, y), text, font=fnt, fill=fill)
    return bbox[3] - bbox[1]

def left_text(draw, text, x, y, fnt, fill):
    draw.text((x, y), text, font=fnt, fill=fill)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[3] - bbox[1]

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_pill_badge(draw, text, cx, cy, fnt, bg, fg, hpad=40, vpad=16):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x0 = cx - tw // 2 - hpad
    y0 = cy - th // 2 - vpad
    x1 = cx + tw // 2 + hpad
    y1 = cy + th // 2 + vpad
    draw.rounded_rectangle((x0, y0, x1, y1), radius=(y1 - y0) // 2, fill=bg)
    draw.text((cx - tw // 2, cy - th // 2), text, font=fnt, fill=fg)
    return x1 - x0

def draw_mockup_rect(draw, x, y, w, h, label, label_font, border_color=SOFT_BORDER, bg=WHITE, text_color=CHARCOAL):
    """Draw a simplified template mockup rectangle."""
    draw.rounded_rectangle((x, y, x + w, y + h), radius=12, fill=bg, outline=border_color, width=3)
    # Add lines to simulate content
    line_y = y + 50
    for i in range(4):
        lw = w - 80 if i == 0 else w - 120 - (i * 30)
        if lw < 60:
            lw = 60
        draw.rounded_rectangle((x + 40, line_y, x + 40 + lw, line_y + 12), radius=6, fill=SOFT_BORDER)
        line_y += 28
    # Label at bottom
    if label:
        bbox = draw.textbbox((0, 0), label, font=label_font)
        tw = bbox[2] - bbox[0]
        draw.text((x + (w - tw) // 2, y + h - 50), label, font=label_font, fill=text_color)

def draw_step_circle(draw, num, cx, cy, r, bg, fg, fnt):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=bg)
    txt = str(num)
    bbox = draw.textbbox((0, 0), txt, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 4), txt, font=fnt, fill=fg)

def decorative_border(draw, thickness=6, color=SAGE, margin=60):
    draw.rounded_rectangle((margin, margin, W - margin, H - margin), radius=30, fill=None, outline=color, width=thickness)

def top_brand_bar(draw, text="SHELZY'S DESIGNS"):
    fnt = font(SANS_BOLD, 28)
    draw.rectangle((0, 0, W, 70), fill=DARK_SAGE)
    center_text(draw, text, 20, fnt, GOLD)

def bottom_brand_bar(draw, text="shelzysdesigns.etsy.com"):
    fnt = font(SANS_REG, 26)
    draw.rectangle((0, H - 70, W, H), fill=DARK_SAGE)
    center_text(draw, text, H - 52, fnt, GOLD)

# =============================================
# IMAGE 01 - HERO
# =============================================
def make_image01():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    # Background accent: soft sage strip at top
    draw.rectangle((0, 0, W, 520), fill=DARK_SAGE)

    # Top branding
    fnt_brand = font(SANS_BOLD, 30)
    center_text(draw, "SHELZY'S DESIGNS", 30, fnt_brand, GOLD)

    # Main headline
    fnt_h1 = font(SERIF_BOLD, 110)
    center_text(draw, "Villa Vibes", 120, fnt_h1, WHITE)

    # Sub headline
    fnt_h2 = font(SERIF_BOLD, 64)
    center_text(draw, "Bachelorette Bundle", 260, fnt_h2, PALE_GOLD)

    # Template count
    fnt_count = font(SANS_BOLD, 48)
    center_text(draw, "23 Editable + Printable Templates", 380, fnt_count, TROPICAL_SAGE)

    # Divider line
    draw.line((600, 470, 1400, 470), fill=GOLD, width=3)

    # Mockup grid (6 template previews)
    mock_font = font(SANS_REG, 22)
    labels = ["Welcome Sign", "Itinerary", "Drink If...", "Who Knows\nthe Bride", "Packing List", "Photo Props"]
    cols, rows = 3, 2
    card_w, card_h = 420, 340
    gap_x, gap_y = 60, 50
    start_x = (W - (cols * card_w + (cols - 1) * gap_x)) // 2
    start_y = 570

    for idx, label in enumerate(labels):
        col = idx % cols
        row = idx // cols
        cx = start_x + col * (card_w + gap_x)
        cy = start_y + row * (card_h + gap_y)

        # Card shadow
        draw.rounded_rectangle((cx + 6, cy + 6, cx + card_w + 6, cy + card_h + 6), radius=16, fill=(220, 220, 215))
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=WHITE, outline=SOFT_BORDER, width=2)

        # Simulated content lines
        line_y = cy + 35
        for i in range(5):
            lw = card_w - 70 if i == 0 else card_w - 100 - (i * 25)
            if lw < 40:
                lw = 40
            color = SAGE if i == 0 else SOFT_BORDER
            draw.rounded_rectangle((cx + 35, line_y, cx + 35 + lw, line_y + 14), radius=7, fill=color)
            line_y += 30

        # Card label
        for li, line in enumerate(label.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=mock_font)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + card_h - 65 + li * 26), line, font=mock_font, fill=CHARCOAL)

    # Badge row at bottom
    badge_y = 1420
    badge_font = font(SANS_BOLD, 34)
    badges = ["Instant Download", "Edit in Canva", "Print or Share"]
    total_badge_w = 0
    badge_widths = []
    for b in badges:
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        bw = bbox[2] - bbox[0] + 80
        badge_widths.append(bw)
        total_badge_w += bw
    gap = 40
    total_badge_w += gap * (len(badges) - 1)
    bx = (W - total_badge_w) // 2
    for i, b in enumerate(badges):
        bw = badge_widths[i]
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + 72), radius=36, fill=SAGE)
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((bx + (bw - tw) // 2, badge_y + (72 - th) // 2 - 2), b, font=badge_font, fill=WHITE)
        bx += bw + gap

    # Bottom tagline
    fnt_tag = font(SANS_REG, 32)
    center_text(draw, "Games  |  Signs  |  Planning  |  Extras", 1560, fnt_tag, CHARCOAL)

    # Bottom brand bar
    draw.rectangle((0, H - 80, W, H), fill=DARK_SAGE)
    fnt_url = font(SANS_REG, 28)
    center_text(draw, "shelzysdesigns.etsy.com", H - 58, fnt_url, GOLD)

    # Decorative border
    draw.rounded_rectangle((40, 530, W - 40, 1640), radius=24, fill=None, outline=SOFT_BORDER, width=3)

    img.save(os.path.join(OUT, "VillaVibes_Image01_Hero.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [1/10] Hero image done")

# =============================================
# IMAGE 02 - WHAT'S INCLUDED
# =============================================
def make_image02():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    # Title
    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "What's Included", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "23 Templates in One Bundle", 220, fnt_sub, SAGE)

    # Divider
    draw.line((700, 290, 1300, 290), fill=GOLD, width=3)

    # 4 category cards in 2x2 grid
    categories = [
        ("8", "Party Games", ["Drink If...", "Who Knows the Bride", "Scavenger Hunt",
                               "Would She Rather", "Groom Trivia", "Never Have I Ever",
                               "Bridal Bingo", "Over or Under"]),
        ("7", "Signs & Decor", ["Welcome Sign", "Bar Menu Sign", "Photo Prop Frame",
                                 "Directional Sign", "Door Hanger", "Table Numbers",
                                 "Hashtag Sign"]),
        ("4", "Planning", ["Weekend Itinerary", "Invitation", "Packing List",
                            "House Rules"]),
        ("4", "Bonus Extras", ["Name Tags", "Paddle Signs", "Story Templates",
                                "Cocktail Recipe Cards"]),
    ]

    card_w, card_h = 820, 560
    gap = 60
    start_x = (W - 2 * card_w - gap) // 2
    start_y = 340

    for idx, (count, title, items) in enumerate(categories):
        col = idx % 2
        row = idx // 2
        cx = start_x + col * (card_w + gap)
        cy = start_y + row * (card_h + gap)

        # Card bg
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=WHITE, outline=SOFT_BORDER, width=3)

        # Count circle
        circle_r = 48
        circle_cx = cx + 80
        circle_cy = cy + 72
        draw.ellipse((circle_cx - circle_r, circle_cy - circle_r, circle_cx + circle_r, circle_cy + circle_r), fill=SAGE)
        fnt_num = font(SANS_BOLD, 52)
        bbox = draw.textbbox((0, 0), count, font=fnt_num)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((circle_cx - tw // 2, circle_cy - th // 2 - 4), count, font=fnt_num, fill=WHITE)

        # Category title
        fnt_cat = font(SERIF_BOLD, 46)
        draw.text((cx + 150, cy + 45), title, font=fnt_cat, fill=DARK_SAGE)

        # Items list
        fnt_item = font(SANS_REG, 28)
        iy = cy + 140
        for item in items:
            draw.text((cx + 60, iy), f"\u2713  {item}", font=fnt_item, fill=CHARCOAL)
            iy += 44

    # Bottom
    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image02_WhatsIncluded.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [2/10] What's Included done")

# =============================================
# IMAGE 03 - EDITABLE IN CANVA
# =============================================
def make_image03():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Fully Editable in Canva", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_REG, 38)
    center_text(draw, "Free Canva Account Works!", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    # Before / After panels
    panel_w = 780
    panel_h = 550
    left_x = 120
    right_x = W - 120 - panel_w
    panel_y = 340

    # BEFORE panel
    draw.rounded_rectangle((left_x, panel_y, left_x + panel_w, panel_y + panel_h), radius=20, fill=WHITE, outline=SOFT_BORDER, width=3)
    fnt_label = font(SANS_BOLD, 36)
    center_text(draw, "BEFORE", panel_y + 20, fnt_label, CHARCOAL, w=left_x * 2 + panel_w)

    # Simulated template - generic content lines
    for i in range(8):
        lw = panel_w - 120 if i == 0 else panel_w - 160 - (i * 40)
        if lw < 80:
            lw = 80
        ly = panel_y + 90 + i * 48
        c = SAGE if i == 0 else SOFT_BORDER
        draw.rounded_rectangle((left_x + 60, ly, left_x + 60 + lw, ly + 20), radius=10, fill=c)

    # Arrow between panels
    arrow_cx = W // 2
    arrow_cy = panel_y + panel_h // 2
    draw.polygon([(arrow_cx - 30, arrow_cy - 25), (arrow_cx + 30, arrow_cy),
                  (arrow_cx - 30, arrow_cy + 25)], fill=SAGE)

    # AFTER panel
    draw.rounded_rectangle((right_x, panel_y, right_x + panel_w, panel_y + panel_h), radius=20, fill=WHITE, outline=SAGE, width=4)
    center_text(draw, "AFTER", panel_y + 20, fnt_label, SAGE, w=right_x * 2 + panel_w - W)

    # Simulated edited template - with colored elements
    for i in range(8):
        lw = panel_w - 120 if i == 0 else panel_w - 160 - (i * 40)
        if lw < 80:
            lw = 80
        ly = panel_y + 90 + i * 48
        c = DARK_SAGE if i == 0 else TROPICAL_SAGE if i % 2 == 0 else PALE_GOLD
        draw.rounded_rectangle((right_x + 60, ly, right_x + 60 + lw, ly + 20), radius=10, fill=c)

    # What you can edit section
    edit_y = 960
    fnt_edit_title = font(SERIF_BOLD, 52)
    center_text(draw, "What You Can Edit", edit_y, fnt_edit_title, DARK_SAGE)

    editable_items = [
        ("Text & Wording", "Change any text to match your party"),
        ("Colors & Fonts", "Update to your wedding or party colors"),
        ("Photos & Images", "Add your own photos and graphics"),
        ("Layout Elements", "Move, resize, or rearrange anything"),
    ]

    fnt_item_title = font(SANS_BOLD, 34)
    fnt_item_desc = font(SANS_REG, 30)
    iy = edit_y + 80

    for title, desc in editable_items:
        # Checkmark circle
        draw.ellipse((280, iy, 330, iy + 50), fill=SAGE)
        fnt_check = font(SANS_BOLD, 30)
        draw.text((293, iy + 6), "\u2713", font=fnt_check, fill=WHITE)

        draw.text((360, iy), title, font=fnt_item_title, fill=DARK_SAGE)
        draw.text((360, iy + 44), desc, font=fnt_item_desc, fill=CHARCOAL)
        iy += 120

    # Canva badge
    badge_y = 1580
    fnt_badge = font(SANS_BOLD, 36)
    draw_pill_badge(draw, "Works with Free Canva", W // 2, badge_y, fnt_badge, SAGE, WHITE)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image03_EditableCanva.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [3/10] Editable in Canva done")

# =============================================
# IMAGE 04 - HOW IT WORKS
# =============================================
def make_image04():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "How It Works", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_REG, 38)
    center_text(draw, "5 Simple Steps to Your Perfect Party", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    steps = [
        ("Purchase on Etsy", "Add to cart and check out instantly"),
        ("Download Access PDF", "Get your download link via Etsy email"),
        ("Open in Canva", "Click the link to open all templates"),
        ("Edit Your Templates", "Customize text, colors, and photos"),
        ("Download & Print", "Save as PDF/PNG and print or share"),
    ]

    fnt_step_num = font(SANS_BOLD, 52)
    fnt_step_title = font(SERIF_BOLD, 46)
    fnt_step_desc = font(SANS_REG, 32)

    start_y = 360
    step_h = 220
    circle_r = 50

    for i, (title, desc) in enumerate(steps):
        cy = start_y + i * step_h

        # Connecting line
        if i < len(steps) - 1:
            draw.line((200, cy + circle_r + 10, 200, cy + step_h - 10), fill=SOFT_BORDER, width=4)

        # Step circle
        draw_step_circle(draw, i + 1, 200, cy, circle_r, SAGE, WHITE, fnt_step_num)

        # Step content card
        card_x = 310
        card_w = W - card_x - 120
        draw.rounded_rectangle((card_x, cy - 45, card_x + card_w, cy + 95), radius=16, fill=WHITE, outline=SOFT_BORDER, width=2)
        draw.text((card_x + 35, cy - 35), title, font=fnt_step_title, fill=DARK_SAGE)
        draw.text((card_x + 35, cy + 25), desc, font=fnt_step_desc, fill=CHARCOAL)

    # Call to action
    cta_y = 1520
    fnt_cta = font(SANS_BOLD, 38)
    draw_pill_badge(draw, "Start Customizing in Minutes!", W // 2, cta_y, fnt_cta, DARK_SAGE, WHITE, hpad=60, vpad=24)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image04_HowItWorks.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [4/10] How It Works done")

# =============================================
# IMAGE 05 - GAMES PREVIEW
# =============================================
def make_image05():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Party Games", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "8 Fun, Ready-to-Play Games", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    # Game card grid (4x2)
    games = [
        "Drink If...", "Who Knows\nthe Bride", "Scavenger\nHunt", "Would She\nRather",
        "Groom\nTrivia", "Never Have\nI Ever", "Bridal\nBingo", "Over or\nUnder"
    ]

    card_w, card_h = 380, 340
    gap = 50
    cols, rows = 4, 2
    start_x = (W - cols * card_w - (cols - 1) * gap) // 2
    start_y = 350

    fnt_game = font(SERIF_BOLD, 34)
    fnt_game_num = font(SANS_BOLD, 28)

    for idx, game in enumerate(games):
        col = idx % cols
        row = idx // cols
        cx = start_x + col * (card_w + gap)
        cy = start_y + row * (card_h + gap)

        # Shadow
        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=16, fill=(230, 230, 225))
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=WHITE, outline=SOFT_BORDER, width=2)

        # Number badge at top-left
        draw.ellipse((cx + 15, cy + 15, cx + 55, cy + 55), fill=SAGE)
        num_text = str(idx + 1)
        bbox = draw.textbbox((0, 0), num_text, font=fnt_game_num)
        ntw = bbox[2] - bbox[0]
        draw.text((cx + 35 - ntw // 2, cy + 22), num_text, font=fnt_game_num, fill=WHITE)

        # Content simulation lines
        for li in range(4):
            lw = card_w - 60 if li == 0 else card_w - 80 - li * 20
            if lw < 40:
                lw = 40
            ly = cy + 80 + li * 30
            draw.rounded_rectangle((cx + 30, ly, cx + 30 + lw, ly + 12), radius=6, fill=SOFT_BORDER)

        # Game name
        lines = game.split("\n")
        for li, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=fnt_game)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + card_h - 80 + li * 38), line, font=fnt_game, fill=DARK_SAGE)

    # Callout
    callout_y = 1150
    fnt_callout = font(SANS_REG, 34)
    center_text(draw, "Fun, easy-to-run, bachelorette-ready game set", callout_y, fnt_callout, CHARCOAL)

    # Feature badges
    badge_y = 1280
    badge_font = font(SANS_BOLD, 30)
    badges = ["Editable Text", "Print at Home", "Instant Fun"]
    total_w = 0
    bws = []
    for b in badges:
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        bw = bbox[2] - bbox[0] + 60
        bws.append(bw)
        total_w += bw
    total_w += 30 * (len(badges) - 1)
    bx = (W - total_w) // 2
    for i, b in enumerate(badges):
        bw = bws[i]
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + 60), radius=30, fill=SAGE)
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        tw = bbox[2] - bbox[0]
        draw.text((bx + (bw - tw) // 2, badge_y + 12), b, font=badge_font, fill=WHITE)
        bx += bw + 30

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image05_GamesPreview.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [5/10] Games Preview done")

# =============================================
# IMAGE 06 - SIGNS & DECOR
# =============================================
def make_image06():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Signs & Decor", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "7 Print-Ready Party Signs", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    signs = [
        ("Welcome Sign", "Greet your guests\nin style"),
        ("Bar Menu", "Custom cocktail\nmenu sign"),
        ("Photo Prop Frame", "Fun selfie\nframe cutout"),
        ("Directional Sign", "Guide guests\naround the venue"),
        ("Door Hanger", "Do Not Disturb\n& party modes"),
        ("Table Numbers", "Matching table\nnumber cards"),
        ("Hashtag Sign", "Custom hashtag\nfor photos"),
    ]

    # Layout: top row 4, bottom row 3 centered
    card_w, card_h = 380, 400
    gap = 40
    fnt_sign = font(SERIF_BOLD, 32)
    fnt_desc = font(SANS_REG, 24)

    # Row 1: 4 cards
    row1_count = 4
    row1_x = (W - row1_count * card_w - (row1_count - 1) * gap) // 2
    row1_y = 350

    # Row 2: 3 cards centered
    row2_count = 3
    row2_x = (W - row2_count * card_w - (row2_count - 1) * gap) // 2
    row2_y = 350 + card_h + gap

    for idx, (name, desc) in enumerate(signs):
        if idx < 4:
            cx = row1_x + idx * (card_w + gap)
            cy = row1_y
        else:
            cx = row2_x + (idx - 4) * (card_w + gap)
            cy = row2_y

        # Shadow
        draw.rounded_rectangle((cx + 4, cy + 4, cx + card_w + 4, cy + card_h + 4), radius=16, fill=(230, 230, 225))
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=WHITE, outline=SOFT_BORDER, width=2)

        # Icon area (simulated sign shape)
        icon_cx = cx + card_w // 2
        icon_cy = cy + 100
        draw.rounded_rectangle((icon_cx - 80, icon_cy - 60, icon_cx + 80, icon_cy + 60), radius=8, fill=PALE_GOLD, outline=SAGE, width=2)
        # Mini lines inside
        for li in range(3):
            lw = 100 - li * 20
            draw.rounded_rectangle((icon_cx - lw // 2, icon_cy - 30 + li * 28, icon_cx + lw // 2, icon_cy - 20 + li * 28), radius=4, fill=SAGE)

        # Name
        bbox = draw.textbbox((0, 0), name, font=fnt_sign)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 190), name, font=fnt_sign, fill=DARK_SAGE)

        # Description
        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 240 + li * 32), line, font=fnt_desc, fill=CHARCOAL)

    # Callout
    callout_y = 1310
    fnt_callout = font(SANS_REG, 36)
    center_text(draw, "Print-ready party signage for every corner of the venue", callout_y, fnt_callout, CHARCOAL)

    # Badge
    badge_y = 1420
    fnt_badge = font(SANS_BOLD, 34)
    draw_pill_badge(draw, "Customize Colors & Text", W // 2, badge_y, fnt_badge, SAGE, WHITE)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image06_SignsAndDecor.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [6/10] Signs & Decor done")

# =============================================
# IMAGE 07 - PLANNING TEMPLATES
# =============================================
def make_image07():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Planning Templates", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "Plan the Weekend in Minutes", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    templates = [
        ("Weekend Itinerary", "Full schedule layout\nwith times & activities", "Day-by-day\nplanner"),
        ("Invitation", "Send to your girls\nwith all the details", "Editable\ntext + photo"),
        ("Packing List", "Everything they need\nto bring, checked off", "Printable\nchecklist"),
        ("House Rules", "Set the vibe with\nfun villa rules", "Customizable\nrules list"),
    ]

    card_w = 400
    card_h = 700
    gap = 50
    start_x = (W - 4 * card_w - 3 * gap) // 2
    start_y = 350

    fnt_name = font(SERIF_BOLD, 38)
    fnt_desc = font(SANS_REG, 26)
    fnt_tag = font(SANS_BOLD, 22)

    for idx, (name, desc, tag) in enumerate(templates):
        cx = start_x + idx * (card_w + gap)
        cy = start_y

        # Shadow
        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=20, fill=(230, 230, 225))
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=WHITE, outline=SOFT_BORDER, width=3)

        # Template preview area
        preview_margin = 30
        preview_y = cy + preview_margin
        preview_h = 350
        draw.rounded_rectangle((cx + preview_margin, preview_y, cx + card_w - preview_margin, preview_y + preview_h),
                               radius=12, fill=PALE_GOLD, outline=SAGE, width=2)

        # Simulated content
        for li in range(8):
            lw = card_w - 100 if li == 0 else card_w - 120 - li * 15
            if lw < 60:
                lw = 60
            ly = preview_y + 30 + li * 36
            c = DARK_SAGE if li == 0 else SAGE if li % 3 == 0 else SOFT_BORDER
            draw.rounded_rectangle((cx + 50, ly, cx + 50 + lw, ly + 14), radius=7, fill=c)

        # Name
        bbox = draw.textbbox((0, 0), name, font=fnt_name)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 420), name, font=fnt_name, fill=DARK_SAGE)

        # Description
        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 480 + li * 34), line, font=fnt_desc, fill=CHARCOAL)

        # Tag at bottom
        tag_y = cy + card_h - 90
        for li, line in enumerate(tag.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_tag)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, tag_y + li * 28), line, font=fnt_tag, fill=SAGE)

    # Callout
    callout_y = 1150
    fnt_callout = font(SANS_REG, 36)
    center_text(draw, "Organize every detail for a stress-free celebration", callout_y, fnt_callout, CHARCOAL)

    # Badge
    badge_y = 1280
    fnt_badge = font(SANS_BOLD, 34)
    draw_pill_badge(draw, "Edit & Print in Minutes", W // 2, badge_y, fnt_badge, SAGE, WHITE)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image07_PlanningTemplates.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [7/10] Planning Templates done")

# =============================================
# IMAGE 08 - EXTRAS & BONUS
# =============================================
def make_image08():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Bonus Extras", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "4 Matching Extras Included", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    extras = [
        ("Name Tags", "Personalized name tags\nfor each guest", "Perfect for\ngroup photos"),
        ("Paddle Signs", "Yes/No, Team Bride\nphoto prop paddles", "Great for\ngames & pics"),
        ("Story Templates", "Instagram story\ntemplates to share", "Match your\nparty theme"),
        ("Cocktail Cards", "Signature drink\nrecipe cards", "Print for\nthe bar area"),
    ]

    card_w = 400
    card_h = 680
    gap = 50
    start_x = (W - 4 * card_w - 3 * gap) // 2
    start_y = 360

    fnt_name = font(SERIF_BOLD, 38)
    fnt_desc = font(SANS_REG, 28)
    fnt_note = font(SANS_BOLD, 24)

    for idx, (name, desc, note) in enumerate(extras):
        cx = start_x + idx * (card_w + gap)
        cy = start_y

        # Shadow
        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=20, fill=(230, 230, 225))
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=WHITE, outline=SOFT_BORDER, width=3)

        # "BONUS" mini badge
        bonus_fnt = font(SANS_BOLD, 20)
        bbox = draw.textbbox((0, 0), "BONUS", font=bonus_fnt)
        bw = bbox[2] - bbox[0] + 24
        bh = bbox[3] - bbox[1] + 12
        draw.rounded_rectangle((cx + card_w - bw - 15, cy + 12, cx + card_w - 15, cy + 12 + bh), radius=bh // 2, fill=GOLD)
        draw.text((cx + card_w - bw - 15 + 12, cy + 15), "BONUS", font=bonus_fnt, fill=WHITE)

        # Preview area
        preview_y = cy + 50
        preview_h = 300
        draw.rounded_rectangle((cx + 30, preview_y, cx + card_w - 30, preview_y + preview_h),
                               radius=12, fill=PALE_GOLD, outline=SAGE, width=2)

        # Content lines
        for li in range(6):
            lw = card_w - 100 if li == 0 else card_w - 130 - li * 20
            if lw < 40:
                lw = 40
            ly = preview_y + 30 + li * 40
            c = DARK_SAGE if li == 0 else SOFT_BORDER
            draw.rounded_rectangle((cx + 50, ly, cx + 50 + lw, ly + 16), radius=8, fill=c)

        # Name
        bbox = draw.textbbox((0, 0), name, font=fnt_name)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 400), name, font=fnt_name, fill=DARK_SAGE)

        # Desc
        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 460 + li * 36), line, font=fnt_desc, fill=CHARCOAL)

        # Note
        for li, line in enumerate(note.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_note)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 570 + li * 30), line, font=fnt_note, fill=SAGE)

    # Callout
    callout_y = 1130
    fnt_callout = font(SANS_REG, 36)
    center_text(draw, "Bonus matching extras to complete your party look", callout_y, fnt_callout, CHARCOAL)

    # Badge
    badge_y = 1250
    fnt_badge = font(SANS_BOLD, 34)
    draw_pill_badge(draw, "All Included in Your Bundle", W // 2, badge_y, fnt_badge, SAGE, WHITE)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image08_ExtrasAndBonus.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [8/10] Extras & Bonus done")

# =============================================
# IMAGE 09 - PRINT + DIGITAL USE
# =============================================
def make_image09():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 80)
    center_text(draw, "Print & Digital Use", 120, fnt_title, DARK_SAGE)

    fnt_sub = font(SANS_BOLD, 42)
    center_text(draw, "Flexible for Every Party Setup", 225, fnt_sub, SAGE)

    draw.line((650, 290, 1350, 290), fill=GOLD, width=3)

    # Two columns: Print / Digital
    col_w = 780
    col_h = 700
    left_x = 120
    right_x = W - 120 - col_w
    col_y = 360

    # PRINT column
    draw.rounded_rectangle((left_x, col_y, left_x + col_w, col_y + col_h), radius=24, fill=WHITE, outline=SAGE, width=3)
    fnt_col_title = font(SERIF_BOLD, 52)
    center_text(draw, "Print at Home", col_y + 30, fnt_col_title, DARK_SAGE, w=left_x * 2 + col_w)

    print_items = [
        "US Letter (8.5 x 11 in) compatible",
        "Standard home printer friendly",
        "Also great at print shops (FedEx, Staples)",
        "High-quality PDF downloads",
        "Cardstock recommended for signs",
        "Trim guides included where needed",
    ]
    fnt_item = font(SANS_REG, 30)
    iy = col_y + 120
    for item in print_items:
        draw.text((left_x + 50, iy), f"\u2713  {item}", font=fnt_item, fill=CHARCOAL)
        iy += 55

    # DIGITAL column
    draw.rounded_rectangle((right_x, col_y, right_x + col_w, col_y + col_h), radius=24, fill=WHITE, outline=SAGE, width=3)
    center_text(draw, "Share Digitally", col_y + 30, fnt_col_title, DARK_SAGE, w=W - (W - right_x - col_w) * 2)

    digital_items = [
        "Download as JPG or PNG from Canva",
        "Text or email to guests",
        "Share in group chats",
        "Post to Instagram Stories",
        "Use as phone wallpapers",
        "Perfect for remote bachelorettes",
    ]
    iy = col_y + 120
    for item in digital_items:
        draw.text((right_x + 50, iy), f"\u2713  {item}", font=fnt_item, fill=CHARCOAL)
        iy += 55

    # Specs section
    specs_y = 1140
    fnt_specs_title = font(SERIF_BOLD, 46)
    center_text(draw, "File Specifications", specs_y, fnt_specs_title, DARK_SAGE)

    specs = [
        "Format: Canva-editable PDF templates",
        "Print Size: US Letter (8.5 x 11 inches)",
        "Resolution: High-quality 300 DPI output",
        "Color: Full color, sRGB optimized",
    ]
    fnt_spec = font(SANS_REG, 32)
    sy = specs_y + 70
    for spec in specs:
        center_text(draw, spec, sy, fnt_spec, CHARCOAL)
        sy += 52

    # Badge
    badge_y = 1520
    fnt_badge = font(SANS_BOLD, 34)
    draw_pill_badge(draw, "Print or Share - Your Choice!", W // 2, badge_y, fnt_badge, SAGE, WHITE)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image09_PrintAndDigitalUse.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [9/10] Print & Digital Use done")

# =============================================
# IMAGE 10 - FAQ + IMPORTANT NOTES
# =============================================
def make_image10():
    img = Image.new("RGB", (W, H), WARM_WHITE)
    draw = ImageDraw.Draw(img)

    top_brand_bar(draw)

    fnt_title = font(SERIF_BOLD, 76)
    center_text(draw, "FAQ & Important Notes", 120, fnt_title, DARK_SAGE)

    draw.line((650, 220, 1350, 220), fill=GOLD, width=3)

    faqs = [
        ("Is this a physical product?",
         "No. This is a digital download only. No physical item\nwill be shipped. You'll receive instant access to download\nyour files after purchase."),
        ("How do I access my templates?",
         "After purchase, download the Access PDF from your\nEtsy purchases. It contains your unique Canva link\nto open and edit all 23 templates."),
        ("Do I need a paid Canva account?",
         "No! A free Canva account is all you need.\nSign up at canva.com if you don't have one."),
        ("Can I edit the text and colors?",
         "Yes! Every template is fully customizable.\nChange text, fonts, colors, photos, and layout\nelements to match your party theme."),
        ("What size do the templates print?",
         "All templates are designed for US Letter size\n(8.5 x 11 inches) for easy home or shop printing."),
        ("Is this for personal use only?",
         "Yes. This bundle is licensed for personal use only.\nCommercial use, resale, or redistribution is not permitted."),
        ("Need help? Have questions?",
         "Message us through Etsy! We're happy to help\nand typically respond within 24 hours."),
    ]

    fnt_q = font(SANS_BOLD, 34)
    fnt_a = font(SANS_REG, 28)

    y = 270
    for q, a in faqs:
        # Q label
        draw.rounded_rectangle((120, y, W - 120, y + 2), radius=1, fill=SOFT_BORDER)
        y += 16

        draw.text((140, y), f"Q:  {q}", font=fnt_q, fill=DARK_SAGE)
        y += 52

        for li, line in enumerate(a.split("\n")):
            draw.text((180, y), line, font=fnt_a, fill=CHARCOAL)
            y += 38
        y += 20

    # Important note box at bottom
    note_y = y + 10
    draw.rounded_rectangle((120, note_y, W - 120, note_y + 120), radius=16, fill=PALE_GOLD, outline=GOLD, width=2)
    fnt_note = font(SANS_BOLD, 30)
    center_text(draw, "DIGITAL PRODUCT  |  INSTANT DOWNLOAD  |  NO PHYSICAL ITEM", note_y + 20, fnt_note, DARK_SAGE)
    fnt_note2 = font(SANS_REG, 28)
    center_text(draw, "Personal use only. Not for resale or redistribution.", note_y + 65, fnt_note2, CHARCOAL)

    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image10_FAQ_ImportantNotes.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [10/10] FAQ & Important Notes done")

# =============================================
# RUN ALL
# =============================================
if __name__ == "__main__":
    print("Generating Villa Vibes Etsy listing images...")
    make_image01()
    make_image02()
    make_image03()
    make_image04()
    make_image05()
    make_image06()
    make_image07()
    make_image08()
    make_image09()
    make_image10()
    print("\nAll 10 images generated successfully!")
