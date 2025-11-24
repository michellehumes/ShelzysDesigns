    </main><!-- .site-content -->

    <footer class="site-footer" role="contentinfo">
        <div class="footer-container">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>

            <?php if (is_active_sidebar('footer-1')) : ?>
                <div class="footer-widgets">
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php endif; ?>

            <nav class="footer-navigation" role="navigation" aria-label="<?php esc_attr_e('Footer Navigation', 'shelzyperkins'); ?>">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'menu_class'     => 'footer-menu',
                    'container'      => false,
                    'fallback_cb'    => false,
                    'depth'          => 1,
                ));
                ?>
            </nav>

            <p class="footer-tagline">
                <small>
                    Amazon Affiliate Deals &amp; Product Reviews |
                    <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a> |
                    <a href="<?php echo esc_url(home_url('/affiliate-disclosure')); ?>">Affiliate Disclosure</a>
                </small>
            </p>
        </div>
    </footer>

</div><!-- .site-container -->

<?php wp_footer(); ?>
</body>
</html>
