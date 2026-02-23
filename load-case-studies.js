// Load case studies dynamically from API
(async function loadCaseStudies() {
    const caseStudiesContainer = document.querySelector('.case-studies');
    if (!caseStudiesContainer) return;

    try {
        // Fetch case studies from API
        const response = await fetch('/api/case-studies');
        if (!response.ok) {
            console.error('Failed to fetch case studies:', response.statusText);
            showError();
            return;
        }

        const caseStudies = await response.json();
        console.log('Loaded case studies:', caseStudies);

        // Find the section header
        const sectionHeader = caseStudiesContainer.querySelector('.section-header');
        
        // Remove loading spinner
        const loadingSpinner = caseStudiesContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }

        // Filter only published case studies
        const publishedCases = caseStudies.filter(cs => cs.status === 'published');

        if (publishedCases.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.style.cssText = 'text-align: center; padding: 60px 20px; color: #999;';
            emptyMessage.innerHTML = `
                <p style="font-size: 18px; margin-bottom: 8px;">No case studies yet</p>
                <p style="font-size: 14px;">Check back soon for new work!</p>
            `;
            caseStudiesContainer.appendChild(emptyMessage);
            return;
        }

        // Render each case study
        publishedCases.forEach(caseStudy => {
            const card = createCaseStudyCard(caseStudy);
            caseStudiesContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading case studies:', error);
        showError();
    }

    function showError() {
        const loadingSpinner = caseStudiesContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.innerHTML = '<p style="color: #e74c3c;">Failed to load case studies. Please try again later.</p>';
        }
    }
})();

function createCaseStudyCard(caseStudy) {
    const { id, title, description, thumbnail, tags, is_password_protected } = caseStudy;
    
    // Determine if it's a locked or unlocked case
    const isLocked = is_password_protected;
    
    // Create card element
    const card = document.createElement(isLocked ? 'div' : 'a');
    card.className = isLocked ? 'case-card locked-case' : 'case-card clickable';
    
    if (!isLocked) {
        card.href = `case-study-${id}.html`; // Or use a generic case study page with ?id=${id}
    } else {
        card.setAttribute('data-case-title', title);
    }
    
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
    
    // Tags as date placeholder
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
    
    return card;
}
