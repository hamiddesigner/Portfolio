import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, Clock, TrendingDown, FileText, BookOpen, ExternalLink, ChevronDown, ChevronUp, Mail, Lock } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [setupOpen, setSetupOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  // Load message counts from localStorage
  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    const requests = JSON.parse(localStorage.getItem('password_requests') || '[]');
    setMessageCount(messages.filter(m => !m.read).length);
    setRequestCount(requests.filter(r => r.status === 'pending').length);
  }, []);

  // Analytics Statistics
  const stats = [
    { 
      label: 'Unread Messages', 
      value: messageCount, 
      sublabel: 'Contact form',
      icon: Mail,
      color: '#8B5CF6',
      clickable: true,
      path: '/admin/messages'
    },
    { 
      label: 'Pending Requests', 
      value: requestCount, 
      sublabel: 'Case study access',
      icon: Lock,
      color: '#EC4899',
      clickable: true,
      path: '/admin/messages'
    },
    { 
      label: 'Total Visitors', 
      value: '-', 
      sublabel: 'Last 30 days',
      icon: Users,
      color: '#4F46E5'
    },
    { 
      label: 'Page Views', 
      value: '-', 
      sublabel: 'Last 30 days',
      icon: Eye,
      color: '#0EA5E9'
    },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your portfolio analytics</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`stat-card ${stat.clickable ? 'clickable' : ''}`}
              onClick={() => stat.clickable && navigate(stat.path)}
            >
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className="stat-content">
                <h2 className="stat-value">{stat.value}</h2>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-sublabel">{stat.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Sections */}
      <div className="analytics-sections">
        {/* Google Analytics 4 */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h2>Website Traffic</h2>
            <span className="badge">Google Analytics 4</span>
          </div>
          <div className="analytics-placeholder">
            <div className="placeholder-icon">
              <TrendingDown size={48} strokeWidth={1.5} />
            </div>
            <p className="placeholder-text">Connect Google Analytics 4 to see traffic data</p>
            <a 
              href="https://analytics.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="analytics-btn"
            >
              Connect GA4
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Microsoft Clarity */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h2>User Behavior & Heatmaps</h2>
            <span className="badge">Microsoft Clarity</span>
          </div>
          <div className="analytics-placeholder">
            <div className="placeholder-icon">
              <Eye size={48} strokeWidth={1.5} />
            </div>
            <p className="placeholder-text">Connect Microsoft Clarity for heatmaps and session recordings</p>
            <a 
              href="https://clarity.microsoft.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="analytics-btn"
            >
              Connect Clarity
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/case-studies')}
          >
            <FileText size={20} />
            <span>Add New Case Study</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/posts')}
          >
            <BookOpen size={20} />
            <span>Add New Post</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => window.open('/', '_blank')}
          >
            <ExternalLink size={20} />
            <span>View Live Site</span>
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="setup-instructions">
        <button 
          className="setup-toggle"
          onClick={() => setSetupOpen(!setupOpen)}
        >
          <span>Setup Instructions</span>
          {setupOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {setupOpen && (
          <div className="setup-content">
            <div className="setup-section">
              <h3>Google Analytics 4 Setup</h3>
              <ol>
                <li>Go to <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
                <li>Create a new GA4 property for your portfolio website</li>
                <li>Copy the Measurement ID (format: G-XXXXXXXXXX)</li>
                <li>Add the GA4 tracking code to your portfolio's HTML files</li>
                <li>Wait 24-48 hours for data to populate</li>
              </ol>
              <a 
                href="https://support.google.com/analytics/answer/9304153" 
                target="_blank" 
                rel="noopener noreferrer"
                className="setup-link"
              >
                View GA4 Documentation <ExternalLink size={14} />
              </a>
            </div>

            <div className="setup-section">
              <h3>Microsoft Clarity Setup</h3>
              <ol>
                <li>Visit <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a></li>
                <li>Sign in with your Microsoft account</li>
                <li>Click "Add new project" and enter your website URL</li>
                <li>Copy the Clarity tracking code</li>
                <li>Add the tracking code to your portfolio's HTML files</li>
                <li>Start seeing heatmaps and session recordings within minutes</li>
              </ol>
              <a 
                href="https://docs.microsoft.com/en-us/clarity/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="setup-link"
              >
                View Clarity Documentation <ExternalLink size={14} />
              </a>
            </div>

            <div className="setup-note">
              <p><strong>Note:</strong> Both analytics tools require you to add tracking codes to your portfolio website. Add the codes in the <code>&lt;head&gt;</code> section of your HTML files (index.html, about.html, work.html, etc.).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
