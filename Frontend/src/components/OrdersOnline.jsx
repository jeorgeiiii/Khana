import React, { useState, useEffect } from "react";
import "../App.css";
import restaurantApi from '../services/restaurantApi';

// Keep static data as fallback
const staticCategories = [
  { name: "Pocket Friendly Combos", count: 7 },
  { name: "Snacks", count: 7 },
  { name: "Starters", count: 21 },
  { name: "North Indian Main Course", count: 16 },
  { name: "Chinese Main course", count: 13 },
  { name: "Italian Pizza and Pasta", count: 4 },
  { name: "Rice", count: 3 },
  { name: "Breads", count: 7 },
  { name: "Boxes", count: 1 },
  { name: "Drinks (Beverages)", count: 20 }
];

const staticCombos = [
  {
    id: 1,
    name: "Dal Makhani Rice Bowl",
    price: 279,
    priceText: "₹279",
    desc: "Dal Makhani+Jeera Rice+Masala Onions",
    veg: true
  },
  {
    id: 2,
    name: "Veg Hakka Noodles with Chilli Paneer",
    price: 349,
    priceText: "₹349",
    desc: "Noodles tossed with a savory blend of soy sauce and chilli sauce, while ...",
    veg: true
  },
  {
    id: 3,
    name: "Veg Hakka Noodles with Manchurian",
    price: 299,
    priceText: "₹299",
    desc: "A classic Chinese inspired veg dish featuring stir fried noodles and crispy manchurian ...",
    veg: true
  },
  {
    id: 4,
    name: "Veg Fried Rice with Chilli Paneer",
    price: 349,
    priceText: "₹349",
    desc: "A popular veg dish that combines the savory goodness of fried rice with ...",
    veg: true
  },
  {
    id: 5,
    name: "Veg Fried Rice with Manchurian",
    price: 299,
    priceText: "₹299",
    desc: "The fried rice is typically made with vegetables like carrots, peas, corn and ...",
    veg: true
  },
  {
    id: 6,
    name: "Aloo Tikki Burger Combo",
    price: 249,
    priceText: "₹249",
    desc: "Aloo Tikki Burger+Fries+Cold Coffee",
    veg: true
  },
  {
    id: 7,
    name: "Italian Feast Combo",
    price: 399,
    priceText: "₹399",
    desc: "Pasta+Garlic Bread+Cold Drink",
    veg: true
  }
];

