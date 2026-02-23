// ============================================================================
// API SERVICE - Centralized API calls to Netlify Functions
// ============================================================================

const API_BASE = '/.netlify/functions';

/**
 * Helper function for API calls
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>} JSON response
 */
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// ============================================================================
// API METHODS - Public interface for fetching data
// ============================================================================

export const API = {
  // Case Studies
  getCaseStudies: () => apiCall('/case-studies'),
  getCaseStudy: (id) => apiCall(`/case-studies/${id}`),
  
  // Posts
  getPosts: () => apiCall('/posts'),
  getPost: (id) => apiCall(`/posts/${id}`),
  
  // Page Content
  getPageContent: async (section) => {
    try {
      const data = await apiCall(`/page-content?section=${section}`);
      return data;
    } catch (error) {
      console.warn(`Failed to load ${section}, using fallback`);
      return getDefaultContent(section);
    }
  },
  
  // Settings
  getSettings: async () => {
    try {
      return await apiCall('/settings');
    } catch (error) {
      console.warn('Failed to load settings, using defaults');
      return getDefaultSettings();
    }
  },
  
  getGlobalPassword: async () => {
    try {
      const settings = await apiCall('/settings');
      return settings.globalPassword || '';
    } catch (error) {
      console.warn('Failed to load global password');
      return '';
    }
  },
  
  // Availability
  getAvailability: async () => {
    try {
      return await apiCall('/availability');
    } catch (error) {
      console.warn('Failed to load availability');
      return { available: true };
    }
  }
};

// ============================================================================
// DEFAULT FALLBACK DATA
// ============================================================================

function getDefaultContent(section) {
  const defaults = {
    homepage_hero: {
      headline: 'Product Designer',
      subtitle: 'Creating intuitive digital experiences',
      tagline: 'Based in Pakistan',
      profileImage: '/images/profile.jpg'
    },
    homepage_about: {
      bio: 'I\'m a product designer passionate about creating user-centered digital experiences.'
    },
    homepage_skills: {
      skills: ['UI/UX Design', 'Product Strategy', 'User Research', 'Prototyping'],
      tools: ['Figma', 'Sketch', 'Adobe XD', 'Principle']
    },
    homepage_cta: {
      heading: 'Let\'s work together',
      text: 'Have a project in mind? Let\'s discuss how we can collaborate.',
      email: 'hello@hamidali.com'
    },
    footer: {
      copyrightText: '© 2024 Hamid Ali. All rights reserved.',
      email: 'hello@hamidali.com'
    }
  };
  
  return defaults[section] || {};
}

function getDefaultSettings() {
  return {
    globalPassword: '',
    linkedin: '',
    github: '',
    dribbble: '',
    behance: ''
  };
}
