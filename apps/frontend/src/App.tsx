import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import './App.css';

// Types
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

interface CartItem {
  id: number;
  name: string;
  pricePerMeter: number;
  meters: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, meters: number) => void;
  getTotalCost: () => number;
}

// Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id 
          ? { ...c, meters: c.meters + item.meters } 
          : c
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, meters: number) => {
    if (meters <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, meters } : item
      ));
    }
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.pricePerMeter * item.meters), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalCost }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Navbar Component
const Navbar: React.FC<{ currentPage: string; onNavigate: (page: string) => void }> = ({ currentPage, onNavigate }) => {
  const { cart } = useCart();

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.navLogo} onClick={() => onNavigate('home')}>
          🧵 Fabric Marketplace
        </div>
        <div style={styles.navLinks}>
          <div style={styles.navLink} onClick={() => onNavigate('home')}>
            Products
          </div>
          <div style={styles.navLink} onClick={() => onNavigate('cart')}>
            Cart ({cart.length})
          </div>
        </div>
      </div>
    </nav>
  );
};

// Product Card Component
const ProductCard: React.FC<Product & { onNavigate: (page: string, id: number) => void }> = ({ 
  id, name, fabricType, gsm, color, pricePerMeter, imageUrl, onNavigate 
}) => {
  return (
    <div style={styles.productCard} onClick={() => onNavigate('details', id)}>
      <img src={imageUrl} alt={name} style={styles.productImage} />
      <div style={styles.productInfo}>
        <h3 style={styles.productName}>{name}</h3>
        <p style={styles.fabricType}>{fabricType} • {gsm} GSM</p>
        <p style={styles.color}>Color: {color}</p>
        <p style={styles.price}>₹{pricePerMeter}/meter</p>
      </div>
    </div>
  );
};

// Product List Component
const ProductList: React.FC<{ onNavigate: (page: string, id?: number) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [color, setColor] = useState('');
  const [gsmRange, setGsmRange] = useState(400);
  const [priceRange, setPriceRange] = useState(1000);
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
      p.gsm <= gsmRange && p.pricePerMeter <= priceRange
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

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.productListContainer}>
      <aside style={styles.filters}>
        <h2>Filters</h2>
        
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search</label>
          <input 
            type="text" 
            placeholder="Search by name or color"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Fabric Type</label>
          <select value={fabricType} onChange={(e) => setFabricType(e.target.value)} style={styles.filterInput}>
            <option value="">All Types</option>
            {uniqueFabricTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Color</label>
          <select value={color} onChange={(e) => setColor(e.target.value)} style={styles.filterInput}>
            <option value="">All Colors</option>
            {uniqueColors.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>GSM Range: 0 - {gsmRange}</label>
          <input 
            type="range" 
            min="0" 
            max="400" 
            value={gsmRange}
            onChange={(e) => setGsmRange(parseInt(e.target.value))}
            style={styles.filterRange}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Price Range: ₹0 - ₹{priceRange}</label>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            style={styles.filterRange}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.filterInput}>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </aside>

      <main style={styles.productsGrid}>
        <h1>All Products ({filteredProducts.length})</h1>
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} {...product} onNavigate={onNavigate} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p style={styles.noResults}>No products found</p>
        )}
      </main>
    </div>
  );
};

