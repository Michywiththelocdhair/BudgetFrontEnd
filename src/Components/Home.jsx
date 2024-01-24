import '../App.css';
import React, { useState, useEffect } from 'react';
import { baseURL } from '../utils/constant.js';
import { BsTrash } from 'react-icons/bs';
import { BiEditAlt } from 'react-icons/bi';
import { CiMenuBurger } from "react-icons/ci";
import Navbar from './Navbar';
import { Link } from 'react-router-dom';


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null); // Initialize user state as null

  useEffect(() => {
    // Fetch user data based on the user ID stored in localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
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
        })
        .catch((error) => console.error(error));
    }
    

    // Fetch cards
    fetch(`${baseURL}/cards`)
      .then((response) => response.json())
      .then((data) => {
        // Filter the cards based on the user ID
        const filteredCards = data.cards.filter((card) => card.user._id === userId);
        setCards(filteredCards);
      })
      .catch((error) => console.error(error));

    // Fetch transactions
    fetch(`${baseURL}/transactions`)
      .then((response) => response.json())
      .then((data) => {
        // Filter the transactionss based on the user ID
        const filteredTransactions = data.transactions.filter((transaction) => transaction.user._id === userId);
        console.log('Transaction data:', filteredTransactions);
        setTransactions(filteredTransactions);
        
      })
      .catch((error) => console.error(error));
      setIsLoading(false); // Set loading to false after data fetching is complete
    
  }, []);

  return (
   <div className='body'>
      <div className='header'>
        {user && <h4>Hey there, {user.username}!</h4>}
        <Link to={`/profile`}>
          <CiMenuBurger className='icon menu'/>
        </Link>
      </div>
     {isLoading ? (
     <div>Loading...</div>
     ) : (
     <>
       {(cards.length === 0 || transactions.length === 0) && (
         <h4>
           Add your cards and transactions below!
         </h4>
       )}
       <h2>Cards</h2>
       <div className='cards-container'>
         <div className='cards'>
           {cards.map((card) => (
             <div key={card._id} className='card'>
               <p>{card.card_name} </p>
               <p>Amount: ${card.amount}</p>
               <div className='icon_holder'>
                 <Link to={`/editcard/${card._id}`}>
                   <BiEditAlt className='icon' />
                 </Link>
                 <Link to={`/delete/card/${card._id}`}>
                   <BsTrash className='icon'/>
                 </Link>

               </div>

             </div>
           ))}
          </div>
       </div>

       <h2>Transactions</h2>
       {transactions.map((transaction) => (
         <div key={transaction._id} className='transaction'>
           <div className='transactiondescription'>
             <div>
               <p>{transaction.description} </p>
                  {transaction.category && (
                <p className='transactioncategory'>{transaction.category.name}</p>
                  )}
             </div>
             <p>${transaction.amount}</p>
           </div>
           <p>{new Date(transaction.date).toLocaleDateString('en-GB')}</p>
           <div className='icon_holder'>
             <Link to={`/edittransaction/${transaction._id}`}>
               <BiEditAlt className='icon' />
             </Link>
             <Link to={`/delete/transaction/${transaction._id}`}>
               <BsTrash className='icon'/>
             </Link>

           </div>
         </div>
       ))}
       <Navbar />
     </>
     )}     
    </div>
  );
}
