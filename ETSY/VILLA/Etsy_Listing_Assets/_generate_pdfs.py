#!/usr/bin/env python3
"""
Generate 5 buyer-facing PDFs for the Villa Vibes Bachelorette Bundle Etsy listing.
Uses VILLA VIBES color palette. All PDFs are US Letter size.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode

OUT = "/home/user/ShelzysDesigns/ETSY/VILLA/Etsy_Listing_Assets"
PAGE_W, PAGE_H = letter  # 612 x 792 points

# === VILLA VIBES PALETTE ===
HOT_PINK   = HexColor("#fb5887")
ORANGE     = HexColor("#fe8c43")
BLUE       = HexColor("#3ca4d7")
TEAL       = HexColor("#8adbde")
DARK_TEXT   = HexColor("#2d2d32")
LIGHT_BG    = HexColor("#fefcfa")
CARD_BG     = HexColor("#ffffff")
GOLD_TEXT   = HexColor("#d1b464")
SOFT_GRAY   = HexColor("#ebebee")

# Register Montserrat fonts
pdfmetrics.registerFont(TTFont('Montserrat', '/usr/share/fonts/truetype/montserrat/Montserrat-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-Bold', '/usr/share/fonts/truetype/montserrat/Montserrat-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-Semi', '/usr/share/fonts/truetype/montserrat/Montserrat-SemiBold.ttf'))
pdfmetrics.registerFont(TTFont('Montserrat-Med', '/usr/share/fonts/truetype/montserrat/Montserrat-Medium.ttf'))

SANS = "Montserrat-Bold"
SANS_SEMI = "Montserrat-Semi"
SANS_MED = "Montserrat-Med"
SANS_REG = "Montserrat"

CANVA_LINK_PLACEHOLDER = "https://www.canva.com/design/YOUR-TEMPLATE-LINK-HERE"


def draw_header(c, title):
    c.setFillColor(HOT_PINK)
    c.rect(0, PAGE_H - 80, PAGE_W, 80, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont(SANS, 11)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 30, "SHELZY'S DESIGNS")
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 58, title)


def draw_footer(c, text="shelzysdesigns.etsy.com"):
    c.setFillColor(HOT_PINK)
    c.rect(0, 0, PAGE_W, 40, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, 15, text)


def draw_divider(c, y, color=ORANGE, margin=72):
    c.setStrokeColor(color)
    c.setLineWidth(2)
    c.line(margin + 100, y, PAGE_W - margin - 100, y)


def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=1):
    c.saveState()
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
    if fill_color:
        c.setFillColor(fill_color)
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    if fill_color and stroke_color:
        c.drawPath(p, fill=1, stroke=1)
    elif fill_color:
        c.drawPath(p, fill=1, stroke=0)
    elif stroke_color:
        c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def word_wrap(c, text, font_name, font_size, max_width):
    lines = []
    current = ""
    for word in text.split():
        test = current + " " + word if current else word
        if c.stringWidth(test, font_name, font_size) < max_width:
            current = test
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def generate_qr_code(url):
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#fb5887", back_color="#fefefe")
    path = os.path.join(OUT, "_temp_qr.png")
    img.save(path)
    return path


# =============================================
# PDF 1: ACCESS PDF
# =============================================
def make_access_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Bundle-Access.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    # --- PAGE 1: Welcome & Access Link ---
    draw_header(c, "Villa Vibes Bachelorette Bundle")
    draw_footer(c)

    y = PAGE_H - 125
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 32)
    c.drawCentredString(PAGE_W / 2, y, "Welcome!")
    y -= 28
    c.setFont(SANS_REG, 13)
    c.drawCentredString(PAGE_W / 2, y, "Thank you for purchasing the Villa Vibes Bachelorette Bundle")

    y -= 18
    draw_divider(c, y)

    # Access link box
    y -= 50
    box_h = 100
    draw_rounded_rect(c, 50, y - box_h + 40, PAGE_W - 100, box_h, 12, fill_color=HexColor("#fff5f8"), stroke_color=HOT_PINK, stroke_width=2)

    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 13)
    c.drawCentredString(PAGE_W / 2, y + 12, "YOUR CANVA TEMPLATE LINK")
    c.setFillColor(BLUE)
    c.setFont(SANS_REG, 10)
    c.drawCentredString(PAGE_W / 2, y - 8, "Click the link below to open all 23 templates:")
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, y - 32, CANVA_LINK_PLACEHOLDER)
    link_w = c.stringWidth(CANVA_LINK_PLACEHOLDER, SANS_REG, 9)
    c.linkURL(CANVA_LINK_PLACEHOLDER, ((PAGE_W - link_w) / 2, y - 38, (PAGE_W + link_w) / 2, y - 25))

    # QR Code - positioned clearly below box
    y -= 90
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 10)
    c.drawCentredString(PAGE_W / 2, y, "Or scan this QR code:")

    qr_path = generate_qr_code(CANVA_LINK_PLACEHOLDER)
    qr_size = 100
    y -= qr_size + 10
    c.drawImage(qr_path, (PAGE_W - qr_size) / 2, y, qr_size, qr_size)

    # Quick steps - below QR with clear spacing
    y -= 30
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 12)
    c.drawCentredString(PAGE_W / 2, y, "Quick Start:")
    y -= 22

    steps = [
        "1.  Click the Canva link above (or scan QR code)",
        "2.  Log in to your free Canva account",
        '3.  Click "Use Template" to copy to your account',
        "4.  Edit text, colors, fonts, and photos",
        "5.  Download as PDF or PNG and print/share!",
    ]
    c.setFont(SANS_REG, 10)
    c.setFillColor(DARK_TEXT)
    for step in steps:
        c.drawString(140, y, step)
        y -= 20

    # Bottom note
    y -= 15
    draw_rounded_rect(c, 50, y - 5, PAGE_W - 100, 30, 8, fill_color=HexColor("#e8f7f8"), stroke_color=TEAL)
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 8)
    c.drawCentredString(PAGE_W / 2, y + 5, "A free Canva account is all you need!  Sign up at canva.com if you don't have one.")

    # --- PAGE 2: What's Included Checklist ---
    c.showPage()
    draw_header(c, "What's Included - 23 Templates")
    draw_footer(c)

    y = PAGE_H - 115
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 22)
    c.drawCentredString(PAGE_W / 2, y, "Complete Template Checklist")
    y -= 12
    draw_divider(c, y)
    y -= 25

    categories = [
        ("PARTY GAMES (8)", HOT_PINK, [
            "Drink If...", "Who Knows the Bride Best", "Scavenger Hunt",
            "Would She Rather", "Groom Trivia", "Never Have I Ever",
            "Bridal Bingo", "Over or Under"]),
        ("SIGNS & DECOR (7)", ORANGE, [
            "Welcome Sign", "Bar Menu Sign", "Photo Prop Frame",
            "Directional Sign", "Door Hanger", "Table Numbers", "Hashtag Sign"]),
        ("PLANNING TEMPLATES (4)", BLUE, [
            "Weekend Itinerary", "Invitation", "Packing List", "House Rules"]),
        ("BONUS EXTRAS (4)", TEAL, [
            "Name Tags", "Paddle Signs", "Instagram Story Templates",
            "Cocktail Recipe Cards"]),
    ]

    left_x = 65
    right_x = PAGE_W / 2 + 15

    for ci, (cat_name, accent, items) in enumerate(categories):
        col_x = left_x if ci % 2 == 0 else right_x
        if ci == 2:
            y -= 15

        cat_y = y if ci % 2 == 0 else saved_y

        draw_rounded_rect(c, col_x - 5, cat_y - 5, 240, 22, 6, fill_color=accent)
        c.setFillColor(white)
        c.setFont(SANS, 10)
        c.drawString(col_x + 3, cat_y, cat_name)

        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9.5)
        iy = cat_y - 25
        for item in items:
            c.setStrokeColor(accent)
            c.setLineWidth(1.5)
            c.rect(col_x, iy - 1, 10, 10, fill=0, stroke=1)
            c.drawString(col_x + 16, iy, item)
            iy -= 18

        if ci % 2 == 0:
            saved_y = cat_y
        else:
            y = min(iy, y - len(categories[ci-1][2]) * 18 - 25) - 10

    # Bottom banner
    y -= 25
    draw_rounded_rect(c, 50, y - 5, PAGE_W - 100, 42, 8, fill_color=HexColor("#fff5f8"), stroke_color=HOT_PINK)
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 10)
    c.drawCentredString(PAGE_W / 2, y + 18, "23 TEMPLATES  |  1 CANVA LINK  |  UNLIMITED EDITS")
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 8)
    c.drawCentredString(PAGE_W / 2, y + 3, "All templates are accessible from the single Canva link on page 1")

    # --- PAGE 3: Step-by-Step ---
    c.showPage()
    draw_header(c, "Step-by-Step Instructions")
    draw_footer(c)

    y = PAGE_H - 115
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 22)
    c.drawCentredString(PAGE_W / 2, y, "How to Use Your Templates")
    y -= 12
    draw_divider(c, y)
    y -= 30

    detailed_steps = [
        ("Step 1: Open Your Canva Link", "Go to page 1 of this PDF and click the Canva template link (or scan the QR code). This will open all 23 templates in your browser.", BLUE),
        ("Step 2: Log In to Canva", "If you don't have a Canva account, sign up for free at canva.com. A free account is all you need.", ORANGE),
        ("Step 3: Make a Copy", 'Click "Use Template" to save the templates to your own Canva account. This creates your personal editable version.', HOT_PINK),
        ("Step 4: Edit Your Templates", "Click on any text to change wording. Update colors, swap photos, change fonts. Make it completely yours!", TEAL),
        ("Step 5: Download Your Files", 'Click "Share" then "Download." Choose PDF for printing or PNG/JPG for sharing digitally.', BLUE),
        ("Step 6: Print or Share", "Print at home on US Letter paper (8.5 x 11 in) or take to a print shop. For digital sharing, text or email the files.", ORANGE),
    ]

    for title, desc, accent in detailed_steps:
        c.setFillColor(accent)
        c.setFont(SANS, 12)
        c.drawString(72, y, title)
        y -= 18
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9.5)
        for line in word_wrap(c, desc, SANS_REG, 9.5, PAGE_W - 180):
            c.drawString(90, y, line)
            y -= 14
        y -= 18

    # --- PAGE 4: Printing Tips ---
    c.showPage()
    draw_header(c, "Printing Tips & Specifications")
    draw_footer(c)

    y = PAGE_H - 115
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 22)
    c.drawCentredString(PAGE_W / 2, y, "Printing Guide")
    y -= 12
    draw_divider(c, y)
    y -= 25

    sections = [
        ("Paper Size", BLUE, ["All templates: US Letter (8.5 x 11 inches)", "Standard paper size for home printers in the US"]),
        ("Recommended Paper", ORANGE, ["Signs & Decor: White cardstock (65-110 lb)", "Game Cards: Standard printer paper or light cardstock", "Invitations: Premium cardstock or photo paper", "Name Tags: Light cardstock, then cut to size"]),
        ("Printer Settings", HOT_PINK, ['Paper size: "Letter" or "8.5 x 11"', 'Scaling: "Actual Size" (NOT "Fit to Page")', "Quality: Best or High Quality", "Color: Full Color", "Orientation: Portrait (vertical)"]),
        ("Print Shop Tips", TEAL, ["FedEx Office, Staples, Office Depot all accept PDFs", "Upload downloaded PDFs to their online print portal", "Request cardstock for signs, standard for games", "Ask for color printing, single-sided"]),
        ("Cutting & Trimming", BLUE, ["Most templates print full-bleed on letter paper", "Use a paper trimmer or scissors for clean edges", "A ruler and craft knife give the best results"]),
    ]

    for sec_title, accent, items in sections:
        c.setFillColor(accent)
        c.setFont(SANS, 12)
        c.drawString(72, y, sec_title)
        c.setStrokeColor(accent)
        c.setLineWidth(1)
        tw = c.stringWidth(sec_title, SANS, 12)
        c.line(72, y - 3, 72 + tw, y - 3)
        y -= 18
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9.5)
        for item in items:
            c.drawString(90, y, item)
            y -= 16
        y -= 12

    # Pro tip box
    y -= 5
    draw_rounded_rect(c, 50, y - 5, PAGE_W - 100, 42, 10, fill_color=HexColor("#fff5f8"), stroke_color=HOT_PINK)
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 9)
    c.drawCentredString(PAGE_W / 2, y + 18, "PRO TIP: Always do a test print of one page first!")
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 8)
    c.drawCentredString(PAGE_W / 2, y + 4, "Check colors, alignment, and sizing before printing the full set.")

    # --- PAGE 5: Support & Contact ---
    c.showPage()
    draw_header(c, "Support & Contact")
    draw_footer(c)

    y = PAGE_H - 115
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 22)
    c.drawCentredString(PAGE_W / 2, y, "Need Help? We're Here!")
    y -= 12
    draw_divider(c, y)
    y -= 25

    faqs = [
        ("I can't find my download", "Go to Etsy.com > Your Account > Purchases and Reviews. Click 'Download Files' next to this order.", HOT_PINK),
        ("The Canva link isn't working", "Make sure you're logged into Canva. Try Chrome browser. If it persists, message us on Etsy.", ORANGE),
        ("I don't have a Canva account", "Go to canva.com and sign up for free! The free version has everything you need.", BLUE),
        ("Can I change the colors/fonts/text?", "Yes! Everything is fully editable. Click any element in Canva to customize it.", TEAL),
        ("What if prints look different?", "Colors vary between screens and printers. Do a test print first. Use 'Best Quality' setting.", HOT_PINK),
    ]

    for q, a, accent in faqs:
        c.setFillColor(accent)
        c.setFont(SANS, 10)
        c.drawString(72, y, "Q:  " + q)
        y -= 16
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9)
        for line in word_wrap(c, a, SANS_REG, 9, PAGE_W - 180):
            c.drawString(90, y, line)
            y -= 14
        y -= 14

    # Contact box - with enough space
    y -= 10
    draw_rounded_rect(c, 50, y - 15, PAGE_W - 100, 60, 10, fill_color=HexColor("#e8f7f8"), stroke_color=TEAL, stroke_width=2)
    c.setFillColor(BLUE)
    c.setFont(SANS, 11)
    c.drawCentredString(PAGE_W / 2, y + 22, "Message us anytime through Etsy!")
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, y + 6, "We typically respond within 24 hours.")
    c.drawCentredString(PAGE_W / 2, y - 8, "We want your bachelorette weekend to be perfect!")

    c.save()
    print("  [1/5] Access PDF done")


# =============================================
# PDF 2: QUICK START GUIDE
# =============================================
def make_quickstart_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Quick-Start-Guide.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Quick Start Guide")
    draw_footer(c)

    y = PAGE_H - 120
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 26)
    c.drawCentredString(PAGE_W / 2, y, "Get Started in 5 Minutes")
    y -= 12
    draw_divider(c, y)
    y -= 40

    steps = [
        ("1", "OPEN YOUR CANVA LINK", "Find the Access PDF in your Etsy downloads. Click the Canva template link on page 1. This opens all 23 templates in one place.", "Tip: Bookmark the link so you can come back anytime!", BLUE),
        ("2", "LOG IN TO CANVA", "Sign in to your free Canva account (or create one at canva.com). No paid subscription needed.", "Tip: Use Google or Facebook login for fastest setup.", ORANGE),
        ("3", "MAKE YOUR COPY", 'Click "Use Template" to save to your Canva account. This creates your own editable version.', "Tip: Rename your copy so it's easy to find later.", HOT_PINK),
        ("4", "EDIT & CUSTOMIZE", "Click any text to change wording. Update colors to match your party theme. Swap photos, change fonts — make it yours!", "Tip: Use Canva's color picker for exact party colors.", TEAL),
        ("5", "DOWNLOAD & PRINT", 'Click "Share" > "Download." Choose PDF for printing or PNG/JPG for digital sharing. Print at home on US Letter paper.', "Tip: Print on cardstock for signs — more professional!", BLUE),
    ]

    for num, title, desc, tip, accent in steps:
        # Step circle
        c.setFillColor(accent)
        c.circle(85, y + 5, 18, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(SANS, 15)
        c.drawCentredString(85, y, num)

        c.setFillColor(DARK_TEXT)
        c.setFont(SANS, 13)
        c.drawString(115, y, title)
        y -= 18

        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9.5)
        for line in word_wrap(c, desc, SANS_REG, 9.5, PAGE_W - 190):
            c.drawString(115, y, line)
            y -= 14

        # Tip
        y -= 3
        tip_w = min(c.stringWidth(tip, SANS_REG, 8) + 16, PAGE_W - 190)
        draw_rounded_rect(c, 112, y - 3, tip_w, 16, 8, fill_color=HexColor("#e8f7f8"))
        c.setFillColor(accent)
        c.setFont(SANS_MED, 8)
        c.drawString(120, y, tip)
        y -= 30

    # CTA
    y -= 10
    draw_rounded_rect(c, 90, y - 5, PAGE_W - 180, 40, 12, fill_color=HOT_PINK)
    c.setFillColor(white)
    c.setFont(SANS, 13)
    c.drawCentredString(PAGE_W / 2, y + 10, "You're all set — enjoy planning your party!")

    c.save()
    print("  [2/5] Quick Start Guide done")


# =============================================
# PDF 3: TEMPLATE PREVIEW
# =============================================
def make_preview_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Template-Preview.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    categories = [
        ("Party Games - 8 Templates", HOT_PINK, [
            ("1", "Drink If..."), ("2", "Who Knows the Bride Best"),
            ("3", "Scavenger Hunt"), ("4", "Would She Rather"),
            ("5", "Groom Trivia"), ("6", "Never Have I Ever"),
            ("7", "Bridal Bingo"), ("8", "Over or Under"),
        ]),
        ("Signs & Decor - 7 Templates", ORANGE, [
            ("9", "Welcome Sign"), ("10", "Bar Menu Sign"),
            ("11", "Photo Prop Frame"), ("12", "Directional Sign"),
            ("13", "Door Hanger"), ("14", "Table Numbers"),
            ("15", "Hashtag Sign"),
        ]),
        ("Planning Templates - 4 Templates", BLUE, [
            ("16", "Weekend Itinerary"), ("17", "Invitation"),
            ("18", "Packing List"), ("19", "House Rules"),
        ]),
        ("Bonus Extras - 4 Templates", TEAL, [
            ("20", "Name Tags"), ("21", "Paddle Signs"),
            ("22", "Instagram Story Templates"), ("23", "Cocktail Recipe Cards"),
        ]),
    ]

    for ci, (cat_name, accent, templates) in enumerate(categories):
        if ci > 0:
            c.showPage()

        draw_header(c, "Template Preview Gallery")
        draw_footer(c, f"Villa Vibes Bachelorette Bundle  |  Page {ci + 1} of {len(categories)}")

        y = PAGE_H - 112
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS, 20)
        c.drawCentredString(PAGE_W / 2, y, cat_name)
        y -= 10
        draw_divider(c, y, color=accent)
        y -= 20

        # Cards: 2 columns, limit rows to fit page
        col_w = 220
        col_gap = 25
        row_h = 130  # reduced to fit more
        left_x = (PAGE_W - 2 * col_w - col_gap) / 2
        right_x = left_x + col_w + col_gap

        for idx, (num, name) in enumerate(templates):
            col = idx % 2
            row = idx // 2
            cx = left_x if col == 0 else right_x
            cy = y - row * (row_h + 10)

            if cy - row_h < 50:  # stop before footer
                break

            # Shadow
            draw_rounded_rect(c, cx + 2, cy - row_h + 2, col_w, row_h, 8, fill_color=SOFT_GRAY)
            # Card
            draw_rounded_rect(c, cx, cy - row_h + 4, col_w, row_h, 8, fill_color=white, stroke_color=SOFT_GRAY, stroke_width=1)
            # Top accent bar
            c.setFillColor(accent)
            c.rect(cx, cy + 4 - 4, col_w, 4, fill=1, stroke=0)

            # Number badge
            c.setFillColor(accent)
            c.circle(cx + 18, cy - 10, 11, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont(SANS, 8)
            c.drawCentredString(cx + 18, cy - 13, num)

            # Template name
            c.setFillColor(DARK_TEXT)
            c.setFont(SANS, 11)
            c.drawString(cx + 36, cy - 14, name)

            # Content lines
            line_y = cy - 35
            for li in range(4):
                lw = col_w - 35 if li == 0 else col_w - 50 - li * 12
                if lw < 25: lw = 25
                fill = accent if li == 0 else SOFT_GRAY
                draw_rounded_rect(c, cx + 16, line_y, lw, 6, 3, fill_color=fill)
                line_y -= 14

            # "EDITABLE IN CANVA" tag
            c.setFillColor(GOLD_TEXT)
            c.setFont(SANS_REG, 6)
            tag = "EDITABLE IN CANVA"
            tag_w = c.stringWidth(tag, SANS_REG, 6) + 8
            draw_rounded_rect(c, cx + col_w - tag_w - 8, cy - row_h + 10, tag_w, 12, 6, fill_color=GOLD_TEXT)
            c.setFillColor(white)
            c.drawString(cx + col_w - tag_w - 4, cy - row_h + 13, tag)

    c.save()
    print("  [3/5] Template Preview done")


# =============================================
# PDF 4: PRINTING GUIDE
# =============================================
def make_printing_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Printing-Guide.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Printing Guide")
    draw_footer(c)

    y = PAGE_H - 115
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS, 24)
    c.drawCentredString(PAGE_W / 2, y, "How to Print Your Templates")
    y -= 12
    draw_divider(c, y)
    y -= 25

    # Download from Canva
    c.setFillColor(BLUE)
    c.setFont(SANS, 13)
    c.drawString(72, y, "Downloading from Canva")
    y -= 20

    dl_steps = [
        'Open your template in Canva and finish editing',
        'Click "Share" in the top-right corner',
        'Click "Download"',
        'File type: Choose PDF Print for best quality',
        'Select the pages you want',
        'Click "Download" and save to your computer',
    ]
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 9.5)
    for i, step in enumerate(dl_steps):
        c.drawString(90, y, f"{i + 1}.  {step}")
        y -= 16
    y -= 12

    # Specs table
    c.setFillColor(ORANGE)
    c.setFont(SANS, 13)
    c.drawString(72, y, "Print Specifications")
    y -= 8

    specs = [
        ("Paper Size", "US Letter (8.5 x 11 inches)"),
        ("Orientation", "Portrait (vertical)"),
        ("Color Mode", "Full Color"),
        ("Resolution", "300 DPI (set by Canva)"),
        ("Scaling", 'Actual Size (NOT "Fit to Page")'),
        ("Print Quality", "Best / High Quality"),
        ("Duplex", "Single-sided recommended"),
    ]

    table_x = 72
    col1_w = 140
    col2_w = 310
    row_h = 20

    for i, (label, value) in enumerate(specs):
        ry = y - i * row_h
        bg = HexColor("#fff5f8") if i % 2 == 0 else white
        c.setFillColor(bg)
        c.rect(table_x, ry - 4, col1_w + col2_w, row_h, fill=1, stroke=0)
        c.setStrokeColor(SOFT_GRAY)
        c.rect(table_x, ry - 4, col1_w + col2_w, row_h, fill=0, stroke=1)
        c.line(table_x + col1_w, ry - 4, table_x + col1_w, ry - 4 + row_h)
        c.setFillColor(HOT_PINK)
        c.setFont(SANS, 8)
        c.drawString(table_x + 6, ry + 3, label)
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 8)
        c.drawString(table_x + col1_w + 6, ry + 3, value)

    y -= len(specs) * row_h + 20

    # Paper recommendations
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 13)
    c.drawString(72, y, "Paper Recommendations")
    y -= 20

    recs = [
        ("Signs & Posters:", "White cardstock (65-110 lb)", ORANGE),
        ("Game Cards:", "Standard paper or light cardstock", BLUE),
        ("Invitations:", "Premium cardstock or photo paper", HOT_PINK),
        ("Name Tags:", "Light cardstock, cut to size", TEAL),
        ("Cocktail Cards:", "Cardstock or glossy photo paper", ORANGE),
    ]

    for ttype, rec, accent in recs:
        c.setFillColor(accent)
        c.setFont(SANS, 9)
        c.drawString(90, y, ttype)
        c.setFillColor(DARK_TEXT)
        c.setFont(SANS_REG, 9)
        c.drawString(90 + c.stringWidth(ttype, SANS, 9) + 6, y, rec)
        y -= 18

    c.save()
    print("  [4/5] Printing Guide done")


# =============================================
# PDF 5: THANK YOU
# =============================================
def make_thankyou_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Thank-You.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Thank You!")
    draw_footer(c)

    y = PAGE_H - 140
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 36)
    c.drawCentredString(PAGE_W / 2, y, "Thank You!")
    y -= 25
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_MED, 14)
    c.drawCentredString(PAGE_W / 2, y, "for choosing Shelzy's Designs")
    y -= 15
    draw_divider(c, y)

    y -= 30
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 11)
    lines = [
        "We're so excited you chose the Villa Vibes Bachelorette Bundle",
        "for your special celebration!",
        "",
        "We put a lot of love into designing these templates, and we",
        "hope they help make your bachelorette weekend unforgettable.",
    ]
    for line in lines:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 18

    # Coupon box
    y -= 20
    draw_rounded_rect(c, 70, y - 60, PAGE_W - 140, 100, 14, fill_color=HexColor("#fff5f8"), stroke_color=HOT_PINK, stroke_width=2)
    c.setFillColor(HOT_PINK)
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, y + 15, "SAVE 15% ON YOUR NEXT ORDER")
    c.setFont(SANS, 22)
    c.drawCentredString(PAGE_W / 2, y - 15, "Code:  VILLAVIBES15")
    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, y - 42, "Use at checkout on any Shelzy's Designs listing")

    y -= 100

    # Review request
    c.setFillColor(BLUE)
    c.setFont(SANS, 18)
    c.drawCentredString(PAGE_W / 2, y, "Loved Your Templates?")
    y -= 22

    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 10)
    review_lines = [
        "We'd love to hear from you! A 5-star review helps",
        "other brides-to-be find our templates and means",
        "the world to our small shop.",
        "",
        "To leave a review:",
        "  1.  Go to Etsy > Your Account > Purchases and Reviews",
        "  2.  Find this order and click 'Leave a Review'",
        "  3.  Share your experience!",
    ]
    for line in review_lines:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 16

    # Stay Connected
    y -= 12
    draw_divider(c, y)
    y -= 22

    c.setFillColor(ORANGE)
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, y, "Stay Connected")
    y -= 20

    c.setFillColor(DARK_TEXT)
    c.setFont(SANS_REG, 10)
    for line in ["Shop:  shelzysdesigns.etsy.com", "Questions?  Message us anytime through Etsy", "", "We typically respond within 24 hours!"]:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 16

    # Sign-off
    y -= 15
    c.setFillColor(HOT_PINK)
    c.setFont(SANS_MED, 12)
    c.drawCentredString(PAGE_W / 2, y, "Made with love by Shelzy's Designs")

    c.save()
    print("  [5/5] Thank You PDF done")


if __name__ == "__main__":
    print("Generating Villa Vibes buyer-facing PDFs (tropical palette)...")
    make_access_pdf()
    make_quickstart_pdf()
    make_preview_pdf()
    make_printing_pdf()
    make_thankyou_pdf()

    temp_qr = os.path.join(OUT, "_temp_qr.png")
    if os.path.exists(temp_qr):
        os.remove(temp_qr)

    print("\nAll 5 PDFs regenerated with Villa Vibes palette!")
