import '../App.css'
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className='navigation'>
      <button><Link to="/home">Home</Link></button>
      <button><Link to="/addtransaction">Add transaction</Link></button>
      <button><Link to="/addcard">Add card</Link></button>

    </nav>
  )
}
