import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Edituser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', 
  });

  const [user, setUser] = useState(null); // State to store the current user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`${baseURL}/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        console.log('User data:', userData);  // Log the entire user data
        console.log('Extracted user:', userData.user);  // Log the extracted user

        setUser(userData.user); // Assuming the response contains an array of users, update accordingly

        // Set the initial form data with user details
        setFormData({
          username: userData.user.username,
          email: userData.user.email,
          password: userData.user.password,
        });

        // Set loading to false after successful data fetching
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set loading to false in case of an error
        setLoading(false);
      }
    };

    fetchData();
  }, []); 


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Perform validation if needed
      // Send POST request to update card
      const response = await fetch(`${baseURL}/user/${userId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to update user: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('User updated successfully');
      navigate('/home');
    } catch (error) {
      console.error(error);
      // Handle errors, display a message to the user, etc.
    }
  };

  // Render loading state until data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

return (
  <div className='page'>
    <h2>Update Profile</h2>
    <form onSubmit={handleSubmit} className='form-group' action={`/user/${userId}/update`} method="POST">

      <label className='labelform'>UserName:</label>
      <input type="text" name="username" value={formData.username || ''} onChange={handleChange} className='inputform' required />

      <label className='labelform'>Email:</label>
      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className='inputform' required />

      <label className='labelform'>Password:</label>
      <input type="password" name="password" value={formData.password || ''} onChange={handleChange} className='inputform' required />

      <button type="submit">Update Profile</button>
    </form>
  </div>
);
};

export default Edituser;