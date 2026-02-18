#!/usr/bin/env python3
"""
Generate 5 buyer-facing PDFs for the Villa Vibes Bachelorette Bundle Etsy listing.
Uses Shelzy's Designs brand colors. All PDFs are US Letter size.
"""

import os
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
import qrcode
from PIL import Image as PILImage

OUT = "/home/user/ShelzysDesigns/ETSY/VILLA/Etsy_Listing_Assets"
PAGE_W, PAGE_H = letter  # 612 x 792 points

# Brand colors
SAGE = HexColor("#8BAA88")
DARK_SAGE = HexColor("#4E5F4A")
WARM_WHITE = HexColor("#FAF9F6")
CHARCOAL = HexColor("#2B2B2B")
GOLD = HexColor("#D1C7A1")
PALE_GOLD = HexColor("#EBE4CE")
SOFT_BORDER = HexColor("#C7D3C5")
LIGHT_BG = HexColor("#F5F3EE")

# Fonts (use standard PDF fonts - Helvetica/Times available everywhere)
SERIF = "Times-Bold"
SERIF_REG = "Times-Roman"
SANS = "Helvetica-Bold"
SANS_REG = "Helvetica"

CANVA_LINK_PLACEHOLDER = "https://www.canva.com/design/YOUR-TEMPLATE-LINK-HERE"


def draw_header(c, title, subtitle=None):
    """Draw branded header bar."""
    # Dark sage header bar
    c.setFillColor(DARK_SAGE)
    c.rect(0, PAGE_H - 80, PAGE_W, 80, fill=1, stroke=0)

    # Brand name
    c.setFillColor(GOLD)
    c.setFont(SANS, 11)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 30, "SHELZY'S DESIGNS")

    # Title
    c.setFillColor(white)
    c.setFont(SERIF, 16)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 58, title)

    # Page title below header
    if subtitle:
        c.setFillColor(DARK_SAGE)
        c.setFont(SERIF, 28)
        c.drawCentredString(PAGE_W / 2, PAGE_H - 130)


def draw_footer(c, page_text="shelzysdesigns.etsy.com"):
    """Draw branded footer bar."""
    c.setFillColor(DARK_SAGE)
    c.rect(0, 0, PAGE_W, 40, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, 15, page_text)


def draw_divider(c, y, margin=72):
    """Draw a thin gold divider line."""
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(margin, y, PAGE_W - margin, y)


def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=1):
    """Draw a rounded rectangle."""
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


def generate_qr_code(url, size=150):
    """Generate a QR code image and return as a temporary file path."""
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#4E5F4A", back_color="#FAF9F6")
    path = os.path.join(OUT, "_temp_qr.png")
    img.save(path)
    return path


