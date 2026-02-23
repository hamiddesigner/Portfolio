// ============================================================================
// LOAD WORK PAGE - Dynamic case studies loading with filtering
// ============================================================================

import { API } from './api.js';
import { openPasswordModal } from './password-modal.js';

let allCaseStudies = [];
let currentFilter = 'all';

/**
 * Load all case studies from API
 */
async function loadCaseStudies() {
    const caseStudiesContainer = document.querySelector('.case-studies');
    if (!caseStudiesContainer) return;

    try {
        showLoadingState();
        
        // Fetch case studies from API
        const studies = await API.getCaseStudies();
        console.log('Loaded case studies:', studies);
        
        // Filter only published
        allCaseStudies = studies.filter(study => study.status === 'published');
        
        // Remove loading spinner
        const loadingSpinner = caseStudiesContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
        
        if (allCaseStudies.length === 0) {
            showEmptyState();
            return;
        }
        
        displayCaseStudies(allCaseStudies);
        setupFilters();
        
    } catch (error) {
        console.error('Failed to load case studies:', error);
        showErrorState();
    }
}

/**
 * Display case studies in the grid
 */
function displayCaseStudies(studies) {
    const container = document.querySelector('.case-studies');
    
    // Clear existing cards (but keep section header if it exists)
    const cards = container.querySelectorAll('.case-card');
    cards.forEach(card => card.remove());
    
    if (studies.length === 0) {
        showEmptyState();
        return;
    }
    
    studies.forEach(study => {
        const card = createCaseStudyCard(study);
        container.appendChild(card);
    });
}

/**
 * Create a case study card element
 */
function createCaseStudyCard(study) {
    const { id, title, description, thumbnail, tags, is_password_protected } = study;
    
    const isLocked = is_password_protected;
    
    // Create card element
    const card = document.createElement('div');
    card.className = isLocked ? 'case-card locked-case' : 'case-card clickable';
    card.dataset.id = id;
    
    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'case-image';
    
    if (thumbnail) {
        imageDiv.style.backgroundImage = `url(${thumbnail})`;
        imageDiv.style.backgroundSize = 'cover';
        imageDiv.style.backgroundPosition = 'center';
    } else {
        // Random pastel color if no thumbnail
        const colors = ['#dedef2', '#d9edeb', '#f0e7ff', '#ffe7e7', '#fff4e0'];
        imageDiv.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'case-info';
    
    // Title row (with lock icon if locked)
    const titleRow = document.createElement('div');
    titleRow.className = isLocked ? 'case-title-row' : '';
    
    const titleH3 = document.createElement('h3');
    titleH3.className = 'case-title';
    titleH3.textContent = title;
    titleRow.appendChild(titleH3);
    
    if (isLocked) {
        const lockIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        lockIcon.setAttribute('class', 'lock-icon');
        lockIcon.setAttribute('width', '16');
        lockIcon.setAttribute('height', '16');
        lockIcon.setAttribute('viewBox', '0 0 16 16');
        lockIcon.setAttribute('fill', 'none');
        lockIcon.innerHTML = `
            <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7" stroke="currentColor" stroke-width="1.5"/>
        `;
        titleRow.appendChild(lockIcon);
    }
    
    infoDiv.appendChild(titleRow);
    
    // Tags
    if (tags && tags.length > 0) {
        const tagsP = document.createElement('p');
        tagsP.className = 'case-date';
        tagsP.textContent = tags.join(' • ');
        infoDiv.appendChild(tagsP);
    }
    
    // Description
    const descP = document.createElement('p');
    descP.className = 'case-description';
    descP.textContent = description || 'No description available';
    infoDiv.appendChild(descP);
    
    // Assemble card
    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    
    // Click handler
    card.addEventListener('click', () => {
        if (isLocked) {
            openPasswordModal(id);
        } else {
            window.location.href = `/case-study.html?id=${id}`;
        }
    });
    
    return card;
}

/**
 * Setup filter buttons
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter
            const filter = btn.dataset.filter;
            filterCaseStudies(filter);
        });
    });
}

/**
 * Filter case studies by tag
 */
function filterCaseStudies(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        displayCaseStudies(allCaseStudies);
        return;
    }
    
    // Filter by tag (case insensitive)
    const filtered = allCaseStudies.filter(study => 
        study.tags && study.tags.some(tag => 
            tag.toLowerCase().includes(filter.toLowerCase())
        )
    );
    
    displayCaseStudies(filtered);
}

/**
 * Show loading state
 */
function showLoadingState() {
    const container = document.querySelector('.case-studies');
    const existing = container.querySelector('.loading-spinner');
    if (existing) return;
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = 'text-align: center; padding: 60px 20px;';
    spinner.innerHTML = '<div class="spinner"></div><p style="margin-top: 16px; color: #666;">Loading case studies...</p>';
    container.appendChild(spinner);
}

/**
 * Show empty state
 */
function showEmptyState() {
    const container = document.querySelector('.case-studies');
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-state';
    emptyMessage.style.cssText = 'text-align: center; padding: 60px 20px; color: #999;';
    emptyMessage.innerHTML = `
        <p style="font-size: 18px; margin-bottom: 8px;">No case studies found</p>
        <p style="font-size: 14px;">Check back soon for new work!</p>
    `;
    container.appendChild(emptyMessage);
}

/**
 * Show error state
 */
function showErrorState() {
    const container = document.querySelector('.case-studies');
    const loadingSpinner = container.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.innerHTML = '<p style="color: #e74c3c; text-align: center;">Failed to load case studies. Please try again later.</p>';
    } else {
        container.innerHTML = '<p style="color: #e74c3c; text-align: center; padding: 40px;">Failed to load case studies. Please try again later.</p>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadCaseStudies);
