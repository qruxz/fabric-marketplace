import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [color, setColor] = useState('');
  const [gsmRange, setGsmRange] = useState([0, 400]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.color.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fabricType) {
      result = result.filter(p => p.fabricType === fabricType);
    }

    if (color) {
      result = result.filter(p => p.color === color);
    }

    result = result.filter(p => 
      p.gsm >= gsmRange[0] && p.gsm <= gsmRange[1] &&
      p.pricePerMeter >= priceRange[0] && p.pricePerMeter <= priceRange[1]
    );

    if (sortBy === 'priceLow') {
      result.sort((a, b) => a.pricePerMeter - b.pricePerMeter);
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => b.pricePerMeter - a.pricePerMeter);
    }

    setFilteredProducts(result);
  }, [search, fabricType, color, gsmRange, priceRange, sortBy, products]);

  const uniqueFabricTypes = Array.from(new Set(products.map(p => p.fabricType)));
  const uniqueColors = Array.from(new Set(products.map(p => p.color)));

  if (loading) return Loading...;

  return (
    
      
        Filters
        
        
          Search
          <input 
            type="text" 
            placeholder="Search by name or color"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        

        
          Fabric Type
          <select value={fabricType} onChange={(e) => setFabricType(e.target.value)}>
            All Types
            {uniqueFabricTypes.map(type => (
              {type}
            ))}
          
        

        
          Color
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            All Colors
            {uniqueColors.map(c => (
              {c}
            ))}
          
        

        
          GSM Range: {gsmRange[0]} - {gsmRange[1]}
          <input 
            type="range" 
            min="0" 
            max="400" 
            value={gsmRange[1]}
            onChange={(e) => setGsmRange([0, parseInt(e.target.value)])}
          />
        

        
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
        

        
          Sort By
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            Newest
            Price: Low to High
            Price: High to Low
          
        
      

      
        All Products ({filteredProducts.length})
        
          {filteredProducts.map(product => (
            
          ))}
        
        {filteredProducts.length === 0 && (
          No products found
        )}
      
    
  );
};

export default ProductList;