import { createIcons, icons } from 'lucide';
import { marked } from 'marked';
import { SITE_CONFIG, JOURNAL_POSTS, PORTFOLIO_DATA } from './content/journal/data.js';

// Initialize Icons with all available icons
createIcons({ icons });

// --- Config Injection ---
if (SITE_CONFIG) {
    // Quote
    const quoteContainer = document.getElementById('quote-container');
    if (quoteContainer && SITE_CONFIG.quote) {
        quoteContainer.innerHTML = `<div class="quote-pill">"${SITE_CONFIG.quote}"</div>`;
    }

    // Initialize BGM
    initBGM();
}

function initBGM() {
    const audio = document.getElementById('bgm-audio');
    const toggleBtn = document.getElementById('bgm-toggle');
    const icon = document.getElementById('bgm-icon');

    // Settings
    const VOLUME = 0.18;
    const FADE_DURATION = 1000; // ms

    audio.volume = 0; // Start at 0 for fade in

    // Load preference
    const userPref = localStorage.getItem('bgm_preference'); // 'playing' or 'paused' or null
    let isPlaying = false;
    let fadeInterval;

    function updateUI(playing) {
        if (playing) {
            toggleBtn.classList.add('playing');
            icon.setAttribute('data-lucide', 'music-2'); // distinct active icon
        } else {
            toggleBtn.classList.remove('playing');
            icon.setAttribute('data-lucide', 'music'); // muted/inactive icon
        }
        createIcons({ icons });
    }

    function fadeTo(targetVolume, callback) {
        clearInterval(fadeInterval);
        const step = 0.02;
        const intervalTime = FADE_DURATION * step / VOLUME;

        fadeInterval = setInterval(() => {
            let current = audio.volume;
            if (Math.abs(current - targetVolume) < step) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
                if (callback) callback();
            } else if (current < targetVolume) {
                audio.volume = Math.min(1, current + step);
            } else {
                audio.volume = Math.max(0, current - step);
            }
        }, intervalTime);
    }

    function play() {
        audio.play().then(() => {
            isPlaying = true;
            localStorage.setItem('bgm_preference', 'playing');
            updateUI(true);
            fadeTo(VOLUME);
        }).catch(err => {
            console.log('Autoplay blocked', err);
            // If blocked, we just wait for next interaction
        });
    }

    function pause() {
        fadeTo(0, () => {
            audio.pause();
            isPlaying = false;
            localStorage.setItem('bgm_preference', 'paused');
            updateUI(false);
        });
    }

    function toggle() {
        if (isPlaying) pause();
        else play();
    }

    // Toggle Listeners
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
    });

    // Initialize State
    // If user explicitly paused before, don't auto-start.
    // If user said 'playing' or null (first time), try auto-start on interaction.
    const shouldAutoStart = userPref !== 'paused';

    if (shouldAutoStart) {
        // Attempt immediate playback (may be blocked by browser)
        play();

        const onFirstInteraction = () => {
            if (!isPlaying) {
                // Try to play again on interaction
                play();
            }
            document.removeEventListener('click', onFirstInteraction);
            document.removeEventListener('keydown', onFirstInteraction);
            document.removeEventListener('scroll', onFirstInteraction);
        };

        document.addEventListener('click', onFirstInteraction);
        document.addEventListener('keydown', onFirstInteraction);
        document.addEventListener('scroll', onFirstInteraction, { once: true });
    } else {
        // Restore UI state if it was paused
        updateUI(false);
    }
}

// --- Navigation System ---
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');

