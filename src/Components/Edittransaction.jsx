import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Edittransaction = () => {
  const navigate = useNavigate();
  const { transactionId } = useParams(); // Extract transactionId from route parameters

  const [formData, setFormData] = useState({
    budget: '',
    card: '',
    category: '',
    amount: '',
    transaction_type: '',
    description: '',
    date: '',
    user: '', // Include the logged-in user's ID in the transaction data
  });

  const [budgets, setBudgets] = useState([]);
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
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
        setUser(userData.user);

        // Combine fetch requests for budgets, cards, and categories
        const [budgetsResponse, cardsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseURL}/budgets`),
          fetch(`${baseURL}/cards`),
          fetch(`${baseURL}/categories`),
        ]);

        const [budgetsData, cardsData, categoriesData] = await Promise.all([
          budgetsResponse.json(),
          cardsResponse.json(),
          categoriesResponse.json(),
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

        // Fetch transaction data using the transactionId from route parameters
        const transactionResponse = await fetch(`${baseURL}/transaction/${transactionId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!transactionResponse.ok) {
          throw new Error(`Failed to fetch transaction: ${transactionResponse.statusText}`);
        }

        const transactionData = await transactionResponse.json();
        // Access card details from the "card" property
        const { budget, card, category, amount, transaction_type, description, date, user: transactionUser } = transactionData.transaction;

        // Convert the date to "yyyy-MM-dd" format
        const formattedDate = new Date(date).toISOString().split('T')[0];

        setFormData({
          ...formData,
          budget,
          card,
          category,
          amount,
          transaction_type,
          description,
          date: formattedDate,
          user: transactionUser._id,
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
  }, [transactionId]);

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
      // Send POST request to update transaction
      const response = await fetch(`${baseURL}/transaction/${transactionId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming the server sends error details in JSON format
        throw new Error(`Failed to update transaction: ${errorData.message}`);
      }

      // Optionally, you can redirect the user or perform other actions after a successful submission
      console.log('Transaction updated successfully');
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
      <h2>Update Transaction</h2>
      <form onSubmit={handleSubmit} className='form-group' action={`/transaction/${transactionId}/update`} method="POST">
        <label className='labelform'>User:</label>
        <input
          className='inputform'
          type="text"
          name="user"
          value={formData.user || ''}
          onChange={handleChange}
          disabled
          // If you want to display the user's name, use defaultValue={currentUser.name}
        />

        <label className='labelform'>Card:</label>
        <select name="card" value={formData.card || ''} onChange={handleChange} className='inputform' required>
          <option value="">Select a Card</option>
          {cards.map((card) => (
            <option key={card._id} value={card.card_name}>
              {card.card_name}
            </option>
          ))}
        </select>

        <label className='labelform'>Category:</label>
        <select name="category" value={formData.category || ''} onChange={handleChange} className='inputform' >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <label className='labelform'>Amount:</label>
        <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} className='inputform' required />

        <label className='labelform'>Date:</label>
        <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className='inputform' required />

        <label className='labelform'>Transaction Type:</label>
        <select name="transaction_type" value={formData.transaction_type || ''} onChange={handleChange} className='inputform' required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label className='labelform'>Description:</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} className='inputform' />

        <button type="submit" >Update Transaction</button>
      </form>
    </div>
  );
};

export default Edittransaction;