# =============================================
# PDF 1: ACCESS PDF (Main file with Canva link)
# =============================================
def make_access_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Bundle-Access.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    # --- PAGE 1: Welcome & Access Link ---
    draw_header(c, "Villa Vibes Bachelorette Bundle")
    draw_footer(c)

    # Main title
    y = PAGE_H - 140
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 36)
    c.drawCentredString(PAGE_W / 2, y, "Welcome!")
    y -= 35
    c.setFont(SANS_REG, 14)
    c.setFillColor(CHARCOAL)
    c.drawCentredString(PAGE_W / 2, y, "Thank you for purchasing the Villa Vibes Bachelorette Bundle")

    y -= 20
    draw_divider(c, y)

    # Access link box
    y -= 60
    box_x, box_w, box_h = 60, PAGE_W - 120, 120
    draw_rounded_rect(c, box_x, y - box_h + 40, box_w, box_h, 12, fill_color=PALE_GOLD, stroke_color=GOLD, stroke_width=2)

    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, y + 10, "YOUR CANVA TEMPLATE LINK")

    c.setFillColor(SAGE)
    c.setFont(SANS, 11)
    c.drawCentredString(PAGE_W / 2, y - 15, "Click the link below to open all 23 templates:")

    # The actual link
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS_REG, 10)
    c.drawCentredString(PAGE_W / 2, y - 45, CANVA_LINK_PLACEHOLDER)

    # Make it clickable
    link_text_width = c.stringWidth(CANVA_LINK_PLACEHOLDER, SANS_REG, 10)
    link_x = (PAGE_W - link_text_width) / 2
    c.linkURL(CANVA_LINK_PLACEHOLDER, (link_x, y - 50, link_x + link_text_width, y - 35))

    # QR Code
    y -= 120
    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 11)
    c.drawCentredString(PAGE_W / 2, y, "Or scan this QR code with your phone:")

    qr_path = generate_qr_code(CANVA_LINK_PLACEHOLDER, 150)
    qr_size = 120
    c.drawImage(qr_path, (PAGE_W - qr_size) / 2, y - qr_size - 20, qr_size, qr_size)

    # Quick steps below QR
    y -= qr_size - 60
    steps_y = y - 40
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 13)
    c.drawCentredString(PAGE_W / 2, steps_y, "Quick Start:")

    steps = [
        "1.  Click the Canva link above (or scan QR code)",
        "2.  Log in to your free Canva account",
        '3.  Click "Use Template" to copy to your account',
        "4.  Edit text, colors, fonts, and photos",
        "5.  Download as PDF or PNG and print/share!",
    ]
    c.setFont(SANS_REG, 11)
    c.setFillColor(CHARCOAL)
    for i, step in enumerate(steps):
        c.drawString(140, steps_y - 30 - i * 24, step)

    # Note at bottom
    note_y = steps_y - 30 - len(steps) * 24 - 30
    draw_rounded_rect(c, 60, note_y - 10, PAGE_W - 120, 40, 8, fill_color=LIGHT_BG, stroke_color=SOFT_BORDER)
    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, note_y + 8, "A free Canva account is all you need!  Sign up at canva.com if you don't have one.")

    # --- PAGE 2: What's Included Checklist ---
    c.showPage()
    draw_header(c, "What's Included — 23 Templates")
    draw_footer(c)

    y = PAGE_H - 120
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 26)
    c.drawCentredString(PAGE_W / 2, y, "Complete Template Checklist")
    y -= 15
    draw_divider(c, y)
    y -= 30

    categories = [
        ("PARTY GAMES (8)", [
            "Drink If...", "Who Knows the Bride Best", "Scavenger Hunt",
            "Would She Rather", "Groom Trivia", "Never Have I Ever",
            "Bridal Bingo", "Over or Under"
        ]),
        ("SIGNS & DECOR (7)", [
            "Welcome Sign", "Bar Menu Sign", "Photo Prop Frame",
            "Directional Sign", "Door Hanger", "Table Numbers", "Hashtag Sign"
        ]),
        ("PLANNING TEMPLATES (4)", [
            "Weekend Itinerary", "Invitation", "Packing List", "House Rules"
        ]),
        ("BONUS EXTRAS (4)", [
            "Name Tags", "Paddle Signs", "Instagram Story Templates",
            "Cocktail Recipe Cards"
        ]),
    ]

    left_col_x = 80
    right_col_x = PAGE_W / 2 + 20

    for cat_idx, (cat_name, items) in enumerate(categories):
        col_x = left_col_x if cat_idx % 2 == 0 else right_col_x
        if cat_idx == 2:
            y -= 20  # Extra space before second row

        cat_y = y if cat_idx % 2 == 0 else cat_y_saved

        # Category header
        draw_rounded_rect(c, col_x - 10, cat_y - 8, 240, 26, 6, fill_color=SAGE)
        c.setFillColor(white)
        c.setFont(SANS, 11)
        c.drawString(col_x, cat_y - 2, cat_name)

        # Items with checkboxes
        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 10)
        item_y = cat_y - 30
        for item in items:
            # Empty checkbox
            c.setStrokeColor(SAGE)
            c.setLineWidth(1.5)
            c.rect(col_x, item_y - 2, 12, 12, fill=0, stroke=1)
            c.setFillColor(CHARCOAL)
            c.drawString(col_x + 20, item_y, item)
            item_y -= 22

        if cat_idx % 2 == 0:
            cat_y_saved = cat_y
        else:
            y = min(item_y, y) - 15
            # Reset y to the lowest point
            y = min(cat_y_saved - 30 - len(categories[cat_idx - 1][1]) * 22, item_y) - 15

    # Bottom note
    y -= 40
    draw_rounded_rect(c, 60, y - 10, PAGE_W - 120, 50, 8, fill_color=PALE_GOLD, stroke_color=GOLD)
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 10)
    c.drawCentredString(PAGE_W / 2, y + 18, "23 TEMPLATES  |  1 CANVA LINK  |  UNLIMITED EDITS")
    c.setFont(SANS_REG, 9)
    c.setFillColor(CHARCOAL)
    c.drawCentredString(PAGE_W / 2, y + 2, "All templates are accessible from the single Canva link on page 1")

    # --- PAGE 3: Step-by-Step Instructions ---
    c.showPage()
    draw_header(c, "Step-by-Step Instructions")
    draw_footer(c)

    y = PAGE_H - 120
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 26)
    c.drawCentredString(PAGE_W / 2, y, "How to Use Your Templates")
    y -= 15
    draw_divider(c, y)
    y -= 40

    detailed_steps = [
        ("Step 1: Open Your Canva Link",
         "Go to page 1 of this PDF and click the Canva template link (or scan the QR code). "
         "This will open all 23 templates in your browser."),
        ("Step 2: Log In to Canva",
         "If you don't have a Canva account, sign up for free at canva.com. "
         "A free account is all you need — no paid subscription required."),
        ("Step 3: Make a Copy",
         'Click "Use Template" or "Make a Copy" to save the templates to your own Canva account. '
         "This creates your personal editable version."),
        ("Step 4: Edit Your Templates",
         "Click on any text to change wording. Click on colors to update your palette. "
         "Swap photos, move elements, change fonts — make it completely yours!"),
        ("Step 5: Download Your Files",
         'When you\'re done editing, click "Share" then "Download." Choose PDF for printing '
         "or PNG/JPG for sharing digitally. Select the pages you need."),
        ("Step 6: Print or Share",
         "Print at home on US Letter paper (8.5 x 11 in) or take to a print shop. "
         "For digital sharing, text or email the PNG/JPG files directly to your guests."),
    ]

    for step_title, step_desc in detailed_steps:
        # Step number circle + title
        c.setFillColor(DARK_SAGE)
        c.setFont(SANS, 13)
        c.drawString(80, y, step_title)

        # Description
        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 10)

        # Word wrap the description
        words = step_desc.split()
        lines = []
        current_line = ""
        for word in words:
            test = current_line + " " + word if current_line else word
            if c.stringWidth(test, SANS_REG, 10) < PAGE_W - 200:
                current_line = test
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)

        for line in lines:
            y -= 18
            c.drawString(100, y, line)

        y -= 35

    # --- PAGE 4: Printing Tips ---
    c.showPage()
    draw_header(c, "Printing Tips & Specifications")
    draw_footer(c)

    y = PAGE_H - 120
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 26)
    c.drawCentredString(PAGE_W / 2, y, "Printing Guide")
    y -= 15
    draw_divider(c, y)
    y -= 35

    sections = [
        ("Paper Size", [
            "All templates are designed for US Letter (8.5 x 11 inches)",
            "This is the standard paper size for home printers in the US",
        ]),
        ("Recommended Paper Types", [
            "Signs & Decor: White cardstock (65-110 lb) for durability",
            "Game Cards: Standard printer paper or light cardstock",
            "Invitations: Premium cardstock or photo paper",
            "Name Tags: Light cardstock, then cut to size",
        ]),
        ("Printer Settings", [
            'Paper size: "Letter" or "8.5 x 11"',
            'Scaling: "Actual Size" (do NOT use "Fit to Page")',
            "Quality: Best or High Quality",
            "Color: Full Color",
            "Orientation: Portrait (vertical)",
        ]),
        ("Print Shop Tips", [
            "FedEx Office, Staples, Office Depot all accept PDF files",
            "Upload your downloaded PDFs to their online print portal",
            "Request cardstock for signs, standard for game sheets",
            "Ask for color printing, single-sided",
        ]),
        ("Cutting & Trimming", [
            "Most templates print full-bleed on letter paper",
            "Use a paper trimmer or scissors for clean edges on signs",
            "A ruler and craft knife give the most professional results",
        ]),
    ]

    for section_title, items in sections:
        c.setFillColor(DARK_SAGE)
        c.setFont(SANS, 12)
        c.drawString(80, y, section_title)
        y -= 5
        # Underline
        c.setStrokeColor(SAGE)
        c.setLineWidth(1)
        tw = c.stringWidth(section_title, SANS, 12)
        c.line(80, y, 80 + tw, y)
        y -= 18

        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 10)
        for item in items:
            c.drawString(100, y, f"  {item}")
            y -= 18
        y -= 15

    # --- PAGE 5: Support & Contact ---
    c.showPage()
    draw_header(c, "Support & Contact")
    draw_footer(c)

    y = PAGE_H - 130
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 26)
    c.drawCentredString(PAGE_W / 2, y, "Need Help? We're Here!")
    y -= 15
    draw_divider(c, y)
    y -= 40

    faqs = [
        ("I can't find my download",
         "Go to Etsy.com > Your Account > Purchases and Reviews. "
         "Click 'Download Files' next to this order. If you don't see it, "
         "check your email for the Etsy receipt with a download link."),
        ("The Canva link isn't working",
         "Make sure you're logged into a Canva account. Try opening the link "
         "in a different browser (Chrome works best). If the issue persists, "
         "message us on Etsy and we'll send a fresh link."),
        ("I don't have a Canva account",
         "Go to canva.com and sign up for free! You don't need a paid account. "
         "The free version has everything you need to edit these templates."),
        ("Can I change the colors/fonts/text?",
         "Yes! Everything is fully editable. Click on any element in Canva to "
         "change text, fonts, colors, photos, and layout. Make it match your "
         "party theme perfectly."),
        ("What if my prints look different from the screen?",
         "Colors can vary slightly between screens and printers. For best results, "
         "do a test print of one page before printing the full set. Use the "
         "'Best Quality' printer setting."),
    ]

    c.setFont(SANS_REG, 10)
    for q, a in faqs:
        c.setFillColor(DARK_SAGE)
        c.setFont(SANS, 11)
        c.drawString(80, y, f"Q:  {q}")
        y -= 20

        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 10)
        words = a.split()
        lines = []
        current_line = ""
        for word in words:
            test = current_line + " " + word if current_line else word
            if c.stringWidth(test, SANS_REG, 10) < PAGE_W - 220:
                current_line = test
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)

        for line in lines:
            c.drawString(100, y, line)
            y -= 16
        y -= 20

    # Contact box
    y -= 10
    draw_rounded_rect(c, 60, y - 20, PAGE_W - 120, 70, 10, fill_color=PALE_GOLD, stroke_color=GOLD, stroke_width=2)
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 12)
    c.drawCentredString(PAGE_W / 2, y + 28, "Message us anytime through Etsy!")
    c.setFont(SANS_REG, 10)
    c.setFillColor(CHARCOAL)
    c.drawCentredString(PAGE_W / 2, y + 8, "We typically respond within 24 hours.")
    c.drawCentredString(PAGE_W / 2, y - 10, "We want your bachelorette weekend to be perfect!")

    c.save()
    print(f"  [1/5] Access PDF done: {filepath}")