// Product Details Component
const ProductDetails: React.FC<{ productId: number; onNavigate: (page: string) => void }> = ({ productId, onNavigate }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [meters, setMeters] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products/${productId}`);
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
      onNavigate('cart');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!product) return <div style={styles.loading}>Product not found</div>;

  return (
    <div style={styles.productDetails}>
      <div style={styles.detailsContainer}>
        <img src={product.imageUrl} alt={product.name} style={styles.detailsImage} />
        <div style={styles.detailsInfo}>
          <h1>{product.name}</h1>
          <p style={styles.detailRow}><strong>Fabric Type:</strong> {product.fabricType}</p>
          <p style={styles.detailRow}><strong>GSM:</strong> {product.gsm}</p>
          <p style={styles.detailRow}><strong>Color:</strong> {product.color}</p>
          <p style={styles.detailRow}><strong>Stock:</strong> {product.stock} meters</p>
          <p style={styles.priceLarge}>₹{product.pricePerMeter}/meter</p>
          
          <div style={styles.quantitySection}>
            <label style={styles.quantityLabel}>Meters:</label>
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              value={meters}
              onChange={(e) => setMeters(parseInt(e.target.value) || 1)}
              style={styles.quantityInput}
            />
          </div>

          <div style={styles.totalPrice}>
            Total: ₹{(product.pricePerMeter * meters).toFixed(2)}
          </div>

          <button style={styles.addToCartBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Component
const Cart: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, getTotalCost } = useCart();

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <button style={styles.continueShoppingBtn} onClick={() => onNavigate('home')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.cartPage}>
      <h1>Shopping Cart</h1>
      <div style={styles.cartContainer}>
        <div style={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <img src={item.imageUrl} alt={item.name} style={styles.cartItemImage} />
              <div style={styles.cartItemDetails}>
                <h3>{item.name}</h3>
                <p style={styles.cartItemPrice}>₹{item.pricePerMeter}/meter</p>
              </div>
              <div style={styles.cartItemQuantity}>
                <button 
                  onClick={() => updateQuantity(item.id, item.meters - 1)}
                  style={styles.quantityBtn}
                >
                  -
                </button>
                <span style={styles.quantityValue}>{item.meters} meters</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.meters + 1)}
                  style={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              <div style={styles.cartItemTotal}>
                <p style={styles.itemTotal}>₹{(item.pricePerMeter * item.meters).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.cartSummary}>
          <h2>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>₹{getTotalCost().toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div style={styles.summaryTotal}>
            <span>Total:</span>
            <span>₹{getTotalCost().toFixed(2)}</span>
          </div>
          <button style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
          <button style={styles.continueLink} onClick={() => onNavigate('home')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleNavigate = (page: string, id?: number) => {
    setCurrentPage(page);
    if (id) setSelectedProductId(id);
  };

  return (
    <CartProvider>
      <div className="App">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        {currentPage === 'home' && <ProductList onNavigate={handleNavigate} />}
        {currentPage === 'details' && selectedProductId && (
          <ProductDetails productId={selectedProductId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'cart' && <Cart onNavigate={handleNavigate} />}
      </div>
    </CartProvider>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLogo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
  productListContainer: {
    display: 'flex',
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 2rem',
    gap: '2rem',
  },
  filters: {
    width: '280px',
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  filterGroup: {
    marginBottom: '1.5rem',
  },
  filterLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#34495e',
  },
  filterInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  filterRange: {
    width: '100%',
  },
  productsGrid: {
    flex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s',
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  productInfo: {
    padding: '1rem',
  },
  productName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#2c3e50',
  },
  fabricType: {
    color: '#7f8c8d',
    margin: '0.25rem 0',
  },
  color: {
    color: '#34495e',
    margin: '0.25rem 0',
  },
  price: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '0.5rem 0 0 0',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    margin: '3rem 0',
  },
  noResults: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    margin: '3rem 0',
  },
  productDetails: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  detailsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  detailsImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  detailsInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailRow: {
    margin: '1rem 0',
    fontSize: '1.1rem',
    color: '#34495e',
  },
  priceLarge: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '1.5rem 0',
  },
  quantitySection: {
    margin: '2rem 0',
  },
  quantityLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#2c3e50',
  },
  quantityInput: {
    width: '100px',
    padding: '0.5rem',
    fontSize: '1.1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  totalPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '1rem 0',
  },
  addToCartBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  cartPage: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  continueShoppingBtn: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '2rem',
  },
  cartContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '2rem',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr auto auto',
    gap: '1.5rem',
    alignItems: 'center',
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cartItemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  cartItemDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  cartItemPrice: {
    color: '#27ae60',
    fontWeight: 'bold',
    margin: 0,
  },
  cartItemQuantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityBtn: {
    backgroundColor: '#ecf0f1',
    border: 'none',
    width: '35px',
    height: '35px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  quantityValue: {
    fontWeight: '500',
    color: '#2c3e50',
    minWidth: '80px',
    textAlign: 'center',
  },
  cartItemTotal: {
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem',
  },
  cartSummary: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    color: '#34495e',
    fontSize: '1rem',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    marginTop: '1rem',
    borderTop: '2px solid #ecf0f1',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  checkoutBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem',
    fontSize: '1.1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1.5rem',
  },
  continueLink: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginTop: '1rem',
    color: '#3498db',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default App;