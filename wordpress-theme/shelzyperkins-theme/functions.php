<?php
/**
 * ShelzyPerkins Affiliate Theme Functions
 *
 * @package ShelzyPerkins
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function shelzyperkins_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('automatic-feed-links');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'shelzyperkins'),
        'footer' => __('Footer Menu', 'shelzyperkins'),
    ));

    // Set content width
    if (!isset($content_width)) {
        $content_width = 800;
    }
}
add_action('after_setup_theme', 'shelzyperkins_setup');

/**
 * Enqueue Google Fonts
 */
function shelzyperkins_enqueue_fonts() {
    wp_enqueue_style('shelzyperkins-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap', array(), null);
}
add_action('wp_enqueue_scripts', 'shelzyperkins_enqueue_fonts');

/**
 * Enqueue Scripts and Styles
 */
function shelzyperkins_enqueue_scripts() {
    wp_enqueue_style('shelzyperkins-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'shelzyperkins_enqueue_scripts');

/**
 * =============================================
 * AFFILIATE SHORTCODES
 * =============================================
 */

/**
 * Affiliate Disclosure Shortcode
 * Usage: [affiliate_disclosure]
 */
function shelzyperkins_affiliate_disclosure() {
    $disclosure = '<div class="affiliate-disclosure">';
    $disclosure .= '<p><strong>Affiliate Disclosure:</strong> This post contains affiliate links, which means I may earn a small commission if you make a purchase through these links, at no additional cost to you. I only recommend products I genuinely believe in. Thank you for supporting ShelzyPerkins!</p>';
    $disclosure .= '</div>';
    return $disclosure;
}
add_shortcode('affiliate_disclosure', 'shelzyperkins_affiliate_disclosure');

/**
 * Amazon Button Shortcode
 * Usage: [amazon_button url="https://amazon.com/..." text="Shop Now"]
 */
function shelzyperkins_amazon_button($atts) {
    $atts = shortcode_atts(array(
        'url' => '',
        'text' => 'View on Amazon',
    ), $atts);

    if (empty($atts['url'])) {
        return '';
    }

    // Ensure affiliate tag is included
    $url = shelzyperkins_add_affiliate_tag($atts['url']);

    return sprintf(
        '<a href="%s" class="amazon-button" target="_blank" rel="nofollow noopener">%s</a>',
        esc_url($url),
        esc_html($atts['text'])
    );
}
add_shortcode('amazon_button', 'shelzyperkins_amazon_button');

/**
 * Product Card Shortcode
 * Usage: [product_card title="Product Name" price="$29.99" url="https://amazon.com/..." features="Feature 1, Feature 2, Feature 3"]
 */
function shelzyperkins_product_card($atts) {
    $atts = shortcode_atts(array(
        'title' => '',
        'price' => '',
        'url' => '',
        'features' => '',
        'button_text' => 'Check Price on Amazon',
    ), $atts);

    if (empty($atts['title']) || empty($atts['url'])) {
        return '';
    }

    $url = shelzyperkins_add_affiliate_tag($atts['url']);
    $features_array = !empty($atts['features']) ? explode(',', $atts['features']) : array();

    $output = '<div class="product-card">';
    $output .= sprintf('<h3>%s</h3>', esc_html($atts['title']));

    if (!empty($atts['price'])) {
        $output .= sprintf('<div class="product-price">%s</div>', esc_html($atts['price']));
    }

    if (!empty($features_array)) {
        $output .= '<ul class="product-features">';
        foreach ($features_array as $feature) {
            $output .= sprintf('<li>%s</li>', esc_html(trim($feature)));
        }
        $output .= '</ul>';
    }

    $output .= sprintf(
        '<a href="%s" class="amazon-button" target="_blank" rel="nofollow noopener">%s</a>',
        esc_url($url),
        esc_html($atts['button_text'])
    );

    $output .= '</div>';

    return $output;
}
add_shortcode('product_card', 'shelzyperkins_product_card');

/**
 * Add Amazon Affiliate Tag to URLs
 */
function shelzyperkins_add_affiliate_tag($url) {
    $affiliate_tag = 'shelzysdesigns-20'; // Your Amazon Associates tag

    // Check if URL already has a tag parameter
    if (strpos($url, 'tag=') !== false) {
        return $url;
    }

    // Add tag parameter
    $separator = (strpos($url, '?') !== false) ? '&' : '?';
    return $url . $separator . 'tag=' . $affiliate_tag;
}

/**
 * Automatically add affiliate tag to Amazon links in content
 */
function shelzyperkins_auto_affiliate_links($content) {
    // Only process on single posts
    if (!is_single()) {
        return $content;
    }

    // Pattern to match Amazon links
    $pattern = '/<a\s+(?:[^>]*?\s+)?href=(["\'])(https?:\/\/(?:www\.)?amazon\.com[^"\']*)\1/i';

    // Replace callback
    $content = preg_replace_callback($pattern, function($matches) {
        $url = $matches[2];
        $url = shelzyperkins_add_affiliate_tag($url);
        return '<a href="' . $url . '" target="_blank" rel="nofollow noopener"';
    }, $content);

    return $content;
}
add_filter('the_content', 'shelzyperkins_auto_affiliate_links');

/**
 * =============================================
 * SEO ENHANCEMENTS
 * =============================================
 */

/**
 * Add meta description
 */
function shelzyperkins_add_meta_description() {
    if (is_single() || is_page()) {
        global $post;
        $excerpt = get_the_excerpt($post->ID);
        if (!empty($excerpt)) {
            echo '<meta name="description" content="' . esc_attr(wp_trim_words($excerpt, 30)) . '">' . "\n";
        }
    }
}
add_action('wp_head', 'shelzyperkins_add_meta_description');

/**
 * =============================================
 * EXCERPT CUSTOMIZATION
 * =============================================
 */

/**
 * Custom excerpt length
 */
function shelzyperkins_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'shelzyperkins_excerpt_length');

/**
 * Custom excerpt more text
 */
function shelzyperkins_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'shelzyperkins_excerpt_more');

