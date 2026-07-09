// frontend/src/components/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      console.log('🔐 Attempting admin login with:', email);
      
      // Login and get response (no auto-storage)
      const response = await authService.login(email, password);
      console.log('📡 Login response:', response);

      if (!response || !response.token) {
        setError('Invalid credentials');
        setIsLoggingIn(false);
        return;
      }

      // Check if user is admin
      const user = response.user;
      console.log('👤 User data:', user);

      if (!user || user.role !== 'admin') {
        setError('This account is not an admin account');
        setIsLoggingIn(false);
        return;
      }

      // Store the auth data only after admin verification
      authService.storeAuthData(response.token, user);
      
      // Set admin token
      localStorage.setItem('adminToken', 'admin_authenticated');
      console.log('✅ Admin login successful');
      
      // Navigate to admin dashboard
      navigate('/admin');
      
    } catch (error) {
      console.error('❌ Admin login error:', error);
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      setError(message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f6eadb 0%, #fffaf2 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 24px 70px rgba(63, 38, 24, 0.14)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#b85c38',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '30px',
          }}>
            A
          </div>
          <h1 style={{ margin: 0, color: '#241913' }}>Admin Login</h1>
          <p style={{ margin: '8px 0 0', color: '#71635b' }}>
            Enter your admin account to access the admin panel
          </p>
          <p style={{ margin: '4px 0 0', color: '#b85c38', fontSize: '0.85rem' }}>
            Default: admin@handicraft.com / admin123
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@handicraft.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
              required
              disabled={isLoggingIn}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
              required
              disabled={isLoggingIn}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#ffe8df',
              borderRadius: '8px',
              color: '#8d261a',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: '100%',
              padding: '12px',
              background: '#b85c38',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              opacity: isLoggingIn ? 0.7 : 1,
            }}
          >
            {isLoggingIn ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#71635b',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;