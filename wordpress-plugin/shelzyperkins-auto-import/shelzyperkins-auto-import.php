<?php
/**
 * Plugin Name: ShelzyPerkins Content Importer
 * Plugin URI: https://shelzyperkins.com
 * Description: One-click importer for all ShelzyPerkins.com content (pages, posts, menus, settings). Upload, activate, click "Import Now", and you're done!
 * Version: 1.0.0
 * Author: Shelzy's Designs
 * Author URI: https://shelzyperkins.com
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class
 */
class ShelzyPerkins_Importer {

    private $imported = false;

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_post_shelzyperkins_import', array($this, 'handle_import'));
    }

    /**
     * Add admin menu page
     */
    public function add_admin_menu() {
        add_menu_page(
            'ShelzyPerkins Importer',
            'Import Content',
            'manage_options',
            'shelzyperkins-importer',
            array($this, 'admin_page'),
            'dashicons-download',
            30
        );
    }

    /**
     * Admin page HTML
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>🚀 ShelzyPerkins Content Importer</h1>

            <?php if (isset($_GET['imported']) && $_GET['imported'] == 'success'): ?>
                <div class="notice notice-success">
                    <h2>✅ Import Complete!</h2>
                    <p><strong>Your site is now live and ready!</strong></p>
                    <p>Imported:</p>
                    <ul style="list-style: disc; margin-left: 20px;">
                        <li>✅ 4 Pages (About, Contact, Privacy Policy, Affiliate Disclosure)</li>
                        <li>✅ 6 Blog Posts (with affiliate links)</li>
                        <li>✅ Categories and Tags</li>
                        <li>✅ Navigation Menus</li>
                        <li>✅ Permalink Settings</li>
                    </ul>
                    <p><a href="<?php echo home_url(); ?>" class="button button-primary" target="_blank">View Your Site</a></p>
                    <p><em>You can now deactivate and delete this plugin. It's no longer needed!</em></p>
                </div>
            <?php endif; ?>

            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>📦 What Will Be Imported</h2>
                <ul style="list-style: disc; margin-left: 20px; line-height: 2;">
                    <li><strong>4 Essential Pages:</strong> About, Contact, Privacy Policy, Affiliate Disclosure</li>
                    <li><strong>6 Blog Posts:</strong> Beauty, Organization, Home Office, Travel, Fitness, Dog Mom</li>
                    <li><strong>Categories:</strong> Deals, Beauty, Home & Organization, Travel, Fitness, Pets</li>
                    <li><strong>Navigation Menus:</strong> Primary menu and Footer menu</li>
                    <li><strong>Settings:</strong> Permalinks, site tagline, discussion settings</li>
                </ul>

                <hr>

                <h2>⚙️ Import Process</h2>
                <ol style="line-height: 2;">
                    <li>Click the "Import Now" button below</li>
                    <li>Wait 10-20 seconds for import to complete</li>
                    <li>See success message with link to view your site</li>
                    <li>Deactivate and delete this plugin</li>
                </ol>

                <hr>

                <h2>⚠️ Important Notes</h2>
                <ul style="line-style: disc; margin-left: 20px; line-height: 1.8;">
                    <li>✅ Safe to run multiple times (won't create duplicates)</li>
                    <li>✅ Existing content will NOT be deleted</li>
                    <li>✅ Your affiliate tag (shelzysdesigns-20) is already in all links</li>
                    <li>⚠️ Make sure the <strong>ShelzyPerkins theme</strong> is activated first!</li>
                </ul>

                <hr style="margin: 30px 0;">

                <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" onsubmit="return confirm('Ready to import all content? This will take 10-20 seconds.');">
                    <input type="hidden" name="action" value="shelzyperkins_import">
                    <?php wp_nonce_field('shelzyperkins_import_nonce'); ?>
                    <p>
                        <button type="submit" class="button button-primary button-hero" style="font-size: 18px; padding: 15px 40px;">
                            🚀 Import Now
                        </button>
                    </p>
                </form>
            </div>

            <div class="card" style="max-width: 800px; margin-top: 20px; background: #f0f0f0;">
                <h3>📖 After Import: Next Steps</h3>
                <ol style="line-height: 2;">
                    <li>Add featured images to blog posts (optional but recommended)</li>
                    <li>Install <strong>Rank Math SEO</strong> plugin</li>
                    <li>Install <strong>LiteSpeed Cache</strong> or <strong>WP Super Cache</strong></li>
                    <li>Set up Google Analytics</li>
                    <li>Start promoting on Pinterest!</li>
                </ol>
                <p><a href="<?php echo plugins_url('DEPLOYMENT-GUIDE.md', dirname(__FILE__)); ?>" target="_blank">📄 View Full Deployment Guide</a></p>
            </div>
        </div>

        <style>
            .card h2 { margin-top: 0; color: #FF6B6B; }
            .card h3 { color: #FF6B6B; }
            .button-hero { background: #FF6B6B !important; border-color: #FF6B6B !important; text-shadow: none !important; }
            .button-hero:hover { background: #FF8E8E !important; border-color: #FF8E8E !important; }
        </style>
        <?php
    }

    /**
     * Handle import process
     */
    public function handle_import() {
        // Check nonce
        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'shelzyperkins_import_nonce')) {
            wp_die('Security check failed');
        }

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('You do not have permission to do this');
        }

        // Run import
        $this->import_all_content();

        // Redirect with success message
        wp_redirect(admin_url('admin.php?page=shelzyperkins-importer&imported=success'));
        exit;
    }

    /**
     * Import all content
     */
    private function import_all_content() {
        $this->import_pages();
        $this->import_blog_posts();
        $this->create_menus();
        $this->configure_settings();
    }

    /**
     * Import pages
     */
    private function import_pages() {
        $pages = $this->get_pages_content();

        foreach ($pages as $slug => $page_data) {
            // Check if page already exists
            $existing = get_page_by_path($slug);
            if ($existing) {
                continue; // Skip if exists
            }

            // Create page
            wp_insert_post(array(
                'post_title'    => $page_data['title'],
                'post_content'  => $page_data['content'],
                'post_status'   => 'publish',
                'post_type'     => 'page',
                'post_name'     => $slug,
            ));
        }
    }

    /**
     * Import blog posts
     */
    private function import_blog_posts() {
        // Create categories first
        $categories = array(
            'Deals' => 'Amazing Amazon deals and product finds',
            'Beauty' => 'Beauty products and skincare recommendations',
            'Home & Organization' => 'Organization solutions and home products',
            'Travel' => 'Travel essentials and packing guides',
            'Fitness & Wellness' => 'Fitness equipment and wellness products',
            'Pets' => 'Pet products and dog mom essentials',
        );

        $category_ids = array();
        foreach ($categories as $cat_name => $cat_desc) {
            $existing = get_term_by('name', $cat_name, 'category');
            if (!$existing) {
                $result = wp_insert_term($cat_name, 'category', array('description' => $cat_desc));
                if (!is_wp_error($result)) {
                    $category_ids[$cat_name] = $result['term_id'];
                }
            } else {
                $category_ids[$cat_name] = $existing->term_id;
            }
        }

        // Get blog posts
        $posts = $this->get_blog_posts_content();

        foreach ($posts as $post_data) {
            // Check if post already exists
            $existing = get_page_by_title($post_data['title'], OBJECT, 'post');
            if ($existing) {
                continue; // Skip if exists
            }

            // Get category IDs for this post
            $post_categories = array();
            foreach ($post_data['categories'] as $cat_name) {
                if (isset($category_ids[$cat_name])) {
                    $post_categories[] = $category_ids[$cat_name];
                }
            }

            // Create post
            $post_id = wp_insert_post(array(
                'post_title'    => $post_data['title'],
                'post_content'  => $post_data['content'],
                'post_status'   => 'publish',
                'post_type'     => 'post',
                'post_category' => $post_categories,
                'tags_input'    => $post_data['tags'],
            ));
        }
    }

    /**
     * Create navigation menus
     */
    private function create_menus() {
        // Create primary menu
        $primary_menu = wp_get_nav_menu_object('Primary Menu');
        if (!$primary_menu) {
            $primary_menu_id = wp_create_nav_menu('Primary Menu');

            // Add Home
            wp_update_nav_menu_item($primary_menu_id, 0, array(
                'menu-item-title' => 'Home',
                'menu-item-url' => home_url('/'),
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom',
            ));

            // Add Blog
            wp_update_nav_menu_item($primary_menu_id, 0, array(
                'menu-item-title' => 'Blog',
                'menu-item-url' => home_url('/blog'),
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom',
            ));

            // Add pages
            $pages_to_add = array('About', 'Contact');
            foreach ($pages_to_add as $page_title) {
                $page = get_page_by_title($page_title);
                if ($page) {
                    wp_update_nav_menu_item($primary_menu_id, 0, array(
                        'menu-item-object-id' => $page->ID,
                        'menu-item-object' => 'page',
                        'menu-item-type' => 'post_type',
                        'menu-item-status' => 'publish',
                    ));
                }
            }

            // Assign to primary location
            $locations = get_theme_mod('nav_menu_locations');
            $locations['primary'] = $primary_menu_id;
            set_theme_mod('nav_menu_locations', $locations);
        }

        // Create footer menu
        $footer_menu = wp_get_nav_menu_object('Footer Menu');
        if (!$footer_menu) {
            $footer_menu_id = wp_create_nav_menu('Footer Menu');

            $footer_pages = array('Privacy Policy', 'Affiliate Disclosure');
            foreach ($footer_pages as $page_title) {
                $page = get_page_by_title($page_title);
                if ($page) {
                    wp_update_nav_menu_item($footer_menu_id, 0, array(
                        'menu-item-object-id' => $page->ID,
                        'menu-item-object' => 'page',
                        'menu-item-type' => 'post_type',
                        'menu-item-status' => 'publish',
                    ));
                }
            }

            // Assign to footer location
            $locations = get_theme_mod('nav_menu_locations');
            $locations['footer'] = $footer_menu_id;
            set_theme_mod('nav_menu_locations', $locations);
        }
    }

    /**
     * Configure WordPress settings
     */
    private function configure_settings() {
        // Set permalinks to post name
        update_option('permalink_structure', '/%postname%/');
        flush_rewrite_rules();

        // Set site tagline
        update_option('blogdescription', 'Amazon Deals & Product Reviews That Save You Money');

        // Set discussion settings
        update_option('comment_moderation', '1');
        update_option('comment_previously_approved', '1');

        // Set posts per page
        update_option('posts_per_page', 10);
    }

    /**
     * Get pages content (embedded in plugin)
     */
    private function get_pages_content() {
        return array(
            'about' => array(
                'title' => 'About',
                'content' => file_get_contents(dirname(__FILE__) . '/content/about.txt'),
            ),
            'contact' => array(
                'title' => 'Contact',
                'content' => file_get_contents(dirname(__FILE__) . '/content/contact.txt'),
            ),
            'privacy-policy' => array(
                'title' => 'Privacy Policy',
                'content' => file_get_contents(dirname(__FILE__) . '/content/privacy-policy.txt'),
            ),
            'affiliate-disclosure' => array(
                'title' => 'Affiliate Disclosure',
                'content' => file_get_contents(dirname(__FILE__) . '/content/affiliate-disclosure.txt'),
            ),
        );
    }

    /**
     * Get blog posts content (embedded in plugin)
     */
    private function get_blog_posts_content() {
        return array(
            array(
                'title' => '12 Amazon Beauty Must-Haves Under $30 (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-beauty.txt'),
                'categories' => array('Beauty', 'Deals'),
                'tags' => array('amazon beauty', 'skincare', 'beauty tools', 'affordable beauty'),
            ),
            array(
                'title' => '15 Viral Amazon Organization Finds That Actually Work (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-organization.txt'),
                'categories' => array('Home & Organization', 'Deals'),
                'tags' => array('organization', 'amazon finds', 'storage solutions', 'home organization'),
            ),
            array(
                'title' => '15 Work From Home Office Must-Haves on Amazon (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-home-office.txt'),
                'categories' => array('Home & Organization', 'Deals'),
                'tags' => array('home office', 'work from home', 'productivity', 'office essentials'),
            ),
            array(
                'title' => '20 Amazon Travel Essentials for Your Next Trip (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-travel.txt'),
                'categories' => array('Travel', 'Deals'),
                'tags' => array('travel essentials', 'packing', 'vacation', 'travel tips'),
            ),
            array(
                'title' => '15 Amazon Fitness & Wellness Finds to Level Up Your Routine (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-fitness.txt'),
                'categories' => array('Fitness & Wellness', 'Deals'),
                'tags' => array('fitness', 'wellness', 'workout essentials', 'health'),
            ),
            array(
                'title' => '15 Amazon Dog Mom Essentials Your Pup Will Love (2025)',
                'content' => file_get_contents(dirname(__FILE__) . '/content/post-dog-mom.txt'),
                'categories' => array('Pets', 'Deals'),
                'tags' => array('dog mom', 'pet essentials', 'dog products', 'pet lover gifts'),
            ),
        );
    }
}

// Initialize plugin
new ShelzyPerkins_Importer();
