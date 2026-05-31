import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Header = ({ onTabChange, currentView, selectedLocation }) => {
  const [currentViewState, setCurrentViewState] = React.useState(currentView || "delivery");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loggedInUser, setLoggedInUser] = React.useState('');
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loggedInUser');
    setIsLoggedIn(!!token);
    setLoggedInUser(user || '');
    updateCartCount();
  }, []);

  // Function to update cart count from localStorage
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    } else {
      setCartCount(0);
    }
  };

  const handleDiningOutClick = () => {
    setCurrentViewState("diningOut");
    if (onTabChange) onTabChange("diningOut");
  };

  const handleDeliveryClick = () => {
    setCurrentViewState("delivery");
    if (onTabChange) onTabChange("delivery");
  };

  const handleNightlifeClick = () => {
    setCurrentViewState("nightlife");
    if (onTabChange) onTabChange("nightlife");
  };

  const handleLocationClick = () => {
    console.log("Location selector clicked");
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setLoggedInUser('');
    navigate('/login');
  };

  return (
    <div className="zomato-header">
      <div className="header-top">
        <div className="logo-location">
          <span className="logo" onClick={() => navigate('/home')}>zomoro</span>
          <span className="location" onClick={handleLocationClick}>
            <span className="location-icon">📍</span>
            <span>{selectedLocation || "Indore"}</span>
            <span className="dropdown-arrow">▼</span>
          </span>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search for restaurant, cuisine or a dish" />
        </div>
        <div className="auth-links">
          {isLoggedIn ? (
            <>
              <span className="profile-link" onClick={handleProfileClick}>
                <span className="profile-icon">👤</span>
                {loggedInUser || 'Profile'}
              </span>
              <span className="favorites-link" onClick={() => navigate('/favorites')}>
                ❤️ Favorites
              </span>
              <span className="orders-link" onClick={() => navigate('/profile?tab=orders')}>
                📦 Orders
              </span>
              {/* CART LINK - FIXED */}
              <span className="cart-link" onClick={handleCartClick}>
                🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </span>
              <span className="logout-link" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <>
              <span className="login" onClick={handleLoginClick}>Log in</span>
              <span className="signup" onClick={handleSignupClick}>Sign up</span>
            </>
          )}
        </div>
      </div>

      <div className="breadcrumb">
        <span onClick={() => navigate('/home')}>Home</span> / <span>India</span> / <span>{selectedLocation || "Indore"} Restaurants</span>
      </div>

      <div className="nav-tabs">
        <div 
          className={`tab ${currentViewState === 'diningOut' ? 'active' : ''}`} 
          onClick={handleDiningOutClick}
        >
          <span className="tab-icon">🍴</span>
          <span>Dining Out</span>
        </div>
        <div 
          className={`tab ${currentViewState === 'delivery' ? 'active' : ''}`} 
          onClick={handleDeliveryClick}
        >
          <span className="tab-icon">🛵</span>
          <span>Delivery</span>
        </div>
        <div 
          className={`tab ${currentViewState === 'nightlife' ? 'active' : ''}`} 
          onClick={handleNightlifeClick}
        >
          <span className="tab-icon">🍷</span>
          <span>Nightlife</span>
        </div>
      </div>

      <div className="filters-row">
        {currentViewState === 'nightlife' ? (
          <>
            <button className="filter-btn">
              <span className="filter-icon">⚙️</span> Filters
            </button>
            <button className="pure-veg-btn">Open Now</button>
            <div className="cuisines-dropdown">
              <span>Music Type</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="cuisines-dropdown">
              <span>Place Type</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </>
        ) : currentViewState === 'diningOut' ? (
          <>
            <button className="filter-btn">
              <span className="filter-icon">⚙️</span> Filters
            </button>
            <button className="pure-veg-btn">Pure Veg</button>
            <div className="cuisines-dropdown">
              <span>Cuisines</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="cuisines-dropdown">
              <span>Rating 4.5+</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </>
        ) : (
          <>
            <button className="filter-btn">
              <span className="filter-icon">⚙️</span> Filters
            </button>
            <button className="pure-veg-btn">Pure Veg</button>
            <div className="cuisines-dropdown">
              <span>Cuisines</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;