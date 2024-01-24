import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
  const navigate = useNavigate();
  const { id, type } = useParams(); // Extract id and type from route parameters
  const [item, setItem] = useState(null); // State to store the item data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch item data using the id and type from route parameters
        const response = await fetch(`${baseURL}/${type}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch item: ${response.statusText}`);
        }

        const itemData = await response.json();
       
        setItem(itemData[type]); // Assuming the response contains an object with the specified type 
        

        setLoading(false);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setLoading(false);
      }
    };

    fetchData();
   
  }, [id, type]); 

  useEffect(() => {
    console.log('Item:', item);
  }, [item]);


  const handleDelete = async () => {
    try {
      // Send DELETE request to delete the item
      const response = await fetch(`${baseURL}/${type}/${id}/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to delete item: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful deletion
      console.log(`${type} deleted successfully`);
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
      <h3>Are you sure you want to delete this {type}?</h3>
      {/* Display item details if available */}
      {item && (
        <div >
          {/* Display item details based on type */}
          {type === 'card' && (
            <p>
              Card Name: {item.card_name}, Amount: ${item.amount}
            </p>
          )}
          {type === 'transaction' && (
            <p>
              Description: {item.description}, Amount: ${item.amount}
            </p>
          )}
          {type === 'category' && (
            <p>
              Name: {item.name}
            </p>
          )}
        </div>
      )}
      <button onClick={handleDelete}>Delete {type}</button>
    </div>
  );
};

export default Delete;
