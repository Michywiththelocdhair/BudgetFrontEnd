import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    budget: '',
    card: '',
    category: '',
    amount: '',
    transaction_type: 'expense',
    description: '',
    date: '',
    user: '', // Include the logged-in user's ID in the transaction data
  });
  
  const [budgets, setBudgets] = useState([]);
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchData = async () => {
      try {
        const [budgetsResponse, cardsResponse, categoriesResponse, userResponse] = await Promise.all([
          fetch(`${baseURL}/budgets`),
          fetch(`${baseURL}/cards`),
          fetch(`${baseURL}/categories`),
          fetch(`${baseURL}/user/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        const [budgetsData, cardsData, categoriesData, userData] = await Promise.all([
          budgetsResponse.json(),
          cardsResponse.json(),
          categoriesResponse.json(),
          userResponse.json(),
        ]);

        // Filter and set budgets
        const filteredBudgets = budgetsData.budgets.filter((budget) => budget.user._id === userId);
        setBudgets(filteredBudgets);

        // Filter and set cards
        const filteredCards = cardsData.cards.filter((card) => card.user._id === userId);
        setCards(filteredCards);

        // Filter and set categories
        const filteredCategories = categoriesData.categories.filter((category) => category.user._id === userId);
        setCategories(filteredCategories);

        // Set user data
        setUser(userData.user);

        // Include the user's ID in the formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          user: userData.user._id,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
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
      // Send POST request to create a new transaction
      const response = await fetch(`${baseURL}/transaction/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
          throw new Error(`Failed to add transaction: ${response.status} - ${errorData}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('Transaction added successfully');
      navigate('/home');
    } catch (error) {
      console.error(error);
      // Handle errors, display a message to the user, etc.
    }
  };

  return (
    <div className='page'>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className='form-group' action="/transaction/create" method="POST">
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

          

          <label className='labelform'>Card:</label>
          <select name="card" value={formData.card} onChange={handleChange} className='inputform' required>
            <option value="">Select a Card</option>
            {cards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.card_name}
              </option>
            ))}
          </select>

        <label className='labelform'>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange} className='inputform' >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        
          <label className='labelform'>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} className='inputform' required />

          <label className='labelform'>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className='inputform' required />

          <label className='labelform'>Transaction Type:</label>
          <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} className='inputform' required>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <label className='labelform'>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className='inputform'/>
      
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

  export default AddTransaction;