/**
 * =============================================
 * WIDGET AREAS
 * =============================================
 */

function shelzyperkins_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'shelzyperkins'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar.', 'shelzyperkins'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    register_sidebar(array(
        'name'          => __('Footer', 'shelzyperkins'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in your footer.', 'shelzyperkins'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'shelzyperkins_widgets_init');

/**
 * =============================================
 * CUSTOM POST META
 * =============================================
 */

/**
 * Add custom fields for affiliate posts
 */
function shelzyperkins_add_meta_boxes() {
    add_meta_box(
        'shelzyperkins_affiliate_meta',
        __('Affiliate Post Settings', 'shelzyperkins'),
        'shelzyperkins_affiliate_meta_callback',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'shelzyperkins_add_meta_boxes');

/**
 * Meta box callback
 */
function shelzyperkins_affiliate_meta_callback($post) {
    wp_nonce_field('shelzyperkins_save_meta', 'shelzyperkins_meta_nonce');

    $featured_product = get_post_meta($post->ID, '_featured_product', true);

    echo '<label for="featured_product">';
    echo __('Featured Amazon Product URL:', 'shelzyperkins');
    echo '</label> ';
    echo '<input type="url" id="featured_product" name="featured_product" value="' . esc_attr($featured_product) . '" size="25" style="width: 100%; margin-top: 10px;" />';
}

/**
 * Save meta box data
 */
function shelzyperkins_save_meta($post_id) {
    if (!isset($_POST['shelzyperkins_meta_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['shelzyperkins_meta_nonce'], 'shelzyperkins_save_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['featured_product'])) {
        update_post_meta($post_id, '_featured_product', sanitize_text_field($_POST['featured_product']));
    }
}
add_action('save_post', 'shelzyperkins_save_meta');

/**
 * =============================================
 * PERFORMANCE OPTIMIZATIONS
 * =============================================
 */

/**
 * Remove unnecessary WordPress features
 */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');

/**
 * Disable emojis
 */
function shelzyperkins_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'shelzyperkins_disable_emojis');

/**
 * =============================================
 * AMAZON PRODUCT SEARCH (OPTIONAL)
 * =============================================
 */

/**
 * Helper function to create Amazon search URL
 */
function shelzyperkins_amazon_search_url($keywords) {
    $affiliate_tag = 'shelzysdesigns-20';
    $keywords = urlencode($keywords);
    return "https://www.amazon.com/s?k={$keywords}&tag={$affiliate_tag}";
}

/**
 * Amazon Search Shortcode
 * Usage: [amazon_search keywords="yoga mat" text="Find on Amazon"]
 */
function shelzyperkins_amazon_search($atts) {
    $atts = shortcode_atts(array(
        'keywords' => '',
        'text' => 'Search on Amazon',
    ), $atts);

    if (empty($atts['keywords'])) {
        return '';
    }

    $url = shelzyperkins_amazon_search_url($atts['keywords']);

    return sprintf(
        '<a href="%s" class="amazon-button" target="_blank" rel="nofollow noopener">%s</a>',
        esc_url($url),
        esc_html($atts['text'])
    );
}
add_shortcode('amazon_search', 'shelzyperkins_amazon_search');

/**
 * =============================================
 * ADMIN CUSTOMIZATIONS
 * =============================================
 */

/**
 * Add helpful admin notice about affiliate tag
 */
function shelzyperkins_admin_notice() {
    $screen = get_current_screen();
    if ($screen->id === 'post' || $screen->id === 'page') {
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p><strong>Amazon Affiliate Tag:</strong> Your affiliate tag (shelzysdesigns-20) is automatically added to all Amazon links. Just paste regular Amazon URLs!</p>';
        echo '</div>';
    }
}
add_action('admin_notices', 'shelzyperkins_admin_notice');

/**
 * Add custom admin CSS
 */
function shelzyperkins_admin_css() {
    echo '<style>
        .amazon-button {
            background: #FF6B6B !important;
            border-color: #FF6B6B !important;
        }
    </style>';
}
add_action('admin_head', 'shelzyperkins_admin_css');