function switchSection(targetId) {
    // Update Nav
    navBtns.forEach(btn => {
        if (btn.dataset.target === targetId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Section
    sections.forEach(section => {
        if (section.id === targetId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    window.scrollTo(0, 0);
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchSection(btn.dataset.target);
    });
});

// --- Journal System ---
const journalContainer = document.getElementById('journal-posts-container');
const searchInput = document.getElementById('journal-search');
const tagsContainer = document.getElementById('tags-filter');
const listView = document.getElementById('journal-list-view');
const detailView = document.getElementById('journal-detail-view');
const detailContent = document.getElementById('journal-content');
const backBtn = document.getElementById('back-to-journal');

let allPosts = [];
let activeTag = 'all';

// Load Posts from global data
if (JOURNAL_POSTS) {
    allPosts = JOURNAL_POSTS;
    renderTags();
    filterAndRenderPosts();
} else {
    console.error('window.JOURNAL_POSTS not found');
    journalContainer.innerHTML = '<div class="error">Failed to load journal posts.</div>';
}

function renderTags() {
    const tags = new Set(['all']);
    allPosts.forEach(post => {
        if (post.tags) post.tags.forEach(t => tags.add(t));
    });

    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = `tag-btn ${tag === activeTag ? 'active' : ''}`;
        btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        btn.addEventListener('click', () => {
            activeTag = tag;
            updateTagUI();
            filterAndRenderPosts();
        });
        tagsContainer.appendChild(btn);
    });
}

function updateTagUI() {
    document.querySelectorAll('.tag-btn').forEach(btn => {
        if (btn.textContent.toLowerCase() === activeTag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function filterAndRenderPosts() {
    const query = searchInput.value.toLowerCase();

    const filtered = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query);
        const matchesTag = activeTag === 'all' || (post.tags && post.tags.includes(activeTag));
        return matchesSearch && matchesTag;
    });

    renderPosts(filtered);
}

function renderPosts(posts) {
    journalContainer.innerHTML = '';

    if (posts.length === 0) {
        journalContainer.innerHTML = '<div class="no-results">No posts found.</div>';
        return;
    }

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'journal-card';
        card.innerHTML = `
                <span class="journal-date">${post.date}</span>
                <h3 class="journal-title">${post.title}</h3>
                <p class="journal-excerpt">${post.excerpt}</p>
            `;

        card.addEventListener('click', () => openPost(post));
        journalContainer.appendChild(card);
    });
}

// Search Listener
searchInput.addEventListener('input', filterAndRenderPosts);

// Detail View Logic
function openPost(post) {
    if (!post.content) {
        console.error('No content for post', post.slug);
        return;
    }

    // Parse markdown from data
    detailContent.innerHTML = marked.parse(post.content);

    // Switch views
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
}

backBtn.addEventListener('click', () => {
    detailView.classList.add('hidden');
    listView.classList.remove('hidden');
});

// --- Portfolio System ---
const portfolioCategoriesContainer = document.getElementById('portfolio-categories-container');
const portfolioDetailView = document.getElementById('portfolio-detail-view');
const portfolioCategoriesView = document.getElementById('portfolio-categories-view');
const portfolioItemsContainer = document.getElementById('portfolio-items-container');
const backToPortfolioBtn = document.getElementById('back-to-portfolio');
const catTitle = document.getElementById('portfolio-category-title');
const catDesc = document.getElementById('portfolio-category-desc');

if (PORTFOLIO_DATA && portfolioCategoriesContainer) {
    initPortfolio();
}

function initPortfolio() {
    const { categories, items } = PORTFOLIO_DATA;

    // Render Categories
    portfolioCategoriesContainer.innerHTML = '';
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card portfolio-category-card';
        card.innerHTML = `
                <div class="card-icon-placeholder"><i data-lucide="${cat.icon}"></i></div>
                <div class="card-content">
                    <h4>${cat.title}</h4>
                    <p>${cat.description}</p>
                </div>
            `;
        // Add interaction
        card.addEventListener('click', () => openPortfolioCategory(cat));
        portfolioCategoriesContainer.appendChild(card);
    });

    // Back Button
    backToPortfolioBtn.addEventListener('click', () => {
        portfolioDetailView.classList.add('hidden');
        portfolioCategoriesView.classList.remove('hidden');
        window.scrollTo(0, 0);
    });
}

function openPortfolioCategory(category) {
    // Populate Header
    catTitle.textContent = category.title;
    catDesc.textContent = category.description;

    // Populate Items
    const catItems = PORTFOLIO_DATA.items[category.slug] || [];
    renderPortfolioItems(catItems, category.slug);

    // Switch View
    portfolioCategoriesView.classList.add('hidden');
    portfolioDetailView.classList.remove('hidden');
    createIcons({ icons });
    window.scrollTo(0, 0);
}