# =============================================
# PDF 2: QUICK START GUIDE
# =============================================
def make_quickstart_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Quick-Start-Guide.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Quick Start Guide")
    draw_footer(c)

    y = PAGE_H - 130
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 30)
    c.drawCentredString(PAGE_W / 2, y, "Get Started in 5 Minutes")
    y -= 15
    draw_divider(c, y)
    y -= 50

    steps = [
        ("1", "OPEN YOUR CANVA LINK",
         "Find the Access PDF in your Etsy downloads. Click the Canva template link on page 1. "
         "This opens all 23 templates in one place.",
         "Tip: Bookmark the link so you can come back anytime!"),
        ("2", "LOG IN TO CANVA",
         "Sign in to your free Canva account (or create one at canva.com). "
         "No paid subscription needed — the free version works perfectly.",
         "Tip: Use Google or Facebook login for the fastest setup."),
        ("3", "MAKE YOUR COPY",
         'Click "Use Template" to save the templates to your Canva account. '
         "This creates your own editable version that won't affect the originals.",
         "Tip: Rename your copy so it's easy to find later."),
        ("4", "EDIT & CUSTOMIZE",
         "Click any text to change the wording. Update colors to match your party theme. "
         "Swap photos, change fonts, move elements around — make it yours!",
         "Tip: Use Canva's color picker to match your exact party colors."),
        ("5", "DOWNLOAD & PRINT",
         'Click "Share" > "Download." Choose PDF for printing or PNG/JPG for digital sharing. '
         "Print at home on US Letter paper or take to a print shop.",
         "Tip: Print on cardstock for signs — it looks more professional!"),
    ]

    for num, title, desc, tip in steps:
        # Step circle
        circle_x = 90
        circle_y = y + 5
        c.setFillColor(SAGE)
        c.circle(circle_x, circle_y, 22, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(SANS, 18)
        c.drawCentredString(circle_x, circle_y - 6, num)

        # Title
        c.setFillColor(DARK_SAGE)
        c.setFont(SANS, 14)
        c.drawString(130, y + 2, title)

        # Description (word wrap)
        y -= 22
        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 10)
        words = desc.split()
        lines = []
        current_line = ""
        for word in words:
            test = current_line + " " + word if current_line else word
            if c.stringWidth(test, SANS_REG, 10) < PAGE_W - 220:
                current_line = test
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)

        for line in lines:
            c.drawString(130, y, line)
            y -= 16

        # Tip box
        y -= 5
        tip_w = c.stringWidth(tip, SANS_REG, 9) + 20
        draw_rounded_rect(c, 125, y - 5, min(tip_w, PAGE_W - 200), 22, 6, fill_color=LIGHT_BG)
        c.setFillColor(SAGE)
        c.setFont(SANS, 9)
        c.drawString(135, y, tip)

        y -= 40

    # Bottom CTA
    y -= 20
    draw_rounded_rect(c, 100, y - 10, PAGE_W - 200, 50, 12, fill_color=DARK_SAGE)
    c.setFillColor(white)
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, y + 12, "You're all set — enjoy planning your party!")

    c.save()
    print(f"  [2/5] Quick Start Guide done: {filepath}")


