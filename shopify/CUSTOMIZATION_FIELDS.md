# Product Customization Fields Setup

**How to set up personalization fields for each product using Shopify apps or custom code.**

---

## 🛠️ Recommended Apps

### Option 1: Bold Product Options (Premium - $20/month)
**Best for:** Advanced customization, live preview, conditional logic
**Features:**
- Text inputs
- Dropdowns
- File uploads
- Price modifiers
- Conditional fields

### Option 2: Infinite Options (by ShopPad) ($13/month)
**Best for:** Simple text/dropdown options
**Features:**
- Text fields
- Dropdowns
- Checkboxes
- Color swatches

### Option 3: Custom Fields (Free - Code Required)
**Best for:** Developers comfortable with Liquid
**Method:** Use Shopify's native line item properties

---

## 📋 Customization Fields by Product

### Product 1: Signature Personalized Bottle

**Required Fields:**

1. **Name for Personalization**
   - Type: Text input
   - Required: Yes
   - Character limit: 20
   - Placeholder: "Enter name exactly as you'd like it"
   - Instructions: "Please check spelling and capitalization"

2. **Bottle Color**
   - Type: Dropdown
   - Required: Yes
   - Options:
     - White
     - Sage Green
     - Blush Pink
     - Matte Black
   - Note: This is already handled by Shopify variants

3. **Font Style**
   - Type: Dropdown
   - Required: Yes
   - Options:
     - Elegant Script (flowing, feminine)
     - Clean Block (modern, uppercase)
     - Vertical Down Bottle

4. **Text Color**
   - Type: Dropdown
   - Required: Yes
   - Options:
     - Black
     - Sage Green
     - Blush Pink
     - Gold Effect

5. **Add Icon? (Optional)**
   - Type: Dropdown
   - Required: No
   - Options:
     - None
     - Heart
     - Star
     - Daisy
     - Palm Tree
     - Coffee Cup
     - Sun

**Example Output to Order:**
```
Name: Sarah
Font: Elegant Script
Text Color: Black
Icon: Heart
```

---

### Product 2: Bridesmaid Proposal Bottle

**Required Fields:**

1. **Name for Personalization**
   - Type: Text input
   - Required: Yes
   - Character limit: 20

2. **Bottle Color**
   - Type: Variant selector
   - Options: White, Sage Green, Blush Pink, Matte Black

3. **Title**
   - Type: Variant selector
   - Options: Bridesmaid, Maid of Honor

4. **Add Gift Note Card?**
   - Type: Checkbox
   - Price modifier: +$3.00
   - Label: "Add 'Will you be my bridesmaid?' gift note card (+$3)"

**Example Output:**
```
Name: Emily
Title: Maid of Honor
Gift Note: Yes
```

---

### Product 3: Bridesmaid Proposal Gift Box

**Required Fields:**

1. **Name for Personalization**
   - Type: Text input
   - Required: Yes

2. **Bottle Color**
   - Type: Variant selector
   - Options: White, Sage Green, Blush Pink, Matte Black

3. **Title**
   - Type: Variant selector
   - Options: Bridesmaid, Maid of Honor, Matron of Honor, Flower Girl

**Example Output:**
```
Name: Jessica
Title: Bridesmaid
Bottle Color: White
```

---

### Product 4: Bridal Party Bottle Set

**Special Note:** This requires multiple personalization inputs (one per bottle)

**Setup Method:**

**Option A: Simple (Use Order Notes)**
- Add instruction text on product page:
  "Please provide personalization details in the 'Order Notes' at checkout"
- Format example:
  ```
  1. Sarah - Bride
  2. Emily - Maid of Honor
  3. Jessica - Bridesmaid
  4. Lauren - Bridesmaid
  5. Mom - Mother of the Bride
  ```

**Option B: Advanced (Use Bold Product Options)**
- Create repeating text fields
- Field 1 Name, Field 1 Title
- Field 2 Name, Field 2 Title
- etc. (up to 10)

**Required Fields:**

1. **Set Size**
   - Type: Variant selector
   - Options: 5-Pack, 8-Pack, 10-Pack