function renderPortfolioItems(items, categorySlug) {
    portfolioItemsContainer.innerHTML = '';
    if (items.length === 0) {
        portfolioItemsContainer.innerHTML = '<div class="no-results">No items yet.</div>';
        return;
    }

    // Check if this is the photography category (Album Mode)
    const isAlbumMode = categorySlug === 'photograph';

    items.forEach(item => {
        const card = document.createElement('div');

        if (isAlbumMode) {
            // Render Album Card
            card.className = 'card portfolio-item-card album-card';
            // Placeholder UI if image fails/missing
            const imgHTML = item.coverImage
                ? `<div class="card-image"><img src="${item.coverImage}" alt="${item.title}" loading="lazy"></div>`
                : `<div class="card-image-placeholder"><i data-lucide="images"></i></div>`;

            card.innerHTML = `
                    ${imgHTML}
                    <div class="card-content">
                        <h4>${item.title} <span class="album-count">${item.photos.length} Photos</span></h4>
                        <p class="year">${item.year} - ${item.description || ''}</p>
                        <div class="meta-tags" style="margin-top:0.5rem">
                           ${item.tags ? item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('') : ''}
                        </div>
                    </div>
                `;
            card.addEventListener('click', () => openAlbum(item));
        } else {
            // Render Standard Work Card (Design/Video)
            card.className = 'card portfolio-item-card';
            // Image handling (placeholder if empty)
            const imgHTML = item.image
                ? `<div class="card-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>`
                : `<div class="card-image-placeholder"><i data-lucide="image"></i></div>`;

            card.innerHTML = `
                    ${imgHTML}
                    <div class="card-content">
                        <div class="meta-tags">
                            ${item.tags ? item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('') : ''}
                        </div>
                        <h4>${item.title} <span class="year">${item.year}</span></h4>
                    </div>
                `;
        }
        portfolioItemsContainer.appendChild(card);
    });
    createIcons({ icons });
}

// --- Album Modal System ---
const albumModal = document.getElementById('album-modal');
const albumGrid = document.getElementById('album-grid');
const albumCloseBtn = albumModal.querySelector('.modal-close');
const albumTitle = document.getElementById('album-title');
const albumDesc = document.getElementById('album-desc');

// Lightbox
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = lightboxModal.querySelector('.modal-close');

// Lightbox State
let currentAlbumPhotos = [];
let currentLightboxIndex = 0;
const lbPrevBtn = document.getElementById('lb-prev');
const lbNextBtn = document.getElementById('lb-next');

function openAlbum(album) {
    currentAlbumPhotos = album.photos || [];
    albumTitle.textContent = album.title;
    albumDesc.textContent = album.description || `${album.photos.length} photos`;
    albumGrid.innerHTML = '';

    album.photos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = `<img src="${photo.src}" alt="${photo.alt || 'Photo'}" loading="lazy">`;
        // Pass index to openLightbox
        div.addEventListener('click', () => openLightbox(index));
        albumGrid.appendChild(div);
    });

    albumModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeAlbum() {
    albumModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function openLightbox(index) {
    if (!currentAlbumPhotos[index]) return;
    currentLightboxIndex = index;
    updateLightboxImage();
    lightboxModal.classList.remove('hidden');
}

function updateLightboxImage() {
    if (!currentAlbumPhotos[currentLightboxIndex]) return;
    const photo = currentAlbumPhotos[currentLightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt || 'Full view';
}

function showNextPhoto(e) {
    if (e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % currentAlbumPhotos.length;
    updateLightboxImage();
}

function showPrevPhoto(e) {
    if (e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length;
    updateLightboxImage();
}

function closeLightbox() {
    lightboxModal.classList.add('hidden');
    lightboxImg.src = '';
}

// Event Listeners for Modals
albumCloseBtn.addEventListener('click', closeAlbum);
lightboxCloseBtn.addEventListener('click', closeLightbox);

if (lbNextBtn) lbNextBtn.addEventListener('click', showNextPhoto);
if (lbPrevBtn) lbPrevBtn.addEventListener('click', showPrevPhoto);

// Close on click outside
albumModal.addEventListener('click', (e) => {
    if (e.target === albumModal) closeAlbum();
});
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('hidden')) {
        if (e.key === 'Escape' && !albumModal.classList.contains('hidden')) closeAlbum();
        return;
    }

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
});



// --- Cursor Glow System ---
function initCursorGlow() {
    // 1. Accessibility & Device Checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) return;

    // 2. Create and inject glow element
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let isVisible = false;
    let ticking = false;

    // 3. Pointer Move Listener
    window.addEventListener('pointermove', (e) => {
        // Ensure it's a mouse (pointerType 'mouse' or 'pen', not 'touch')
        if (e.pointerType === 'touch') return;

        mouseX = e.clientX;
        mouseY = e.clientY;

        // On first move, reveal the glow
        if (!isVisible) {
            glow.style.opacity = '0.9'; // matches CSS target
            isVisible = true;
        }

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // margin-left/top in CSS handles centering (-190px)
                glow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
                ticking = false;
            });
            ticking = true;
        }
    });

    // 4. Handle leaving the window
    document.documentElement.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        isVisible = false;
    });

    document.documentElement.addEventListener('mouseenter', () => {
        glow.style.opacity = '0.9';
        isVisible = true;
    });
}

initCursorGlow();
