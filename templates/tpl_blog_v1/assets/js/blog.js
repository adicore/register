document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. WIDGET: POPULAR CATEGORIES
    // ==========================================
    const categoryContainer = document.getElementById("popular-categories-container");
    if (categoryContainer) {
        fetch("/json/top-categories.json")
            .then(response => {
                if (!response.ok) throw new Error("Gagal mengambil data kategori");
                return response.json();
            })
            .then(categories => {
                categoryContainer.innerHTML = "";
                
                if (categories.length === 0) {
                    categoryContainer.innerHTML = '<div class="text-muted small py-2">Tidak ada kategori ditemukan.</div>';
                    return;
                }

                categories.forEach(cat => {
                    // Mengubah spasi pada slug/nama menjadi tanda hubung jika diperlukan
                    const safeSlug = cat.slug ? cat.slug.trim().toLowerCase().replace(/\s+/g, '-') : '#';
                    const categoryUrl = cat.url || `/category/${safeSlug}`;
                    
                    const badgeHTML = `
                        <a href="${categoryUrl}" class="badge bg-light text-dark border py-2 px-3 text-decoration-none hover-bg-primary hover-text-white">
                            ${cat.name} (${cat.count})
                        </a>
                    `;
                    categoryContainer.innerHTML += badgeHTML;
                });
            })
            .catch(error => {
                console.error("Gagal memuat popular categories:", error);
                categoryContainer.innerHTML = '<div class="text-danger small py-2">Gagal memuat kategori.</div>';
            });
    }

    // ==========================================
    // 1. WIDGET: RELATED POSTS
    // ==========================================
    const containerrelated = document.getElementById("related-posts-container");
    if (containerrelated) {
        let rawCategory = containerrelated.getAttribute("data-category");
        let category = rawCategory ? rawCategory.trim().toLowerCase().replace(/\s+/g, '-') : '';
        if (category) {
            fetch(`/json/categories/${encodeURIComponent(category)}.json`)
                .then(response => {
                    if (!response.ok) throw new Error("Gagal mengambil data kategori");
                    return response.json();
                })
                .then(data => {
                    const posts = data.posts || [];
                    if (posts.length === 0) {
                        containerrelated.innerHTML = '<div class="col-12 text-muted small text-center py-3">Tidak ada postingan terkait.</div>';
                        return;
                    }

                    const relatedPosts = posts.slice(0, 3);
                    containerrelated.innerHTML = "";

                    relatedPosts.forEach(post => {
                        const cardHTML = `
                            <div class="col-md-4">
                                <div class="card h-100 border shadow-sm rounded-4 overflow-hidden">
                                    <img src="${post.thumbnail}" class="card-img-top" height="130" style="object-fit: cover;" alt="${post.title}">
                                    <div class="card-body p-3">
                                        <span class="badge bg-light text-primary small mb-1 text-capitalize">${post.category}</span>
                                        <h6 class="fw-bold text-dark fs-6 text-truncate mb-1">
                                            <a href="${post.url}" class="text-decoration-none text-dark stretched-link">${post.title}</a>
                                        </h6>
                                        <small class="text-muted" style="font-size: 0.75rem;">${post.date}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                        containerrelated.innerHTML += cardHTML;
                    });
                })
                .catch(error => {
                    console.error("Gagal memuat related posts:", error);
                    containerrelated.innerHTML = '<div class="col-12 text-danger small text-center py-2">Gagal memuat postingan terkait.</div>';
                });
        }
    }

    // ==========================================
    // 2. WIDGET: POPULAR POSTS
    // ==========================================
    const popularposts = document.getElementById("popular-posts-container");
    if (popularposts) {
        fetch("/json/popular.json")
            .then(response => {
                if (!response.ok) throw new Error("Gagal mengambil data JSON");
                return response.json();
            })
            .then(posts => {
                posts.sort((a, b) => b.views - a.views);
                const topPosts = posts.slice(0, 3);

                popularposts.innerHTML = "";
                topPosts.forEach((post, index) => {
                    const rank = String(index + 1).padStart(2, '0');
                    const viewsFormatted = post.views >= 1000 ? (post.views / 1000).toFixed(1) + 'k' : post.views;

                    const itemHTML = `
                        <div class="d-flex align-items-start gap-3">
                            <span class="fw-bold text-muted fs-4 lh-1">${rank}</span>
                            <div>
                                <a href="${post.url}" class="text-decoration-none fw-bold text-dark fs-6 d-block mb-1 hover-primary">${post.title}</a>
                                <small class="text-muted" style="font-size: 0.75rem;"><i class="bi bi-eye me-1"></i> ${viewsFormatted} Dilihat</small>
                            </div>
                        </div>
                    `;
                    popularposts.innerHTML += itemHTML;
                });
            })
            .catch(error => {
                console.error("Gagal memuat widget popular posts:", error);
                popularposts.innerHTML = `<div class="text-danger small text-center py-2">Gagal memuat artikel populer.</div>`;
            });
    }

    // ==========================================
    // 3. READING TIME ESTIMATOR
    // ==========================================
    const articleContainer = document.querySelector('.article-content');
    const readingTimeSpan = document.getElementById('reading-time');
    if (articleContainer && readingTimeSpan) {
        const text = articleContainer.textContent || articleContainer.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        readingTimeSpan.textContent = `${minutes}-Minute Read`;
    }

    // ==========================================
    // 4. RECENT POSTS WIDGET
    // ==========================================
    const recentContainer = document.getElementById('recent-posts-container');
    if (recentContainer) {
        fetch('/json/posts.json')
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat data artikel');
                return response.json();
            })
            .then(posts => {
                recentContainer.innerHTML = '';
                posts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                const latestPosts = posts.slice(0, 5);
                
                if (latestPosts.length > 0) {
                    latestPosts.forEach(post => {
                        const postLink = document.createElement('a');
                        postLink.href = post.url || '#';
                        postLink.className = 'd-flex align-items-center gap-3 text-decoration-none text-dark hover-primary';
                        postLink.innerHTML = `
                            <img src="${post.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80'}" width="60" height="60" class="rounded-3 object-fit-cover" alt="${post.title}">
                            <div>
                                <h6 class="fw-bold fs-6 mb-1 text-truncate" style="max-width: 200px;">${post.title}</h6>
                                <small class="text-muted" style="font-size: 0.75rem;">${post.date}</small>
                            </div>`;
                        recentContainer.appendChild(postLink);
                    });
                } else {
                    recentContainer.innerHTML = '<div class="text-muted small text-center py-2">Tidak ada artikel ditemukan.</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                recentContainer.innerHTML = '<div class="text-danger small text-center py-2">Gagal memuat artikel.</div>';
            });
    }

    // ==========================================
    // 5. TABLE OF CONTENTS (TOC) GENERATOR
    // ==========================================
    const tocList = document.querySelector('ul.list-unstyled');
    if (articleContainer && tocList) {
        const headings = articleContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length > 0) {
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = `section-${index + 1}`;
                }
                const headingId = heading.id;
                const headingText = heading.textContent;
                const tagLevel = heading.tagName.toLowerCase();
                const li = document.createElement('li');
                li.className = index === headings.length - 1 ? 'mb-0' : 'mb-2';
                
                let indentClass = '';
                if (tagLevel === 'h3') indentClass = 'ps-3';
                if (tagLevel === 'h4') indentClass = 'ps-4';
                
                li.innerHTML = `<a href="#${headingId}" class="text-decoration-none text-dark hover-primary ${indentClass}">${index + 1}. ${headingText}</a>`;
                tocList.appendChild(li);
            });
        } else {
            const tocBox = tocList.closest('.toc-box');
            if (tocBox) tocBox.style.display = 'none';
        }
    }

    // ==========================================
    // 6. DISQUS COMMENTS & LAZY LOAD COUNTER
    // ==========================================
    const disqusSection = document.getElementById('disqus-section');
    if (disqusSection && typeof DisQusShortname !== 'undefined') {
        const loadDisqus = () => {
            if (window.disqusLoaded) return;
            window.disqusLoaded = true;
            const d = document, s = d.createElement('script');
            s.src = `https://${DisQusShortname}.disqus.com/embed.js`;
            s.setAttribute('data-timestamp', +new Date());
            window.disqus_config = function() {
                this.page.url = window.location.href;
                this.page.identifier = window.location.pathname;
            };
            (d.head || d.body).appendChild(s);
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadDisqus();
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px 300px 0px' });
        
        observer.observe(disqusSection);
    }

    let countScriptLoaded = false;
    const loadDisqusCount = () => {
        if (countScriptLoaded || typeof DisQusShortname === 'undefined') return;
        countScriptLoaded = true;
        const s = document.createElement('script');
        s.id = 'dsq-count-scr';
        s.src = `//${DisQusShortname}.disqus.com/count.js`;
        s.async = true;
        document.body.appendChild(s);
    };

    window.addEventListener('scroll', loadDisqusCount, { once: true });
    setTimeout(loadDisqusCount, 4000);
});
