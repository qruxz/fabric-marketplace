import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  fabricType: string;
  gsm: number;
  color: string;
  pricePerMeter: number;
  imageUrl: string;
}

const ProductCard: React.FC = ({ 
  id, name, fabricType, gsm, color, pricePerMeter, imageUrl 
}) => {
  return (
    
      
      
        {name}
        {fabricType} • {gsm} GSM
        Color: {color}
        ₹{pricePerMeter}/meter
      
    
  );
};

export default ProductCard;