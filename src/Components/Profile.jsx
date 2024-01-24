import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import '../App.css';
import { BsTrash } from 'react-icons/bs';
import { BiEditAlt } from 'react-icons/bi';
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  const [user, setUser] = useState(null); // Initialize user state as null
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    // Fetch user data
    fetch(`${baseURL}/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('User data:', data);
        setUser(data.user); // Assuming the response contains an array of users, update accordingly
        setLoading(false); // Set loading to false after successful data fetching

      })
    .catch((error) => {
      console.error(error);
      setLoading(false); // Set loading to false in case of an error
    });

    // Fetch categories
    fetch(`${baseURL}/categories`)
      .then((response) => response.json())
      .then((data) => {
        // Filter the cards based on the user ID
        const filteredCategories = data.categories.filter((category) => category.user._id === userId);
        setCategories(filteredCategories);
      })
      .catch((error) => console.error(error));

  }, []);

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Redirect to the login page or any other desired page after logout
    navigate(`/`);
  };

  // Render loading state until data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className='page profile'>
      <div>
        <h2>Categories</h2>
        <Link to={`/addcategory`}>
          <BiPlus className='icon'/>
         </Link>
        <div className='categories'>
          {categories.map((category) => (
            <div key={category._id} className='category'>
              <p>{category.name}</p>
              <div className='icon_holder'>
                <Link to={`/editcategory/${category._id}`}>
                  <BiEditAlt className='icon' />
                </Link>
                <Link to={`/delete/category/${category._id}`}>
                  <BsTrash className='icon' />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <h2>My Account</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <Link to={`/edituser/${user._id}`}>
          <BiEditAlt className='icon' />
        </Link>
      </div>
      <button className='logoutbutton' onClick={handleLogout}>
        Logout
      </button>
      <Navbar />
    </div>
  );
};

export default Profile;
