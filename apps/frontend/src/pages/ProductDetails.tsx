import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

interface Product {
  id: number;
  name: string;
  fabricType: string;
  gsm: number;
  color: string;
  pricePerMeter: number;
  stock: number;
  imageUrl: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [meters, setMeters] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        pricePerMeter: product.pricePerMeter,
        meters: meters,
        imageUrl: product.imageUrl
      });
      navigate('/cart');
    }
  };

  if (loading) return Loading...;
  if (!product) return Product not found;

  return (
    
      
        
        
          {product.name}
          Fabric Type: {product.fabricType}
          GSM: {product.gsm}
          Color: {product.color}
          Stock: {product.stock} meters
          ₹{product.pricePerMeter}/meter
          
          
            Meters:
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              value={meters}
              onChange={(e) => setMeters(parseInt(e.target.value) || 1)}
            />
          

          
            Total: ₹{(product.pricePerMeter * meters).toFixed(2)}
          

          
            Add to Cart
          
        
      
    
  );
};

export default ProductDetails;