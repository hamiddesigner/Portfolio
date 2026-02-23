import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, X, ChevronUp, ChevronDown, Image as ImageIcon, ExternalLink } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import './PageContent.css';

// Register custom font sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
Quill.register(Size, true);

function PageContent() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [showCertModal, setShowCertModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  // Quill modules
  const quillModules = {
    toolbar: [
      [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  // Homepage data
  const [homepage, setHomepage] = useState({
    hero: {
      heading: '',
      subtitle: '',
      tagline: '',
      avatar: ''
    },
    skills: ''
  });

  // About page data
  const [about, setAbout] = useState({
    bio: '',
    certifications: []
  });

  // FAQs data
  const [faqs, setFaqs] = useState({
    items: []
  });

  // Footer data
  const [footer, setFooter] = useState({
    copyright: '',
    email: '',
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      dribbble: ''
    }
  });

  // Cert form
  const [certForm, setCertForm] = useState({
    name: '',
    organization: '',
    date: '',
    url: ''
  });

  // FAQ form
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: ''
  });

  // Load data
  useEffect(() => {
    const savedHomepage = localStorage.getItem('pageContent_homepage');
    const savedAbout = localStorage.getItem('pageContent_about');
    const savedFaqs = localStorage.getItem('pageContent_faqs');
    const savedFooter = localStorage.getItem('pageContent_footer');

    if (savedHomepage) setHomepage(JSON.parse(savedHomepage));
    if (savedAbout) setAbout(JSON.parse(savedAbout));
    if (savedFaqs) setFaqs(JSON.parse(savedFaqs));
    if (savedFooter) setFooter(JSON.parse(savedFooter));
  }, []);

  // Save functions
  const saveHeroSection = () => {
    if (!homepage.hero.heading) {
      toast.error('Heading is required');
      return;
    }
    localStorage.setItem('pageContent_homepage', JSON.stringify(homepage));
    toast.success('Hero section saved!');
  };

  const saveSkills = () => {
    if (!homepage.skills) {
      toast.error('Skills are required');
      return;
    }
    localStorage.setItem('pageContent_homepage', JSON.stringify(homepage));
    toast.success('Skills saved!');
  };

  const saveAboutBio = () => {
    if (!about.bio || about.bio === '<p><br></p>') {
      toast.error('Bio content is required');
      return;
    }
    localStorage.setItem('pageContent_about', JSON.stringify(about));
    toast.success('About page bio saved!');
  };

  const saveFooter = () => {
    if (!footer.email) {
      toast.error('Email is required');
      return;
    }
    localStorage.setItem('pageContent_footer', JSON.stringify(footer));
    toast.success('Footer saved!');
  };

  // Avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomepage({
          ...homepage,
          hero: { ...homepage.hero, avatar: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Certification CRUD
  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({ name: '', organization: '', date: '', url: '' });
    setShowCertModal(true);
  };

  const openEditCert = (cert) => {
    setEditingCert(cert);
    setCertForm({ ...cert });
    setShowCertModal(true);
  };

  const saveCertification = () => {
    if (!certForm.name || !certForm.organization || !certForm.date) {
      toast.error('Name, organization, and date are required');
      return;
    }

    let updatedCerts;
    if (editingCert) {
      updatedCerts = about.certifications.map(c => 
        c.id === editingCert.id ? { ...certForm, id: editingCert.id } : c
      );
    } else {
      updatedCerts = [...about.certifications, { ...certForm, id: Date.now() }];
    }

    const updatedAbout = { ...about, certifications: updatedCerts };
    setAbout(updatedAbout);
    localStorage.setItem('pageContent_about', JSON.stringify(updatedAbout));
    setShowCertModal(false);
    toast.success(editingCert ? 'Certification updated!' : 'Certification added!');
  };

  const deleteCertification = (id) => {
    const updatedCerts = about.certifications.filter(c => c.id !== id);
    const updatedAbout = { ...about, certifications: updatedCerts };
    setAbout(updatedAbout);
    localStorage.setItem('pageContent_about', JSON.stringify(updatedAbout));
    toast.success('Certification deleted!');
  };

  // FAQ CRUD
  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(true);
  };

  const openEditFaq = (faq) => {
    setEditingFaq(faq);
    setFaqForm({ ...faq });
    setShowFaqModal(true);
  };

  const saveFaq = () => {
    if (!faqForm.question || !faqForm.answer || faqForm.answer === '<p><br></p>') {
      toast.error('Question and answer are required');
      return;
    }

    let updatedItems;
    if (editingFaq) {
      updatedItems = faqs.items.map(f => 
        f.id === editingFaq.id ? { ...faqForm, id: editingFaq.id } : f
      );
    } else {
      updatedItems = [...faqs.items, { ...faqForm, id: Date.now() }];
    }

    const updatedFaqs = { ...faqs, items: updatedItems };
    setFaqs(updatedFaqs);
    localStorage.setItem('pageContent_faqs', JSON.stringify(updatedFaqs));
    setShowFaqModal(false);
    toast.success(editingFaq ? 'FAQ updated!' : 'FAQ added!');
  };

  const deleteFaq = (id) => {
    const updatedItems = faqs.items.filter(f => f.id !== id);
    const updatedFaqs = { ...faqs, items: updatedItems };
    setFaqs(updatedFaqs);
    localStorage.setItem('pageContent_faqs', JSON.stringify(updatedFaqs));
    toast.success('FAQ deleted!');
  };

  const moveFaq = (index, direction) => {
    const newItems = [...faqs.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    const updatedFaqs = { ...faqs, items: newItems };
    setFaqs(updatedFaqs);
    localStorage.setItem('pageContent_faqs', JSON.stringify(updatedFaqs));
  };

  return (
    <div className="page-content-editor">
      <div className="admin-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Edit Page Content</h1>
            <p>Manage content for Homepage, About, FAQs, and Footer</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="content-tabs">
          <button 
            className={activeTab === 'homepage' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('homepage')}
          >
            Homepage
          </button>
          <button 
            className={activeTab === 'about' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={activeTab === 'faqs' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('faqs')}
          >
            FAQs
          </button>
          <button 
            className={activeTab === 'footer' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('footer')}
          >
            Footer
          </button>
        </div>

        {/* Homepage Tab */}
        {activeTab === 'homepage' && (
          <div className="tab-content">
            {/* Hero Section */}
            <div className="content-section">
              <h2>Hero Section</h2>
              <div className="form-group">
                <label>Main Headline *</label>
                <input
                  type="text"
                  value={homepage.hero.heading}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, heading: e.target.value }
                  })}
                  placeholder="e.g., Hi, I'm John Doe"
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={homepage.hero.subtitle}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, subtitle: e.target.value }
                  })}
                  placeholder="e.g., Product Designer & UX Engineer"
                />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <textarea
                  value={homepage.hero.tagline}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, tagline: e.target.value }
                  })}
                  placeholder="Brief tagline or description"
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Profile Avatar</label>
                <div className="avatar-upload">
                  {homepage.hero.avatar ? (
                    <div className="avatar-preview">
                      <img src={homepage.hero.avatar} alt="Avatar" />
                      <button 
                        className="remove-avatar-btn"
                        onClick={() => setHomepage({
                          ...homepage,
                          hero: { ...homepage.hero, avatar: '' }
                        })}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="avatar-upload-label">
                      <ImageIcon size={20} />
                      <span>Upload avatar</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
              <button className="btn-primary" onClick={saveHeroSection}>
                <Save size={16} />
                Save Hero Section
              </button>
            </div>

            {/* Skills & Tools */}
            <div className="content-section">
              <h2>Skills & Tools</h2>
              <div className="form-group">
                <label>Skills list (comma-separated) *</label>
                <textarea
                  value={homepage.skills}
                  onChange={(e) => setHomepage({ ...homepage, skills: e.target.value })}
                  placeholder="e.g., Figma, React, TypeScript, Node.js, UX Design"
                  rows="2"
                />
                <small>Separate each skill with a comma</small>
              </div>
              <button className="btn-primary" onClick={saveSkills}>
                <Save size={16} />
                Save Skills
              </button>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="tab-content">
            <div className="content-section">
              <h2>About Page Bio</h2>
              <div className="form-group">
                <label>Full Bio *</label>
                <ReactQuill
                  theme="snow"
                  value={about.bio}
                  onChange={(value) => setAbout({ ...about, bio: value })}
                  modules={quillModules}
                  placeholder="Write your complete bio..."
                />
              </div>
              <button className="btn-primary" onClick={saveAboutBio}>
                <Save size={16} />
                Save About Bio
              </button>
            </div>

            {/* Certifications */}
            <div className="content-section">
              <div className="section-header">
                <h2>Certifications</h2>
                <button className="btn-secondary" onClick={openAddCert}>
                  <Plus size={16} />
                  Add Certification
                </button>
              </div>
              {about.certifications.length === 0 ? (
                <div className="empty-message">
                  No certifications added yet
                </div>
              ) : (
                <div className="items-list">
                  {about.certifications.map(cert => (
                    <div key={cert.id} className="item-card">
                      <div className="item-content">
                        <h3>{cert.name}</h3>
                        <p>{cert.organization} • {cert.date}</p>
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="item-link">
                            <ExternalLink size={14} />
                            View Certificate
                          </a>
                        )}
                      </div>
                      <div className="item-actions">
                        <button className="icon-btn" onClick={() => openEditCert(cert)}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => deleteCertification(cert.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="tab-content">
            <div className="content-section">
              <div className="section-header">
                <h2>Frequently Asked Questions</h2>
                <button className="btn-secondary" onClick={openAddFaq}>
                  <Plus size={16} />
                  Add FAQ
                </button>
              </div>

              {faqs.items.length === 0 ? (
                <div className="empty-message">
                  No FAQs added yet
                </div>
              ) : (
                <div className="items-list">
                  {faqs.items.map((faq, index) => (
                    <div key={faq.id} className="item-card faq-card">
                      <div className="item-content">
                        <h3>{faq.question}</h3>
                        <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </div>
                      <div className="item-actions">
                        <button 
                          className="icon-btn" 
                          onClick={() => moveFaq(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button 
                          className="icon-btn" 
                          onClick={() => moveFaq(index, 'down')}
                          disabled={index === faqs.items.length - 1}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => openEditFaq(faq)}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => deleteFaq(faq.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="tab-content">
            <div className="content-section">
              <h2>Footer Information</h2>
              <div className="form-group">
                <label>Copyright Text</label>
                <input
                  type="text"
                  value={footer.copyright}
                  onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                  placeholder="© 2024 Your Name. All rights reserved."
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={footer.email}
                  onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <h3>Social Links</h3>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={footer.social.linkedin}
                  onChange={(e) => setFooter({ 
                    ...footer, 
                    social: { ...footer.social, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={footer.social.github}
                  onChange={(e) => setFooter({ 
                    ...footer, 
                    social: { ...footer.social, github: e.target.value }
                  })}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="form-group">
                <label>Twitter URL</label>
                <input
                  type="url"
                  value={footer.social.twitter}
                  onChange={(e) => setFooter({ 
                    ...footer, 
                    social: { ...footer.social, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="form-group">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={footer.social.instagram}
                  onChange={(e) => setFooter({ 
                    ...footer, 
                    social: { ...footer.social, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="form-group">
                <label>Dribbble URL</label>
                <input
                  type="url"
                  value={footer.social.dribbble}
                  onChange={(e) => setFooter({ 
                    ...footer, 
                    social: { ...footer.social, dribbble: e.target.value }
                  })}
                  placeholder="https://dribbble.com/yourprofile"
                />
              </div>
              
              <button className="btn-primary" onClick={saveFooter}>
                <Save size={16} />
                Save Footer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certification Modal */}
      {showCertModal && (
        <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCert ? 'Edit Certification' : 'Add Certification'}</h2>
              <button className="icon-btn" onClick={() => setShowCertModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Certification Name *</label>
                <input
                  type="text"
                  value={certForm.name}
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  placeholder="e.g., Google UX Design Professional Certificate"
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization *</label>
                <input
                  type="text"
                  value={certForm.organization}
                  onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                  placeholder="e.g., Google via Coursera"
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="text"
                  value={certForm.date}
                  onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                  placeholder="e.g., 2024 or Jan 2024"
                />
              </div>
              <div className="form-group">
                <label>Certificate URL</label>
                <input
                  type="url"
                  value={certForm.url}
                  onChange={(e) => setCertForm({ ...certForm, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCertModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveCertification}>
                <Save size={16} />
                {editingCert ? 'Update' : 'Add'} Certification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="modal-overlay" onClick={() => setShowFaqModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button className="icon-btn" onClick={() => setShowFaqModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Question *</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="What is your question?"
                />
              </div>
              <div className="form-group">
                <label>Answer *</label>
                <ReactQuill
                  theme="snow"
                  value={faqForm.answer}
                  onChange={(value) => setFaqForm({ ...faqForm, answer: value })}
                  modules={quillModules}
                  placeholder="Write your answer..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowFaqModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveFaq}>
                <Save size={16} />
                {editingFaq ? 'Update' : 'Add'} FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageContent;
