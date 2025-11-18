
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCart();

  return (
    
      
        
          🧵 Fabric Marketplace
        
        
          Products
          
            Cart ({cart.length})
          
        
      
    
  );
};

export default Navbar;