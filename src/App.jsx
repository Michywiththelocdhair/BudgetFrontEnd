import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTransaction from "./Components/AddTransaction";
import AddCard from "./Components/AddCard";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Editcard from './Components/Editcard';
import Edittransaction from './Components/Edittransaction';
import Delete from './Components/Delete';
import Profile from './Components/Profile';
import Edituser from './Components/Edituser';
import Register from './Components/Register';
import AddCategory from './Components/AddCategory';
import Editcategory from './Components/Editcategory';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addtransaction" element={<AddTransaction />} />
        <Route path="/addcard" element={<AddCard />} />
        <Route path="/editcard/:cardId" element={<Editcard />} />
        <Route path="/edittransaction/:transactionId" element={<Edittransaction />} />
        <Route path="/delete/:type/:id" element={<Delete />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edituser/:userId" element={<Edituser />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/editcategory/:categoryId" element={<Editcategory />} />
      </Routes>
    </Router>
  );
};

export default App;