const OrderOnline = ({ restaurant, onBack, addToCart, cartItems = [] }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [showCartToast, setShowCartToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState('');

  // Fetch menu data when component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      if (restaurant?._id) {
        setLoading(true);
        try {
          const menuData = await restaurantApi.getRestaurantMenu(restaurant._id);
          setMenu(menuData.foods || []);
          
          const categoriesData = await restaurantApi.getRestaurantCategories(restaurant._id);
          if (categoriesData.categories?.length > 0) {
            const formattedCategories = categoriesData.categories.map((cat, index) => ({
              name: cat.name,
              count: menuData.foods?.filter(item => 
                (item.Category || item.category) === cat.name
              ).length || 0
            }));
            setCategories(formattedCategories);
          }
        } catch (error) {
          console.error('Error fetching menu data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMenuData();
  }, [restaurant]);

  // Get dynamic combos from menu if available
  const getDynamicCombos = () => {
    if (menu.length > 0) {
      return menu.map((item, idx) => ({
        id: item._id || idx,
        name: item.Title || item.name,
        price: item.Price || item.price || 199,
        priceText: `₹${item.Price || item.price || 199}`,
        desc: item.Description || item.description || item.desc || 'Delicious food item',
        category: item.Category || item.category || 'Other',
        veg: item.veg !== false,
        image: item.ImageURL
      }));
    }
    return staticCombos;
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    const cartItem = {
      _id: item.id,
      name: item.name,
      price: item.price,
      quantity: (quantities[item.id] || 0) + 1,
      image: item.image,
      veg: item.veg
    };
    
    if (addToCart) {
      addToCart(cartItem, restaurant);
    }
    
    // Update quantity locally
    setQuantities(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    // Show animation
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setLastAddedItem(item.name);
    setShowCartToast(true);
    
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
      setShowCartToast(false);
    }, 1500);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  // Get quantity of an item in cart
  const getItemQuantity = (itemId) => {
    if (cartItems) {
      const cartItem = cartItems.find(item => item._id === itemId);
      return cartItem?.quantity || quantities[itemId] || 0;
    }
    return quantities[itemId] || 0;
  };

  // Filter combos based on search
  const filteredCombos = getDynamicCombos().filter(combo =>
    combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCombos = getDynamicCombos();

  // Get total cart items count
  const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 
                         Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="order-online-container">
      {/* Cart Toast Notification */}
      {showCartToast && (
        <div className="cart-toast">
          🛒 Added to cart: {lastAddedItem}
        </div>
      )}
      
      {/* Cart Summary Bar */}
      {totalCartItems > 0 && (
        <div className="cart-summary-bar">
          <div className="cart-summary-content">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{totalCartItems} item(s) in cart</span>
            <button 
              className="view-cart-btn"
              onClick={() => window.location.href = '/checkout'}
            >
              View Cart →
            </button>
          </div>
        </div>
      )}
      
      <nav className="order-online-tabs">
        <span className="tab">Overview</span>
        <span className="tab active">Order Online</span>
        <span className="tab">Reviews</span>
        <span className="tab">Photos</span>
        <span className="tab">Menu</span>
        <span className="tab">Book a Table</span>
      </nav>
      
      {loading && <div className="loading-spinner">Loading menu...</div>}
      
      <div className="order-online-main">
        <aside className="order-online-sidebar">
          {(categories.length > 0 ? categories : staticCategories).map((cat, idx) => (
            <div 
              key={idx} 
              className={`sidebar-category ${activeCategory === idx ? "active" : ""}`}
              onClick={() => setActiveCategory(idx)}
            >
              {cat.name} <span className="count">({cat.count})</span>
            </div>
          ))}
        </aside>
        
        <section className="order-online-content">
          <div className="order-online-header">
            <h2>Order Online {restaurant?.Title && `from ${restaurant.Title}`}</h2>
            <span className="live-track">🟢 Live track your order</span>
            <span className="delivery-time">{restaurant?.Time || '52 min'}</span>
            <input 
              className="search-menu" 
              placeholder="Search within menu"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <h3>Pocket Friendly Combos</h3>
          <div className="combo-list">
            {(searchTerm ? filteredCombos : displayCombos).map((combo) => (
              <div key={combo.id} className={`combo-item ${addedItems[combo.id] ? 'item-added' : ''}`}>
                <div className="combo-info">
                  <div className="combo-title">
                    <span className={`veg-dot ${combo.veg ? 'veg' : 'non-veg'}`} /> 
                    {combo.name}
                  </div>
                  <div className="combo-price">{combo.priceText}</div>
                  <div className="combo-desc">{combo.desc}</div>
                  <a className="read-more" href="#">read more</a>
                </div>
                
                <div className="combo-actions">
                  {getItemQuantity(combo.id) > 0 ? (
                    <div className="quantity-control">
                      <button 
                        className="qty-btn"
                        onClick={() => {
                          const newQty = getItemQuantity(combo.id) - 1;
                          handleQuantityChange(combo.id, newQty);
                          if (newQty === 0) {
                            // Remove from cart if quantity becomes 0
                            if (addToCart) {
                              addToCart({ ...combo, _id: combo.id, quantity: -1 }, restaurant);
                            }
                          } else {
                            if (addToCart) {
                              addToCart({ ...combo, _id: combo.id, quantity: -1 }, restaurant);
                              addToCart({ ...combo, _id: combo.id, quantity: 1 }, restaurant);
                            }
                          }
                        }}
                      >
                        −
                      </button>
                      <span className="qty-value">{getItemQuantity(combo.id)}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleAddToCart(combo)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(combo)}
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {searchTerm && filteredCombos.length === 0 && (
            <div className="no-results">No items found matching "{searchTerm}"</div>
          )}
        </section>
      </div>
      
      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>
  );
};

export default OrderOnline;