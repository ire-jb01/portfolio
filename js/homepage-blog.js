document.addEventListener('DOMContentLoaded', function () {
    const recentArticlesGrid = document.getElementById('recent-articles-grid');

    if (typeof articlesData !== 'undefined' && articlesData.length > 0) {
        // Sort articles by date in descending order (most recent first)
        const sortedArticles = articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the first 3 articles (or fewer if not enough)
        const recentArticles = sortedArticles.slice(0, 3);

        if (recentArticles.length > 0) {
            let articlesHTML = '';
            recentArticles.forEach(article => {
                // Format date (e.g., "October 26, 2023")
                const articleDate = new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const tagsHTML = article.tags.map(tag => `<span>${tag}</span>`).join('');

                articlesHTML += `
                    <article class="blog-card">
                        <div class="blog-card-image">
                            <a href="${article.articleLink}"><img src="${article.imagePath}" alt="Thumbnail for ${article.title}"></a>
                        </div>
                        <div class="blog-card-content">
                            <div class="blog-meta">
                                <span class="blog-date">${articleDate}</span> |
                                <span class="blog-read-time">${article.readTime}</span>
                            </div>
                            <h3 class="blog-title"><a href="${article.articleLink}">${article.title}</a></h3>
                            <p class="blog-excerpt">${article.excerpt}</p>
                            <div class="blog-tags">
                                ${tagsHTML}
                            </div>
                            <a href="${article.articleLink}" class="btn btn-secondary blog-read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                `;
            });

            if (recentArticlesGrid) {
                recentArticlesGrid.innerHTML = articlesHTML;
            }
        } else {
            if (recentArticlesGrid) {
                recentArticlesGrid.innerHTML = '<p>No recent articles found.</p>';
            }
        }
    } else {
        if (recentArticlesGrid) {
            recentArticlesGrid.innerHTML = '<p>No articles available at the moment. Please check back later!</p>';
        }
    }
});
