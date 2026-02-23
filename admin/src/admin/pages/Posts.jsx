import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, Edit, Calendar, FileText, Image as ImageIcon, Save, X } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import './Posts.css';

// Register custom font sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
Quill.register(Size, true);

function Posts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    image: '',
    date: '',
    excerpt: '',
    content: '',
    status: 'draft'
  });

  // Quill modules configuration
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

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  // Open add modal
  const openAddModal = () => {
    setEditingPost(null);
    setFormData({
      image: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      status: 'draft'
    });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      image: post.image,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status
    });
    setShowModal(true);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.image) {
      toast.error('Please upload an image');
      return false;
    }
    if (!formData.date) {
      toast.error('Please select a date');
      return false;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return false;
    }
    if (formData.excerpt.length > 200) {
      toast.error('Excerpt must be 200 characters or less');
      return false;
    }
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      toast.error('Please enter post content');
      return false;
    }
    return true;
  };

  // Save post
  const savePost = (status) => {
    const dataToSave = { ...formData, status };
    setFormData(dataToSave);

    if (!validateForm()) return;

    let updatedPosts;
    if (editingPost) {
      updatedPosts = posts.map(p => 
        p.id === editingPost.id 
          ? { ...dataToSave, id: editingPost.id }
          : p
      );
      toast.success('Post updated successfully!');
    } else {
      const newPost = {
        ...dataToSave,
        id: Date.now()
      };
      updatedPosts = [newPost, ...posts];
      toast.success('Post created successfully!');
    }

    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setShowModal(false);
  };

  // Delete post
  const confirmDelete = (id) => {
    setDeletePostId(id);
    setShowDeleteModal(true);
  };

  const deletePost = () => {
    const updatedPosts = posts.filter(p => p.id !== deletePostId);
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setShowDeleteModal(false);
    toast.success('Post deleted successfully!');
  };

  // Preview post
  const openPreview = (post) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => filterStatus === 'all' || post.status === filterStatus)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="posts-page">
      <div className="admin-container">
        {/* Page header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Manage Posts</h1>
            <p>Create, edit, and manage your blog posts</p>
          </div>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            <span>Add New Post</span>
          </button>
        </div>

        {/* Filter */}
        <div className="posts-filter">
          <button 
            className={filterStatus === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('all')}
          >
            All ({posts.length})
          </button>
          <button 
            className={filterStatus === 'draft' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('draft')}
          >
            Draft ({posts.filter(p => p.status === 'draft').length})
          </button>
          <button 
            className={filterStatus === 'published' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('published')}
          >
            Published ({posts.filter(p => p.status === 'published').length})
          </button>
        </div>

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No posts yet</h3>
            <p>Create your first blog post to get started</p>
            <button className="btn-primary" onClick={openAddModal}>
              <Plus size={20} />
              <span>Add New Post</span>
            </button>
          </div>
        ) : (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Date</th>
                  <th>Excerpt</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="table-image">
                        <img src={post.image} alt={post.excerpt} />
                      </div>
                    </td>
                    <td>
                      <div className="table-date">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="table-excerpt">{post.excerpt}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${post.status}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-btn" 
                          onClick={() => openPreview(post)}
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="icon-btn" 
                          onClick={() => openEditModal(post)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="icon-btn delete-btn" 
                          onClick={() => confirmDelete(post.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Image Upload */}
                <div className="form-group">
                  <label>Post Image *</label>
                  <div className="image-upload-area">
                    {formData.image ? (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" />
                        <button 
                          className="remove-image-btn"
                          onClick={() => setFormData({ ...formData, image: '' })}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <ImageIcon size={32} />
                        <span>Click to upload image</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="form-group">
                  <label>Post Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Excerpt */}
                <div className="form-group">
                  <label>
                    Post Excerpt * 
                    <span className="char-count">
                      {formData.excerpt.length}/200
                    </span>
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setFormData({ ...formData, excerpt: e.target.value });
                      }
                    }}
                    placeholder="Brief description of the post (max 200 characters)"
                    rows="3"
                  />
                </div>

                {/* Content */}
                <div className="form-group">
                  <label>Post Content *</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={quillModules}
                    placeholder="Write your post content here..."
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                <X size={16} />
                Cancel
              </button>
              <button className="btn-secondary" onClick={() => savePost('draft')}>
                <Save size={16} />
                Save as Draft
              </button>
              <button className="btn-primary" onClick={() => savePost('published')}>
                <Save size={16} />
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Post</h2>
              <button className="icon-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={deletePost}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewPost && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Preview Post</h2>
              <button className="icon-btn" onClick={() => setShowPreviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="preview-post">
                <img src={previewPost.image} alt={previewPost.excerpt} className="preview-image" />
                <div className="preview-date">
                  <Calendar size={14} />
                  {new Date(previewPost.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <p className="preview-excerpt">{previewPost.excerpt}</p>
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewPost.content }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
