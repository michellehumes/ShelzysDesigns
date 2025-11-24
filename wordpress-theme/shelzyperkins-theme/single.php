<?php
/**
 * Single Post Template
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
            <div class="post-meta">
                <span class="posted-on">
                    Published on <?php echo get_the_date(); ?>
                </span>
                <?php if (has_category()) : ?>
                    <span class="category-links">
                        in <?php the_category(', '); ?>
                    </span>
                <?php endif; ?>
            </div>
        </header>

        <?php if (has_post_thumbnail()) : ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail('large'); ?>
            </div>
        <?php endif; ?>

        <div class="post-content">
            <?php
            the_content();

            wp_link_pages(array(
                'before' => '<div class="page-links">' . __('Pages:', 'shelzyperkins'),
                'after'  => '</div>',
            ));
            ?>
        </div>

        <footer class="post-footer">
            <?php if (has_tag()) : ?>
                <div class="post-tags">
                    <strong>Tags:</strong> <?php the_tags('', ', ', ''); ?>
                </div>
            <?php endif; ?>

            <div class="post-share">
                <p><strong>Share this post:</strong></p>
                <a href="https://pinterest.com/pin/create/button/?url=<?php echo urlencode(get_permalink()); ?>&description=<?php echo urlencode(get_the_title()); ?>" target="_blank" rel="noopener">
                    Pinterest
                </a> |
                <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" target="_blank" rel="noopener">
                    Facebook
                </a> |
                <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>" target="_blank" rel="noopener">
                    Twitter
                </a>
            </div>
        </footer>
    </article>

    <?php
    // Related posts
    $categories = get_the_category();
    if ($categories) {
        $category_ids = array();
        foreach ($categories as $category) {
            $category_ids[] = $category->term_id;
        }

        $related_args = array(
            'category__in'   => $category_ids,
            'post__not_in'   => array(get_the_ID()),
            'posts_per_page' => 3,
            'orderby'        => 'rand',
        );

        $related_query = new WP_Query($related_args);

        if ($related_query->have_posts()) :
            ?>
            <div class="related-posts mt-lg">
                <h3>You May Also Like</h3>
                <div class="post-list">
                    <?php
                    while ($related_query->have_posts()) :
                        $related_query->the_post();
                        ?>
                        <article class="post-list-item">
                            <h4>
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h4>
                            <div class="post-excerpt">
                                <?php echo wp_trim_words(get_the_excerpt(), 15); ?>
                            </div>
                            <a href="<?php the_permalink(); ?>" class="read-more">
                                Read More &rarr;
                            </a>
                        </article>
                        <?php
                    endwhile;
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
            <?php
        endif;
    }
    ?>

<?php endwhile; ?>

<?php
get_footer();
