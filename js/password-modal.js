// ============================================================================
// PASSWORD MODAL - Handle password-protected case studies
// ============================================================================

import { API } from './api.js';

let currentCaseStudyId = null;

/**
 * Open password modal for a case study
 * @param {string} caseStudyId - ID of the case study to unlock
 */
export function openPasswordModal(caseStudyId) {
  currentCaseStudyId = caseStudyId;
  
  // Create modal if it doesn't exist
  if (!document.querySelector('.password-modal')) {
    createModal();
  }
  
  const modal = document.querySelector('.password-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus on password input
  setTimeout(() => {
    modal.querySelector('input[name="password"]').focus();
  }, 100);
}

/**
 * Create modal HTML structure
 */
function createModal() {
  const modal = document.createElement('div');
  modal.className = 'password-modal';
  
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="Close">&times;</button>
      
      <div class="password-form-view">
        <div class="lock-icon">🔒</div>
        <h2>Password Protected</h2>
        <p>This case study is password protected. Please enter the password to access.</p>
        
        <form id="password-form">
          <input 
            type="text" 
            name="name" 
            placeholder="Your name" 
            required
            autocomplete="name"
          >
          <input 
            type="password" 
            name="password" 
            placeholder="Enter password" 
            required
            autocomplete="off"
          >
          <button type="submit" class="btn-primary">Unlock Case Study</button>
          <div class="error-message" style="display: none;"></div>
        </form>
        
        <button class="btn-link" id="request-access-btn">Don't have the password? Request access</button>
      </div>
      
      <div class="request-form-view" style="display: none;">
        <h2>Request Access</h2>
        <p>Request access to this case study and I'll get back to you with the password.</p>
        
        <form id="request-form">
          <input 
            type="text" 
            name="name" 
            placeholder="Your name" 
            required
            autocomplete="name"
          >
          <input 
            type="email" 
            name="email" 
            placeholder="your@email.com" 
            required
            autocomplete="email"
          >
          <textarea 
            name="message" 
            placeholder="Why are you interested in this case study? (optional)"
            rows="3"
          ></textarea>
          <button type="submit" class="btn-primary">Send Request</button>
        </form>
        
        <button class="btn-link" id="back-to-password-btn">Back to password</button>
      </div>
      
      <div class="success-view" style="display: none;">
        <div class="success-icon">✓</div>
        <h2>Request Sent!</h2>
        <p>Thanks for your interest! I'll get back to you soon with access details.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setupModalListeners();
}

/**
 * Setup all modal event listeners
 */
function setupModalListeners() {
  const modal = document.querySelector('.password-modal');
  
  // Close modal handlers
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
  
  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Password form
  modal.querySelector('#password-form').addEventListener('submit', handlePasswordSubmit);
  
  // Request access flow
  modal.querySelector('#request-access-btn').addEventListener('click', showRequestForm);
  modal.querySelector('#back-to-password-btn').addEventListener('click', showPasswordForm);
  modal.querySelector('#request-form').addEventListener('submit', handleRequestSubmit);
}

/**
 * Handle password form submission
 */
async function handlePasswordSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const password = form.password.value.trim();
  const name = form.name.value.trim();
  
  // Disable submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying...';
  
  try {
    const globalPassword = await API.getGlobalPassword();
    
    if (password === globalPassword) {
      // Password correct - store in sessionStorage and redirect
      sessionStorage.setItem(`unlocked_${currentCaseStudyId}`, 'true');
      sessionStorage.setItem(`visitor_name`, name);
      
      // Show success briefly before redirecting
      showSuccess('Access granted! Loading case study...');
      
      setTimeout(() => {
        window.location.href = `/case-study.html?id=${currentCaseStudyId}`;
      }, 1000);
    } else {
      // Password incorrect
      showError('Incorrect password. Please try again or request access.');
      shakePasswordInput();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    showError('Failed to verify password. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const errorEl = document.querySelector('.password-form-view .error-message');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  errorEl.style.color = '#dc3545';
}

/**
 * Show success message
 */
function showSuccess(message) {
  const errorEl = document.querySelector('.password-form-view .error-message');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  errorEl.style.color = '#28a745';
}

/**
 * Shake animation for password input
 */
function shakePasswordInput() {
  const input = document.querySelector('#password-form input[type="password"]');
  input.value = '';
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 500);
  input.focus();
}

/**
 * Show request access form
 */
function showRequestForm() {
  const modal = document.querySelector('.password-modal');
  modal.querySelector('.password-form-view').style.display = 'none';
  modal.querySelector('.request-form-view').style.display = 'block';
  
  // Pre-fill name if entered
  const name = document.querySelector('#password-form input[name="name"]').value;
  if (name) {
    document.querySelector('#request-form input[name="name"]').value = name;
  }
  
  // Focus on email input
  setTimeout(() => {
    modal.querySelector('#request-form input[name="email"]').focus();
  }, 100);
}

/**
 * Show password form
 */
function showPasswordForm() {
  const modal = document.querySelector('.password-modal');
  modal.querySelector('.password-form-view').style.display = 'block';
  modal.querySelector('.request-form-view').style.display = 'none';
  
  // Clear error
  document.querySelector('.password-form-view .error-message').style.display = 'none';
}

/**
 * Handle access request form submission
 */
async function handleRequestSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  
  // Disable submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  // Log the request (in production, this would send an email or save to database)
  console.log('Access request received:', {
    caseStudyId: currentCaseStudyId,
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  });
  
  // Simulate sending request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Show success message
  showSuccessMessage();
  
  // Auto-close after 3 seconds
  setTimeout(closeModal, 3000);
}

/**
 * Show success message view
 */
function showSuccessMessage() {
  const modal = document.querySelector('.password-modal');
  modal.querySelector('.request-form-view').style.display = 'none';
  modal.querySelector('.success-view').style.display = 'block';
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.querySelector('.password-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset to password view after animation
  setTimeout(() => {
    modal.querySelector('.password-form-view').style.display = 'block';
    modal.querySelector('.request-form-view').style.display = 'none';
    modal.querySelector('.success-view').style.display = 'none';
    modal.querySelector('#password-form').reset();
    modal.querySelector('#request-form').reset();
    document.querySelector('.password-form-view .error-message').style.display = 'none';
  }, 300);
}

/**
 * Check if case study is already unlocked in this session
 * @param {string} caseStudyId - ID of the case study
 * @returns {boolean} True if unlocked
 */
export function isUnlocked(caseStudyId) {
  return sessionStorage.getItem(`unlocked_${caseStudyId}`) === 'true';
}

/**
 * Get visitor name from session
 * @returns {string} Visitor name or empty string
 */
export function getVisitorName() {
  return sessionStorage.getItem('visitor_name') || '';
}
