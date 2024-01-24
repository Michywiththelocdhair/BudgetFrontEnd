import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../utils/constant.js';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}/login`, { username, email });

      // Check if the login was successful based on the response from the server
      if (response.data.success) {
        const token = response.data.token;
        const userId = response.data.userId;

        // Store the token in local storage or a secure cookie
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Call a function to handle successful login (e.g., redirect the user)
        handleSuccessfulLogin();
      } else {
        // Display an error message to the user
        console.error('Login failed. Please check your credentials.');
        
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSuccessfulLogin = () => {
    // Redirect the user after successful login
    window.location.href = `https://budgetfrontend.michellerangond.repl.co/home`;
  };

  return (
    <div className='page'>
      <h2>Login</h2>
      <div className='loginform'>
        <input className='input' type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input  className='input' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      <Link to={`/register`}>
        <button>Sign Up</button>
       </Link>
      
    </div>
  );
};

export default Login;
