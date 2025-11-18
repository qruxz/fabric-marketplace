import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalCost } = useCart();

  if (cart.length === 0) {
    return (
      
        Your cart is empty
        
          Continue Shopping
        
      
    );
  }

  return (
    
      Shopping Cart
      
        
          {cart.map((item) => (
            
              
              
                {item.name}
                ₹{item.pricePerMeter}/meter
              
              
                <button 
                  onClick={() => updateQuantity(item.id, item.meters - 1)}
                  className="quantity-btn"
                >
                  -
                
                {item.meters} meters
                <button 
                  onClick={() => updateQuantity(item.id, item.meters + 1)}
                  className="quantity-btn"
                >
                  +
                
              
              
                ₹{(item.pricePerMeter * item.meters).toFixed(2)}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                
              
            
          ))}
        
        
          Order Summary
          
            Subtotal:
            ₹{getTotalCost().toFixed(2)}
          
          
            Shipping:
            Free
          
          
            Total:
            ₹{getTotalCost().toFixed(2)}
          
          
            Proceed to Checkout
          
          
            Continue Shopping
          
        
      
    
  );
};

export default Cart;