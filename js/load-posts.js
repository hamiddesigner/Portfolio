// ============================================================================
// LOAD POSTS PAGE - Dynamic posts loading
// ============================================================================

import { API } from './api.js';

let allPosts = [];
let displayedCount = 6;

/**
 * Load all posts from API
 */
async function loadPosts() {
    try {
        showLoadingState();
        
        const posts = await API.getPosts();
        console.log('Loaded posts:', posts);
        
        // Filter: only published, sort by date (newest first)
        allPosts = posts
            .filter(post => post.status === 'published')
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        displayPosts();
        
    } catch (error) {
        console.error('Failed to load posts:', error);
        showErrorState();
    }
}

/**
 * Display posts in the grid
 */
function displayPosts() {
    const grid = document.querySelector('.postsgrid, .blog-grid');
    if (!grid) {
        console.error('Posts grid container not found');
        return;
    }
    
    // Remove loading state
    const loading = grid.querySelector('.loading-spinner');
    if (loading) loading.remove();
    
    // Clear existing posts
    grid.innerHTML = '';
    
    if (allPosts.length === 0) {
        showEmptyState();
        return;
    }
    
    // Display first N posts
    const postsToDisplay = allPosts.slice(0, displayedCount);
    
    postsToDisplay.forEach(post => {
        const card = createPostCard(post);
        grid.appendChild(card);
    });
    
    // Show/hide "Load More" button
    updateLoadMoreButton();
}

/**
 * Create a post card element
 */
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    // Format date
    const date = new Date(post.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Get thumbnail
    const thumbnail = post.thumbnail || 'https://via.placeholder.com/800x400/f0f0f0/666666?text=Blog+Post';
    
    // Get excerpt or first 150 chars of content
    let excerpt = post.excerpt;
    if (!excerpt && post.content) {
        try {
            const content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
            if (content.sections && content.sections[0]) {
                const text = content.sections[0].content.replace(/<[^>]*>/g, '');
                excerpt = text.substring(0, 150) + (text.length > 150 ? '...' : '');
            }
        } catch (e) {
            excerpt = 'Read more about this topic...';
        }
    }
    
    card.innerHTML = `
        <div class="post-image">
            <img src="${thumbnail}" alt="${post.title}" loading="lazy">
        </div>
        <div class="post-content">
            <span class="post-date">${formattedDate}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${excerpt}</p>
            ${post.linkedin_url ? `
                <a href="${post.linkedin_url}" target="_blank" rel="noopener noreferrer" class="read-more-link">
                    Read on LinkedIn →
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Load more posts
 */
function loadMorePosts() {
    displayedCount = Math.min(displayedCount + 6, allPosts.length);
    displayPosts();
}

/**
 * Update load more button visibility and text
 */
function updateLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn, .btn-load-more');
    if (!loadMoreBtn) return;
    
    if (displayedCount >= allPosts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        const remaining = allPosts.length - displayedCount;
        loadMoreBtn.textContent = `Load More (${remaining} remaining)`;
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const grid = document.querySelector('.posts-grid, .blog-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <div class="spinner"></div>
            <p style="margin-top: 16px; color: #666;">Loading posts...</p>
        </div>
    `;
}

/**
 * Show empty state
 */
function showEmptyState() {
    const grid = document.querySelector('.posts-grid, .blog-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
            <p style="font-size: 18px; margin-bottom: 8px;">No posts yet</p>
            <p style="font-size: 14px;">Check back soon for new articles!</p>
        </div>
    `;
}

/**
 * Show error state
 */
function showErrorState() {
    const grid = document.querySelector('.posts-grid, .blog-grid');
    if (!grid) return;
    
    grid.innerHTML = `
        <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <p style="color: #e74c3c; font-size: 16px;">Failed to load posts. Please try again later.</p>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    // Setup "Load More" button
    const loadMoreBtn = document.querySelector('.load-more-btn, .btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
});
