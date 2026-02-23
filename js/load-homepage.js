// ============================================================================
// LOAD HOMEPAGE - Dynamic content loading for homepage
// ============================================================================

import { API } from './api.js';

/**
 * Load all homepage content
 */
async function loadHomepage() {
    await Promise.all([
        loadHeroSection(),
        loadAboutSnippet(),
        loadFeaturedCaseStudies(),
        loadSkillsAndTools(),
        loadContactCTA()
    ]);
}

/**
 * Load hero section content
 */
async function loadHeroSection() {
    try {
        const heroContent = await API.getPageContent('homepage_hero');
        
        const headline = document.querySelector('.hero-headline, h1.hero-title');
        if (headline) headline.textContent = heroContent.headline || 'Product Designer';
        
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) subtitle.textContent = heroContent.subtitle || 'Creating intuitive digital experiences';
        
        const tagline = document.querySelector('.hero-tagline');
        if (tagline) tagline.textContent = heroContent.tagline || 'Based in Pakistan';
        
        const heroImage = document.querySelector('.hero-image, .profile-image');
        if (heroImage && heroContent.profileImage) {
            heroImage.src = heroContent.profileImage;
            heroImage.alt = heroContent.headline || 'Hamid Ali';
        }
    } catch (error) {
        console.error('Failed to load hero section:', error);
    }
}

/**
 * Load about snippet for homepage
 */
async function loadAboutSnippet() {
    try {
        const aboutContent = await API.getPageContent('homepage_about');
        
        const bio = document.querySelector('.about-bio, .bio-text');
        if (bio) {
            bio.textContent = aboutContent.bio || "I'm a product designer passionate about creating user-centered digital experiences.";
        }
    } catch (error) {
        console.error('Failed to load about snippet:', error);
    }
}

/**
 * Load featured case studies for homepage
 */
async function loadFeaturedCaseStudies() {
    try {
        const caseStudies = await API.getCaseStudies();
        
        // Filter: published + featured (if featured field exists), otherwise just published, limit to 3
        let featured = caseStudies.filter(study => study.status === 'published');
        
        // If any studies have featured flag, prioritize those
        const hasFeatured = featured.some(s => s.featured === true);
        if (hasFeatured) {
            featured = featured.filter(s => s.featured === true);
        }
        
        // Take first 3
        featured = featured.slice(0, 3);
        
        const container = document.querySelector('.featured-work-grid, .work-preview-grid, .case-studies-grid');
        if (!container) {
            console.warn('Featured work container not found');
            return;
        }
        
        // Clear loading state or existing content
        container.innerHTML = '';
        
        if (featured.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No featured work yet.</p>';
            return;
        }
        
        featured.forEach(study => {
            const card = createFeaturedCard(study);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load featured case studies:', error);
    }
}

/**
 * Create a featured case study card
 */
function createFeaturedCard(study) {
    const card = document.createElement('a');
    card.href = `/case-study.html?id=${study.id}`;
    card.className = 'featured-card case-card';
    
    const thumbnail = study.thumbnail || 'https://via.placeholder.com/600x400/f0f0f0/666666?text=Case+Study';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${thumbnail}" alt="${study.title}" loading="lazy">
            ${study.is_password_protected ? '<span class="lock-badge">🔒</span>' : ''}
        </div>
        <div class="card-content">
            <h3>${study.title}</h3>
            <p>${study.description}</p>
            ${study.tags ? `
                <div class="tags">
                    ${study.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    // If password protected, prevent default and show modal
    if (study.is_password_protected) {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            // Import password modal dynamically if needed
            import('./password-modal.js').then(module => {
                module.openPasswordModal(study.id);
            });
        });
    }
    
    return card;
}

/**
 * Load skills and tools
 */
async function loadSkillsAndTools() {
    try {
        const skillsContent = await API.getPageContent('homepage_skills');
        
        const skillsContainer = document.querySelector('.skills-list, .skills-grid');
        if (skillsContainer && skillsContent.skills) {
            skillsContainer.innerHTML = skillsContent.skills
                .map(skill => `<span class="skill-tag">${skill}</span>`)
                .join('');
        }
        
        const toolsContainer = document.querySelector('.tools-list, .tools-grid');
        if (toolsContainer && skillsContent.tools) {
            toolsContainer.innerHTML = skillsContent.tools
                .map(tool => `<span class="tool-tag">${tool}</span>`)
                .join('');
        }
    } catch (error) {
        console.error('Failed to load skills and tools:', error);
    }
}

/**
 * Load contact CTA section
 */
async function loadContactCTA() {
    try {
        const ctaContent = await API.getPageContent('homepage_cta');
        
        const heading = document.querySelector('.cta-heading, .contact-heading');
        if (heading) heading.textContent = ctaContent.heading || "Let's work together";
        
        const text = document.querySelector('.cta-text, .contact-text');
        if (text) text.textContent = ctaContent.text || 'Have a project in mind? Let\'s discuss how we can collaborate.';
        
        const emailText = document.querySelector('.cta-email, .contact-email');
        if (emailText) {
            const email = ctaContent.email || 'hello@hamidali.com';
            emailText.textContent = email;
            emailText.href = `mailto:${email}`;
        }
    } catch (error) {
        console.error('Failed to load contact CTA:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadHomepage);