# =============================================
# PDF 3: TEMPLATE PREVIEW
# =============================================
def make_preview_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Template-Preview.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    categories = [
        ("Party Games — 8 Templates", [
            ("1", "Drink If..."),
            ("2", "Who Knows the Bride Best"),
            ("3", "Scavenger Hunt"),
            ("4", "Would She Rather"),
            ("5", "Groom Trivia"),
            ("6", "Never Have I Ever"),
            ("7", "Bridal Bingo"),
            ("8", "Over or Under"),
        ]),
        ("Signs & Decor — 7 Templates", [
            ("9", "Welcome Sign"),
            ("10", "Bar Menu Sign"),
            ("11", "Photo Prop Frame"),
            ("12", "Directional Sign"),
            ("13", "Door Hanger"),
            ("14", "Table Numbers"),
            ("15", "Hashtag Sign"),
        ]),
        ("Planning Templates — 4 Templates", [
            ("16", "Weekend Itinerary"),
            ("17", "Invitation"),
            ("18", "Packing List"),
            ("19", "House Rules"),
        ]),
        ("Bonus Extras — 4 Templates", [
            ("20", "Name Tags"),
            ("21", "Paddle Signs"),
            ("22", "Instagram Story Templates"),
            ("23", "Cocktail Recipe Cards"),
        ]),
    ]

    for cat_idx, (cat_name, templates) in enumerate(categories):
        if cat_idx > 0:
            c.showPage()

        draw_header(c, "Template Preview Gallery")
        draw_footer(c, f"Villa Vibes Bachelorette Bundle  |  Page {cat_idx + 1} of {len(categories)}")

        y = PAGE_H - 120
        c.setFillColor(DARK_SAGE)
        c.setFont(SERIF, 24)
        c.drawCentredString(PAGE_W / 2, y, cat_name)
        y -= 12
        draw_divider(c, y, margin=120)
        y -= 35

        # Draw template preview cards in 2-column grid
        col_w = 220
        col_gap = 30
        row_h = 160
        left_x = (PAGE_W - 2 * col_w - col_gap) / 2
        right_x = left_x + col_w + col_gap

        for idx, (num, name) in enumerate(templates):
            col = idx % 2
            row = idx // 2
            cx = left_x if col == 0 else right_x
            cy = y - row * (row_h + 15)

            if cy < 80:  # Don't overflow into footer
                break

            # Card shadow
            c.setFillColor(HexColor("#E8E6E2"))
            draw_rounded_rect(c, cx + 3, cy - row_h + 3, col_w, row_h, 10, fill_color=HexColor("#E8E6E2"))

            # Card background
            draw_rounded_rect(c, cx, cy - row_h + 6, col_w, row_h, 10, fill_color=white, stroke_color=SOFT_BORDER, stroke_width=1.5)

            # Number badge
            badge_x = cx + 12
            badge_y = cy - 10
            c.setFillColor(SAGE)
            c.circle(badge_x + 12, badge_y - 5, 14, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont(SANS, 10)
            c.drawCentredString(badge_x + 12, badge_y - 9, num)

            # Template name
            c.setFillColor(DARK_SAGE)
            c.setFont(SERIF, 13)
            c.drawString(cx + 45, badge_y - 8, name)

            # Simulated content lines
            c.setFillColor(SOFT_BORDER)
            line_y = cy - 45
            for li in range(4):
                lw = col_w - 40 if li == 0 else col_w - 55 - li * 15
                if lw < 30:
                    lw = 30
                c.setFillColor(SAGE if li == 0 else SOFT_BORDER)
                draw_rounded_rect(c, cx + 20, line_y, lw, 8, 4, fill_color=SAGE if li == 0 else SOFT_BORDER)
                line_y -= 18

            # "Fully Editable" mini tag
            c.setFillColor(GOLD)
            c.setFont(SANS_REG, 7)
            tag_text = "EDITABLE IN CANVA"
            tag_w = c.stringWidth(tag_text, SANS_REG, 7) + 12
            draw_rounded_rect(c, cx + col_w - tag_w - 12, cy - row_h + 16, tag_w, 16, 8, fill_color=GOLD)
            c.setFillColor(white)
            c.drawString(cx + col_w - tag_w - 6, cy - row_h + 20, tag_text)

    c.save()
    print(f"  [3/5] Template Preview done: {filepath}")


# =============================================
# PDF 4: PRINTING GUIDE
# =============================================
def make_printing_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Printing-Guide.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Printing Guide")
    draw_footer(c)

    y = PAGE_H - 130
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 28)
    c.drawCentredString(PAGE_W / 2, y, "How to Print Your Templates")
    y -= 15
    draw_divider(c, y)
    y -= 35

    # Section: Download from Canva
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 14)
    c.drawString(72, y, "Downloading from Canva")
    y -= 25

    dl_steps = [
        'Open your template in Canva and finish editing',
        'Click "Share" in the top-right corner',
        'Click "Download"',
        'File type: Choose PDF Print for best quality',
        'Select the pages you want to download',
        'Click "Download" and save to your computer',
    ]
    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 10)
    for i, step in enumerate(dl_steps):
        c.drawString(92, y, f"{i + 1}.  {step}")
        y -= 20
    y -= 15

    # Section: Print Specs Table
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 14)
    c.drawString(72, y, "Print Specifications")
    y -= 10

    # Table
    specs = [
        ("Paper Size", "US Letter (8.5 x 11 inches)"),
        ("Orientation", "Portrait (vertical)"),
        ("Color Mode", "Full Color"),
        ("Resolution", "300 DPI (set automatically by Canva)"),
        ("Scaling", 'Actual Size (NOT "Fit to Page")'),
        ("Print Quality", "Best / High Quality"),
        ("Duplex", "Single-sided recommended"),
    ]

    table_x = 80
    col1_w = 160
    col2_w = 320
    row_h = 24
    c.setStrokeColor(SOFT_BORDER)
    c.setLineWidth(1)

    for i, (label, value) in enumerate(specs):
        ry = y - i * row_h
        bg = LIGHT_BG if i % 2 == 0 else white
        c.setFillColor(bg)
        c.rect(table_x, ry - 6, col1_w + col2_w, row_h, fill=1, stroke=0)
        c.setStrokeColor(SOFT_BORDER)
        c.rect(table_x, ry - 6, col1_w + col2_w, row_h, fill=0, stroke=1)
        c.line(table_x + col1_w, ry - 6, table_x + col1_w, ry - 6 + row_h)

        c.setFillColor(DARK_SAGE)
        c.setFont(SANS, 9)
        c.drawString(table_x + 8, ry + 4, label)

        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 9)
        c.drawString(table_x + col1_w + 8, ry + 4, value)

    y -= len(specs) * row_h + 25

    # Section: Paper Recommendations
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 14)
    c.drawString(72, y, "Paper Recommendations by Template Type")
    y -= 25

    paper_recs = [
        ("Signs & Welcome Posters", "White cardstock (65-110 lb)  —  Sturdy and professional"),
        ("Game Cards & Activity Sheets", "Standard printer paper (20 lb)  —  Easy to write on"),
        ("Invitations", "Premium cardstock or photo paper  —  Thick and elegant"),
        ("Name Tags & Paddles", "Light cardstock (65 lb)  —  Easy to cut, holds shape"),
        ("Cocktail Cards", "Cardstock or glossy photo paper  —  Water-resistant option"),
        ("Itinerary & Packing List", "Standard paper  —  Functional and easy to fold"),
    ]

    for template_type, recommendation in paper_recs:
        c.setFillColor(SAGE)
        c.setFont(SANS, 10)
        c.drawString(92, y, template_type)
        y -= 16
        c.setFillColor(CHARCOAL)
        c.setFont(SANS_REG, 9)
        c.drawString(108, y, recommendation)
        y -= 22

    # Bottom tip box
    y -= 10
    draw_rounded_rect(c, 60, y - 15, PAGE_W - 120, 55, 10, fill_color=PALE_GOLD, stroke_color=GOLD)
    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 10)
    c.drawCentredString(PAGE_W / 2, y + 18, "PRO TIP: Always do a test print of one page first!")
    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 9)
    c.drawCentredString(PAGE_W / 2, y + 2, "Check colors, alignment, and sizing before printing the full set.")

    c.save()
    print(f"  [4/5] Printing Guide done: {filepath}")


