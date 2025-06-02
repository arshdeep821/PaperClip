import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import PaperClipLogo from '../assets/PaperClip.png';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState, // keep previous state
      [name]: value // override previous state value, name can be username or password, value is the value of the input
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic here
    console.log('Login attempt:', formData);
  };

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title-row">
          <img src={PaperClipLogo} alt="PaperClip Logo" className="login-logo" />
          <h1 className="login-title">PaperClip</h1>
        </div>
        <h2>Welcome Back</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="create-account">
          <p>Don't have an account?</p>
          <button onClick={() => handleCreateAccount()} className="create-account-button">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 