import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, FileEdit, Calendar, MessageSquare, Settings } from 'lucide-react';
import './AdminNav.css';

function AdminNav() {
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/case-studies', label: 'Case Studies', icon: FileText },
    { path: '/admin/posts', label: 'Posts', icon: BookOpen },
    { path: '/admin/page-content', label: 'Page Content', icon: FileEdit },
    { path: '/admin/availability', label: 'Availability', icon: Calendar },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="admin-tabs-nav">
      <div className="admin-tabs">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-tab ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default AdminNav;
