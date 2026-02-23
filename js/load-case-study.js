// ============================================================================
// LOAD CASE STUDY DETAIL - Individual case study page
// ============================================================================

import { API } from './api.js';
import { isUnlocked, getVisitorName } from './password-modal.js';

/**
 * Load and display case study details
 */
async function loadCaseStudy() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        console.error('No case study ID provided');
        window.location.href = '/work.html';
        return;
    }
    
    try {
        showLoadingState();
        
        const study = await API.getCaseStudy(id);
        
        // Check if password protected and not unlocked
        if (study.is_password_protected && !isUnlocked(id)) {
            console.log('Case study is locked, redirecting to work page');
            window.location.href = '/work.html';
            return;
        }
        
        // Display the case study
        displayCaseStudy(study);
        
        // Show personalized greeting if visitor entered name
        const visitorName = getVisitorName();
        if (visitorName) {
            showWelcomeMessage(visitorName);
        }
        
    } catch (error) {
        console.error('Failed to load case study:', error);
        showErrorState();
    }
}

/**
 * Display case study content
 */
function displayCaseStudy(study) {
    // Update page title
    document.title = `${study.title} | Hamid Ali Portfolio`;
    
    // Hero section
    const heroImg = document.querySelector('.case-study-hero img');
    if (heroImg && study.thumbnail) {
        heroImg.src = study.thumbnail;
        heroImg.alt = study.title;
    }
    
    const title = document.querySelector('.case-study-title, h1.case-title');
    if (title) title.textContent = study.title;
    
    const subtitle = document.querySelector('.case-study-subtitle, .case-subtitle');
    if (subtitle) subtitle.textContent = study.description;
    
    // Parse content (handle both JSONB and string formats)
    let content;
    try {
        content = typeof study.content === 'string' 
            ? JSON.parse(study.content) 
            : study.content;
    } catch (e) {
        content = study.content || {};
    }
    
    // Meta info
    const metaRole = document.querySelector('.meta-role, .role-value');
    if (metaRole) metaRole.textContent = content.role || 'Product Designer';
    
    const metaTimeline = document.querySelector('.meta-timeline, .timeline-value');
    if (metaTimeline) metaTimeline.textContent = content.timeline || '2024';
    
    const metaTools = document.querySelector('.meta-tools, .tools-value');
    if (metaTools && study.tags) {
        metaTools.innerHTML = study.tags
            .map(tag => `<span class="tool-badge">${tag}</span>`)
            .join('');
    }
    
    // Overview section
    const overviewContent = document.querySelector('.overview-content, .section-overview');
    if (overviewContent) {
        overviewContent.innerHTML = content.overview || study.description || '<p>Overview content will be added soon.</p>';
    }
    
    // Challenge section
    const challengeContent = document.querySelector('.challenge-content, .section-challenge');
    if (challengeContent) {
        challengeContent.innerHTML = content.challenge || '<p>Challenge details will be added soon.</p>';
    }
    
    // My Role section
    const roleContent = document.querySelector('.role-content, .section-role');
    if (roleContent) {
        roleContent.innerHTML = content.roleDescription || content.role || '<p>Role details will be added soon.</p>';
    }
    
    // Design Process section
    const processContent = document.querySelector('.process-content, .section-process');
    if (processContent) {
        processContent.innerHTML = content.process || '<p>Design process details will be added soon.</p>';
    }
    
    // Final Solution section
    const solutionContent = document.querySelector('.solution-content, .section-solution');
    if (solutionContent) {
        solutionContent.innerHTML = content.solution || '<p>Solution details will be added soon.</p>';
    }
    
    // Tools & Technologies (if separate section exists)
    if (content.tools && Array.isArray(content.tools)) {
        const toolsList = document.querySelector('.tools-list');
        if (toolsList) {
            toolsList.innerHTML = content.tools
                .map(tool => `<li class="tool-item">${tool}</li>`)
                .join('');
        }
    }
    
    // Add any sections from content.sections array (if it exists)
    if (content.sections && Array.isArray(content.sections)) {
        const mainContent = document.querySelector('.case-study-content, main');
        if (mainContent) {
            content.sections.forEach(section => {
                if (section.type === 'text') {
                    const div = document.createElement('div');
                    div.className = 'content-section';
                    div.innerHTML = section.content;
                    mainContent.appendChild(div);
                } else if (section.type === 'image') {
                    const img = document.createElement('img');
                    img.src = section.url;
                    img.alt = section.caption || '';
                    img.className = 'content-image';
                    mainContent.appendChild(img);
                }
            });
        }
    }
    
    // Setup navigation (Next/Previous case study)
    setupNavigation(study.id);
}

/**
 * Setup case study navigation
 */
async function setupNavigation(currentId) {
    try {
        const allStudies = await API.getCaseStudies();
        const published = allStudies.filter(s => s.status === 'published');
        
        const currentIndex = published.findIndex(s => s.id === currentId);
        
        if (currentIndex === -1) return;
        
        const prevBtn = document.querySelector('.btn-prev, .nav-prev');
        const nextBtn = document.querySelector('.btn-next, .nav-next');
        
        if (prevBtn) {
            if (currentIndex > 0) {
                const prevStudy = published[currentIndex - 1];
                prevBtn.href = `/case-study.html?id=${prevStudy.id}`;
                prevBtn.style.display = 'inline-block';
            } else {
                prevBtn.style.display = 'none';
            }
        }
        
        if (nextBtn) {
            if (currentIndex < published.length - 1) {
                const nextStudy = published[currentIndex + 1];
                nextBtn.href = `/case-study.html?id=${nextStudy.id}`;
                nextBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Failed to setup navigation:', error);
    }
}

/**
 * Show welcome message for visitor
 */
function showWelcomeMessage(name) {
    const heroSection = document.querySelector('.case-study-hero');
    if (!heroSection) return;
    
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.style.cssText = `
        background: #f8f9fa;
        border-left: 4px solid #000;
        padding: 16px 20px;
        margin: 20px 0;
        border-radius: 4px;
    `;
    welcome.innerHTML = `
        <p style="margin: 0; font-size: 14px; color: #666;">
            Welcome, <strong>${name}</strong>! Thank you for your interest in this case study.
        </p>
    `;
    
    heroSection.appendChild(welcome);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        welcome.style.transition = 'opacity 0.5s';
        welcome.style.opacity = '0';
        setTimeout(() => welcome.remove(), 500);
    }, 5000);
}

/**
 * Show loading state
 */
function showLoadingState() {
    const main = document.querySelector('main, .case-study-container');
    if (!main) return;
    
    main.innerHTML = `
        <div class="loading-state" style="text-align: center; padding: 100px 20px;">
            <div class="spinner"></div>
            <p style="margin-top: 20px; color: #666;">Loading case study...</p>
        </div>
    `;
}

/**
 * Show error state
 */
function showErrorState() {
    const main = document.querySelector('main, .case-study-container');
    if (!main) return;
    
    main.innerHTML = `
        <div class="error-state" style="text-align: center; padding: 100px 20px;">
            <h2 style="color: #333; margin-bottom: 16px;">Case Study Not Found</h2>
            <p style="color: #666; margin-bottom: 24px;">
                Sorry, this case study could not be loaded or does not exist.
            </p>
            <a href="/work.html" class="btn-primary" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 8px;">
                Back to Work
            </a>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadCaseStudy);
