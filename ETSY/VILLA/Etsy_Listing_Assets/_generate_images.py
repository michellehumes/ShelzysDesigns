#!/usr/bin/env python3
"""
Generate 10 Etsy listing images for Villa Vibes Bachelorette Bundle.
All images: 2000x2000 px, sRGB, JPG quality 95.
Uses VILLA VIBES color palette and typography per brand specs.
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/user/ShelzysDesigns/ETSY/VILLA/Etsy_Listing_Assets"
W, H = 2000, 2000

# === VILLA VIBES COLOR PALETTE ===
WHITE      = (254, 254, 254)     # #fefefe
HOT_PINK   = (251, 88, 135)     # #fb5887
ORANGE     = (254, 140, 67)     # #fe8c43
BLUE       = (60, 164, 215)     # #3ca4d7
TEAL       = (138, 219, 222)    # #8adbde
DARK_TEXT   = (45, 45, 50)      # near-black for body text
LIGHT_BG    = (254, 252, 250)   # warm white bg
CARD_BG     = (255, 255, 255)
GOLD_TEXT   = (209, 180, 100)   # gold for subtitles
SOFT_GRAY   = (235, 235, 238)   # light divider/border

# === FONTS (Villa Vibes Typography) ===
# Title: Berthold Block → Anton (closest free block font), size 42 (scaled for 2000px)
# Subtitle: Montserrat, size 36, gold
# Heading: Montserrat Bold, size 32
# Subheading: Montserrat SemiBold
# Section header: Montserrat Bold, size 20
# Body: Montserrat Regular, size 16

TITLE_FONT      = "/usr/share/fonts/truetype/bebasneue/Anton-Regular.ttf"
MONTSERRAT_BOLD = "/usr/share/fonts/truetype/montserrat/Montserrat-Bold.ttf"
MONTSERRAT_SEMI = "/usr/share/fonts/truetype/montserrat/Montserrat-SemiBold.ttf"
MONTSERRAT_REG  = "/usr/share/fonts/truetype/montserrat/Montserrat-Regular.ttf"
MONTSERRAT_MED  = "/usr/share/fonts/truetype/montserrat/Montserrat-Medium.ttf"

# Scale factor: design specs are for ~web/print, images are 2000px. Multiply by ~2.5
def font(path, size):
    return ImageFont.truetype(path, size)

def center_text(draw, text, y, fnt, fill, w=W):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    x = (w - tw) // 2
    draw.text((x, y), text, font=fnt, fill=fill)
    return bbox[3] - bbox[1]

def draw_pill_badge(draw, text, cx, cy, fnt, bg, fg, hpad=40, vpad=16):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x0 = cx - tw // 2 - hpad
    y0 = cy - th // 2 - vpad
    x1 = cx + tw // 2 + hpad
    y1 = cy + th // 2 + vpad
    draw.rounded_rectangle((x0, y0, x1, y1), radius=(y1 - y0) // 2, fill=bg)
    draw.text((cx - tw // 2, cy - th // 2), text, font=fnt, fill=fg)

def draw_step_circle(draw, num, cx, cy, r, bg, fg, fnt):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=bg)
    txt = str(num)
    bbox = draw.textbbox((0, 0), txt, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 4), txt, font=fnt, fill=fg)

def top_brand_bar(draw, text="SHELZY'S DESIGNS"):
    fnt = font(MONTSERRAT_BOLD, 28)
    draw.rectangle((0, 0, W, 70), fill=HOT_PINK)
    center_text(draw, text, 18, fnt, WHITE)

def bottom_brand_bar(draw, text="shelzysdesigns.etsy.com"):
    fnt = font(MONTSERRAT_REG, 26)
    draw.rectangle((0, H - 70, W, H), fill=HOT_PINK)
    center_text(draw, text, H - 52, fnt, WHITE)

def draw_divider(draw, y, color=ORANGE, margin=600):
    draw.line((margin, y, W - margin, y), fill=color, width=4)


# =============================================
# IMAGE 01 - HERO
# =============================================
def make_image01():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top colored header block
    draw.rectangle((0, 0, W, 540), fill=BLUE)

    # Brand name
    fnt_brand = font(MONTSERRAT_BOLD, 30)
    center_text(draw, "SHELZY'S DESIGNS", 28, fnt_brand, WHITE)

    # Title (Berthold Block style)
    fnt_title = font(TITLE_FONT, 120)
    center_text(draw, "VILLA VIBES", 100, fnt_title, WHITE)

    # Subtitle
    fnt_sub = font(MONTSERRAT_BOLD, 68)
    center_text(draw, "Bachelorette Bundle", 250, fnt_sub, GOLD_TEXT)

    # Template count
    fnt_count = font(MONTSERRAT_SEMI, 48)
    center_text(draw, "23 Editable + Printable Templates", 370, fnt_count, TEAL)

    # Divider
    draw.line((600, 470, 1400, 470), fill=ORANGE, width=4)

    # Mockup grid (6 template previews)
    mock_font = font(MONTSERRAT_REG, 22)
    labels = ["Welcome Sign", "Itinerary", "Drink If...", "Who Knows\nthe Bride", "Packing List", "Photo Props"]
    cols, rows = 3, 2
    card_w, card_h = 420, 340
    gap_x, gap_y = 60, 50
    start_x = (W - (cols * card_w + (cols - 1) * gap_x)) // 2
    start_y = 580

    accent_colors = [HOT_PINK, ORANGE, BLUE, TEAL, HOT_PINK, ORANGE]

    for idx, label in enumerate(labels):
        col = idx % cols
        row = idx // cols
        cx = start_x + col * (card_w + gap_x)
        cy = start_y + row * (card_h + gap_y)

        # Card shadow
        draw.rounded_rectangle((cx + 6, cy + 6, cx + card_w + 6, cy + card_h + 6), radius=16, fill=SOFT_GRAY)
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=CARD_BG, outline=TEAL, width=2)

        # Accent bar at top of card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=0, fill=accent_colors[idx])

        # Simulated content lines
        line_y = cy + 40
        for i in range(5):
            lw = card_w - 70 if i == 0 else card_w - 100 - (i * 25)
            if lw < 40:
                lw = 40
            color = accent_colors[idx] if i == 0 else SOFT_GRAY
            draw.rounded_rectangle((cx + 35, line_y, cx + 35 + lw, line_y + 14), radius=7, fill=color)
            line_y += 30

        # Card label
        for li, line in enumerate(label.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=mock_font)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + card_h - 65 + li * 26), line, font=mock_font, fill=DARK_TEXT)

    # Badge row
    badge_y = 1420
    badge_font = font(MONTSERRAT_BOLD, 32)
    badges = [("Instant Download", HOT_PINK), ("Edit in Canva", ORANGE), ("Print or Share", BLUE)]
    total_badge_w = 0
    badge_widths = []
    for b, _ in badges:
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        bw = bbox[2] - bbox[0] + 80
        badge_widths.append(bw)
        total_badge_w += bw
    gap = 40
    total_badge_w += gap * (len(badges) - 1)
    bx = (W - total_badge_w) // 2
    for i, (b, color) in enumerate(badges):
        bw = badge_widths[i]
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + 72), radius=36, fill=color)
        bbox = draw.textbbox((0, 0), b, font=badge_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((bx + (bw - tw) // 2, badge_y + (72 - th) // 2 - 2), b, font=badge_font, fill=WHITE)
        bx += bw + gap

    # Bottom tagline
    fnt_tag = font(MONTSERRAT_MED, 32)
    center_text(draw, "Games  |  Signs  |  Planning  |  Extras", 1560, fnt_tag, DARK_TEXT)

    # Decorative border around mockups
    draw.rounded_rectangle((40, 545, W - 40, 1380), radius=24, fill=None, outline=TEAL, width=3)

    # Bottom brand bar
    bottom_brand_bar(draw)

    img.save(os.path.join(OUT, "VillaVibes_Image01_Hero.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [1/10] Hero done")


# =============================================
# IMAGE 02 - WHAT'S INCLUDED
# =============================================
def make_image02():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "WHAT'S INCLUDED", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "23 Templates in One Bundle", 220, fnt_sub, BLUE)

    draw_divider(draw, 285)

    categories = [
        ("8", "Party Games", HOT_PINK,
         ["Drink If...", "Who Knows the Bride", "Scavenger Hunt", "Would She Rather",
          "Groom Trivia", "Never Have I Ever", "Bridal Bingo", "Over or Under"]),
        ("7", "Signs & Decor", ORANGE,
         ["Welcome Sign", "Bar Menu Sign", "Photo Prop Frame", "Directional Sign",
          "Door Hanger", "Table Numbers", "Hashtag Sign"]),
        ("4", "Planning", BLUE,
         ["Weekend Itinerary", "Invitation", "Packing List", "House Rules"]),
        ("4", "Bonus Extras", TEAL,
         ["Name Tags", "Paddle Signs", "Story Templates", "Cocktail Recipe Cards"]),
    ]

    card_w, card_h = 820, 560
    gap = 60
    start_x = (W - 2 * card_w - gap) // 2
    start_y = 340

    for idx, (count, title, accent, items) in enumerate(categories):
        col = idx % 2
        row = idx // 2
        cx = start_x + col * (card_w + gap)
        cy = start_y + row * (card_h + gap)

        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        # Accent bar at top
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 6), radius=0, fill=accent)

        # Count circle
        circle_r = 48
        circle_cx = cx + 80
        circle_cy = cy + 75
        draw.ellipse((circle_cx - circle_r, circle_cy - circle_r, circle_cx + circle_r, circle_cy + circle_r), fill=accent)
        fnt_num = font(MONTSERRAT_BOLD, 52)
        bbox = draw.textbbox((0, 0), count, font=fnt_num)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((circle_cx - tw // 2, circle_cy - th // 2 - 4), count, font=fnt_num, fill=WHITE)

        fnt_cat = font(MONTSERRAT_BOLD, 44)
        draw.text((cx + 150, cy + 48), title, font=fnt_cat, fill=DARK_TEXT)

        fnt_item = font(MONTSERRAT_REG, 28)
        iy = cy + 140
        for item in items:
            # Colored bullet
            draw.ellipse((cx + 60, iy + 6, cx + 74, iy + 20), fill=accent)
            draw.text((cx + 90, iy), item, font=fnt_item, fill=DARK_TEXT)
            iy += 44

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image02_WhatsIncluded.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [2/10] What's Included done")


# =============================================
# IMAGE 03 - EDITABLE IN CANVA
# =============================================
def make_image03():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "FULLY EDITABLE IN CANVA", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 38)
    center_text(draw, "Free Canva Account Works!", 220, fnt_sub, BLUE)

    draw_divider(draw, 280)

    # Before / After panels
    panel_w = 780
    panel_h = 500
    left_x = 120
    right_x = W - 120 - panel_w
    panel_y = 330

    # BEFORE
    draw.rounded_rectangle((left_x, panel_y, left_x + panel_w, panel_y + panel_h), radius=20, fill=CARD_BG, outline=SOFT_GRAY, width=3)
    fnt_label = font(MONTSERRAT_BOLD, 36)
    lbl_bbox = draw.textbbox((0, 0), "BEFORE", font=fnt_label)
    lbl_w = lbl_bbox[2] - lbl_bbox[0]
    draw.text((left_x + (panel_w - lbl_w) // 2, panel_y + 20), "BEFORE", font=fnt_label, fill=DARK_TEXT)

    for i in range(7):
        lw = panel_w - 120 if i == 0 else panel_w - 160 - (i * 40)
        if lw < 80: lw = 80
        ly = panel_y + 85 + i * 48
        c = SOFT_GRAY
        draw.rounded_rectangle((left_x + 60, ly, left_x + 60 + lw, ly + 20), radius=10, fill=c)

    # Arrow
    arrow_cx = W // 2
    arrow_cy = panel_y + panel_h // 2
    draw.polygon([(arrow_cx - 30, arrow_cy - 30), (arrow_cx + 35, arrow_cy),
                  (arrow_cx - 30, arrow_cy + 30)], fill=ORANGE)

    # AFTER
    draw.rounded_rectangle((right_x, panel_y, right_x + panel_w, panel_y + panel_h), radius=20, fill=CARD_BG, outline=HOT_PINK, width=4)
    lbl_bbox = draw.textbbox((0, 0), "AFTER", font=fnt_label)
    lbl_w = lbl_bbox[2] - lbl_bbox[0]
    draw.text((right_x + (panel_w - lbl_w) // 2, panel_y + 20), "AFTER", font=fnt_label, fill=HOT_PINK)

    after_colors = [HOT_PINK, TEAL, ORANGE, BLUE, HOT_PINK, TEAL, ORANGE]
    for i in range(7):
        lw = panel_w - 120 if i == 0 else panel_w - 160 - (i * 40)
        if lw < 80: lw = 80
        ly = panel_y + 85 + i * 48
        draw.rounded_rectangle((right_x + 60, ly, right_x + 60 + lw, ly + 20), radius=10, fill=after_colors[i])

    # What you can edit section
    edit_y = 910
    fnt_edit_title = font(TITLE_FONT, 60)
    center_text(draw, "WHAT YOU CAN EDIT", edit_y, fnt_edit_title, DARK_TEXT)

    editable_items = [
        ("Text & Wording", "Change any text to match your party", HOT_PINK),
        ("Colors & Fonts", "Update to your wedding or party colors", ORANGE),
        ("Photos & Images", "Add your own photos and graphics", BLUE),
        ("Layout Elements", "Move, resize, or rearrange anything", TEAL),
    ]

    fnt_item_title = font(MONTSERRAT_BOLD, 34)
    fnt_item_desc = font(MONTSERRAT_REG, 30)
    iy = edit_y + 90

    for title, desc, color in editable_items:
        draw.ellipse((280, iy, 330, iy + 50), fill=color)
        # Checkmark
        fnt_check = font(MONTSERRAT_BOLD, 28)
        draw.text((295, iy + 8), "~", font=fnt_check, fill=WHITE)
        draw.text((360, iy), title, font=fnt_item_title, fill=DARK_TEXT)
        draw.text((360, iy + 44), desc, font=fnt_item_desc, fill=(100, 100, 105))
        iy += 120

    badge_y = 1560
    fnt_badge = font(MONTSERRAT_BOLD, 36)
    draw_pill_badge(draw, "Works with Free Canva", W // 2, badge_y, fnt_badge, BLUE, WHITE)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image03_EditableCanva.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [3/10] Editable in Canva done")


# =============================================
# IMAGE 04 - HOW IT WORKS
# =============================================
def make_image04():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "HOW IT WORKS", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 38)
    center_text(draw, "5 Simple Steps to Your Perfect Party", 220, fnt_sub, BLUE)

    draw_divider(draw, 280)

    steps = [
        ("Purchase on Etsy", "Add to cart and check out instantly", HOT_PINK),
        ("Download Access PDF", "Get your download link via Etsy email", ORANGE),
        ("Open in Canva", "Click the link to open all templates", BLUE),
        ("Edit Your Templates", "Customize text, colors, and photos", TEAL),
        ("Download & Print", "Save as PDF/PNG and print or share", HOT_PINK),
    ]

    fnt_step_num = font(MONTSERRAT_BOLD, 52)
    fnt_step_title = font(MONTSERRAT_BOLD, 44)
    fnt_step_desc = font(MONTSERRAT_REG, 32)

    start_y = 350
    step_h = 220
    circle_r = 50

    for i, (title, desc, color) in enumerate(steps):
        cy = start_y + i * step_h

        # Connecting line
        if i < len(steps) - 1:
            draw.line((200, cy + circle_r + 10, 200, cy + step_h - 10), fill=SOFT_GRAY, width=4)

        draw_step_circle(draw, i + 1, 200, cy, circle_r, color, WHITE, fnt_step_num)

        card_x = 310
        card_w = W - card_x - 120
        draw.rounded_rectangle((card_x, cy - 45, card_x + card_w, cy + 95), radius=16, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        # Left accent bar
        draw.rounded_rectangle((card_x, cy - 45, card_x + 6, cy + 95), radius=0, fill=color)
        draw.text((card_x + 30, cy - 35), title, font=fnt_step_title, fill=DARK_TEXT)
        draw.text((card_x + 30, cy + 25), desc, font=fnt_step_desc, fill=(100, 100, 105))

    cta_y = 1510
    fnt_cta = font(MONTSERRAT_BOLD, 38)
    draw_pill_badge(draw, "Start Customizing in Minutes!", W // 2, cta_y, fnt_cta, ORANGE, WHITE, hpad=60, vpad=24)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image04_HowItWorks.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [4/10] How It Works done")


# =============================================
# IMAGE 05 - GAMES PREVIEW
# =============================================
def make_image05():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "PARTY GAMES", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "8 Fun, Ready-to-Play Games", 220, fnt_sub, HOT_PINK)

    draw_divider(draw, 285)

    games = [
        "Drink If...", "Who Knows\nthe Bride", "Scavenger\nHunt", "Would She\nRather",
        "Groom\nTrivia", "Never Have\nI Ever", "Bridal\nBingo", "Over or\nUnder"
    ]

    card_w, card_h = 380, 340
    gap = 50
    cols = 4
    start_x = (W - cols * card_w - (cols - 1) * gap) // 2
    start_y = 340

    fnt_game = font(MONTSERRAT_BOLD, 32)
    fnt_game_num = font(MONTSERRAT_BOLD, 26)
    accent_cycle = [HOT_PINK, ORANGE, BLUE, TEAL]

    for idx, game in enumerate(games):
        col = idx % cols
        row = idx // cols
        cx = start_x + col * (card_w + gap)
        cy = start_y + row * (card_h + gap)
        accent = accent_cycle[idx % 4]

        # Shadow
        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=16, fill=SOFT_GRAY)
        # Card
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        # Top accent bar
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=0, fill=accent)

        # Number badge
        draw.ellipse((cx + 15, cy + 18, cx + 55, cy + 58), fill=accent)
        num_text = str(idx + 1)
        bbox = draw.textbbox((0, 0), num_text, font=fnt_game_num)
        ntw = bbox[2] - bbox[0]
        draw.text((cx + 35 - ntw // 2, cy + 24), num_text, font=fnt_game_num, fill=WHITE)

        # Content lines
        for li in range(4):
            lw = card_w - 60 if li == 0 else card_w - 80 - li * 20
            if lw < 40: lw = 40
            ly = cy + 80 + li * 30
            draw.rounded_rectangle((cx + 30, ly, cx + 30 + lw, ly + 12), radius=6, fill=SOFT_GRAY)

        # Game name
        lines = game.split("\n")
        for li, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=fnt_game)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + card_h - 80 + li * 38), line, font=fnt_game, fill=DARK_TEXT)

    callout_y = 1130
    fnt_callout = font(MONTSERRAT_MED, 34)
    center_text(draw, "Fun, easy-to-run, bachelorette-ready game set", callout_y, fnt_callout, DARK_TEXT)

    badge_y = 1260
    badge_font_b = font(MONTSERRAT_BOLD, 30)
    badges = [("Editable Text", HOT_PINK), ("Print at Home", ORANGE), ("Instant Fun", BLUE)]
    total_w = 0
    bws = []
    for b, _ in badges:
        bbox = draw.textbbox((0, 0), b, font=badge_font_b)
        bw = bbox[2] - bbox[0] + 60
        bws.append(bw)
        total_w += bw
    total_w += 30 * (len(badges) - 1)
    bx = (W - total_w) // 2
    for i, (b, color) in enumerate(badges):
        bw = bws[i]
        draw.rounded_rectangle((bx, badge_y, bx + bw, badge_y + 60), radius=30, fill=color)
        bbox = draw.textbbox((0, 0), b, font=badge_font_b)
        tw = bbox[2] - bbox[0]
        draw.text((bx + (bw - tw) // 2, badge_y + 12), b, font=badge_font_b, fill=WHITE)
        bx += bw + 30

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image05_GamesPreview.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [5/10] Games Preview done")


# =============================================
# IMAGE 06 - SIGNS & DECOR
# =============================================
def make_image06():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "SIGNS & DECOR", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "7 Print-Ready Party Signs", 220, fnt_sub, ORANGE)

    draw_divider(draw, 285)

    signs = [
        ("Welcome Sign", "Greet your guests\nin style"),
        ("Bar Menu", "Custom cocktail\nmenu sign"),
        ("Photo Prop Frame", "Fun selfie\nframe cutout"),
        ("Directional Sign", "Guide guests\naround the venue"),
        ("Door Hanger", "Do Not Disturb\n& party modes"),
        ("Table Numbers", "Matching table\nnumber cards"),
        ("Hashtag Sign", "Custom hashtag\nfor photos"),
    ]

    card_w, card_h = 380, 380
    gap = 40
    fnt_sign = font(MONTSERRAT_BOLD, 30)
    fnt_desc = font(MONTSERRAT_REG, 23)
    accent_cycle = [ORANGE, HOT_PINK, BLUE, TEAL]

    # Row 1: 4 cards
    row1_x = (W - 4 * card_w - 3 * gap) // 2
    row1_y = 340
    # Row 2: 3 cards centered
    row2_x = (W - 3 * card_w - 2 * gap) // 2
    row2_y = 340 + card_h + gap

    for idx, (name, desc) in enumerate(signs):
        accent = accent_cycle[idx % 4]
        if idx < 4:
            cx = row1_x + idx * (card_w + gap)
            cy = row1_y
        else:
            cx = row2_x + (idx - 4) * (card_w + gap)
            cy = row2_y

        draw.rounded_rectangle((cx + 4, cy + 4, cx + card_w + 4, cy + card_h + 4), radius=16, fill=SOFT_GRAY)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=16, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=0, fill=accent)

        # Icon area
        icon_cx = cx + card_w // 2
        icon_cy = cy + 100
        draw.rounded_rectangle((icon_cx - 80, icon_cy - 55, icon_cx + 80, icon_cy + 55), radius=10, fill=WHITE, outline=accent, width=3)
        for li in range(3):
            lw = 100 - li * 20
            draw.rounded_rectangle((icon_cx - lw // 2, icon_cy - 28 + li * 26, icon_cx + lw // 2, icon_cy - 20 + li * 26), radius=4, fill=accent)

        bbox = draw.textbbox((0, 0), name, font=fnt_sign)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 190), name, font=fnt_sign, fill=DARK_TEXT)

        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 240 + li * 30), line, font=fnt_desc, fill=(100, 100, 105))

    callout_y = 1260
    fnt_callout = font(MONTSERRAT_MED, 34)
    center_text(draw, "Print-ready party signage for every corner of the venue", callout_y, fnt_callout, DARK_TEXT)

    badge_y = 1380
    fnt_badge = font(MONTSERRAT_BOLD, 34)
    draw_pill_badge(draw, "Customize Colors & Text", W // 2, badge_y, fnt_badge, ORANGE, WHITE)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image06_SignsAndDecor.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [6/10] Signs & Decor done")


# =============================================
# IMAGE 07 - PLANNING TEMPLATES
# =============================================
def make_image07():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "PLANNING TEMPLATES", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "Plan the Weekend in Minutes", 220, fnt_sub, BLUE)

    draw_divider(draw, 285)

    templates = [
        ("Weekend Itinerary", "Full schedule layout\nwith times & activities", BLUE),
        ("Invitation", "Send to your girls\nwith all the details", HOT_PINK),
        ("Packing List", "Everything they need\nto bring, checked off", ORANGE),
        ("House Rules", "Set the vibe with\nfun villa rules", TEAL),
    ]

    card_w = 400
    card_h = 650
    gap = 50
    start_x = (W - 4 * card_w - 3 * gap) // 2
    start_y = 340

    fnt_name = font(MONTSERRAT_BOLD, 36)
    fnt_desc = font(MONTSERRAT_REG, 26)

    for idx, (name, desc, accent) in enumerate(templates):
        cx = start_x + idx * (card_w + gap)
        cy = start_y

        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=20, fill=SOFT_GRAY)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=0, fill=accent)

        # Preview area
        pm = 30
        ph = 340
        draw.rounded_rectangle((cx + pm, cy + pm + 10, cx + card_w - pm, cy + pm + 10 + ph), radius=12, fill=LIGHT_BG, outline=accent, width=2)

        for li in range(8):
            lw = card_w - 100 if li == 0 else card_w - 120 - li * 15
            if lw < 60: lw = 60
            ly = cy + pm + 40 + li * 36
            c = accent if li == 0 else SOFT_GRAY
            draw.rounded_rectangle((cx + 50, ly, cx + 50 + lw, ly + 14), radius=7, fill=c)

        bbox = draw.textbbox((0, 0), name, font=fnt_name)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 420), name, font=fnt_name, fill=DARK_TEXT)

        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 475 + li * 34), line, font=fnt_desc, fill=(100, 100, 105))

    callout_y = 1100
    fnt_callout = font(MONTSERRAT_MED, 34)
    center_text(draw, "Organize every detail for a stress-free celebration", callout_y, fnt_callout, DARK_TEXT)

    badge_y = 1220
    fnt_badge = font(MONTSERRAT_BOLD, 34)
    draw_pill_badge(draw, "Edit & Print in Minutes", W // 2, badge_y, fnt_badge, BLUE, WHITE)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image07_PlanningTemplates.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [7/10] Planning Templates done")


# =============================================
# IMAGE 08 - EXTRAS & BONUS
# =============================================
def make_image08():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "BONUS EXTRAS", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "4 Matching Extras Included", 220, fnt_sub, TEAL)

    draw_divider(draw, 285)

    extras = [
        ("Name Tags", "Personalized name tags\nfor each guest", TEAL),
        ("Paddle Signs", "Yes/No, Team Bride\nphoto prop paddles", HOT_PINK),
        ("Story Templates", "Instagram story\ntemplates to share", ORANGE),
        ("Cocktail Cards", "Signature drink\nrecipe cards", BLUE),
    ]

    card_w = 400
    card_h = 650
    gap = 50
    start_x = (W - 4 * card_w - 3 * gap) // 2
    start_y = 340

    fnt_name = font(MONTSERRAT_BOLD, 36)
    fnt_desc = font(MONTSERRAT_REG, 26)
    fnt_bonus = font(MONTSERRAT_BOLD, 20)

    for idx, (name, desc, accent) in enumerate(extras):
        cx = start_x + idx * (card_w + gap)
        cy = start_y

        draw.rounded_rectangle((cx + 5, cy + 5, cx + card_w + 5, cy + card_h + 5), radius=20, fill=SOFT_GRAY)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=20, fill=CARD_BG, outline=SOFT_GRAY, width=2)
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=0, fill=accent)

        # BONUS badge
        bbox = draw.textbbox((0, 0), "BONUS", font=fnt_bonus)
        bw = bbox[2] - bbox[0] + 24
        bh = bbox[3] - bbox[1] + 12
        draw.rounded_rectangle((cx + card_w - bw - 15, cy + 16, cx + card_w - 15, cy + 16 + bh), radius=bh // 2, fill=accent)
        draw.text((cx + card_w - bw - 3, cy + 19), "BONUS", font=fnt_bonus, fill=WHITE)

        # Preview
        pm = 30
        ph = 300
        draw.rounded_rectangle((cx + pm, cy + 50, cx + card_w - pm, cy + 50 + ph), radius=12, fill=LIGHT_BG, outline=accent, width=2)

        for li in range(6):
            lw = card_w - 100 if li == 0 else card_w - 130 - li * 20
            if lw < 40: lw = 40
            ly = cy + 80 + li * 40
            c = accent if li == 0 else SOFT_GRAY
            draw.rounded_rectangle((cx + 50, ly, cx + 50 + lw, ly + 16), radius=8, fill=c)

        bbox = draw.textbbox((0, 0), name, font=fnt_name)
        tw = bbox[2] - bbox[0]
        draw.text((cx + (card_w - tw) // 2, cy + 400), name, font=fnt_name, fill=DARK_TEXT)

        for li, line in enumerate(desc.split("\n")):
            bbox = draw.textbbox((0, 0), line, font=fnt_desc)
            tw = bbox[2] - bbox[0]
            draw.text((cx + (card_w - tw) // 2, cy + 455 + li * 34), line, font=fnt_desc, fill=(100, 100, 105))

    callout_y = 1100
    fnt_callout = font(MONTSERRAT_MED, 34)
    center_text(draw, "Bonus matching extras to complete your party look", callout_y, fnt_callout, DARK_TEXT)

    badge_y = 1220
    fnt_badge = font(MONTSERRAT_BOLD, 34)
    draw_pill_badge(draw, "All Included in Your Bundle", W // 2, badge_y, fnt_badge, TEAL, WHITE)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image08_ExtrasAndBonus.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [8/10] Extras & Bonus done")


# =============================================
# IMAGE 09 - PRINT + DIGITAL USE
# =============================================
def make_image09():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 90)
    center_text(draw, "PRINT & DIGITAL USE", 110, fnt_title, DARK_TEXT)

    fnt_sub = font(MONTSERRAT_BOLD, 42)
    center_text(draw, "Flexible for Every Party Setup", 220, fnt_sub, BLUE)

    draw_divider(draw, 285)

    # Two columns
    col_w = 780
    col_h = 650
    left_x = 120
    right_x = W - 120 - col_w
    col_y = 330

    # PRINT column
    draw.rounded_rectangle((left_x, col_y, left_x + col_w, col_y + col_h), radius=24, fill=CARD_BG, outline=BLUE, width=3)
    draw.rounded_rectangle((left_x, col_y, left_x + col_w, col_y + 8), radius=0, fill=BLUE)
    fnt_col_title = font(TITLE_FONT, 50)
    lbl_bbox = draw.textbbox((0, 0), "PRINT AT HOME", font=fnt_col_title)
    lbl_w = lbl_bbox[2] - lbl_bbox[0]
    draw.text((left_x + (col_w - lbl_w) // 2, col_y + 30), "PRINT AT HOME", font=fnt_col_title, fill=BLUE)

    print_items = [
        "US Letter (8.5 x 11 in) compatible",
        "Standard home printer friendly",
        "Also great at print shops",
        "High-quality PDF downloads",
        "Cardstock recommended for signs",
        "Trim guides included",
    ]
    fnt_item = font(MONTSERRAT_REG, 28)
    iy = col_y + 110
    for item in print_items:
        draw.ellipse((left_x + 40, iy + 6, left_x + 54, iy + 20), fill=BLUE)
        draw.text((left_x + 70, iy), item, font=fnt_item, fill=DARK_TEXT)
        iy += 52

    # DIGITAL column
    draw.rounded_rectangle((right_x, col_y, right_x + col_w, col_y + col_h), radius=24, fill=CARD_BG, outline=HOT_PINK, width=3)
    draw.rounded_rectangle((right_x, col_y, right_x + col_w, col_y + 8), radius=0, fill=HOT_PINK)
    lbl_bbox = draw.textbbox((0, 0), "SHARE DIGITALLY", font=fnt_col_title)
    lbl_w = lbl_bbox[2] - lbl_bbox[0]
    draw.text((right_x + (col_w - lbl_w) // 2, col_y + 30), "SHARE DIGITALLY", font=fnt_col_title, fill=HOT_PINK)

    digital_items = [
        "Download as JPG or PNG from Canva",
        "Text or email to guests",
        "Share in group chats",
        "Post to Instagram Stories",
        "Use as phone wallpapers",
        "Perfect for remote bachelorettes",
    ]
    iy = col_y + 110
    for item in digital_items:
        draw.ellipse((right_x + 40, iy + 6, right_x + 54, iy + 20), fill=HOT_PINK)
        draw.text((right_x + 70, iy), item, font=fnt_item, fill=DARK_TEXT)
        iy += 52

    # Specs
    specs_y = 1080
    fnt_specs = font(TITLE_FONT, 50)
    center_text(draw, "FILE SPECIFICATIONS", specs_y, fnt_specs, DARK_TEXT)

    specs = [
        "Format: Canva-editable PDF templates",
        "Print Size: US Letter (8.5 x 11 inches)",
        "Resolution: High-quality 300 DPI output",
        "Color: Full color, sRGB optimized",
    ]
    fnt_spec = font(MONTSERRAT_REG, 30)
    sy = specs_y + 65
    for spec in specs:
        center_text(draw, spec, sy, fnt_spec, DARK_TEXT)
        sy += 48

    badge_y = 1420
    fnt_badge = font(MONTSERRAT_BOLD, 34)
    draw_pill_badge(draw, "Print or Share — Your Choice!", W // 2, badge_y, fnt_badge, ORANGE, WHITE)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image09_PrintAndDigitalUse.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [9/10] Print & Digital Use done")


# =============================================
# IMAGE 10 - FAQ + IMPORTANT NOTES
# =============================================
def make_image10():
    img = Image.new("RGB", (W, H), LIGHT_BG)
    draw = ImageDraw.Draw(img)
    top_brand_bar(draw)

    fnt_title = font(TITLE_FONT, 80)
    center_text(draw, "FAQ & IMPORTANT NOTES", 100, fnt_title, DARK_TEXT)

    draw_divider(draw, 195)

    faqs = [
        ("Is this a physical product?",
         "No. This is a digital download only. No physical item will be shipped.\nYou'll receive instant access to download your files after purchase."),
        ("How do I access my templates?",
         "After purchase, download the Access PDF from your Etsy purchases.\nIt contains your unique Canva link to open and edit all 23 templates."),
        ("Do I need a paid Canva account?",
         "No! A free Canva account is all you need.\nSign up at canva.com if you don't have one."),
        ("Can I edit the text and colors?",
         "Yes! Every template is fully customizable. Change text, fonts,\ncolors, photos, and layout elements to match your party theme."),
        ("What size do the templates print?",
         "All templates are designed for US Letter size\n(8.5 x 11 inches) for easy home or shop printing."),
        ("Is this for personal use only?",
         "Yes. This bundle is licensed for personal use only.\nCommercial use, resale, or redistribution is not permitted."),
        ("Need help? Have questions?",
         "Message us through Etsy! We're happy to help\nand typically respond within 24 hours."),
    ]

    fnt_q = font(MONTSERRAT_BOLD, 32)
    fnt_a = font(MONTSERRAT_REG, 26)
    accent_cycle = [HOT_PINK, ORANGE, BLUE, TEAL]

    y = 240
    for qi, (q, a) in enumerate(faqs):
        accent = accent_cycle[qi % 4]
        # Thin divider line
        draw.line((120, y, W - 120, y), fill=SOFT_GRAY, width=2)
        y += 16

        # Colored Q indicator
        draw.ellipse((130, y + 2, 154, y + 26), fill=accent)
        fnt_qlabel = font(MONTSERRAT_BOLD, 16)
        draw.text((136, y + 4), "Q", font=fnt_qlabel, fill=WHITE)

        draw.text((170, y - 2), q, font=fnt_q, fill=DARK_TEXT)
        y += 42

        for line in a.split("\n"):
            draw.text((170, y), line, font=fnt_a, fill=(100, 100, 105))
            y += 34
        y += 16

    # Important note box
    note_y = y + 8
    draw.rounded_rectangle((120, note_y, W - 120, note_y + 110), radius=16, fill=WHITE, outline=HOT_PINK, width=3)
    fnt_note = font(MONTSERRAT_BOLD, 28)
    center_text(draw, "DIGITAL PRODUCT  |  INSTANT DOWNLOAD  |  NO PHYSICAL ITEM", note_y + 20, fnt_note, HOT_PINK)
    fnt_note2 = font(MONTSERRAT_REG, 26)
    center_text(draw, "Personal use only. Not for resale or redistribution.", note_y + 62, fnt_note2, DARK_TEXT)

    bottom_brand_bar(draw)
    img.save(os.path.join(OUT, "VillaVibes_Image10_FAQ_ImportantNotes.jpg"), "JPEG", quality=95, subsampling=0)
    print("  [10/10] FAQ & Important Notes done")


if __name__ == "__main__":
    print("Generating Villa Vibes listing images (tropical palette)...")
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
    print("\nAll 10 images regenerated with Villa Vibes palette!")
