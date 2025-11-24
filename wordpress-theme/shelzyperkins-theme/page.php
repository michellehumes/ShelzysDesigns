<?php
/**
 * Page Template
 *
 * @package ShelzyPerkins
 */

get_header();
?>

<?php
while (have_posts()) :
    the_post();
    ?>

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="post-header">
            <h1 class="post-title"><?php the_title(); ?></h1>
        </header>

        <div class="post-content">
            <?php
            the_content();

            wp_link_pages(array(
                'before' => '<div class="page-links">' . __('Pages:', 'shelzyperkins'),
                'after'  => '</div>',
            ));
            ?>
        </div>
    </article>

<?php endwhile; ?>

<?php
get_footer();
