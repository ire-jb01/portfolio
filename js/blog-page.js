document.addEventListener('DOMContentLoaded', function () {
    const dynamicBlogGrid = document.getElementById('dynamic-blog-grid');
    const tagFiltersContainer = document.querySelector('.tag-filters-container');
    const searchInput = document.getElementById('blog-search-input');

    let currentFilter = 'all'; // Default filter
    let currentSearchTerm = ''; // Default search term

    if (typeof articlesData === 'undefined' || articlesData.length === 0) {
        if (dynamicBlogGrid) {
            dynamicBlogGrid.innerHTML = '<p>No articles found. Please check back later!</p>';
        }
        if (tagFiltersContainer) {
            tagFiltersContainer.innerHTML = '';
        }
        if (searchInput && searchInput.parentElement) {
            searchInput.parentElement.style.display = 'none';
        }
        return;
    }

    const allArticlesSorted = articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));

    function getUniqueTags() {
        const allTags = new Set();
        allArticlesSorted.forEach(article => {
            article.tags.forEach(tag => allTags.add(tag));
        });
        return Array.from(allTags).sort();
    }

    function displayTagFilters() {
        if (!tagFiltersContainer) return;

        const uniqueTags = getUniqueTags();
        let filtersHTML = `<button class="tag-filter-btn active" data-tag="all">All Articles</button>`;

        uniqueTags.forEach(tag => {
            filtersHTML += `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`;
        });
        tagFiltersContainer.innerHTML = filtersHTML;

        const filterButtons = tagFiltersContainer.querySelectorAll('.tag-filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentFilter = this.getAttribute('data-tag');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                renderArticles();
            });
        });
    }

    function renderArticles() {
        if (!dynamicBlogGrid) return;

        let filteredArticles = allArticlesSorted;

        if (currentFilter !== 'all') {
            filteredArticles = filteredArticles.filter(article => article.tags.includes(currentFilter));
        }

        if (currentSearchTerm) {
            filteredArticles = filteredArticles.filter(article =>
                article.title.toLowerCase().includes(currentSearchTerm) ||
                article.excerpt.toLowerCase().includes(currentSearchTerm)
            );
        }

        dynamicBlogGrid.innerHTML = ''; // Clear existing cards before rendering new ones

        if (filteredArticles.length === 0) {
            if (currentSearchTerm && currentFilter !== 'all') {
                dynamicBlogGrid.innerHTML = `<p>No articles found for tag "${currentFilter}" matching "${currentSearchTerm}".</p>`;
            } else if (currentSearchTerm) {
                dynamicBlogGrid.innerHTML = `<p>No articles found matching "${currentSearchTerm}".</p>`;
            } else if (currentFilter !== 'all') {
                dynamicBlogGrid.innerHTML = `<p>No articles found for the selected tag "${currentFilter}".</p>`;
            } else {
                dynamicBlogGrid.innerHTML = '<p>No articles found.</p>';
            }
            return;
        }

        filteredArticles.forEach(article => {
            const articleDate = new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const tagsHTML = article.tags.map(tag => `<span>${tag}</span>`).join('');

            const card = document.createElement('article');
            card.className = 'blog-card blog-card-entering'; // Start with entering class
            card.innerHTML = `
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
            `;
            dynamicBlogGrid.appendChild(card);
        });

        // Trigger the animation
        // Use requestAnimationFrame to ensure the 'blog-card-entering' styles are applied before changing to 'blog-card-visible'
        requestAnimationFrame(() => {
            const cards = dynamicBlogGrid.querySelectorAll('.blog-card-entering');
            cards.forEach(card => {
                requestAnimationFrame(() => { // Second frame ensures transition will play
                    card.classList.remove('blog-card-entering');
                    card.classList.add('blog-card-visible');
                });
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.trim().toLowerCase();
            renderArticles();
        });
    }

    displayTagFilters();
    renderArticles();
});
