import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const AddCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    card_name: '',   
    amount: '',
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
      // Send POST request to create a new card
      const response = await fetch(`${baseURL}/card/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to add card: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('Card added successfully');
       navigate('/home');
    } catch (error) {
      console.error(error);
      // Handle errors, display a message to the user, etc.
    }
  };

  return (
    <div className='page'>
      <h2>Add Card</h2>
      <form onSubmit={handleSubmit} className='form-group' action="/card/create" method="POST">
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

        <label className='labelform'>Card Name:</label>
        <input type="text" name="card_name" value={formData.card_name} onChange={handleChange} className='inputform' required />

        <label className='labelform'>Amount:</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} className='inputform' required />

        <button type="submit">Add Card</button>
      </form>
    </div>
  );
};

export default AddCard;