2. **Bottle Colors**
   - Type: Dropdown
   - Options:
     - All White
     - All Sage
     - All Blush
     - All Black
     - Mixed (specify in notes)

3. **Personalization Details**
   - Type: Large text area
   - Instructions: "List each person's name and title (Bride, Bridesmaid, Maid of Honor, etc.)"
   - Example provided on page

---

### Product 5: Everyday Custom Bottle

**Required Fields:**

1. **Name for Personalization**
   - Type: Text input
   - Required: Yes

2. **Bottle Color**
   - Type: Variant selector
   - Options: White, Sage Green, Blush Pink, Matte Black

3. **Font Style**
   - Type: Dropdown
   - Options:
     - Script
     - Block

4. **Text Color**
   - Type: Dropdown
   - Options: Black, Sage, Blush, Gold

5. **Add Icon? (Optional)**
   - Type: Dropdown
   - Options:
     - None
     - Heart
     - Star
     - Coffee Cup
     - Sun
     - Lightning Bolt
     - Mountain

---

### Product 6: Kids Personalized Bottle

**Required Fields:**

1. **Child's Name**
   - Type: Text input
   - Required: Yes
   - Character limit: 15

2. **Bottle Color**
   - Type: Variant selector
   - Options: White, Sage Green, Blush Pink, Matte Black

3. **Choose Icon**
   - Type: Dropdown with images (if possible)
   - Required: Yes
   - Options:
     - Dinosaur 🦕
     - Rainbow 🌈
     - Butterfly 🦋
     - Soccer Ball ⚽
     - Basketball 🏀
     - Baseball ⚾
     - Unicorn 🦄
     - Rocket 🚀
     - Flower 🌸
     - Dog 🐶
     - Cat 🐱

4. **Text Color**
   - Type: Dropdown
   - Options: Black, Sage, Blush, Bright Blue, Bright Pink

---

### Product 7: Holiday Personalized Bottle

**Required Fields:**

1. **Name for Personalization**
   - Type: Text input
   - Required: Yes

2. **Holiday Design**
   - Type: Variant selector
   - Options:
     - Merry & Bright
     - Cozy Season
     - Snowflakes
     - Candy Cane Border
     - Holiday Wreath

3. **Bottle Color**
   - Type: Dropdown
   - Options: White, Sage Green, Matte Black
   - Note: Most popular is White for holiday designs

---

### Product 8: Bulk & Corporate Bottles

**Special Setup:** This is a quote-based product, not standard checkout

**Method:** Contact form instead of "Add to Cart"

**Form Fields:**

1. Full Name (text, required)
2. Email (email, required)
3. Company Name (text, required)
4. Quantity Needed (number, required)
5. Bottle Color Preference (dropdown or text)
6. Approximate Delivery Date (date picker)
7. Additional Details / List of Names (textarea)
8. Upload Logo (file upload)

---

## 🔧 Implementation Guide

### Method 1: Using Bold Product Options

1. Install Bold Product Options from Shopify App Store
2. Go to Apps > Bold Product Options
3. Click "Add Option Set"
4. Name it (e.g., "Signature Bottle Personalization")
5. Add fields as listed above
6. Assign to products
7. Style to match your theme

**Example Bold Setup for Signature Bottle:**
```
Option Set: "Signature Bottle Personalization"

Field 1:
- Label: "Name for Personalization"
- Type: Text Input
- Required: Yes
- Max Characters: 20

Field 2:
- Label: "Font Style"
- Type: Dropdown
- Options: Elegant Script, Clean Block, Vertical
- Required: Yes

Field 3:
- Label: "Text Color"
- Type: Dropdown
- Options: Black, Sage Green, Blush Pink, Gold
- Required: Yes

Field 4:
- Label: "Add Icon? (Optional)"
- Type: Dropdown
- Options: None, Heart, Star, Daisy, Palm Tree, Coffee Cup, Sun
- Required: No
```

---

### Method 2: Using Shopify Line Item Properties (Free)

Add this code to your product page template (`product-template.liquid` or similar):

