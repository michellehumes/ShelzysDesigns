<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="site-container">
    <header class="site-header">
        <div class="header-container">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo">
                <?php bloginfo('name'); ?>
            </a>

            <nav class="main-navigation" role="navigation" aria-label="<?php esc_attr_e('Primary Navigation', 'shelzyperkins'); ?>">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_class'     => 'primary-menu',
                    'container'      => false,
                    'fallback_cb'    => 'shelzyperkins_fallback_menu',
                ));
                ?>
            </nav>
        </div>
    </header>

    <main class="site-content" role="main">
<?php

/**
 * Fallback menu if no menu is set
 */
function shelzyperkins_fallback_menu() {
    echo '<ul class="primary-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">Home</a></li>';
    echo '<li><a href="' . esc_url(home_url('/blog')) . '">Blog</a></li>';
    echo '<li><a href="' . esc_url(home_url('/about')) . '">About</a></li>';
    echo '<li><a href="' . esc_url(home_url('/contact')) . '">Contact</a></li>';
    echo '</ul>';
}
?>
