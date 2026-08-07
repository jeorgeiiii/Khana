import React, { useState, useEffect } from "react";
import "../App.css";
import restaurantApi from '../services/restaurantApi';

const OrderOnline = ({ restaurant, onBack, addToCart, cartItems = [] }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurantReviewCount, setRestaurantReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [showCartToast, setShowCartToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState('');

  // Filter state
  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null); // null = no price limit

  useEffect(() => {
    const fetchMenuData = async () => {
      if (restaurant?._id) {
        setLoading(true);
        try {
          const menuData = await restaurantApi.getRestaurantMenu(restaurant._id);
          const foods = menuData.foods || [];
          setMenu(foods);

          const categoriesData = await restaurantApi.getRestaurantCategories(restaurant._id);
          if (categoriesData.categories?.length > 0) {
            const formattedCategories = categoriesData.categories.map((cat) => ({
              name: cat.name,
              count: foods.filter(item => {
                const itemCategory = item.Category || item.category || 'Other';
                return String(itemCategory).trim() === String(cat.name).trim();
              }).length || 0
            }));
            setCategories(formattedCategories);
          } else if (foods.length > 0) {
            const groupedCategories = foods.reduce((acc, item) => {
              const category = item.Category || item.category || 'Other';
              acc[category] = (acc[category] || 0) + 1;
              return acc;
            }, {});
            setCategories(Object.entries(groupedCategories).map(([name, count]) => ({ name, count })));
          }

          const reviewsData = await restaurantApi.getRestaurantReviews(restaurant._id);
          setRestaurantReviewCount(reviewsData.reviews?.length || 0);
        } catch (error) {
          console.error('Error fetching menu data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMenuData();
  }, [restaurant]);

  // Reset to the first category whenever the source list changes
  useEffect(() => {
    setActiveCategory(0);
  }, [menu.length]);

  const visibleCategories = categories.length > 0 ? categories : [];
  const activeCategoryName = visibleCategories[activeCategory]?.name;

  const getAllItems = () => {
    return menu.map((item, idx) => ({
      id: item._id || idx,
      name: item.Title || item.name || 'Food Item',
      price: Number(item.Price || item.price || 199),
      priceText: `₹${Number(item.Price || item.price || 199)}`,
      desc: item.Description || item.description || item.desc || 'Delicious food item',
      category: item.Category || item.category || 'Other',
      veg: item.veg !== false && !String(item.FoodTags || '').toLowerCase().includes('non-veg') && !String(item.Category || '').toLowerCase().includes('non-veg'),
      image: item.ImageURL
    }));
  };

  // Chain all filters: category + search + veg + price
  const applyFilters = (list) => list.filter(item => {
    const normalizedCategory = String(item.category || '').trim();
    const matchesCategory = !activeCategoryName || normalizedCategory === activeCategoryName;
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = !vegOnly || item.veg === true;
    const matchesPrice = !maxPrice || item.price < maxPrice;
    return matchesCategory && matchesSearch && matchesVeg && matchesPrice;
  });

  const handleAddToCart = (item) => {
    const cartItem = {
      _id: item.id,
      name: item.name,
      price: item.price,
      quantity: (quantities[item.id] || 0) + 1,
      image: item.image,
      veg: item.veg
    };

    if (addToCart) addToCart(cartItem, restaurant);

    setQuantities(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setLastAddedItem(item.name);
    setShowCartToast(true);

    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
      setShowCartToast(false);
    }, 1500);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
  };

  const getItemQuantity = (itemId) => {
    if (cartItems) {
      const cartItem = cartItems.find(item => item._id === itemId);
      return cartItem?.quantity || quantities[itemId] || 0;
    }
    return quantities[itemId] || 0;
  };

  const visibleItems = applyFilters(getAllItems());

  const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ||
    Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Inline styles for the filter bar (no CSS file changes needed)
  const filterBarStyle = {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    margin: '12px 0', alignItems: 'center'
  };
  const chipStyle = (active) => ({
    padding: '6px 14px', borderRadius: '20px',
    border: active ? '1px solid #ff5722' : '1px solid #ddd',
    background: active ? '#ff5722' : '#fff',
    color: active ? '#fff' : '#333',
    cursor: 'pointer', fontSize: '13px', fontWeight: 500,
    transition: 'all 0.15s ease'
  });

  return (
    <div className="order-online-container">
      {showCartToast && (
        <div className="cart-toast">🛒 Added to cart: {lastAddedItem}</div>
      )}

      {totalCartItems > 0 && (
        <div className="cart-summary-bar">
          <div className="cart-summary-content">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{totalCartItems} item(s) in cart</span>
            <button className="view-cart-btn" onClick={() => window.location.href = '/checkout'}>
              View Cart →
            </button>
          </div>
        </div>
      )}

      <nav className="order-online-tabs">
        <span className="tab">Overview</span>
        <span className="tab active">Order Online</span>
        <span className="tab">Reviews ({restaurantReviewCount})</span>
        <span className="tab">Photos</span>
        <span className="tab">Menu</span>
      </nav>

      {loading && <div className="loading-spinner">Loading menu...</div>}

      <div className="order-online-main">
        <aside className="order-online-sidebar">
          {visibleCategories.map((cat, idx) => (
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

          {/* Filter bar */}
          <div style={filterBarStyle}>
            <span style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>Filters:</span>

            <button style={chipStyle(vegOnly)} onClick={() => setVegOnly(v => !v)}>
              🟢 Veg Only
            </button>

            <button
              style={chipStyle(maxPrice === 100)}
              onClick={() => setMaxPrice(maxPrice === 100 ? null : 100)}
            >
              Under ₹100
            </button>

            <button
              style={chipStyle(maxPrice === 200)}
              onClick={() => setMaxPrice(maxPrice === 200 ? null : 200)}
            >
              Under ₹200
            </button>

            <button
              style={chipStyle(maxPrice === 300)}
              onClick={() => setMaxPrice(maxPrice === 300 ? null : 300)}
            >
              Under ₹300
            </button>

            {(vegOnly || maxPrice) && (
              <button
                style={chipStyle(false)}
                onClick={() => { setVegOnly(false); setMaxPrice(null); }}
              >
                ✕ Clear
              </button>
            )}

            <span style={{ fontSize: '12px', color: '#aaa', marginLeft: 'auto' }}>
              {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Heading reflects the selected category */}
          <h3>{activeCategoryName || 'Menu'}</h3>

          <div className="combo-list">
            {visibleItems.map((item) => (
              <div key={item.id} className={`combo-item ${addedItems[item.id] ? 'item-added' : ''}`}>
                <div className="combo-info">
                  <div className="combo-title">
                    <span className={`veg-dot ${item.veg ? 'veg' : 'non-veg'}`} />
                    {item.name}
                  </div>
                  <div className="combo-price">{item.priceText}</div>
                  <div className="combo-desc">{item.desc}</div>
                  <a className="read-more" href="#">read more</a>
                </div>

                <div className="combo-actions">
                  {getItemQuantity(item.id) > 0 ? (
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => {
                          const newQty = getItemQuantity(item.id) - 1;
                          handleQuantityChange(item.id, newQty);
                          if (addToCart) {
                            addToCart({ ...item, _id: item.id, quantity: -1 }, restaurant);
                            if (newQty !== 0) {
                              addToCart({ ...item, _id: item.id, quantity: 1 }, restaurant);
                            }
                          }
                        }}
                      >−</button>
                      <span className="qty-value">{getItemQuantity(item.id)}</span>
                      <button className="qty-btn" onClick={() => handleAddToCart(item)}>+</button>
                    </div>
                  ) : (
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                      ADD
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {visibleItems.length === 0 && (
            <div className="no-results">
              No items in {activeCategoryName || 'this menu'} match your filters
              {searchTerm && ` for "${searchTerm}"`}.
              {(vegOnly || maxPrice) && ' Try clearing filters.'}
            </div>
          )}
        </section>
      </div>

      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>
  );
};

export default OrderOnline;
