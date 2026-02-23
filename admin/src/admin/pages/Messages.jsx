import { useState, useEffect } from 'react';
import { Mail, Lock, Trash2, CheckCircle, Circle, Clock, Send, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import './Messages.css';

/**
 * MESSAGES & REQUESTS PAGE
 * 
 * This page displays:
 * 1. Contact form messages from your portfolio website
 * 2. Case study password access requests
 * 
 * DATA STRUCTURES (localStorage):
 * 
 * Contact Messages (key: 'contact_messages'):
 * {
 *   id: string,           // Unique ID (e.g., 'msg_' + Date.now())
 *   name: string,         // Sender's name
 *   email: string,        // Sender's email
 *   subject: string,      // Message subject
 *   message: string,      // Message body
 *   timestamp: string,    // ISO date string
 *   read: boolean         // Read status (default: false)
 * }
 * 
 * Password Requests (key: 'password_requests'):
 * {
 *   id: string,             // Unique ID (e.g., 'req_' + Date.now())
 *   name: string,           // Requester's name
 *   email: string,          // Requester's email
 *   caseStudyId: string,    // ID of the case study from 'case_studies' localStorage
 *   caseStudyTitle: string, // Title of the case study
 *   timestamp: string,      // ISO date string
 *   status: string,         // 'pending' | 'approved' | 'rejected'
 *   read: boolean           // Read status (default: false)
 * }
 * 
 * INTEGRATION WITH YOUR PORTFOLIO:
 * When you create contact forms on your portfolio website, save submissions to 
 * localStorage using these exact structures. Example:
 * 
 * // Contact form submission:
 * const newMessage = {
 *   id: 'msg_' + Date.now(),
 *   name: formData.name,
 *   email: formData.email,
 *   subject: formData.subject,
 *   message: formData.message,
 *   timestamp: new Date().toISOString(),
 *   read: false
 * };
 * const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
 * messages.push(newMessage);
 * localStorage.setItem('contact_messages', JSON.stringify(messages));
 */

function Messages() {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'password'
  const [contactMessages, setContactMessages] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load messages from localStorage
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const contacts = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const passwords = JSON.parse(localStorage.getItem('password_requests') || '[]');
    
    // Sort by timestamp (newest first)
    contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    passwords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setContactMessages(contacts);
    setPasswordRequests(passwords);
  };

  // Toggle message read status
  const toggleReadStatus = (id, type) => {
    if (type === 'contact') {
      const updated = contactMessages.map(msg =>
        msg.id === id ? { ...msg, read: !msg.read } : msg
      );
      setContactMessages(updated);
      localStorage.setItem('contact_messages', JSON.stringify(updated));
      toast.success(updated.find(m => m.id === id).read ? 'Marked as read' : 'Marked as unread');
    } else {
      const updated = passwordRequests.map(req =>
        req.id === id ? { ...req, read: !req.read } : req
      );
      setPasswordRequests(updated);
      localStorage.setItem('password_requests', JSON.stringify(updated));
      toast.success(updated.find(r => r.id === id).read ? 'Marked as read' : 'Marked as unread');
    }
  };

  // Delete message
  const deleteMessage = (id, type) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      if (type === 'contact') {
        const updated = contactMessages.filter(msg => msg.id !== id);
        setContactMessages(updated);
        localStorage.setItem('contact_messages', JSON.stringify(updated));
        toast.success('Message deleted');
      } else {
        const updated = passwordRequests.filter(req => req.id !== id);
        setPasswordRequests(updated);
        localStorage.setItem('password_requests', JSON.stringify(updated));
        toast.success('Request deleted');
      }
      setSelectedMessage(null);
    }
  };

  // Reply to contact message
  const replyToMessage = (email, subject, name) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject || 'Your message'}&body=Hi ${name},%0D%0A%0D%0A`;
  };

  // Copy password to clipboard
  const copyPassword = (caseStudyId) => {
    // Get the actual password from case studies
    const caseStudies = JSON.parse(localStorage.getItem('case_studies') || '[]');
    const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);
    
    if (caseStudy && caseStudy.password) {
      navigator.clipboard.writeText(caseStudy.password);
      toast.success('Password copied to clipboard!');
    } else {
      toast.error('Password not found for this case study');
    }
  };

  // Send password via email
  const sendPassword = (request) => {
    const caseStudies = JSON.parse(localStorage.getItem('case_studies') || '[]');
    const caseStudy = caseStudies.find(cs => cs.id === request.caseStudyId);
    
    if (caseStudy && caseStudy.password) {
      const subject = `Case Study Access - ${request.caseStudyTitle}`;
      const body = `Hi ${request.name},%0D%0A%0D%0AThank you for your interest in viewing my case study: "${request.caseStudyTitle}".%0D%0A%0D%0AHere is the password to access it:%0D%0APassword: ${caseStudy.password}%0D%0A%0D%0AYou can view the case study here: [Add your case study URL]%0D%0A%0D%0ABest regards`;
      
      window.location.href = `mailto:${request.email}?subject=${subject}&body=${body}`;
      
      // Mark as approved
      const updated = passwordRequests.map(req =>
        req.id === request.id ? { ...req, status: 'approved', read: true } : req
      );
      setPasswordRequests(updated);
      localStorage.setItem('password_requests', JSON.stringify(updated));
    } else {
      toast.error('Password not found for this case study');
    }
  };

  // Reject password request
  const rejectRequest = (id) => {
    const updated = passwordRequests.map(req =>
      req.id === id ? { ...req, status: 'rejected', read: true } : req
    );
    setPasswordRequests(updated);
    localStorage.setItem('password_requests', JSON.stringify(updated));
    toast.success('Request rejected');
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get counts
  const unreadContactCount = contactMessages.filter(m => !m.read).length;
  const pendingRequestCount = passwordRequests.filter(r => r.status === 'pending').length;

  // Generate sample data for testing
  const generateSampleData = () => {
    // Sample contact messages
    const sampleMessages = [
      {
        id: 'msg_' + Date.now() + '_1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        subject: 'Project Collaboration Inquiry',
        message: 'Hi! I came across your portfolio and I\'m really impressed with your work on the SaaS analytics dashboard. We\'re currently working on a similar project and would love to discuss a potential collaboration. Would you be available for a call next week?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false
      },
      {
        id: 'msg_' + Date.now() + '_2',
        name: 'Michael Chen',
        email: 'mchen@techstartup.com',
        subject: 'Freelance Opportunity',
        message: 'Hello, I\'m reaching out regarding a freelance opportunity for a fintech product redesign. Your expertise in product design would be perfect for this project. The timeline is 8-10 weeks. Let me know if you\'re interested!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        read: false
      },
      {
        id: 'msg_' + Date.now() + '_3',
        name: 'Emily Rodriguez',
        email: 'emily.r@design.studio',
        subject: 'Portfolio Feedback',
        message: 'Your case studies are absolutely fantastic! The way you present the problem-solving process is very clear and insightful. Just wanted to say great work!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true
      }
    ];

    // Sample password requests (make sure you have case studies in localStorage)
    const caseStudies = JSON.parse(localStorage.getItem('case_studies') || '[]');
    const sampleRequests = [];
    
    if (caseStudies.length > 0) {
      sampleRequests.push({
        id: 'req_' + Date.now() + '_1',
        name: 'Alex Martinez',
        email: 'alex.martinez@company.com',
        caseStudyId: caseStudies[0].id,
        caseStudyTitle: caseStudies[0].title,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        status: 'pending',
        read: false
      });

      if (caseStudies.length > 1) {
        sampleRequests.push({
          id: 'req_' + Date.now() + '_2',
          name: 'David Kim',
          email: 'david.kim@recruiting.com',
          caseStudyId: caseStudies[1].id || caseStudies[0].id,
          caseStudyTitle: caseStudies[1]?.title || caseStudies[0].title,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          status: 'approved',
          read: true
        });
      }
    }

    // Save to localStorage
    localStorage.setItem('contact_messages', JSON.stringify(sampleMessages));
    localStorage.setItem('password_requests', JSON.stringify(sampleRequests));
    
    // Reload
    loadMessages();
    toast.success('Sample data generated successfully!');
  };

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Messages & Requests</h1>
        <button className="btn-sample" onClick={generateSampleData} title="Generate sample data for testing">
          Generate Sample Data
        </button>
      </div>

      {/* Tabs */}
      <div className="messages-tabs">
        <button
          className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Mail size={18} />
          <span>Contact Messages</span>
          {unreadContactCount > 0 && (
            <span className="badge">{unreadContactCount}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <Lock size={18} />
          <span>Password Requests</span>
          {pendingRequestCount > 0 && (
            <span className="badge">{pendingRequestCount}</span>
          )}
        </button>
      </div>

      {/* Contact Messages Tab */}
      {activeTab === 'contact' && (
        <div className="messages-content">
          {contactMessages.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} />
              <h3>No contact messages yet</h3>
              <p>Messages from your portfolio contact form will appear here.</p>
            </div>
          ) : (
            <div className="messages-layout">
              {/* Messages List */}
              <div className="messages-list">
                {contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="message-item-header">
                      <div className="message-item-info">
                        <h3>{message.name}</h3>
                        <p className="message-email">{message.email}</p>
                      </div>
                      {!message.read && <div className="unread-dot"></div>}
                    </div>
                    <p className="message-subject">
                      {message.subject || 'No subject'}
                    </p>
                    <p className="message-preview">
                      {message.message.substring(0, 80)}...
                    </p>
                    <div className="message-item-footer">
                      <span className="message-time">
                        <Clock size={12} />
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Detail */}
              {selectedMessage && (
                <div className="message-detail">
                  <div className="detail-header">
                    <div className="detail-info">
                      <h2>{selectedMessage.name}</h2>
                      <p className="detail-email">{selectedMessage.email}</p>
                    </div>
                    <div className="detail-actions">
                      <button
                        className="btn-icon"
                        onClick={() => toggleReadStatus(selectedMessage.id, 'contact')}
                        title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {selectedMessage.read ? <Circle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => deleteMessage(selectedMessage.id, 'contact')}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="detail-meta">
                    <span className="detail-time">
                      <Clock size={14} />
                      {new Date(selectedMessage.timestamp).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>

                  <div className="detail-subject">
                    <strong>Subject:</strong> {selectedMessage.subject || 'No subject'}
                  </div>

                  <div className="detail-message">
                    <p>{selectedMessage.message}</p>
                  </div>

                  <div className="detail-footer">
                    <button
                      className="btn-primary"
                      onClick={() => replyToMessage(selectedMessage.email, selectedMessage.subject, selectedMessage.name)}
                    >
                      <Send size={16} />
                      Reply via Email
                    </button>
                  </div>
                </div>
              )}

              {!selectedMessage && contactMessages.length > 0 && (
                <div className="no-selection">
                  <Mail size={48} />
                  <p>Select a message to view details</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Password Requests Tab */}
      {activeTab === 'password' && (
        <div className="messages-content">
          {passwordRequests.length === 0 ? (
            <div className="empty-state">
              <Lock size={48} />
              <h3>No password requests yet</h3>
              <p>Case study password requests will appear here.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {passwordRequests.map((request) => (
                <div
                  key={request.id}
                  className={`request-card status-${request.status} ${!request.read ? 'unread' : ''}`}
                >
                  <div className="request-header">
                    <div className="request-info">
                      <h3>{request.name}</h3>
                      <p className="request-email">{request.email}</p>
                    </div>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="request-body">
                    <div className="request-case-study">
                      <Lock size={16} />
                      <span>{request.caseStudyTitle}</span>
                    </div>
                    <div className="request-time">
                      <Clock size={14} />
                      {formatDate(request.timestamp)}
                    </div>
                  </div>

                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn-send"
                          onClick={() => sendPassword(request)}
                          title="Send password via email"
                        >
                          <Send size={16} />
                          Send Password
                        </button>
                        <button
                          className="btn-copy"
                          onClick={() => copyPassword(request.caseStudyId)}
                          title="Copy password"
                        >
                          <Copy size={16} />
                          Copy
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => rejectRequest(request.id)}
                          title="Reject request"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <button
                        className="btn-copy"
                        onClick={() => copyPassword(request.caseStudyId)}
                      >
                        <Copy size={16} />
                        Copy Password
                      </button>
                    )}
                    <button
                      className="btn-icon-small"
                      onClick={() => toggleReadStatus(request.id, 'password')}
                      title={request.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {request.read ? <Circle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <button
                      className="btn-icon-small btn-danger"
                      onClick={() => deleteMessage(request.id, 'password')}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Messages;