# =============================================
# PDF 5: THANK YOU
# =============================================
def make_thankyou_pdf():
    filepath = os.path.join(OUT, "Villa-Vibes-Thank-You.pdf")
    c = canvas.Canvas(filepath, pagesize=letter)

    draw_header(c, "Thank You!")
    draw_footer(c)

    y = PAGE_H - 160
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 42)
    c.drawCentredString(PAGE_W / 2, y, "Thank You!")
    y -= 30
    c.setFont(SERIF, 16)
    c.drawCentredString(PAGE_W / 2, y, "for choosing Shelzy's Designs")
    y -= 20
    draw_divider(c, y)

    y -= 40
    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 12)
    lines = [
        "We're so excited you chose the Villa Vibes Bachelorette Bundle",
        "for your special celebration!",
        "",
        "We put a lot of love into designing these templates, and we",
        "hope they help make your bachelorette weekend unforgettable.",
    ]
    for line in lines:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 22

    # Coupon box
    y -= 30
    box_h = 120
    draw_rounded_rect(c, 80, y - box_h + 30, PAGE_W - 160, box_h, 16, fill_color=PALE_GOLD, stroke_color=GOLD, stroke_width=2)

    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 16)
    c.drawCentredString(PAGE_W / 2, y + 4, "SAVE 15% ON YOUR NEXT ORDER")

    c.setFont(SANS, 24)
    c.drawCentredString(PAGE_W / 2, y - 30, "Code:  VILLAVIBES15")

    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 10)
    c.drawCentredString(PAGE_W / 2, y - 60, "Use at checkout on any Shelzy's Designs listing")

    y -= box_h + 20

    # Review request
    y -= 20
    c.setFillColor(DARK_SAGE)
    c.setFont(SERIF, 20)
    c.drawCentredString(PAGE_W / 2, y, "Loved Your Templates?")
    y -= 30

    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 11)
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
        y -= 20

    # Social / connect section
    y -= 30
    draw_divider(c, y)
    y -= 30

    c.setFillColor(DARK_SAGE)
    c.setFont(SANS, 14)
    c.drawCentredString(PAGE_W / 2, y, "Stay Connected")
    y -= 25

    c.setFillColor(CHARCOAL)
    c.setFont(SANS_REG, 11)
    connect_lines = [
        "Shop:  shelzysdesigns.etsy.com",
        "Questions?  Message us anytime through Etsy",
        "",
        "We typically respond within 24 hours!",
    ]
    for line in connect_lines:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 20

    # Heart at the bottom
    y -= 25
    c.setFillColor(SAGE)
    c.setFont(SERIF, 18)
    c.drawCentredString(PAGE_W / 2, y, "Made with love by Shelzy's Designs")

    c.save()
    print(f"  [5/5] Thank You PDF done: {filepath}")


# =============================================
# RUN ALL
# =============================================
if __name__ == "__main__":
    print("Generating Villa Vibes buyer-facing PDFs...")
    make_access_pdf()
    make_quickstart_pdf()
    make_preview_pdf()
    make_printing_pdf()
    make_thankyou_pdf()

    # Clean up temp files
    temp_qr = os.path.join(OUT, "_temp_qr.png")
    if os.path.exists(temp_qr):
        os.remove(temp_qr)

    print("\nAll 5 PDFs generated successfully!")
