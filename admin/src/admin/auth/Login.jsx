import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      const success = login(password);
      setIsLoading(false);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setPassword('');
      }
    }, 500);
  };

  const handleForgotPassword = () => {
    // Get admin email from localStorage (will be set in Settings page)
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (!adminEmail) {
      toast.error('Please configure your admin email in Settings first');
      return;
    }

    // Get the stored password
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    // In production, this would send an email via backend API
    // For now, we'll show a toast notification
    toast.success(`Password sent to ${adminEmail}\n\nYour password is: ${storedPassword}`, {
      duration: 6000,
      style: {
        maxWidth: '400px',
      }
    });
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="login-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="login-icon">
            <Lock size={32} />
          </div>
          <h1>Admin Login</h1>
          <p>Enter your password to access the admin panel</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={isLoading}
                autoFocus
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading || !password.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login to Admin
              </>
            )}
          </motion.button>

          <button
            type="button"
            className="forgot-password"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </motion.form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="security-note">
            <Lock size={14} />
            This is a secure admin area
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
