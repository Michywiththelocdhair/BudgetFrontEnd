import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',   
    user: '', // Include the logged-in user's ID in the transaction data
  });

  const [user, setUser] = useState(null); // State to store the current user data

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`${baseURL}/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        setUser(userData.user); 
        // Include the user's ID in the formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          user: userData.user._id,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      // Send POST request to create a new category
      const response = await fetch(`${baseURL}/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to add category: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('Category added successfully');
       navigate('/profile');
    } catch (error) {
      console.error(error);
      // Handle errors, display a message to the user, etc.
    }
  };

  return (
    <div className='page'>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit} className='form-group' action="/category/create" method="POST">
        <label className='labelform'>User:</label>
        <input
          type="text"
          name="user"
          value={formData.user}
          onChange={handleChange}
          className='inputform'
          disabled
          // If you want to display the user's name, use defaultValue={currentUser.name}
        />

        <label className='labelform'>Category:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className='inputform' required />

        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
