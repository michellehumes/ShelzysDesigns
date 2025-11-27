const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getThemeId() {
  const response = await shopifyRequest('GET', '/themes.json');
  const mainTheme = response.themes.find(t => t.role === 'main');
  return mainTheme.id;
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// Fonts & Colors Section
const fontsColorsSection = `{% comment %}
  Shelzys Fonts & Colors Guide
  Use this section on a dedicated page template, e.g. page.fonts-colors.json
{% endcomment %}

<section class="section section--fonts-colors">
  <div class="page-width">
    <header class="section-header text-center">
      <h1 class="h1">{{ section.settings.heading }}</h1>
      {% if section.settings.subheading != blank %}
        <p class="shelzys-home-subheading">{{ section.settings.subheading }}</p>
      {% endif %}
    </header>

    {% if section.settings.intro_text != blank %}
      <div class="rte text-center" style="max-width: 640px; margin: 0 auto 32px;">
        {{ section.settings.intro_text }}
      </div>
    {% endif %}

    {%- if section.blocks.size > 0 -%}
      <div class="grid grid--uniform shelzys-feature-grid shelzys-fonts-grid">
        {%- for block in section.blocks -%}
          {%- if block.type == 'font_sample' -%}
          <div class="grid__item medium-up--one-third small--one-half" {{ block.shopify_attributes }}>
            <article class="shelzys-feature-card">
              {% if block.settings.label != blank %}
                <h3 class="shelzys-feature-card__title">{{ block.settings.label }}</h3>
              {% endif %}
              {% if block.settings.sample_text != blank %}
                <p class="shelzys-font-preview" style="font-family: {{ block.settings.font_family | escape }}; font-size: 2rem;">
                  {{ block.settings.sample_text }}
                </p>
              {% endif %}
              {% if block.settings.description != blank %}
                <p class="shelzys-font-description">{{ block.settings.description }}</p>
              {% endif %}
            </article>
          </div>
          {%- endif -%}
        {%- endfor -%}
      </div>
    {%- endif -%}

    {% if section.settings.colors_heading != blank %}
      <header class="section-header text-center" style="margin-top: 48px;">
        <h2 class="h2">{{ section.settings.colors_heading }}</h2>
        {% if section.settings.colors_subheading != blank %}
          <p class="shelzys-home-subheading">{{ section.settings.colors_subheading }}</p>
        {% endif %}
      </header>
    {% endif %}

    {%- assign color_blocks = section.blocks | where: 'type', 'color_swatch' -%}
    {%- if color_blocks.size > 0 -%}
      <div class="grid grid--uniform shelzys-feature-grid shelzys-colors-grid">
        {%- for block in color_blocks -%}
          <div class="grid__item medium-up--one-fourth small--one-half" {{ block.shopify_attributes }}>
            <article class="shelzys-feature-card">
              <div class="shelzys-color-swatch"
                   style="width: 100%; height: 72px; border-radius: 14px; background: {{ block.settings.color_value }};">
              </div>
              {% if block.settings.name != blank %}
                <p class="shelzys-color-name" style="margin-top: 10px; font-weight: 600;">
                  {{ block.settings.name }}
                </p>
              {% endif %}
              {% if block.settings.color_description != blank %}
                <p class="shelzys-color-description">{{ block.settings.color_description }}</p>
              {% endif %}
            </article>
          </div>
        {%- endfor -%}
      </div>
    {%- endif -%}

    {% if section.settings.closing_text != blank %}
      <div class="rte text-center" style="max-width: 640px; margin: 40px auto 0;">
        {{ section.settings.closing_text }}
      </div>
    {% endif %}
  </div>
</section>

<style>
.section--fonts-colors {
  padding: 60px 0;
  background: var(--sz-cream, #FFF9F3);
}

.shelzys-fonts-grid,
.shelzys-colors-grid {
  margin-top: 30px;
}

.shelzys-feature-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  height: 100%;
}

.shelzys-feature-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
}

.shelzys-font-preview {
  color: var(--sz-coral, #FF8A80);
  margin-bottom: 12px;
}

.shelzys-font-description,
.shelzys-color-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.shelzys-color-swatch {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.shelzys-color-name {
  color: #2C2C2C;
}
</style>

{% schema %}
{
  "name": "Fonts & Colors Guide",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Fonts & Colors Guide"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "See how each font and color actually looks so you can build bottles that match your weekend, your photos, and your personality."
    },
    {
      "type": "richtext",
      "id": "intro_text",
      "label": "Intro text",
      "default": "<p>Picking a font and color is half the fun. Use this guide to preview our options so your bottles feel as intentional as the rest of your planning.</p>"
    },
    {
      "type": "text",
      "id": "colors_heading",
      "label": "Colors heading",
      "default": "Bottle Colors"
    },
    {
      "type": "textarea",
      "id": "colors_subheading",
      "label": "Colors subheading",
      "default": "Mix and match or keep everything consistent — either way, your bottles will look pulled-together in every photo."
    },
    {
      "type": "richtext",
      "id": "closing_text",
      "label": "Closing text",
      "default": "<p>Not sure what to choose? Start with one font and one color for your entire set. It always looks intentional and elevated.</p>"
    }
  ],
  "blocks": [
    {
      "type": "font_sample",
      "name": "Font sample",
      "settings": [
        {
          "type": "text",
          "id": "label",
          "label": "Font name/label",
          "default": "Villa Script"
        },
        {
          "type": "text",
          "id": "font_family",
          "label": "CSS font-family value",
          "default": "'Georgia', serif"
        },
        {
          "type": "text",
          "id": "sample_text",
          "label": "Sample text",
          "default": "Alexandra"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Description",
          "default": "Soft, romantic script that feels perfect for bridal and bachelorette bottles."
        }
      ]
    },
    {
      "type": "color_swatch",
      "name": "Color swatch",
      "settings": [
        {
          "type": "text",
          "id": "name",
          "label": "Color name",
          "default": "Pool Blue"
        },
        {
          "type": "color",
          "id": "color_value",
          "label": "Color value",
          "default": "#4EC7E8"
        },
        {
          "type": "textarea",
          "id": "color_description",
          "label": "Description",
          "default": "Feels like a sunny pool day — perfect for bachelorettes and destination weddings."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Fonts & Colors Guide",
      "blocks": [
        {
          "type": "font_sample",
          "settings": {
            "label": "Villa Script",
            "font_family": "'Georgia', serif",
            "sample_text": "Alexandra",
            "description": "Soft, romantic script that feels perfect for bridal and bachelorette bottles."
          }
        },
        {
          "type": "font_sample",
          "settings": {
            "label": "Editorial Serif",
            "font_family": "'Times New Roman', serif",
            "sample_text": "Alexandra",
            "description": "Polished and timeless — great for wedding day and corporate bottles."
          }
        },
        {
          "type": "font_sample",
          "settings": {
            "label": "Bold Caps",
            "font_family": "'Helvetica Neue', sans-serif",
            "sample_text": "ALEXANDRA",
            "description": "Clean and modern, perfect for teams, studios, and everyday bottles."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Ivory",
            "color_value": "#FFF9F3",
            "color_description": "Soft and neutral, works with every wedding palette."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Pool Blue",
            "color_value": "#4EC7E8",
            "color_description": "Feels like a sunny pool day — perfect for bachelorettes and destination weddings."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Blush",
            "color_value": "#FFCDD5",
            "color_description": "A soft pink that photographs beautifully in bridal suites and showers."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Coral",
            "color_value": "#FF8A80",
            "color_description": "Warm and vibrant — perfect for bachelorettes and summer birthdays."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Sand",
            "color_value": "#FFD9A0",
            "color_description": "Golden and beachy — ideal for destination weddings and weekend getaways."
          }
        },
        {
          "type": "color_swatch",
          "settings": {
            "name": "Lilac",
            "color_value": "#F3C8FF",
            "color_description": "Soft purple that adds a playful, feminine touch."
          }
        }
      ]
    }
  ]
}
{% endschema %}`;

// Page template JSON for fonts-colors page
const fontsColorsTemplate = `{
  "sections": {
    "main": {
      "type": "shelzys-fonts-colors",
      "blocks": {
        "font_1": {
          "type": "font_sample",
          "settings": {
            "label": "Villa Script",
            "font_family": "'Georgia', serif",
            "sample_text": "Alexandra",
            "description": "Soft, romantic script that feels perfect for bridal and bachelorette bottles."
          }
        },
        "font_2": {
          "type": "font_sample",
          "settings": {
            "label": "Editorial Serif",
            "font_family": "'Times New Roman', serif",
            "sample_text": "Alexandra",
            "description": "Polished and timeless — great for wedding day and corporate bottles."
          }
        },
        "font_3": {
          "type": "font_sample",
          "settings": {
            "label": "Bold Caps",
            "font_family": "'Helvetica Neue', sans-serif",
            "sample_text": "ALEXANDRA",
            "description": "Clean and modern, perfect for teams, studios, and everyday bottles."
          }
        },
        "color_1": {
          "type": "color_swatch",
          "settings": {
            "name": "Ivory",
            "color_value": "#FFF9F3",
            "color_description": "Soft and neutral, works with every wedding palette."
          }
        },
        "color_2": {
          "type": "color_swatch",
          "settings": {
            "name": "Pool Blue",
            "color_value": "#4EC7E8",
            "color_description": "Feels like a sunny pool day — perfect for bachelorettes and destination weddings."
          }
        },
        "color_3": {
          "type": "color_swatch",
          "settings": {
            "name": "Blush",
            "color_value": "#FFCDD5",
            "color_description": "A soft pink that photographs beautifully in bridal suites and showers."
          }
        },
        "color_4": {
          "type": "color_swatch",
          "settings": {
            "name": "Coral",
            "color_value": "#FF8A80",
            "color_description": "Warm and vibrant — perfect for bachelorettes and summer birthdays."
          }
        },
        "color_5": {
          "type": "color_swatch",
          "settings": {
            "name": "Sand",
            "color_value": "#FFD9A0",
            "color_description": "Golden and beachy — ideal for destination weddings and weekend getaways."
          }
        },
        "color_6": {
          "type": "color_swatch",
          "settings": {
            "name": "Lilac",
            "color_value": "#F3C8FF",
            "color_description": "Soft purple that adds a playful, feminine touch."
          }
        }
      },
      "block_order": ["font_1", "font_2", "font_3", "color_1", "color_2", "color_3", "color_4", "color_5", "color_6"],
      "settings": {
        "heading": "Fonts & Colors Guide",
        "subheading": "See how each font and color actually looks so you can build bottles that match your weekend, your photos, and your personality.",
        "intro_text": "<p>Picking a font and color is half the fun. Use this guide to preview our options so your bottles feel as intentional as the rest of your planning.</p>",
        "colors_heading": "Bottle Colors",
        "colors_subheading": "Mix and match or keep everything consistent — either way, your bottles will look pulled-together in every photo.",
        "closing_text": "<p>Not sure what to choose? Start with one font and one color for your entire set. It always looks intentional and elevated.</p><p><a href=\\"/collections/all-water-bottles\\" class=\\"btn\\">Start Personalizing</a></p>"
      }
    }
  },
  "order": ["main"]
}`;

// Personalization Guide Section
const personalizationSection = `{% comment %}
  Shelzys Personalization Guide
{% endcomment %}

<section class="section section--personalization">
  <div class="page-width">
    <header class="section-header text-center">
      <h1 class="h1">{{ section.settings.heading }}</h1>
      {% if section.settings.subheading != blank %}
        <p class="shelzys-home-subheading">{{ section.settings.subheading }}</p>
      {% endif %}
    </header>

    {% if section.settings.intro_text != blank %}
      <div class="rte text-center" style="max-width: 680px; margin: 0 auto 32px;">
        {{ section.settings.intro_text }}
      </div>
    {% endif %}

    <div class="grid grid--uniform shelzys-steps-grid">
      {% for block in section.blocks %}
        {% if block.type == 'step' %}
          <div class="grid__item medium-up--one-half" {{ block.shopify_attributes }}>
            <article class="shelzys-feature-card shelzys-step-card">
              {% if block.settings.step_label != blank %}
                <p class="shelzys-step-label">{{ block.settings.step_label }}</p>
              {% endif %}
              {% if block.settings.title != blank %}
                <h3 class="shelzys-feature-card__title">{{ block.settings.title }}</h3>
              {% endif %}
              {% if block.settings.text != blank %}
                <p>{{ block.settings.text }}</p>
              {% endif %}
            </article>
          </div>
        {% endif %}
      {% endfor %}
    </div>

    {% assign faq_blocks = section.blocks | where: 'type', 'faq' %}
    {% if faq_blocks.size > 0 %}
      <div class="shelzys-faq-wrapper" style="margin-top: 48px;">
        <header class="section-header text-center">
          <h2 class="h2">{{ section.settings.faq_heading }}</h2>
          {% if section.settings.faq_subheading != blank %}
            <p class="shelzys-home-subheading">{{ section.settings.faq_subheading }}</p>
          {% endif %}
        </header>

        <div class="shelzys-faq-list">
          {% for block in faq_blocks %}
            <details class="shelzys-faq-item" {{ block.shopify_attributes }}>
              <summary class="shelzys-faq-question">
                {{ block.settings.question }}
              </summary>
              <div class="shelzys-faq-answer rte">
                {{ block.settings.answer }}
              </div>
            </details>
          {% endfor %}
        </div>
      </div>
    {% endif %}

    {% if section.settings.closing_text != blank %}
      <div class="rte text-center" style="max-width: 640px; margin: 40px auto 0;">
        {{ section.settings.closing_text }}
      </div>
    {% endif %}
  </div>
</section>

<style>
.section--personalization {
  padding: 60px 0;
  background: var(--sz-cream, #FFF9F3);
}

.shelzys-steps-grid {
  margin-top: 30px;
}

.shelzys-step-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}

.shelzys-step-label {
  display: inline-block;
  background: linear-gradient(135deg, var(--sz-coral, #FF8A80), var(--sz-pool, #4EC7E8));
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shelzys-faq-list {
  max-width: 800px;
  margin: 30px auto 0;
}

.shelzys-faq-item {
  background: white;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  overflow: hidden;
}

.shelzys-faq-question {
  padding: 20px 24px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
}

.shelzys-faq-question::-webkit-details-marker {
  display: none;
}

.shelzys-faq-question::after {
  content: '+';
  font-size: 1.5rem;
  color: var(--sz-coral, #FF8A80);
  transition: transform 0.2s;
}

.shelzys-faq-item[open] .shelzys-faq-question::after {
  transform: rotate(45deg);
}

.shelzys-faq-answer {
  padding: 0 24px 20px;
  color: #555;
  line-height: 1.6;
}
</style>

{% schema %}
{
  "name": "Personalization Guide",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "How Personalization Works"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Every bottle is made to order with your names, colors, and fonts — here's exactly what happens from click to delivery."
    },
    {
      "type": "richtext",
      "id": "intro_text",
      "label": "Intro text",
      "default": "<p>You're not pulling a bottle off a shelf. We print your exact names and details using permanent sublimation, so your bottles feel as personal as the weekend you're planning.</p>"
    },
    {
      "type": "text",
      "id": "faq_heading",
      "label": "FAQ heading",
      "default": "Personalization FAQs"
    },
    {
      "type": "textarea",
      "id": "faq_subheading",
      "label": "FAQ subheading",
      "default": "Still wondering how timing, changes, or custom ideas work? Start here."
    },
    {
      "type": "richtext",
      "id": "closing_text",
      "label": "Closing text",
      "default": "<p>Have a specific timeline or custom idea in mind? <a href=\\"/pages/contact\\">Reach out</a> and we'll help you plan it out.</p>"
    }
  ],
  "blocks": [
    {
      "type": "step",
      "name": "Step",
      "settings": [
        {
          "type": "text",
          "id": "step_label",
          "label": "Step label",
          "default": "Step 1"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Title",
          "default": "Choose Your Bottle"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Body text",
          "default": "Pick your size, finish, and lid style."
        }
      ]
    },
    {
      "type": "faq",
      "name": "FAQ Item",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question",
          "default": "How long does personalization take?"
        },
        {
          "type": "richtext",
          "id": "answer",
          "label": "Answer",
          "default": "<p>Most orders are made to order in 3–5 business days and ship in 3–7 business days.</p>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Personalization Guide",
      "blocks": [
        {
          "type": "step",
          "settings": {
            "step_label": "Step 1",
            "title": "Choose Your Bottle",
            "text": "Pick your size, finish, and lid style — from sleek everyday bottles to full bridal party bundles."
          }
        },
        {
          "type": "step",
          "settings": {
            "step_label": "Step 2",
            "title": "Add Names & Details",
            "text": "Type in names, roles, dates, or short phrases. We print exactly what you enter, so double-check spelling and capitalization."
          }
        },
        {
          "type": "step",
          "settings": {
            "step_label": "Step 3",
            "title": "Choose Fonts & Colors",
            "text": "Select from our curated font and color options so your bottles match your event vibe and look great in photos."
          }
        },
        {
          "type": "step",
          "settings": {
            "step_label": "Step 4",
            "title": "We Print with Sublimation",
            "text": "Your design is fused into the bottle's coating with permanent sublimation printing — no vinyl, no stickers, no peeling edges."
          }
        },
        {
          "type": "step",
          "settings": {
            "step_label": "Step 5",
            "title": "Timeline & Delivery",
            "text": "Orders ship in 3–7 business days. Most customers receive bottles within about 5–7 business days."
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "Can I change my personalization after ordering?",
            "answer": "<p>We start working on your order quickly. If you need to make a change, email us ASAP with your order number — if we haven't started printing, we'll update your details.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "Do you offer rush orders?",
            "answer": "<p>In many cases, yes. Contact us with your event date and quantity before ordering so we can confirm what's possible.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "Will the print peel or fade?",
            "answer": "<p>No — we use permanent sublimation printing, which infuses the design into the bottle's coating. No vinyl stickers or raised edges to peel.</p>"
          }
        }
      ]
    }
  ]
}
{% endschema %}`;

// Personalization page template
const personalizationTemplate = `{
  "sections": {
    "main": {
      "type": "shelzys-personalization",
      "blocks": {
        "step_1": {
          "type": "step",
          "settings": {
            "step_label": "Step 1",
            "title": "Choose Your Bottle",
            "text": "Pick your size, finish, and lid style — from sleek everyday bottles to full bridal party bundles."
          }
        },
        "step_2": {
          "type": "step",
          "settings": {
            "step_label": "Step 2",
            "title": "Add Names & Details",
            "text": "Type in names, roles, dates, or short phrases. We print exactly what you enter, so double-check spelling and capitalization."
          }
        },
        "step_3": {
          "type": "step",
          "settings": {
            "step_label": "Step 3",
            "title": "Choose Fonts & Colors",
            "text": "Select from our curated font and color options so your bottles match your event vibe and look great in photos."
          }
        },
        "step_4": {
          "type": "step",
          "settings": {
            "step_label": "Step 4",
            "title": "We Print with Sublimation",
            "text": "Your design is fused into the bottle's coating with permanent sublimation printing — no vinyl, no stickers, no peeling edges."
          }
        },
        "step_5": {
          "type": "step",
          "settings": {
            "step_label": "Step 5",
            "title": "Timeline & Delivery",
            "text": "Orders are made to order in 3–5 business days and ship in 3–7 business days. Most customers receive their bottles within about 5–7 business days."
          }
        },
        "faq_1": {
          "type": "faq",
          "settings": {
            "question": "Can I change my personalization after ordering?",
            "answer": "<p>We start working on your order quickly to keep our turnaround fast. If you need to make a change, email us as soon as possible with your order number — if we haven't started printing, we'll update your details.</p>"
          }
        },
        "faq_2": {
          "type": "faq",
          "settings": {
            "question": "Do you offer rush orders?",
            "answer": "<p>In many cases, yes. If you're on a tight timeline, contact us with your event date and quantity before ordering so we can confirm what's possible.</p>"
          }
        },
        "faq_3": {
          "type": "faq",
          "settings": {
            "question": "Will the print peel or fade?",
            "answer": "<p>No — we use permanent sublimation printing, which infuses the design into the bottle's coating. There are no vinyl stickers or raised edges to peel.</p>"
          }
        }
      },
      "block_order": ["step_1", "step_2", "step_3", "step_4", "step_5", "faq_1", "faq_2", "faq_3"],
      "settings": {
        "heading": "How Personalization Works",
        "subheading": "Every bottle is made to order with your names, colors, and fonts — here's exactly what happens from click to delivery.",
        "intro_text": "<p>You're not pulling a bottle off a shelf. We print your exact names and details using permanent sublimation, so your bottles feel as personal as the weekend you're planning.</p>",
        "faq_heading": "Personalization FAQs",
        "faq_subheading": "Still wondering how timing, changes, or custom ideas work? Start here.",
        "closing_text": "<p>Have a specific timeline or custom idea in mind? <a href=\\"/pages/contact\\" class=\\"btn\\">Reach out</a> and we'll help you plan it out.</p>"
      }
    }
  },
  "order": ["main"]
}`;

async function main() {
  console.log('================================================================');
  console.log('  DEPLOYING FONTS/COLORS & PERSONALIZATION GUIDES');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Create the section file
    await createAsset(themeId, 'sections/shelzys-fonts-colors.liquid', fontsColorsSection);
    console.log('✓ Created sections/shelzys-fonts-colors.liquid');

    // Create page template
    await createAsset(themeId, 'templates/page.fonts-colors.json', fontsColorsTemplate);
    console.log('✓ Created templates/page.fonts-colors.json');

    // Create or update the fonts-colors page
    const pagesResponse = await shopifyRequest('GET', '/pages.json?limit=100');
    const pages = pagesResponse.pages || [];
    const existingPage = pages.find(p => p.handle === 'fonts-colors');

    if (existingPage) {
      await shopifyRequest('PUT', `/pages/${existingPage.id}.json`, {
        page: {
          id: existingPage.id,
          template_suffix: 'fonts-colors'
        }
      });
      console.log('✓ Updated fonts-colors page to use new template');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: {
          title: 'Fonts & Colors Guide',
          handle: 'fonts-colors',
          template_suffix: 'fonts-colors',
          published: true
        }
      });
      console.log('✓ Created fonts-colors page');
    }

    // Deploy Personalization Guide
    console.log('\n--- Deploying Personalization Guide ---');

    await createAsset(themeId, 'sections/shelzys-personalization.liquid', personalizationSection);
    console.log('✓ Created sections/shelzys-personalization.liquid');

    await createAsset(themeId, 'templates/page.personalization.json', personalizationTemplate);
    console.log('✓ Created templates/page.personalization.json');

    // Create or update personalization page
    const personalizationPage = pages.find(p => p.handle === 'personalization' || p.handle === 'how-personalization-works');
    if (personalizationPage) {
      await shopifyRequest('PUT', `/pages/${personalizationPage.id}.json`, {
        page: {
          id: personalizationPage.id,
          template_suffix: 'personalization'
        }
      });
      console.log('✓ Updated personalization page to use new template');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: {
          title: 'How Personalization Works',
          handle: 'personalization',
          template_suffix: 'personalization',
          published: true
        }
      });
      console.log('✓ Created personalization page');
    }

    console.log('\n================================================================');
    console.log('  GUIDES DEPLOYED!');
    console.log('================================================================');
    console.log('\nPages created:');
    console.log('  • /pages/fonts-colors - Fonts & Colors Guide');
    console.log('  • /pages/personalization - How Personalization Works');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
