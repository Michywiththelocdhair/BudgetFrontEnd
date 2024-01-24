import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Editcategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Extract categoryId from route parameters

  const [formData, setFormData] = useState({
    name: '',
    user: '', // Include the logged-in user's ID in the transaction data
  });

  const [user, setUser] = useState(null); // State to store the current user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get the user ID from local storage
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
        setUser(userData.user); // Assuming the response contains an array of users, update accordingly

        // Fetch category data using the categoryId from route parameters
        const categoryResponse = await fetch(`${baseURL}/category/${categoryId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!categoryResponse.ok) {
          throw new Error(`Failed to fetch category: ${cardResponse.statusText}`);
        }

        const categoryData = await categoryResponse.json();
        // Access category details from the "category" property
        const { name, user: categoryUser } = categoryData.category;

        setFormData({
          ...formData,
          name,
          user: categoryUser._id,
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
  }, [categoryId]); 

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
      // Send POST request to update category
      const response = await fetch(`${baseURL}/category/${categoryId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to update category: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('Category updated successfully');
      navigate('/profile');
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
      <h2>Update Category</h2>
      <form onSubmit={handleSubmit} className='form-group' action={`/category/${categoryId}/update`} method="POST">
        <label className='labelform'>User:</label>
        <input
          type="text"
          name="user"
          value={formData.user || ''}
          onChange={handleChange}
          className='inputform'
          disabled
          // If you want to display the user's name, use defaultValue={currentUser.name}
        />

        <label className='labelform'>Name:</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className='inputform' required />

        <button type="submit">Update Category</button>
      </form>
    </div>
  );
};

export default Editcategory;
