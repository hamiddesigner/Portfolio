import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Lock, Unlock, Edit2, Trash2, X, Save, RefreshCw, FileText, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import './CaseStudies.css';

function CaseStudies() {
  const [globalPassword, setGlobalPassword] = useState('');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [caseStudies, setCaseStudies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [deleteStudyId, setDeleteStudyId] = useState(null);
  const [previewStudy, setPreviewStudy] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    timeline: '',
    tools: '',
    overview: '',
    thumbnail: '',
    thumbnailBgColor: '#f5f5f5',
    tags: '',
    isPasswordProtected: false,
    status: 'draft',
    content: {
      sections: [{ id: Date.now(), title: 'The Challenge', content: '' }],
      results: [{ id: Date.now(), number: '', label: '' }],
      keyFeatures: [{ id: Date.now() + 1, title: '', description: '', imageUrl: '' }]
    }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStudies = localStorage.getItem('caseStudies');
    const savedPassword = localStorage.getItem('globalCaseStudyPassword');
    const savedPasswordEnabled = localStorage.getItem('globalPasswordEnabled');
    
    if (savedStudies) setCaseStudies(JSON.parse(savedStudies));
    if (savedPassword) setGlobalPassword(savedPassword);
    if (savedPasswordEnabled) setPasswordEnabled(savedPasswordEnabled === 'true');
  }, []);

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGlobalPassword(password);
  };

  // Save global password
  const saveGlobalPassword = () => {
    if (passwordEnabled && !globalPassword) {
      toast.error('Please enter a password');
      return;
    }
    localStorage.setItem('globalCaseStudyPassword', globalPassword);
    localStorage.setItem('globalPasswordEnabled', passwordEnabled.toString());
    toast.success('Password settings saved!');
  };

  // Open add modal
  const openAddModal = () => {
    setEditingStudy(null);
    setFormData({
      title: '',
      role: '',
      timeline: '',
      tools: '',
      overview: '',
      thumbnail: '',
      thumbnailBgColor: '#f5f5f5',
      tags: '',
      isPasswordProtected: false,
      status: 'draft',
      content: {
        sections: [{ id: Date.now(), title: 'The Challenge', content: '' }],
        results: [{ id: Date.now(), number: '', label: '' }],
        keyFeatures: [{ id: Date.now() + 1, title: '', description: '', imageUrl: '' }]
      }
    });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (study) => {
    setEditingStudy(study);
    
    // Convert old structure to new structure if needed
    let content = study.content;
    if (content && !content.sections) {
      // Old structure - convert to new
      const sections = [];
      if (content.challenge) sections.push({ id: Date.now(), title: 'The Challenge', content: content.challenge });
      if (content.myRole) sections.push({ id: Date.now() + 1, title: 'My Role', content: content.myRole });
      if (content.designProcess) sections.push({ id: Date.now() + 2, title: 'Design Process', content: content.designProcess });
      if (content.finalSolution) sections.push({ id: Date.now() + 3, title: 'Final Solution', content: content.finalSolution });
      
      content = {
        sections: sections.length > 0 ? sections : [{ id: Date.now(), title: 'The Challenge', content: '' }],
        results: content.results?.map((r, i) => ({ ...r, id: r.id || Date.now() + i })) || [{ id: Date.now(), number: '', label: '' }],
        keyFeatures: content.keyFeatures?.map((f, i) => ({ ...f, id: f.id || Date.now() + 100 + i })) || [{ id: Date.now(), title: '', description: '', imageUrl: '' }]
      };
    }
    
    setFormData({
      ...study,
      tags: Array.isArray(study.tags) ? study.tags.join(', ') : study.tags,
      content: content
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingStudy(null);
  };

  // Save case study
  const saveCaseStudy = (status) => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.overview.trim()) {
      toast.error('Overview is required');
      return;
    }
    if (!formData.role.trim()) {
      toast.error('Role is required');
      return;
    }

    const study = {
      id: editingStudy ? editingStudy.id : Date.now().toString(),
      title: formData.title,
      role: formData.role,
      timeline: formData.timeline,
      tools: formData.tools,
      overview: formData.overview,
      thumbnail: formData.thumbnail,
      thumbnailBgColor: formData.thumbnailBgColor,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPasswordProtected: formData.isPasswordProtected,
      status: status,
      content: formData.content,
      createdAt: editingStudy ? editingStudy.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedStudies;
    if (editingStudy) {
      updatedStudies = caseStudies.map(s => s.id === editingStudy.id ? study : s);
      toast.success('Case study updated!');
    } else {
      updatedStudies = [...caseStudies, study];
      toast.success('Case study created!');
    }

    setCaseStudies(updatedStudies);
    localStorage.setItem('caseStudies', JSON.stringify(updatedStudies));
    closeModal();
  };

  // Toggle lock
  const toggleLock = (id) => {
    const updatedStudies = caseStudies.map(study =>
      study.id === id ? { ...study, isPasswordProtected: !study.isPasswordProtected } : study
    );
    setCaseStudies(updatedStudies);
    localStorage.setItem('caseStudies', JSON.stringify(updatedStudies));
    toast.success('Password protection updated');
  };

  // Delete case study
  const deleteCaseStudy = () => {
    const updatedStudies = caseStudies.filter(study => study.id !== deleteStudyId);
    setCaseStudies(updatedStudies);
    localStorage.setItem('caseStudies', JSON.stringify(updatedStudies));
    setShowDeleteModal(false);
    setDeleteStudyId(null);
    toast.success('Case study deleted');
  };

  // Quill modules
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="case-studies-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Manage Case Studies</h1>
          <p>Create, edit, and manage your portfolio case studies</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          <span>Add New Case Study</span>
        </button>
      </div>

      {/* Global Password Settings */}
      <div className="password-settings-card">
        <h2>Global Password Protection</h2>
        <div className="password-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={passwordEnabled}
              onChange={(e) => setPasswordEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">Enable password protection for all case studies</span>
          </label>
        </div>

        {passwordEnabled && (
          <div className="password-inputs">
            <div className="password-field">
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={globalPassword}
                  onChange={(e) => setGlobalPassword(e.target.value)}
                  placeholder="Enter password"
                  className="password-input"
                />
                <button
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="password-actions">
              <button className="btn-secondary" onClick={generatePassword}>
                <RefreshCw size={16} />
                Generate Random Password
              </button>
              <button className="btn-primary" onClick={saveGlobalPassword}>
                <Save size={16} />
                Save Password
              </button>
            </div>
            <p className="info-text">
              <Lock size={14} />
              This password applies to all protected case studies
            </p>
          </div>
        )}
      </div>

      {/* Case Studies Table */}
      <div className="case-studies-table">
        {caseStudies.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>No case studies yet</p>
            <button className="btn-primary" onClick={openAddModal}>
              Create your first case study
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Status</th>
                <th>Protected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((study) => (
                <tr key={study.id}>
                  <td>
                    <div className="thumbnail">
                      {study.thumbnail ? (
                        <img src={study.thumbnail} alt={study.title} />
                      ) : (
                        <div className="thumbnail-placeholder">No image</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="title-cell">
                      <strong>{study.title}</strong>
                      <p>{study.overview}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${study.status}`}>
                      {study.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${study.isPasswordProtected ? 'badge-protected' : 'badge-public'}`}>
                      {study.isPasswordProtected ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setPreviewStudy(study);
                          setShowPreviewModal(true);
                        }}
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => toggleLock(study.id)}
                        title={study.isPasswordProtected ? 'Remove password' : 'Add password'}
                      >
                        {study.isPasswordProtected ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => openEditModal(study)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => {
                          setDeleteStudyId(study.id);
                          setShowDeleteModal(true);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudy ? 'Edit Case Study' : 'Add New Case Study'}</h2>
              <button className="icon-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="SaaS Analytics Dashboard"
                  />
                </div>

                <div className="form-group form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Lead Product Designer"
                    />
                  </div>

                  <div className="form-group">
                    <label>Timeline</label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder="Jan 2024 - Mar 2024"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tools (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder="Figma, FigJam, Maze"
                  />
                </div>

                <div className="form-group">
                  <label>Overview *</label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Brief project overview (2-3 lines describing the project impact)"
                    rows="3"
                  />
                </div>

                <div className="form-group form-row">
                  <div className="form-group">
                    <label>Featured Image URL</label>
                    <input
                      type="text"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image Background Color</label>
                    <input
                      type="text"
                      value={formData.thumbnailBgColor}
                      onChange={(e) => setFormData({ ...formData, thumbnailBgColor: e.target.value })}
                      placeholder="#dedef2"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="SaaS, Mobile, Website"
                  />
                </div>

                <div className="form-group form-row">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={formData.isPasswordProtected}
                      onChange={(e) => setFormData({ ...formData, isPasswordProtected: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">Password Protected</span>
                  </label>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="content-sections">
                <h3>Case Study Content</h3>

                <div className="form-group">
                  <label>The Challenge</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content.challenge}
                    onChange={(value) => setFormData({
                      ...formData,
                      content: { ...formData.content, challenge: value }
                    })}
                    modules={quillModules}
                    placeholder="Describe the problem, pain points, and context..."
                  />
                </div>

                <div className="form-group">
                  <label>My Role & Responsibilities</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content.myRole}
                    onChange={(value) => setFormData({
                      ...formData,
                      content: { ...formData.content, myRole: value }
                    })}
                    modules={quillModules}
                    placeholder="Your responsibilities, team collaboration, etc..."
                  />
                </div>

                <div className="form-group">
                  <label>Design Process & Iterations</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content.designProcess}
                    onChange={(value) => setFormData({
                      ...formData,
                      content: { ...formData.content, designProcess: value }
                    })}
                    modules={quillModules}
                    placeholder="Research, wireframes, iterations, visual design..."
                  />
                </div>

                <div className="form-group">
                  <label>Final Solution</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content.finalSolution}
                    onChange={(value) => setFormData({
                      ...formData,
                      content: { ...formData.content, finalSolution: value }
                    })}
                    modules={quillModules}
                    placeholder="Key features, design decisions, implementation..."
                  />
                </div>

                <h3 style={{ marginTop: '32px' }}>Impact & Results</h3>
                {formData.content.results.map((result, index) => (
                  <div key={index} className="form-group form-row">
                    <div className="form-group">
                      <label>Result Number</label>
                      <input
                        type="text"
                        value={result.number}
                        onChange={(e) => {
                          const newResults = [...formData.content.results];
                          newResults[index].number = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, results: newResults }
                          });
                        }}
                        placeholder="40%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Result Label</label>
                      <input
                        type="text"
                        value={result.label}
                        onChange={(e) => {
                          const newResults = [...formData.content.results];
                          newResults[index].label = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, results: newResults }
                          });
                        }}
                        placeholder="Faster task completion"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => {
                          const newResults = formData.content.results.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            content: { ...formData.content, results: newResults }
                          });
                        }}
                        type="button"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        results: [...formData.content.results, { number: '', label: '' }]
                      }
                    });
                  }}
                  type="button"
                  style={{ marginTop: '12px' }}
                >
                  <Plus size={16} />
                  Add Result
                </button>

                <h3 style={{ marginTop: '32px' }}>Key Features</h3>
                {formData.content.keyFeatures.map((feature, index) => (
                  <div key={index} className="feature-form-block">
                    <div className="form-group">
                      <label>Feature Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...formData.content.keyFeatures];
                          newFeatures[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, keyFeatures: newFeatures }
                          });
                        }}
                        placeholder="Customizable Widget System"
                      />
                    </div>
                    <div className="form-group">
                      <label>Feature Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...formData.content.keyFeatures];
                          newFeatures[index].description = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, keyFeatures: newFeatures }
                          });
                        }}
                        placeholder="Users can add, remove, and rearrange widgets..."
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label>Feature Image URL</label>
                      <input
                        type="text"
                        value={feature.imageUrl}
                        onChange={(e) => {
                          const newFeatures = [...formData.content.keyFeatures];
                          newFeatures[index].imageUrl = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, keyFeatures: newFeatures }
                          });
                        }}
                        placeholder="https://example.com/feature-image.jpg"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        className="btn-danger"
                        onClick={() => {
                          const newFeatures = formData.content.keyFeatures.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            content: { ...formData.content, keyFeatures: newFeatures }
                          });
                        }}
                        type="button"
                        style={{ marginTop: '12px' }}
                      >
                        <Trash2 size={16} />
                        Remove Feature
                      </button>
                    )}
                    {index < formData.content.keyFeatures.length - 1 && (
                      <div style={{ height: '1px', background: '#e6e6e6', margin: '24px 0' }}></div>
                    )}
                  </div>
                ))}
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        keyFeatures: [...formData.content.keyFeatures, { title: '', description: '', imageUrl: '' }]
                      }
                    });
                  }}
                  type="button"
                  style={{ marginTop: '12px' }}
                >
                  <Plus size={16} />
                  Add Key Feature
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-secondary" onClick={() => saveCaseStudy('draft')}>
                Save as Draft
              </button>
              <button className="btn-primary" onClick={() => saveCaseStudy('published')}>
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Case Study</h2>
              <button className="icon-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this case study?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={deleteCaseStudy}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewStudy && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Preview: {previewStudy.title}</h2>
              <button className="icon-btn" onClick={() => setShowPreviewModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {/* Hero Section */}
              <div className="preview-section">
                <div className="preview-thumbnail" style={{ backgroundColor: previewStudy.thumbnailBgColor }}>
                  {previewStudy.thumbnail ? (
                    <img src={previewStudy.thumbnail} alt={previewStudy.title} />
                  ) : (
                    <div className="preview-thumbnail-placeholder">No thumbnail</div>
                  )}
                </div>
                <div className="preview-hero">
                  <h1 className="preview-title">{previewStudy.title}</h1>
                  {previewStudy.tags && typeof previewStudy.tags === 'string' && previewStudy.tags.trim() && (
                    <div className="preview-tags">
                      {previewStudy.tags.split(',').map((tag, index) => (
                        <span key={index} className="preview-tag">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="preview-meta">
                    <div className="preview-meta-item">
                      <strong>Role:</strong> {previewStudy.role}
                    </div>
                    <div className="preview-meta-item">
                      <strong>Timeline:</strong> {previewStudy.timeline}
                    </div>
                    <div className="preview-meta-item">
                      <strong>Tools:</strong> {previewStudy.tools}
                    </div>
                  </div>
                  <p className="preview-overview">{previewStudy.overview}</p>
                </div>
              </div>

              {/* Content Sections */}
              {previewStudy.content.challenge && (
                <div className="preview-section">
                  <h3>The Challenge</h3>
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewStudy.content.challenge }} />
                </div>
              )}

              {previewStudy.content.myRole && (
                <div className="preview-section">
                  <h3>My Role</h3>
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewStudy.content.myRole }} />
                </div>
              )}

              {previewStudy.content.designProcess && (
                <div className="preview-section">
                  <h3>Design Process</h3>
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewStudy.content.designProcess }} />
                </div>
              )}

              {previewStudy.content.results && previewStudy.content.results.length > 0 && previewStudy.content.results[0].number && (
                <div className="preview-section">
                  <h3>Results & Impact</h3>
                  <div className="preview-results">
                    {previewStudy.content.results.map((result, index) => (
                      <div key={index} className="preview-result-item">
                        <div className="preview-result-number">{result.number}</div>
                        <div className="preview-result-label">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewStudy.content.keyFeatures && previewStudy.content.keyFeatures.length > 0 && previewStudy.content.keyFeatures[0].title && (
                <div className="preview-section">
                  <h3>Key Features</h3>
                  {previewStudy.content.keyFeatures.map((feature, index) => (
                    <div key={index} className="preview-feature">
                      <h4>{feature.title}</h4>
                      <div className="preview-content" dangerouslySetInnerHTML={{ __html: feature.description }} />
                      {feature.imageUrl && (
                        <img src={feature.imageUrl} alt={feature.title} className="preview-feature-image" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {previewStudy.content.finalSolution && (
                <div className="preview-section">
                  <h3>Final Solution</h3>
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewStudy.content.finalSolution }} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPreviewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseStudies;
