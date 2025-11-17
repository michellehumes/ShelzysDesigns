/**
 * Custom Water Bottle Conversion Package - Main JavaScript
 * Vanilla JS for all interactive features
 * Target: +300 emails/month, +30% AOV, +20-40% revenue
 */

(function() {
  'use strict';

  // ==========================================
  // 1. EMAIL POPUP - Target: 300+ emails/month
  // ==========================================
  class EmailPopup {
    constructor() {
      this.popup = document.getElementById('email-popup');
      this.form = document.getElementById('email-signup-form');
      this.closeBtn = document.querySelector('.popup-close');
      this.overlay = document.querySelector('.popup-overlay');
      this.messageEl = document.getElementById('form-message');
      this.delay = 5000; // Show after 5 seconds
      this.exitIntentEnabled = true;
      
      if (this.popup) {
        this.init();
      }
    }

    init() {
      // Check if user has already subscribed
      if (this.hasSubscribed()) {
        return;
      }

      // Show popup after delay
      setTimeout(() => this.show(), this.delay);

      // Exit intent trigger
      if (this.exitIntentEnabled) {
        document.addEventListener('mouseout', (e) => {
          if (e.clientY < 50 && !this.hasSubscribed()) {
            this.show();
          }
        }, { once: true });
      }

      // Event listeners
      this.closeBtn.addEventListener('click', () => this.hide());
      this.overlay.addEventListener('click', () => this.hide());
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.popup.classList.contains('active')) {
          this.hide();
        }
      });
    }

    show() {
      if (!this.popup.classList.contains('active')) {
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    hide() {
      this.popup.classList.remove('active');
      document.body.style.overflow = '';
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      const email = this.form.querySelector('[name="email"]').value;
      const submitBtn = this.form.querySelector('.popup-submit');
      
      // Basic validation
      if (!this.isValidEmail(email)) {
        this.showMessage('Please enter a valid email address', 'error');
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        // Send to Shopify customer list
        // In production, this would integrate with your email service
        await this.subscribeEmail(email);
        
        this.showMessage('🎉 Success! Check your email for your discount code', 'success');
        this.markAsSubscribed();
        
        setTimeout(() => this.hide(), 3000);
      } catch (error) {
        this.showMessage('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }

    async subscribeEmail(email) {
      // Simulate API call - integrate with your email service (Klaviyo, Mailchimp, etc.)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Email subscribed:', email);
          resolve();
        }, 1000);
      });
    }

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showMessage(message, type) {
      this.messageEl.textContent = message;
      this.messageEl.className = `form-message ${type}`;
    }

    hasSubscribed() {
      return localStorage.getItem('email_subscribed') === 'true';
    }

    markAsSubscribed() {
      localStorage.setItem('email_subscribed', 'true');
    }
  }

  // ==========================================
  // 2. LIVE PERSONALIZATION PREVIEW
  // ==========================================
  class PersonalizationPreview {
    constructor() {
      this.textInput = document.getElementById('custom-text');
      this.fontSelect = document.getElementById('font-style');
      this.colorInputs = document.querySelectorAll('[data-personalization-color]');
      this.iconSelect = document.getElementById('design-icon');
      this.previewText = document.getElementById('preview-text');
      this.previewName = document.getElementById('preview-name');
      this.previewIcon = document.getElementById('preview-icon');
      this.charCount = document.querySelector('.char-count');

      if (this.textInput) {
        this.init();
      }
    }

    init() {
      // Text input
      this.textInput.addEventListener('input', () => this.updatePreview());
      
      // Font selection
      this.fontSelect.addEventListener('change', () => this.updatePreview());
      
      // Color selection
      this.colorInputs.forEach(input => {
        input.addEventListener('change', () => this.updatePreview());
      });
      
      // Icon selection
      this.iconSelect.addEventListener('change', () => this.updatePreview());

      // Initial preview
      this.updatePreview();
    }

    updatePreview() {
      // Update text
      const text = this.textInput.value || 'Your Text';
      this.previewName.textContent = text;
      
      // Update character count
      this.charCount.textContent = `${this.textInput.value.length}/15`;
      
      // Update font
      const font = this.fontSelect.value;
      this.previewText.setAttribute('data-font', font);
      
      // Update color
      const selectedColor = document.querySelector('[data-personalization-color]:checked');
      if (selectedColor) {
        this.previewText.setAttribute('data-color', selectedColor.value);
      }
      
      // Update icon
      const icon = this.iconSelect.value;
      this.previewIcon.textContent = this.getIconEmoji(icon);
      
      // Apply styles
      this.applyPreviewStyles();
    }

    applyPreviewStyles() {
      const font = this.previewText.getAttribute('data-font');
      const color = this.previewText.getAttribute('data-color');
      
      // Font styles
      const fontMap = {
        'Classic': 'Arial, sans-serif',
        'Modern': 'Helvetica, sans-serif',
        'Script': 'cursive',
        'Bold': 'Arial Black, sans-serif'
      };
      
      // Color map
      const colorMap = {
        'Black': '#000000',
        'White': '#ffffff',
        'Blue': '#0066cc',
        'Red': '#cc0000',
        'Green': '#00aa00',
        'Gold': '#ffd700'
      };
      
      this.previewText.style.fontFamily = fontMap[font] || fontMap['Classic'];
      this.previewText.style.color = colorMap[color] || colorMap['Black'];
      
      // White text needs outline for visibility
      if (color === 'White') {
        this.previewText.style.textShadow = '0 0 2px #000, 0 0 4px #000';
      } else {
        this.previewText.style.textShadow = 'none';
      }
    }

    getIconEmoji(iconName) {
      const iconMap = {
        'Heart': '❤️',
        'Star': '⭐',
        'Music': '🎵',
        'Sports': '⚽',
        'Nature': '🌿',
        'Coffee': '☕'
      };
      return iconMap[iconName] || '';
    }
  }

  // ==========================================
  // 3. BULK PRICING CALCULATOR - Increases AOV
  // ==========================================
  class BulkPricing {
    constructor() {
      this.qtyInput = document.querySelector('.qty-input');
      this.priceEl = document.querySelector('.product-price .price');
      this.savingsEl = document.getElementById('bulk-savings');
      this.savingsAmount = document.querySelector('.savings-amount');
      this.tiers = document.querySelectorAll('.tier');
      this.basePrice = this.getBasePrice();

      if (this.qtyInput) {
        this.init();
      }
    }

    init() {
      this.qtyInput.addEventListener('change', () => this.calculate());
      this.qtyInput.addEventListener('input', () => this.calculate());
      
      // Initial calculation
      this.calculate();
    }

    getBasePrice() {
      const priceText = document.querySelector('[data-price]');
      if (priceText) {
        return parseFloat(priceText.getAttribute('data-price')) / 100;
      }
      return 29.99; // Default price
    }

    calculate() {
      const qty = parseInt(this.qtyInput.value) || 1;
      const discount = this.getDiscount(qty);
      const discountedPrice = this.basePrice * (1 - discount / 100);
      const totalPrice = discountedPrice * qty;
      const savings = (this.basePrice - discountedPrice) * qty;

      // Update price display
      if (this.priceEl) {
        this.priceEl.textContent = this.formatMoney(discountedPrice);
      }

      // Update active tier
      this.updateActiveTier(qty);

      // Show savings if applicable
      if (savings > 0) {
        this.savingsAmount.textContent = this.formatMoney(savings);
        this.savingsEl.style.display = 'block';
      } else {
        this.savingsEl.style.display = 'none';
      }
    }

    getDiscount(qty) {
      if (qty >= 10) return 20;
      if (qty >= 5) return 15;
      if (qty >= 3) return 10;
      return 0;
    }

    updateActiveTier(qty) {
      this.tiers.forEach(tier => {
        const minQty = parseInt(tier.getAttribute('data-min-qty'));
        const discount = parseInt(tier.getAttribute('data-discount'));
        
        if (qty >= minQty && this.getDiscount(qty) === discount) {
          tier.classList.add('active');
        } else {
          tier.classList.remove('active');
        }
      });
    }

    formatMoney(amount) {
      return '$' + amount.toFixed(2);
    }
  }

  // ==========================================
  // 4. UPSELLS CALCULATOR
  // ==========================================
  class UpsellsCalculator {
    constructor() {
      this.checkboxes = document.querySelectorAll('[data-upsell-price]');
      this.totalEl = document.getElementById('upsells-total');
      this.totalAmount = document.querySelector('.upsells-total .total-amount');

      if (this.checkboxes.length > 0) {
        this.init();
      }
    }

    init() {
      this.checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          this.calculate();
          this.toggleItemStyle(checkbox);
        });
      });
      
      this.calculate();
    }

    calculate() {
      let total = 0;
      
      this.checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          total += parseFloat(checkbox.getAttribute('data-upsell-price'));
        }
      });

      if (total > 0) {
        this.totalAmount.textContent = '$' + total.toFixed(2);
        this.totalEl.style.display = 'flex';
      } else {
        this.totalEl.style.display = 'none';
      }
    }

    toggleItemStyle(checkbox) {
      const item = checkbox.closest('.upsell-item');
      if (checkbox.checked) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    }
  }

  // ==========================================
  // 5. QUANTITY SELECTOR
  // ==========================================
  class QuantitySelector {
    constructor() {
      this.input = document.querySelector('.qty-input');
      this.minusBtn = document.querySelector('.qty-minus');
      this.plusBtn = document.querySelector('.qty-plus');

      if (this.input) {
        this.init();
      }
    }

    init() {
      this.minusBtn.addEventListener('click', () => this.decrease());
      this.plusBtn.addEventListener('click', () => this.increase());
      
      this.input.addEventListener('change', () => this.validate());
    }

    decrease() {
      const current = parseInt(this.input.value);
      const min = parseInt(this.input.min) || 1;
      if (current > min) {
        this.input.value = current - 1;
        this.input.dispatchEvent(new Event('change'));
      }
    }

    increase() {
      const current = parseInt(this.input.value);
      this.input.value = current + 1;
      this.input.dispatchEvent(new Event('change'));
    }

    validate() {
      const min = parseInt(this.input.min) || 1;
      const value = parseInt(this.input.value);
      
      if (isNaN(value) || value < min) {
        this.input.value = min;
      }
    }
  }

  // ==========================================
  // 6. FAQ ACCORDION
  // ==========================================
  class FAQAccordion {
    constructor() {
      this.questions = document.querySelectorAll('.faq-question');
      
      if (this.questions.length > 0) {
        this.init();
      }
    }

    init() {
      this.questions.forEach(question => {
        question.addEventListener('click', () => this.toggle(question));
      });
    }

    toggle(question) {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    }
  }

  // ==========================================
  // 7. PRODUCT GALLERY
  // ==========================================
  class ProductGallery {
    constructor() {
      this.mainImage = document.querySelector('.gallery-main-image');
      this.thumbnails = document.querySelectorAll('.gallery-thumbnail');
      this.zoomBtn = document.querySelector('.gallery-zoom-btn');

      if (this.mainImage) {
        this.init();
      }
    }

    init() {
      // Thumbnail click
      this.thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => this.changImage(thumb));
      });

      // Zoom functionality
      if (this.zoomBtn) {
        this.zoomBtn.addEventListener('click', () => this.zoom());
      }
    }

    changImage(thumb) {
      const img = thumb.querySelector('img');
      const newSrc = img.src.replace('100x100', '800x800');
      
      this.mainImage.src = newSrc;
      
      // Update active state
      this.thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    }

    zoom() {
      // Simple zoom implementation - could be enhanced with a modal
      if (this.mainImage.style.cursor === 'zoom-out') {
        this.mainImage.style.transform = 'scale(1)';
        this.mainImage.style.cursor = 'zoom-in';
      } else {
        this.mainImage.style.transform = 'scale(1.5)';
        this.mainImage.style.cursor = 'zoom-out';
        this.mainImage.style.transition = 'transform 0.3s';
      }
    }
  }

  // ==========================================
  // 8. RUSH SHIPPING COUNTDOWN TIMER
  // ==========================================
  class CountdownTimer {
    constructor() {
      this.timerEl = document.querySelector('.countdown-timer');
      
      if (this.timerEl) {
        this.init();
      }
    }

    init() {
      this.updateCountdown();
      setInterval(() => this.updateCountdown(), 60000); // Update every minute
    }

    updateCountdown() {
      const now = new Date();
      const cutoffHour = 14; // 2 PM cutoff
      const cutoff = new Date(now);
      cutoff.setHours(cutoffHour, 0, 0, 0);

      if (now > cutoff) {
        // Set to next day's cutoff
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = cutoff - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      this.timerEl.textContent = `${hours}h ${minutes}m`;
    }
  }

  // ==========================================
  // 9. VARIANT SELECTOR
  // ==========================================
  class VariantSelector {
    constructor() {
      this.form = document.getElementById('product-form');
      this.variantIdInput = document.querySelector('.variant-id');
      this.optionInputs = document.querySelectorAll('[data-option-position]');
      this.addToCartBtn = document.querySelector('.btn-add-to-cart');

      if (this.form) {
        this.init();
      }
    }

    init() {
      this.optionInputs.forEach(input => {
        input.addEventListener('change', () => this.updateVariant());
      });
    }

    updateVariant() {
      // Get selected options
      const selectedOptions = {};
      this.optionInputs.forEach(input => {
        if (input.checked) {
          const position = input.getAttribute('data-option-position');
          selectedOptions[position] = input.value;
        }
      });

      // In a real implementation, this would find the matching variant
      // For now, we'll just update the UI
      this.updateAddToCartButton(true);
    }

    updateAddToCartButton(available) {
      const btnText = this.addToCartBtn.querySelector('.btn-text');
      
      if (available) {
        this.addToCartBtn.disabled = false;
        btnText.textContent = 'Add to Cart';
      } else {
        this.addToCartBtn.disabled = true;
        btnText.textContent = 'Sold Out';
      }
    }
  }

  // ==========================================
  // 10. FORM SUBMISSION HANDLER
  // ==========================================
  class ProductFormHandler {
    constructor() {
      this.form = document.getElementById('product-form');
      
      if (this.form) {
        this.init();
      }
    }

    init() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.form);
      const btn = this.form.querySelector('.btn-add-to-cart');
      const btnText = btn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      
      btn.disabled = true;
      btnText.textContent = 'Adding...';

      try {
        // In production, this would use Shopify's AJAX API
        await this.addToCart(formData);
        
        btnText.textContent = '✓ Added!';
        setTimeout(() => {
          btnText.textContent = originalText;
          btn.disabled = false;
        }, 2000);
        
        // Optionally redirect to cart
        // window.location.href = '/cart';
      } catch (error) {
        btnText.textContent = 'Error - Try Again';
        setTimeout(() => {
          btnText.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }
    }

    async addToCart(formData) {
      // Simulate API call - in production, use:
      // fetch('/cart/add.js', { method: 'POST', body: formData })
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Product added to cart', Object.fromEntries(formData));
          resolve();
        }, 1000);
      });
    }
  }

  // ==========================================
  // INITIALIZE ALL COMPONENTS
  // ==========================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initComponents);
    } else {
      initComponents();
    }
  }

  function initComponents() {
    new EmailPopup();
    new PersonalizationPreview();
    new BulkPricing();
    new UpsellsCalculator();
    new QuantitySelector();
    new FAQAccordion();
    new ProductGallery();
    new CountdownTimer();
    new VariantSelector();
    new ProductFormHandler();
  }

  // Start the application
  init();

})();
