import React, { useState } from 'react';
import './Login.css'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

function Register() {
    const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleLogin = async () => {
    const data = { email, password, name};
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/userregister', data);
      if (res) {
        toast.success(res.data.msg);
        localStorage.setItem('email',res.data.email);
        history('/login'); 
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
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="email">Name</label>
            <input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            {loading ? 'Register...' : 'Register'}
          </button>
          <p className="register-link">
            I have an account? <a href="/login">login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
