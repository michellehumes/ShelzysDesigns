<?php
/**
 * Archive Template
 *
 * @package ShelzyPerkins
 */

get_header();
?>

<div class="blog-archive">
    <?php if (have_posts()) : ?>

        <header class="page-header">
            <?php
            the_archive_title('<h1 class="page-title">', '</h1>');
            the_archive_description('<div class="archive-description">', '</div>');
            ?>
        </header>

        <div class="post-list">
            <?php
            while (have_posts()) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('post-list-item'); ?>>
                    <header class="entry-header">
                        <h2 class="entry-title">
                            <a href="<?php the_permalink(); ?>" rel="bookmark">
                                <?php the_title(); ?>
                            </a>
                        </h2>
                        <div class="post-meta">
                            <span class="posted-on">
                                <?php echo get_the_date(); ?>
                            </span>
                        </div>
                    </header>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="post-excerpt">
                        <?php the_excerpt(); ?>
                    </div>

                    <footer class="entry-footer">
                        <a href="<?php the_permalink(); ?>" class="read-more">
                            Read More &rarr;
                        </a>
                    </footer>
                </article>
                <?php
            endwhile;
            ?>
        </div>

        <?php
        // Pagination
        the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => __('&larr; Previous', 'shelzyperkins'),
            'next_text' => __('Next &rarr;', 'shelzyperkins'),
        ));
        ?>

    <?php else : ?>

        <div class="no-posts">
            <h2><?php _e('Nothing Found', 'shelzyperkins'); ?></h2>
            <p><?php _e('It seems we can&rsquo;t find what you&rsquo;re looking for.', 'shelzyperkins'); ?></p>
        </div>

    <?php endif; ?>
</div>

<?php
get_footer();
