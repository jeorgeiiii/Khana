import "./RestaurantDetails.css";
import React, { useState } from 'react';

const RestaurantDetail = ({ restaurant, onBack, onReviewsClick, onBookTableClick, onMenuClick, onOrderOnlineClick }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const restaurantDetails = {
    "Olio - The Mood Fired Pizzeria": {
      address: "6, Opposite Palsia Police Station, Old Palsia, Indore",
      timing: "Open now - 24 Hours (Today)",
      price: "₹100 for one",
      phone: "+91971703317",
      cuisine: "Pizza",
      offers: [
        "Flat 10% OFF on bill payments",
        "Get a scratch card after every transaction",
        "Flat 10% OFF valid on your next dining payment"
      ],
      photos: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3"
      ]
    },
    "Apna Sweets": {
      address: "456 Sweet Lane, Indore",
      timing: "Open 9AM - 10PM",
      price: "₹150 for one",
      phone: "+91971703321",
      cuisine: "Desserts, Ice Cream, Juice...",
      offers: [
        "75% OFF on selected sweets",
        "Buy 2 Get 1 Free on ice cream"
      ],
      photos: [
        "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
      ]
    },
    "Tandoori Nights": {
      address: "78, MG Road, Indore",
      timing: "Open 11AM - 11PM",
      price: "₹300 for two",
      phone: "+91971703333",
      cuisine: "Indian, BBQ, Kebabs",
      offers: [
        "Flat 10% OFF on bill payments",
        "Get a scratch card after every transaction",
        "Flat 10% OFF valid on your next dining payment"
      ],
      photos: [
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
      ]
    }
  };

  // Use the restaurant data directly if it exists, otherwise use fallback
  const details = restaurantDetails[restaurant.name] || {
    address: restaurant.address || "Address information not available",
    timing: restaurant.timing || "Check timing with restaurant",
    price: restaurant.price || "Price not available",
    phone: restaurant.phone || "Contact not available",
    cuisine: restaurant.cuisine || "Cuisine information not available",
    offers: ["Special offers available"],
    photos: restaurant.img ? [restaurant.img] : []
  };

  // Reviews data
  const reviews = [
    {
      id: 1,
      userName: "Ansh Pandey",
      userStats: "0 reviews • 0 Followers",
      type: "DELIVERY",
      time: "14 hours ago",
      review: "I'm a bekaar khaana kit Ivya hit kehne The balls of manchurian are disgusting......Worst food ever I had eaten....",
      helpful: 11,
      comments: 0
    },
    {
      id: 2,
      userName: "Divy Sharma",
      userStats: "0 reviews • 0 Followers",
      type: "DELIVERY",
      time: "15 hours ago",
      review: "It was uncooked and not properly filled.",
      helpful: 12,
      comments: 0
    }
  ];

  const handleTabClick = (tab) => {
    switch(tab) {
      case 'overview':
        if (onBack) onBack(); // Go to overview (detail view)
        break;
      case 'reviews':
        if (onReviewsClick) onReviewsClick();
        break;
      case 'book':
        if (onBookTableClick) onBookTableClick();
        break;
      case 'menu':
        if (onMenuClick) onMenuClick();
        break;
      case 'orderOnline':
        if (onOrderOnlineClick) onOrderOnlineClick();
        break;
      case 'photos':
        setActiveTab('photos'); // Only local tab for photos
        break;
      default:
        setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'reviews':
        return renderReviewsContent();
      case 'photos':
        return renderPhotosContent();
      case 'menu':
        return renderMenuContent();
      case 'book':
        return renderBookContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => (
    <>
      {/* Photos Section */}
      <div className="photos-section-compact">
        <div className="photos-header">
          <h3 className="section-title">Photos</h3>
          <button className="view-gallery-btn" onClick={() => setActiveTab('photos')}>
            View Gallery →
          </button>
        </div>
        <div className="photos-grid-compact">
          {details.photos.slice(0, 3).map((photo, index) => (
            <div key={index} className="photo-item-compact">
              <img src={photo} alt={`${restaurant.name} ${index + 1}`} />
              {index === 2 && details.photos.length > 3 && (
                <div className="photo-overlay">+{details.photos.length - 3}</div>
              )}
            </div>
          ))}
          {details.photos.length === 0 && (
            <div className="no-photos">No photos available</div>
          )}
        </div>
      </div>

      {/* Dining Offers */}
      <div className="offers-section-compact">
        <h3 className="section-title">Dining Offers</h3>
        <p className="offer-subtitle">Tap on any offer to know more</p>
        
        <div className="offer-cards-compact">
          <div className="offer-card-compact">
            <span className="offer-badge instant">INSTANT OFFER</span>
            <h4>Flat 10% OFF</h4>
            <p>on bill payments</p>
          </div>
          
          <div className="offer-card-compact">
            <span className="offer-badge surprise">SURPRISE</span>
            <h4>Get a scratch card</h4>
            <p>after every transaction</p>
          </div>
          
          <div className="offer-card-compact">
            <span className="offer-badge exclusive">EXCLUSIVE OFFER</span>
            <h4>Flat 10% OFF</h4>
            <p>valid on your next dining payment</p>
          </div>
        </div>

        {/* Bank Offer */}
        <div className="bank-offer-compact">
          <h4>BANK OFFER</h4>
          <p>20% OFF up to ₹5000 on Solitaire Credit Cards</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section-compact">
        <h3 className="section-title">Menu</h3>
        <div className="cuisines-compact">
          <span className="cuisine-tag">North Indian</span>
          <span className="cuisine-tag">Chinese</span>
          <span className="cuisine-tag">Momos</span>
          <span className="cuisine-tag">Rolls</span>
        </div>
        <button className="see-all-menu" onClick={() => handleTabClick('menu')}>
          See all menus →
        </button>
      </div>

      {/* Table Reservation */}
      <div className="reservation-compact">
        <h3 className="section-title">Table reservation</h3>
        <div className="reservation-card-compact">
          <span className="reservation-offer">● Flat 10% OFF + 2 more offers</span>
          <div className="reservation-widget-compact">
            <span>Today • 1 guest</span>
            <button className="book-btn-compact" onClick={() => handleTabClick('book')}>
              Book a table
            </button>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="location-compact">
        <p className="location-address">{details.address}</p>
        <button className="copy-direction">Copy Direction</button>
        <button className="see-outlets">See at 2 {restaurant.name} outlets in Indore →</button>
      </div>
    </>
  );

  const renderReviewsContent = () => (
    <div className="reviews-content">
      <h3 className="section-title">All Reviews</h3>
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            {review.userName && (
              <div className="user-info">
                <div className="user-name">{review.userName}</div>
                {review.userStats && <div className="user-stats">{review.userStats}</div>}
              </div>
            )}
            <div className="review-content">
              <div className="review-meta">
                <span className="review-type">{review.type}</span>
                <span className="review-time">{review.time}</span>
              </div>
              {review.review && (
                <p className="review-text">{review.review}</p>
              )}
              <div className="review-actions">
                <div className="review-stats">
                  <span className="votes">{review.helpful} Votes for helpful</span>
                  <span className="comments">{review.comments} Comments</span>
                </div>
                <div className="action-buttons">
                  <button className="action-btn helpful">Helpful</button>
                  <button className="action-btn comment">Comment</button>
                  <button className="action-btn share">Share</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="follow-section">
        <button className="follow-btn">Follow</button>
      </div>
    </div>
  );

  const renderPhotosContent = () => (
    <div className="photos-content">
      <h3 className="section-title">Photos of {restaurant.name}</h3>
      <div className="photos-grid-full">
        {details.photos.map((photo, index) => (
          <div key={index} className="photo-item-full">
            <img src={photo} alt={`${restaurant.name} ${index + 1}`} />
          </div>
        ))}
        {details.photos.length === 0 && (
          <div className="no-photos-full">No photos available for this restaurant</div>
        )}
      </div>
    </div>
  );

  const renderMenuContent = () => (
    <div className="menu-content-preview">
      <h3 className="section-title">Menu Preview</h3>
      <p>Click below to view the complete menu for {restaurant.name}</p>
      <button className="view-full-menu-btn" onClick={onMenuClick}>
        View Full Menu →
      </button>
    </div>
  );

  const renderBookContent = () => (
    <div className="book-content-preview">
      <h3 className="section-title">Book a Table</h3>
      <p>Click below to start your reservation process for {restaurant.name}</p>
      <button className="start-booking-btn" onClick={onBookTableClick}>
        Start Booking Process →
      </button>
    </div>
  );

  return (
    <div className="restaurant-detail-compact">
      {/* Header */}
      <div className="detail-header-compact">
        <button className="back-btn-compact" onClick={onBack}>←</button>
        <h1 className="restaurant-name-compact">{restaurant.name}</h1>
      </div>

      {/* Basic Info */}
      <div className="basic-info-compact">
        <p className="cuisine-compact">{details.cuisine}</p>
        <p className="address-compact">{details.address}</p>
        
        <div className="info-row-compact">
          <span className="timing-compact">🕒 {details.timing}</span>
          <span className="price-compact">💰 {details.price}</span>
          <span className="phone-compact">📞 {details.phone}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-compact">
        <span className={`tab-compact ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabClick('overview')}>
          Overview
        </span>
        <span className={`tab-compact ${activeTab === 'orderOnline' ? 'active' : ''}`} onClick={() => handleTabClick('orderOnline')}>
          Order Online
        </span>
        <span className={`tab-compact ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabClick('reviews')}>
          Reviews
        </span>
        <span className={`tab-compact ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => handleTabClick('photos')}>
          Photos
        </span>
        <span className={`tab-compact ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => handleTabClick('menu')}>
          Menu
        </span>
        <span className={`tab-compact ${activeTab === 'book' ? 'active' : ''}`} onClick={() => handleTabClick('book')}>
          Book a Table
        </span>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default RestaurantDetail;