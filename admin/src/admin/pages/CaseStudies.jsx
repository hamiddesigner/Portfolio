import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Lock, Unlock, Edit2, Trash2, X, Save, RefreshCw, FileText, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import './CaseStudies.css';

// Register custom font sizes for Quill
const Size = Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
Quill.register(Size, true);

function CaseStudies() {
  const [globalPassword, setGlobalPassword] = useState('');
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
      results: [{ id: Date.now() + 1, number: '', label: '' }],
      keyFeatures: [{ id: Date.now() + 2, title: '', description: '', imageUrl: '' }]
    }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStudies = localStorage.getItem('caseStudies');
    const savedPassword = localStorage.getItem('globalCaseStudyPassword');
    
    if (savedStudies) setCaseStudies(JSON.parse(savedStudies));
    if (savedPassword) setGlobalPassword(savedPassword);
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
    if (!globalPassword) {
      toast.error('Please enter a password');
      return;
    }
    localStorage.setItem('globalCaseStudyPassword', globalPassword);
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
        results: [{ id: Date.now() + 1, number: '', label: '' }],
        keyFeatures: [{ id: Date.now() + 2, title: '', description: '', imageUrl: '' }]
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

  // Quill modules with custom font sizes
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
        <div className="password-input-row">
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
              {/* Basic Info */}
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
                  <label>Tools & Technologies</label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder="Figma, FigJam, Maze, Adobe XD"
                  />
                </div>

                <div className="form-group">
                  <label>Overview *</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.overview}
                    onChange={(value) => setFormData({ ...formData, overview: value })}
                    modules={quillModules}
                    placeholder="Brief project overview (2-3 lines describing the project impact)"
                  />
                </div>

                <div className="form-group">
                  <label>Featured Image</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, thumbnail: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="thumbnail-upload" className="upload-trigger">
                      <Upload size={20} />
                      <span>Click to upload image</span>
                    </label>
                    {formData.thumbnail && (
                      <div className="image-preview">
                        <img src={formData.thumbnail} alt="Preview" />
                        <button
                          className="remove-image"
                          onClick={() => setFormData({ ...formData, thumbnail: '' })}
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
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

                <div className="form-group">
                  <label>Password Protected</label>
                  <select
                    value={formData.isPasswordProtected ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, isPasswordProtected: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Content Sections */}
              <div className="content-sections">
                <div className="section-header">
                  <h3>Content Sections</h3>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          sections: [...formData.content.sections, { id: Date.now(), title: '', content: '' }]
                        }
                      });
                    }}
                    type="button"
                  >
                    <Plus size={16} />
                    Add Section
                  </button>
                </div>

                {formData.content.sections.map((section, index) => (
                  <div key={section.id} className="section-block">
                    <div className="section-block-header">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...formData.content.sections];
                          newSections[index].title = e.target.value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, sections: newSections }
                          });
                        }}
                        placeholder="Section title (e.g., The Challenge, My Role)"
                        className="section-title-input"
                      />
                      <div className="section-controls">
                        {index > 0 && (
                          <button
                            className="icon-btn"
                            onClick={() => {
                              const newSections = [...formData.content.sections];
                              [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                              setFormData({
                                ...formData,
                                content: { ...formData.content, sections: newSections }
                              });
                            }}
                            title="Move up"
                            type="button"
                          >
                            <ChevronUp size={16} />
                          </button>
                        )}
                        {index < formData.content.sections.length - 1 && (
                          <button
                            className="icon-btn"
                            onClick={() => {
                              const newSections = [...formData.content.sections];
                              [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                              setFormData({
                                ...formData,
                                content: { ...formData.content, sections: newSections }
                              });
                            }}
                            title="Move down"
                            type="button"
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => {
                            const newSections = formData.content.sections.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              content: { ...formData.content, sections: newSections }
                            });
                          }}
                          title="Remove section"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={section.content}
                      onChange={(value) => {
                        const newSections = [...formData.content.sections];
                        newSections[index].content = value;
                        setFormData({
                          ...formData,
                          content: { ...formData.content, sections: newSections }
                        });
                      }}
                      modules={quillModules}
                      placeholder="Write your content here..."
                    />
                  </div>
                ))}
              </div>

              {/* Results Section */}
              <div className="content-sections">
                <div className="section-header">
                  <h3>Impact & Results</h3>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          results: [...formData.content.results, { id: Date.now(), number: '', label: '' }]
                        }
                      });
                    }}
                    type="button"
                  >
                    <Plus size={16} />
                    Add Result
                  </button>
                </div>

                {formData.content.results.map((result, index) => (
                  <div key={result.id} className="result-row">
                    <div className="form-row" style={{ flex: 1, gap: '12px' }}>
                      <div className="form-group" style={{ flex: '0 0 120px' }}>
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
                      <div className="form-group" style={{ flex: 1 }}>
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
                    </div>
                    <div className="section-controls">
                      {index > 0 && (
                        <button
                          className="icon-btn"
                          onClick={() => {
                            const newResults = [...formData.content.results];
                            [newResults[index - 1], newResults[index]] = [newResults[index], newResults[index - 1]];
                            setFormData({
                              ...formData,
                              content: { ...formData.content, results: newResults }
                            });
                          }}
                          title="Move up"
                          type="button"
                        >
                          <ChevronUp size={16} />
                        </button>
                      )}
                      {index < formData.content.results.length - 1 && (
                        <button
                          className="icon-btn"
                          onClick={() => {
                            const newResults = [...formData.content.results];
                            [newResults[index], newResults[index + 1]] = [newResults[index + 1], newResults[index]];
                            setFormData({
                              ...formData,
                              content: { ...formData.content, results: newResults }
                            });
                          }}
                          title="Move down"
                          type="button"
                        >
                          <ChevronDown size={16} />
                        </button>
                      )}
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => {
                          const newResults = formData.content.results.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            content: { ...formData.content, results: newResults }
                          });
                        }}
                        title="Remove result"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Features Section */}
              <div className="content-sections">
                <div className="section-header">
                  <h3>Key Features</h3>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          keyFeatures: [...formData.content.keyFeatures, { id: Date.now(), title: '', description: '', imageUrl: '' }]
                        }
                      });
                    }}
                    type="button"
                  >
                    <Plus size={16} />
                    Add Feature
                  </button>
                </div>

                {formData.content.keyFeatures.map((feature, index) => (
                  <div key={feature.id} className="feature-block">
                    <div className="feature-block-header">
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
                        placeholder="Feature title"
                        className="feature-title-input"
                      />
                      <div className="section-controls">
                        {index > 0 && (
                          <button
                            className="icon-btn"
                            onClick={() => {
                              const newFeatures = [...formData.content.keyFeatures];
                              [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
                              setFormData({
                                ...formData,
                                content: { ...formData.content, keyFeatures: newFeatures }
                              });
                            }}
                            title="Move up"
                            type="button"
                          >
                            <ChevronUp size={16} />
                          </button>
                        )}
                        {index < formData.content.keyFeatures.length - 1 && (
                          <button
                            className="icon-btn"
                            onClick={() => {
                              const newFeatures = [...formData.content.keyFeatures];
                              [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
                              setFormData({
                                ...formData,
                                content: { ...formData.content, keyFeatures: newFeatures }
                              });
                            }}
                            title="Move down"
                            type="button"
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => {
                            const newFeatures = formData.content.keyFeatures.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              content: { ...formData.content, keyFeatures: newFeatures }
                            });
                          }}
                          title="Remove feature"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <ReactQuill
                        theme="snow"
                        value={feature.description}
                        onChange={(value) => {
                          const newFeatures = [...formData.content.keyFeatures];
                          newFeatures[index].description = value;
                          setFormData({
                            ...formData,
                            content: { ...formData.content, keyFeatures: newFeatures }
                          });
                        }}
                        modules={quillModules}
                        placeholder="Feature description (you can add images using the toolbar)..."
                      />
                    </div>
                  </div>
                ))}
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
                <div className="preview-thumbnail">
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
                  {Array.isArray(previewStudy.tags) && previewStudy.tags.length > 0 && (
                    <div className="preview-tags">
                      {previewStudy.tags.map((tag, index) => (
                        <span key={index} className="preview-tag">{tag}</span>
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
                    {previewStudy.tools && (
                      <div className="preview-meta-item">
                        <strong>Tools:</strong> {previewStudy.tools}
                      </div>
                    )}
                  </div>
                  <p className="preview-overview">{previewStudy.overview}</p>
                </div>
              </div>

              {/* Dynamic Content Sections */}
              {previewStudy.content.sections && previewStudy.content.sections.map((section, index) => (
                section.content && section.content.trim() !== '' && section.content !== '<p><br></p>' && (
                  <div key={index} className="preview-section">
                    <h3>{section.title}</h3>
                    <div className="preview-content" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                )
              ))}

              {/* Results */}
              {previewStudy.content.results && previewStudy.content.results.length > 0 && previewStudy.content.results[0].number && (
                <div className="preview-section">
                  <h3>Results & Impact</h3>
                  <div className="preview-results">
                    {previewStudy.content.results.map((result, index) => (
                      result.number && (
                        <div key={index} className="preview-result-item">
                          <div className="preview-result-number">{result.number}</div>
                          <div className="preview-result-label">{result.label}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {previewStudy.content.keyFeatures && previewStudy.content.keyFeatures.length > 0 && previewStudy.content.keyFeatures[0].title && (
                <div className="preview-section">
                  <h3>Key Features</h3>
                  {previewStudy.content.keyFeatures.map((feature, index) => (
                    feature.title && (
                      <div key={index} className="preview-feature">
                        <h4>{feature.title}</h4>
                        <p className="preview-content">{feature.description}</p>
                        {feature.imageUrl && (
                          <img src={feature.imageUrl} alt={feature.title} className="preview-feature-image" />
                        )}
                      </div>
                    )
                  ))}
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