```liquid
<div class="product-customization">
  <h3>Personalize Your Bottle</h3>

  <!-- Name Input -->
  <div class="form-field">
    <label for="personalization-name">Name for Personalization *</label>
    <input
      type="text"
      id="personalization-name"
      name="properties[Name]"
      required
      maxlength="20"
      placeholder="Enter name exactly as you'd like it"
    >
    <small>Please check spelling and capitalization</small>
  </div>

  <!-- Font Style -->
  <div class="form-field">
    <label for="font-style">Font Style *</label>
    <select id="font-style" name="properties[Font Style]" required>
      <option value="">Select a font style...</option>
      <option value="Elegant Script">Elegant Script (flowing, feminine)</option>
      <option value="Clean Block">Clean Block (modern, uppercase)</option>
      <option value="Vertical">Vertical (down the bottle)</option>
    </select>
  </div>

  <!-- Text Color -->
  <div class="form-field">
    <label for="text-color">Text Color *</label>
    <select id="text-color" name="properties[Text Color]" required>
      <option value="">Select a color...</option>
      <option value="Black">Black</option>
      <option value="Sage Green">Sage Green</option>
      <option value="Blush Pink">Blush Pink</option>
      <option value="Gold">Gold Effect</option>
    </select>
  </div>

  <!-- Icon (Optional) -->
  <div class="form-field">
    <label for="icon">Add Icon? (Optional)</label>
    <select id="icon" name="properties[Icon]">
      <option value="None">None</option>
      <option value="Heart">❤️ Heart</option>
      <option value="Star">⭐ Star</option>
      <option value="Daisy">🌼 Daisy</option>
      <option value="Palm Tree">🌴 Palm Tree</option>
      <option value="Coffee Cup">☕ Coffee Cup</option>
      <option value="Sun">☀️ Sun</option>
    </select>
  </div>
</div>

<style>
.product-customization {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #F7F4EF;
  border-radius: 8px;
}

.product-customization h3 {
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #111111;
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #111111;
}

.form-field input,
.form-field select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D8CFC4;
  border-radius: 4px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
}

.form-field small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 14px;
}
</style>
```

**How This Works:**
- Form fields use `name="properties[FieldName]"`
- Data appears in Shopify order as line item properties
- You'll see it when fulfilling orders
- Free, no app needed!

---

### Method 3: Using Infinite Options

1. Install Infinite Options from Shopify App Store
2. Create option set for each product
3. Add text inputs and dropdowns
4. Assign to products

**Similar to Bold, but simpler interface**

---

## 📦 Order Fulfillment View

When a customer orders, you'll see:

```
Order #1234
Product: Personalized 20oz Sublimation Water Bottle – White

Customization:
- Name: Sarah
- Font Style: Elegant Script
- Text Color: Black
- Icon: Heart
```

This information flows to your production process.

---

## ✅ Setup Checklist

- [ ] Choose customization method (Bold, Infinite Options, or native)
- [ ] Set up fields for Product 1 (Signature Bottle)
- [ ] Test order to ensure fields appear correctly
- [ ] Set up fields for Product 2 (Bridesmaid Bottle)
- [ ] Set up fields for Product 3 (Gift Box)
- [ ] Set up special handling for Product 4 (Bridal Party Set)
- [ ] Set up fields for remaining products
- [ ] Style customization fields to match brand
- [ ] Add helpful instructions/examples
- [ ] Test mobile responsiveness

---

## 💡 Pro Tips

1. **Always include examples** - Show customers how to format names
2. **Validate input** - Require fields and set character limits
3. **Mobile-friendly** - Test on phone (most customers shop mobile)
4. **Clear instructions** - Remind about spelling and capitalization
5. **Show preview** (optional) - Use Bold's live preview feature if budget allows

---

## 🚨 Important Notes

- **Line item properties are FREE** but require theme code editing
- **Apps are easier** but cost $10-20/month
- **For live preview**, you'll need Bold or custom development
- **Test thoroughly** before launch - place test orders!

---

**Next Step:** Once customization fields are set up, test the entire flow from product page → cart → checkout → order confirmation.

---

**Version:** 1.0
**Last Updated:** November 2025
