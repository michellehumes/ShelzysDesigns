/**
 * Shelzy's Designs Theme JavaScript
 * Premium Personalized Water Bottles
 */

(function() {
  'use strict';

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const formatMoney = (cents) => {
    const format = window.ShelzysConfig?.shop?.moneyFormat || '${{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
  };

  // ==========================================================================
  // Email Popup
  // ==========================================================================

  const EmailPopup = {
    popup: null,
    overlay: null,
    hasShown: false,
    delay: 12000,
    exitIntentEnabled: true,

    init() {
      this.popup = document.querySelector('.email-popup');
      this.overlay = document.querySelector('.email-popup-overlay');

      if (!this.popup || !this.overlay) return;

      // Check if already dismissed
      if (localStorage.getItem('shelzys_popup_dismissed')) return;

      // Get settings from data attributes
      this.delay = (this.popup.dataset.delay || 12) * 1000;
      this.exitIntentEnabled = this.popup.dataset.exitIntent !== 'false';

      // Timer-based trigger
      setTimeout(() => this.show(), this.delay);

      // Exit intent trigger (desktop only)
      if (this.exitIntentEnabled && window.innerWidth > 768) {
        document.addEventListener('mouseout', this.handleExitIntent.bind(this));
      }

      // Close handlers
      this.popup.querySelector('.email-popup__close')?.addEventListener('click', () => this.close());
      this.overlay.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      // Form submission
      const form = this.popup.querySelector('form');
      if (form) {
        form.addEventListener('submit', this.handleSubmit.bind(this));
      }
    },

    handleExitIntent(e) {
      if (e.clientY < 10 && !this.hasShown) {
        this.show();
      }
    },

    show() {
      if (this.hasShown) return;
      this.hasShown = true;
      this.popup.classList.add('active');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.popup.classList.remove('active');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      localStorage.setItem('shelzys_popup_dismissed', 'true');
    },

    handleSubmit(e) {
      // Let the form submit naturally or handle via AJAX if needed
      localStorage.setItem('shelzys_popup_submitted', 'true');
    }
  };

  // ==========================================================================
  // Cart Drawer
  // ==========================================================================

  const CartDrawer = {
    drawer: null,
    overlay: null,

    init() {
      this.drawer = document.querySelector('.cart-drawer');
      this.overlay = document.querySelector('.cart-drawer-overlay');

      if (!this.drawer || !this.overlay) return;

      // Open cart triggers
      document.querySelectorAll('[data-cart-toggle]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      // Close handlers
      this.drawer.querySelector('.cart-drawer__close')?.addEventListener('click', () => this.close());
      this.overlay.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      // Listen for cart updates
      document.addEventListener('cart:updated', () => this.refresh());
    },

    open() {
      this.drawer.classList.add('active');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.drawer.classList.remove('active');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    async refresh() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        this.render(cart);
      } catch (error) {
        console.error('Error refreshing cart:', error);
      }
    },

    render(cart) {
      const content = this.drawer.querySelector('.cart-drawer__content');
      const total = this.drawer.querySelector('.cart-drawer__total-amount');
      const count = document.querySelectorAll('.cart-count');

      // Update count badges
      count.forEach(el => el.textContent = cart.item_count);

      // Update total
      if (total) {
        total.textContent = formatMoney(cart.total_price);
      }

      // Update free shipping bar
      this.updateFreeShippingBar(cart.total_price);
    },

    updateFreeShippingBar(totalPrice) {
      const bar = this.drawer.querySelector('.free-shipping-bar');
      if (!bar) return;

      const threshold = window.ShelzysConfig?.freeShippingThreshold || 5000;
      const remaining = Math.max(0, threshold - totalPrice);
      const progress = Math.min(100, (totalPrice / threshold) * 100);

      const message = bar.querySelector('.free-shipping-bar__message');
      const progressFill = bar.querySelector('.free-shipping-bar__progress-fill');

      if (remaining === 0) {
        bar.classList.add('free-shipping-bar--achieved');
        if (message) message.textContent = "You've unlocked FREE SHIPPING!";
      } else {
        bar.classList.remove('free-shipping-bar--achieved');
        if (message) message.textContent = `Add ${formatMoney(remaining)} more to unlock FREE SHIPPING!`;
      }

      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
    }
  };

  // ==========================================================================
  // Add to Cart
  // ==========================================================================

  const AddToCart = {
    init() {
      document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
        form.addEventListener('submit', this.handleSubmit.bind(this));
      });
    },

    async handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.textContent;

      try {
        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Adding...';
        }

        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to add to cart');

        const item = await response.json();

        // Dispatch custom event for tracking
        document.dispatchEvent(new CustomEvent('cart:item-added', {
          detail: {
            variant_id: item.variant_id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          }
        }));

        // Update cart and open drawer
        document.dispatchEvent(new CustomEvent('cart:updated'));
        CartDrawer.open();

        // Reset button
        if (submitBtn) {
          submitBtn.textContent = 'Added!';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }, 2000);
        }

      } catch (error) {
        console.error('Add to cart error:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        alert('There was an error adding this item to your cart. Please try again.');
      }
    }
  };

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================

  const MobileNav = {
    toggle: null,
    nav: null,

    init() {
      this.toggle = document.querySelector('.mobile-nav-toggle');
      this.nav = document.querySelector('.mobile-nav');

      if (!this.toggle || !this.nav) return;

      this.toggle.addEventListener('click', () => this.toggleNav());
    },

    toggleNav() {
      const isOpen = this.nav.classList.toggle('active');
      this.toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  };

  // ==========================================================================
  // Checkout Tracking
  // ==========================================================================

  const CheckoutTracking = {
    init() {
      // Track checkout button clicks
      document.querySelectorAll('[name="checkout"], [href="/checkout"]').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            const response = await fetch('/cart.js');
            const cart = await response.json();

            document.dispatchEvent(new CustomEvent('cart:checkout-started', {
              detail: cart
            }));
          } catch (error) {
            console.error('Checkout tracking error:', error);
          }
        });
      });
    }
  };

  // ==========================================================================
  // Lazy Loading Images
  // ==========================================================================

  const LazyImages = {
    init() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
          observer.observe(img);
        });
      }
    }
  };

  // ==========================================================================
  // Announcement Bar Dismiss
  // ==========================================================================

  const AnnouncementBar = {
    init() {
      const bar = document.querySelector('.announcement-bar');
      const dismiss = bar?.querySelector('.announcement-bar__dismiss');

      if (!dismiss) return;

      dismiss.addEventListener('click', () => {
        bar.style.display = 'none';
        sessionStorage.setItem('announcement_dismissed', 'true');
      });

      // Check if already dismissed
      if (sessionStorage.getItem('announcement_dismissed')) {
        bar.style.display = 'none';
      }
    }
  };

  // ==========================================================================
  // Product Card Savings Calculator
  // ==========================================================================

  const ProductSavings = {
    init() {
      document.querySelectorAll('[data-bundle-savings]').forEach(el => {
        const price = parseFloat(el.dataset.price);
        const comparePrice = parseFloat(el.dataset.comparePrice);
        const quantity = parseInt(el.dataset.quantity) || 1;

        if (comparePrice && comparePrice > price) {
          const savings = Math.round((1 - price / comparePrice) * 100);
          const perUnit = price / quantity;

          const savingsEl = el.querySelector('.product-card__subtitle');
          if (savingsEl) {
            savingsEl.textContent = `Save ${savings}% vs singles`;
          }
        }
      });
    }
  };

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  // ==========================================================================
  // Shelzy's Analytics Tracking
  // Pushes events to dataLayer for GTM/GA4 and handles Facebook Pixel
  // ==========================================================================

  const ShelzysAnalytics = {
    init() {
      // Initialize dataLayer if not present
      window.dataLayer = window.dataLayer || [];

      // Bind all data-shelzys attribute handlers
      this.bindTrackingAttributes();

      // Listen for cart events
      this.bindCartEvents();

      // Track page view
      this.trackPageView();
    },

    // Push event to dataLayer (GTM/GA4)
    push(eventName, eventData = {}) {
      window.dataLayer.push({
        event: eventName,
        shelzys_event: true,
        timestamp: new Date().toISOString(),
        ...eventData
      });

      // Also fire to console in dev mode
      if (window.ShelzysConfig?.debug) {
        console.log('[Shelzys Analytics]', eventName, eventData);
      }
    },

    // Track Facebook Pixel events if available
    trackFB(eventName, data = {}) {
      if (typeof fbq === 'function') {
        fbq('track', eventName, data);
      }
    },

    // Bind click handlers for data-shelzys attributes
    bindTrackingAttributes() {
      // Add to Cart buttons
      document.querySelectorAll('[data-shelzys="add-to-cart"]').forEach(el => {
        el.addEventListener('click', () => {
          this.push('shelzys_add_to_cart_click', {
            button_location: el.dataset.location || 'unknown'
          });
        });
      });

      // Checkout buttons
      document.querySelectorAll('[data-shelzys="begin-checkout"]').forEach(el => {
        el.addEventListener('click', () => {
          this.push('shelzys_begin_checkout_click');
        });
      });

      // CTA buttons (hero, use-cases, etc.)
      document.querySelectorAll('[data-shelzys="cta"]').forEach(el => {
        el.addEventListener('click', () => {
          this.push('shelzys_cta_click', {
            cta_text: el.textContent.trim(),
            cta_href: el.href || '',
            cta_type: el.dataset.ctaType || 'general'
          });
        });
      });

      // Quote form submissions
      document.querySelectorAll('[data-shelzys="quote-form"]').forEach(form => {
        form.addEventListener('submit', () => {
          this.push('shelzys_quote_form_submit', {
            form_type: form.dataset.formType || 'general'
          });
          this.trackFB('Lead', { content_name: form.dataset.formType || 'quote' });
        });
      });

      // Email signup forms
      document.querySelectorAll('[data-shelzys="email-signup"]').forEach(form => {
        form.addEventListener('submit', () => {
          this.push('shelzys_email_signup', {
            form_location: form.dataset.location || 'unknown'
          });
          this.trackFB('CompleteRegistration', { content_name: 'email_signup' });
        });
      });

      // Product personalization interactions
      document.querySelectorAll('[data-shelzys="personalization-field"]').forEach(field => {
        field.addEventListener('change', debounce(() => {
          this.push('shelzys_personalization_updated', {
            field_name: field.name || field.id,
            field_type: field.type || field.tagName.toLowerCase()
          });
        }, 500));
      });

      // Upsell clicks
      document.querySelectorAll('[data-shelzys="upsell-click"]').forEach(el => {
        el.addEventListener('click', () => {
          this.push('shelzys_upsell_click', {
            upsell_product: el.dataset.productTitle || '',
            upsell_location: el.dataset.location || 'cart'
          });
        });
      });
    },

    // Bind to custom cart events
    bindCartEvents() {
      // Item added to cart
      document.addEventListener('cart:item-added', (e) => {
        const item = e.detail;
        this.push('shelzys_add_to_cart', {
          currency: 'USD',
          value: item.price / 100,
          items: [{
            item_id: item.variant_id,
            item_name: item.title,
            price: item.price / 100,
            quantity: item.quantity
          }]
        });

        this.trackFB('AddToCart', {
          content_ids: [item.variant_id],
          content_name: item.title,
          content_type: 'product',
          value: item.price / 100,
          currency: 'USD'
        });
      });

      // Checkout started
      document.addEventListener('cart:checkout-started', (e) => {
        const cart = e.detail;
        this.push('shelzys_begin_checkout', {
          currency: 'USD',
          value: cart.total_price / 100,
          items: cart.items.map(item => ({
            item_id: item.variant_id,
            item_name: item.title,
            price: item.price / 100,
            quantity: item.quantity
          }))
        });

        this.trackFB('InitiateCheckout', {
          content_ids: cart.items.map(i => i.variant_id),
          content_type: 'product',
          num_items: cart.item_count,
          value: cart.total_price / 100,
          currency: 'USD'
        });
      });
    },

    // Track page view
    trackPageView() {
      const pageType = document.body.dataset.pageType || 'unknown';
      const pageTitle = document.title;

      this.push('shelzys_page_view', {
        page_type: pageType,
        page_title: pageTitle,
        page_path: window.location.pathname
      });

      // Track product view specifically
      if (pageType === 'product' && window.ShelzysConfig?.product) {
        const product = window.ShelzysConfig.product;
        this.push('shelzys_view_item', {
          currency: 'USD',
          value: product.price / 100,
          items: [{
            item_id: product.id,
            item_name: product.title,
            price: product.price / 100
          }]
        });

        this.trackFB('ViewContent', {
          content_ids: [product.id],
          content_name: product.title,
          content_type: 'product',
          value: product.price / 100,
          currency: 'USD'
        });
      }
    }
  };

  // ==========================================================================
  // Initialize Everything
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    EmailPopup.init();
    CartDrawer.init();
    AddToCart.init();
    MobileNav.init();
    CheckoutTracking.init();
    LazyImages.init();
    AnnouncementBar.init();
    ProductSavings.init();
    SmoothScroll.init();
    ShelzysAnalytics.init();
  });

})();
