import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, AlertTriangle, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './Settings.css';

function Settings() {
  // Profile & Personal Info
  const [profile, setProfile] = useState({
    avatar: '',
    fullName: 'Hamid Ali',
    title: 'Product Designer',
    bio: '',
    location: '',
    social: {
      github: '',
      linkedin: '',
      twitter: '',
      dribbble: '',
      behance: '',
      instagram: '',
      website: ''
    }
  });

  // Admin Account
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Contact Settings
  const [contactSettings, setContactSettings] = useState({
    primaryEmail: '',
    backupEmail: '',
    notifyOnMessages: true
  });

  // Analytics
  const [analytics, setAnalytics] = useState({
    ga4TrackingId: '',
    ga4Enabled: false,
    clarityProjectId: '',
    clarityEnabled: false
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'Hamid Ali - Product Designer',
    tagline: 'Crafting digital experiences',
    metaDescription: '',
    faviconUrl: '',
    faviconFile: '',
    ogImageUrl: '',
    twitterCardUrl: ''
  });

  // Maintenance Mode
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: 'We are currently performing scheduled maintenance. Please check back soon.'
  });

  // Backup & Export
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: false,
    lastBackup: null
  });

  // Danger Zone modals
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      const data = JSON.parse(savedSettings);
      if (data.profile) setProfile(data.profile);
      if (data.contactSettings) setContactSettings(data.contactSettings);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.maintenance) setMaintenance(data.maintenance);
      if (data.backupSettings) setBackupSettings(data.backupSettings);
    }
  }, []);

  // Save all settings to localStorage
  const saveAllSettings = () => {
    const allSettings = {
      profile,
      contactSettings,
      analytics,
      siteSettings,
      maintenance,
      backupSettings,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('admin_settings', JSON.stringify(allSettings));
  };

  // Profile handlers
  const updateProfile = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const updateSocial = (platform, value) => {
    setProfile({
      ...profile,
      social: { ...profile.social, [platform]: value }
    });
  };

  const saveProfile = () => {
    saveAllSettings();
    toast.success('Profile settings saved');
  };

  // Password handlers
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { strength, label: labels[strength] };
  };

  const changePassword = () => {
    if (!passwordForm.currentPassword) {
      toast.error('Please enter current password');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // In a real app, verify current password with backend
    toast.success('Password changed successfully');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Contact handlers
  const saveContactSettings = () => {
    if (contactSettings.primaryEmail && !isValidEmail(contactSettings.primaryEmail)) {
      toast.error('Please enter a valid primary email');
      return;
    }
    if (contactSettings.backupEmail && !isValidEmail(contactSettings.backupEmail)) {
      toast.error('Please enter a valid backup email');
      return;
    }
    saveAllSettings();
    toast.success('Contact settings saved');
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Analytics handlers
  const saveAnalytics = () => {
    saveAllSettings();
    toast.success('Analytics settings saved');
  };

  // Site Settings handlers
  const saveSiteSettings = () => {
    if (siteSettings.metaDescription.length > 160) {
      toast.error('Meta description must be 160 characters or less');
      return;
    }
    saveAllSettings();
    toast.success('Site settings saved');
  };

  // Maintenance handlers
  const saveMaintenance = () => {
    saveAllSettings();
    toast.success('Maintenance settings saved');
  };

  // Backup handlers
  const exportData = () => {
    const allData = {
      settings: {
        profile,
        contactSettings,
        analytics,
        siteSettings,
        maintenance,
        backupSettings
      },
      caseStudies: JSON.parse(localStorage.getItem('case_studies') || '[]'),
      posts: JSON.parse(localStorage.getItem('posts') || '[]'),
      availability: JSON.parse(localStorage.getItem('availability_schedule') || '{}'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setBackupSettings({ ...backupSettings, lastBackup: new Date().toISOString() });
    saveAllSettings();
    toast.success('Data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.settings) {
          if (data.settings.profile) setProfile(data.settings.profile);
          if (data.settings.contactSettings) setContactSettings(data.settings.contactSettings);
          if (data.settings.analytics) setAnalytics(data.settings.analytics);
          if (data.settings.siteSettings) setSiteSettings(data.settings.siteSettings);
          if (data.settings.maintenance) setMaintenance(data.settings.maintenance);
          if (data.settings.backupSettings) setBackupSettings(data.settings.backupSettings);
          saveAllSettings();
        }
        
        if (data.caseStudies) localStorage.setItem('case_studies', JSON.stringify(data.caseStudies));
        if (data.posts) localStorage.setItem('posts', JSON.stringify(data.posts));
        if (data.availability) localStorage.setItem('availability_schedule', JSON.stringify(data.availability));

        toast.success('Data imported successfully');
      } catch (error) {
        toast.error('Invalid backup file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const toggleAutoBackup = () => {
    setBackupSettings({ ...backupSettings, autoBackup: !backupSettings.autoBackup });
    saveAllSettings();
  };

  // Danger Zone handlers
  const confirmAction = (action) => {
    setShowConfirmModal(action);
    setConfirmText('');
  };

  const executeAction = () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    switch (showConfirmModal) {
      case 'clearCaseStudies':
        localStorage.removeItem('case_studies');
        toast.success('All case studies cleared');
        break;
      case 'clearPosts':
        localStorage.removeItem('posts');
        toast.success('All posts cleared');
        break;
      case 'resetDefaults':
        localStorage.clear();
        window.location.reload();
        break;
      default:
        break;
    }

    setShowConfirmModal(null);
    setConfirmText('');
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="btn-primary" onClick={saveAllSettings}>
          <Save size={16} />
          Save All Settings
        </button>
      </div>

      {/* Profile & Personal Info */}
      <div className="settings-section">
        <h2>Profile & Personal Info</h2>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label>Avatar URL</label>
            <input
              type="text"
              value={profile.avatar}
              onChange={(e) => updateProfile('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            {profile.avatar && (
              <div className="avatar-preview">
                <img src={profile.avatar} alt="Avatar preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => updateProfile('fullName', e.target.value)}
              placeholder="Hamid Ali"
            />
          </div>

          <div className="form-group">
            <label>Professional Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => updateProfile('title', e.target.value)}
              placeholder="Product Designer"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateProfile('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bio / About Me</label>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfile('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <div className="social-links-section">
          <h3>Social Links</h3>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="text"
                value={profile.social.github}
                onChange={(e) => updateSocial('github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="text"
                value={profile.social.linkedin}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Twitter / X</label>
              <input
                type="text"
                value={profile.social.twitter}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="form-group">
              <label>Dribbble</label>
              <input
                type="text"
                value={profile.social.dribbble}
                onChange={(e) => updateSocial('dribbble', e.target.value)}
                placeholder="https://dribbble.com/username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Behance</label>
              <input
                type="text"
                value={profile.social.behance}
                onChange={(e) => updateSocial('behance', e.target.value)}
                placeholder="https://behance.net/username"
              />
            </div>

            <div className="form-group">
              <label>Instagram</label>
              <input
                type="text"
                value={profile.social.instagram}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website / Portfolio</label>
              <input
                type="text"
                value={profile.social.website}
                onChange={(e) => updateSocial('website', e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={saveProfile}>
          <Save size={16} />
          Save Profile
        </button>
      </div>

      {/* Admin Account */}
      <div className="settings-section">
        <h2>Admin Account</h2>
        
        <div className="form-group">
          <label>Current Password</label>
          <div className="password-input">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div className="password-input">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password (min 8 characters)"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordForm.newPassword && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill strength-${passwordStrength.strength}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className={`strength-label strength-${passwordStrength.strength}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="password-input">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={changePassword}>
          <Save size={16} />
          Change Password
        </button>
      </div>

      {/* Contact Settings */}
      <div className="settings-section">
        <h2>Contact Settings</h2>
        
        <div className="form-group">
          <label>Primary Email</label>
          <input
            type="email"
            value={contactSettings.primaryEmail}
            onChange={(e) => setContactSettings({ ...contactSettings, primaryEmail: e.target.value })}
            placeholder="your@email.com"
          />
          <p className="field-hint">This email receives all contact form submissions</p>
        </div>

        <div className="form-group">
          <label>Backup Email</label>
          <input
            type="email"
            value={contactSettings.backupEmail}
            onChange={(e) => setContactSettings({ ...contactSettings, backupEmail: e.target.value })}
            placeholder="backup@email.com"
          />
          <p className="field-hint">Optional backup for important notifications</p>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={contactSettings.notifyOnMessages}
              onChange={(e) => setContactSettings({ ...contactSettings, notifyOnMessages: e.target.checked })}
            />
            <span>Notify me of new messages</span>
          </label>
        </div>

        <button className="btn-primary" onClick={saveContactSettings}>
          <Save size={16} />
          Save Contact Settings
        </button>
      </div>

      {/* Analytics */}
      <div className="settings-section">
        <h2>Analytics</h2>
        
        <div className="analytics-provider">
          <div className="provider-header">
            <h3>Google Analytics 4</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={analytics.ga4Enabled}
                onChange={(e) => setAnalytics({ ...analytics, ga4Enabled: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="form-group">
            <label>Tracking ID</label>
            <input
              type="text"
              value={analytics.ga4TrackingId}
              onChange={(e) => setAnalytics({ ...analytics, ga4TrackingId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          {analytics.ga4TrackingId && (
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              <ExternalLink size={14} />
              View GA4 Dashboard
            </a>
          )}
        </div>

        <div className="analytics-provider">
          <div className="provider-header">
            <h3>Microsoft Clarity</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={analytics.clarityEnabled}
                onChange={(e) => setAnalytics({ ...analytics, clarityEnabled: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="form-group">
            <label>Project ID</label>
            <input
              type="text"
              value={analytics.clarityProjectId}
              onChange={(e) => setAnalytics({ ...analytics, clarityProjectId: e.target.value })}
              placeholder="xxxxxxxxxx"
            />
          </div>
          {analytics.clarityProjectId && (
            <a
              href="https://clarity.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              <ExternalLink size={14} />
              View Clarity Dashboard
            </a>
          )}
        </div>

        <button className="btn-primary" onClick={saveAnalytics}>
          <Save size={16} />
          Save Analytics Settings
        </button>
      </div>

      {/* Site Settings */}
      <div className="settings-section">
        <h2>Site Settings</h2>
        
        <div className="form-group">
          <label>Site Title</label>
          <input
            type="text"
            value={siteSettings.siteTitle}
            onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
            placeholder="Your Site Name"
          />
        </div>

        <div className="form-group">
          <label>Tagline</label>
          <input
            type="text"
            value={siteSettings.tagline}
            onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
            placeholder="A brief description"
          />
        </div>

        <div className="form-group">
          <label>Meta Description</label>
          <textarea
            value={siteSettings.metaDescription}
            onChange={(e) => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })}
            placeholder="Description for search engines (160 characters max)"
            rows={3}
            maxLength={160}
          />
          <p className="char-count">{siteSettings.metaDescription.length} / 160 characters</p>
        </div>

        <div className="form-group">
          <label>Favicon</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="favicon-upload"
              accept=".ico,.png,.jpg,.jpeg,.svg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 1024 * 1024) {
                    toast.error('File size must be less than 1MB');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSiteSettings({ ...siteSettings, faviconFile: reader.result, faviconUrl: '' });
                    toast.success('Favicon uploaded successfully');
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-upload"
              onClick={() => document.getElementById('favicon-upload').click()}
            >
              <Upload size={16} />
              {siteSettings.faviconFile || siteSettings.faviconUrl ? 'Change Favicon' : 'Upload Favicon'}
            </button>
            {(siteSettings.faviconFile || siteSettings.faviconUrl) && (
              <div className="favicon-preview">
                <img
                  src={siteSettings.faviconFile || siteSettings.faviconUrl}
                  alt="Favicon preview"
                  width="32"
                  height="32"
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => setSiteSettings({ ...siteSettings, faviconFile: '', faviconUrl: '' })}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
          <p className="field-hint">Upload .ico, .png, .jpg, or .svg file (max 1MB). 32x32px or 16x16px recommended</p>
        </div>

        <div className="form-group">
          <label>Open Graph Image URL</label>
          <input
            type="text"
            value={siteSettings.ogImageUrl}
            onChange={(e) => setSiteSettings({ ...siteSettings, ogImageUrl: e.target.value })}
            placeholder="https://example.com/og-image.jpg"
          />
          <p className="field-hint">Used when sharing on social media (1200x630px recommended)</p>
        </div>

        <div className="form-group">
          <label>Twitter Card Image URL</label>
          <input
            type="text"
            value={siteSettings.twitterCardUrl}
            onChange={(e) => setSiteSettings({ ...siteSettings, twitterCardUrl: e.target.value })}
            placeholder="https://example.com/twitter-card.jpg"
          />
          <p className="field-hint">Twitter preview image (1200x600px recommended)</p>
        </div>

        <button className="btn-primary" onClick={saveSiteSettings}>
          <Save size={16} />
          Save Site Settings
        </button>
      </div>

      {/* Maintenance Mode */}
      <div className="settings-section">
        <h2>Maintenance Mode</h2>
        
        <div className="form-group">
          <div className="checkbox-wrapper">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={maintenance.enabled}
                onChange={(e) => setMaintenance({ ...maintenance, enabled: e.target.checked })}
              />
              <span>Enable maintenance mode</span>
            </label>
          </div>
          <p className="field-hint">When enabled, visitors will see the maintenance page</p>
        </div>

        <div className="form-group">
          <label>Maintenance Message</label>
          <textarea
            value={maintenance.message}
            onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
            placeholder="Message to show visitors during maintenance"
            rows={3}
          />
        </div>

        <button className="btn-primary" onClick={saveMaintenance}>
          <Save size={16} />
          Save Maintenance Settings
        </button>
      </div>

      {/* Backup & Export */}
      <div className="settings-section">
        <h2>Backup & Export</h2>
        
        <div className="backup-actions">
          <button className="btn-secondary" onClick={exportData}>
            <Download size={16} />
            Export All Data
          </button>

          <label className="btn-secondary upload-btn">
            <Upload size={16} />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {backupSettings.lastBackup && (
          <p className="last-backup">
            Last backup: {new Date(backupSettings.lastBackup).toLocaleString()}
          </p>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={backupSettings.autoBackup}
              onChange={toggleAutoBackup}
            />
            <span>Backup data weekly</span>
          </label>
          <p className="field-hint">Automatically create backups every week</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger-zone">
        <h2>
          <AlertTriangle size={20} />
          Danger Zone
        </h2>
        
        <div className="danger-action">
          <div className="danger-info">
            <h3>Clear All Case Studies</h3>
            <p>Permanently delete all case studies. This action cannot be undone!</p>
          </div>
          <button
            className="btn-danger"
            onClick={() => confirmAction('clearCaseStudies')}
          >
            <Trash2 size={16} />
            Clear Case Studies
          </button>
        </div>

        <div className="danger-action">
          <div className="danger-info">
            <h3>Clear All Posts</h3>
            <p>Permanently delete all blog posts. This action cannot be undone!</p>
          </div>
          <button
            className="btn-danger"
            onClick={() => confirmAction('clearPosts')}
          >
            <Trash2 size={16} />
            Clear Posts
          </button>
        </div>

        <div className="danger-action">
          <div className="danger-info">
            <h3>Reset to Defaults</h3>
            <p>Clear all data and reset everything to default. This action cannot be undone!</p>
          </div>
          <button
            className="btn-danger"
            onClick={() => confirmAction('resetDefaults')}
          >
            <Trash2 size={16} />
            Reset All Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(null)}>
          <div className="modal-content danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <AlertTriangle size={20} />
                Confirm Action
              </h3>
            </div>
            <div className="modal-body">
              <p className="danger-warning">
                This action cannot be undone! All data will be permanently deleted.
              </p>
              <p>Type <strong>DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowConfirmModal(null)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={executeAction}
                disabled={confirmText !== 'DELETE'}
              >
                <Trash2 size={16} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
