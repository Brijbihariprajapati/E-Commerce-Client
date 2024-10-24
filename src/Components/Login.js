import React, { useState } from 'react';
import './Login.css'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleLogin = async () => {
    const data = { email, password };
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/userlogin', data);
      if (res) {
        toast.success(res.data.msg);
        console.log('login',res.status);
        
        localStorage.setItem('email',res.data.isexist.email);
        localStorage.setItem('userid',res.data.isexist._id)
        Navigate('/'); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login Failed'; 
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
          <p className="register-link">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
