// ============================================================================
// LOAD ABOUT PAGE - Dynamic content loading for about page
// ============================================================================

import { API } from './api.js';

/**
 * Load all about page content
 */
async function loadAboutPage() {
    await Promise.all([
        loadAboutHero(),
        loadWorkExperience(),
        loadEducation(),
        loadCertifications(),
        loadSkills()
    ]);
}

/**
 * Load about hero section
 */
async function loadAboutHero() {
    try {
        const content = await API.getPageContent('about_content');
        
        const heroImage = document.querySelector('.about-hero-image, .profile-image');
        if (heroImage && content.profileImage) {
            heroImage.src = content.profileImage;
            heroImage.alt = 'Hamid Ali';
        }
        
        const bio = document.querySelector('.about-bio, .bio-content');
        if (bio) {
            bio.innerHTML = content.bio || '<p>Product designer passionate about creating user-centered digital experiences.</p>';
        }
    } catch (error) {
        console.error('Failed to load about hero:', error);
    }
}

/**
 * Load work experience timeline
 */
async function loadWorkExperience() {
    try {
        const experience = await API.getPageContent('work_experience');
        
        if (!Array.isArray(experience)) {
            console.warn('Work experience is not an array');
            return;
        }
        
        const timeline = document.querySelector('.experience-timeline, .timeline');
        if (!timeline) {
            console.warn('Experience timeline container not found');
            return;
        }
        
        timeline.innerHTML = '';
        
        if (experience.length === 0) {
            timeline.innerHTML = '<p style="text-align: center; color: #999;">No work experience added yet.</p>';
            return;
        }
        
        experience.forEach(job => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const endDate = job.isPresent || job.isCurrent ? 'Present' : (job.endDate || '');
            const dateRange = `${job.startDate || ''} - ${endDate}`;
            
            item.innerHTML = `
                <div class="timeline-date">${dateRange}</div>
                <div class="timeline-content">
                    <h3 class="job-title">${job.title || ''}</h3>
                    <h4 class="company-name">${job.company || ''}</h4>
                    ${job.location ? `<p class="job-location">${job.location}</p>` : ''}
                    <p class="job-description">${job.description || ''}</p>
                    ${job.achievements && job.achievements.length > 0 ? `
                        <ul class="achievements">
                            ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
            
            timeline.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to load work experience:', error);
    }
}

/**
 * Load education
 */
async function loadEducation() {
    try {
        const education = await API.getPageContent('education');
        
        const degree = document.querySelector('.education-degree');
        if (degree) degree.textContent = education.degree || 'Bachelor of Design';
        
        const institution = document.querySelector('.education-institution');
        if (institution) institution.textContent = education.institution || 'University';
        
        const year = document.querySelector('.education-year');
        if (year) year.textContent = education.year || '2024';
        
        const description = document.querySelector('.education-description');
        if (description && education.description) {
            description.textContent = education.description;
        }
    } catch (error) {
        console.error('Failed to load education:', error);
    }
}

/**
 * Load certifications
 */
async function loadCertifications() {
    try {
        const certifications = await API.getPageContent('certifications');
        
        if (!Array.isArray(certifications)) {
            console.warn('Certifications is not an array');
            return;
        }
        
        const grid = document.querySelector('.certifications-grid, .certs-grid');
        if (!grid) {
            console.warn('Certifications grid not found');
            return;
        }
        
        grid.innerHTML = '';
        
        if (certifications.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No certifications added yet.</p>';
            return;
        }
        
        certifications.forEach(cert => {
            const card = document.createElement(cert.url ? 'a' : 'div');
            if (cert.url) {
                card.href = cert.url;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
            }
            card.className = 'certification-card';
            
            card.innerHTML = `
                <div class="cert-icon">${cert.icon || '🎓'}</div>
                <h4 class="cert-name">${cert.name || ''}</h4>
                <p class="cert-organization">${cert.organization || ''}</p>
                ${cert.date ? `<span class="cert-date">${cert.date}</span>` : ''}
                ${cert.credential ? `<span class="cert-credential">ID: ${cert.credential}</span>` : ''}
            `;
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load certifications:', error);
    }
}

/**
 * Load skills (same as homepage)
 */
async function loadSkills() {
    try {
        const skills = await API.getPageContent('homepage_skills');
        
        const skillsContainer = document.querySelector('.about-skills-list, .skills-list');
        if (skillsContainer && skills.skills) {
            skillsContainer.innerHTML = skills.skills
                .map(skill => `<span class="skill-tag">${skill}</span>`)
                .join('');
        }
        
        const toolsContainer = document.querySelector('.about-tools-list, .tools-list');
        if (toolsContainer && skills.tools) {
            toolsContainer.innerHTML = skills.tools
                .map(tool => `<span class="tool-tag">${tool}</span>`)
                .join('');
        }
    } catch (error) {
        console.error('Failed to load skills:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAboutPage);
