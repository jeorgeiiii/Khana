import React from "react";
import "./Header.css";

const Header = () => {
  const [currentView, setCurrentView] = React.useState("delivery");

  const handleDiningOutClick = () => {
    setCurrentView("diningOut");
  };

  const handleDeliveryClick = () => {
    setCurrentView("delivery");
  };

  const handleNightlifeClick = () => {
    setCurrentView("nightlife");
  };

  return (
    <div className="zomato-header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="logo-location">
          <span className="logo">zomato</span>
          <span className="location">
            <span className="location-icon">📍</span>
            <span>Indore</span>
            <span className="dropdown-arrow">▼</span>
          </span>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search for restaurant, cuisine or a dish" />
        </div>
        <div className="auth-links">
          <span className="login">Log in</span>
          <span className="signup">Sign up</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span> / <span>India</span> / <span>Indore Restaurants</span>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="tab" onClick={handleDiningOutClick}>
          <span className="tab-icon">🍴</span>
          <span>Dining Out</span>
        </div>
        <div className="tab active" onClick={handleDeliveryClick}>
          <span className="tab-icon">🛵</span>
          <span>Delivery</span>
        </div>
        <div className={`tab ${currentView === 'nightlife' ? 'active' : ''}`} onClick={handleNightlifeClick}>
          <span className="tab-icon">🍷</span>
          <span>Nightlife</span>
        </div>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <button className="filter-btn">
          <span className="filter-icon">⚙️</span> Filters
        </button>
        <button className="pure-veg-btn">Pure Veg</button>
        <div className="cuisines-dropdown">
          <span>Cuisines</span>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
    </div>
  );
};

export default Header;