import "../App.css";
import React, { useState, useEffect } from 'react';
import restaurantApi from '../services/restaurantApi';
import '../App.css'

const RestaurantDetail = ({ 
  restaurantId, 
  restaurant: propRestaurant, 
  onBack, 
  onReviewsClick, 
  onBookTableClick, 
  onMenuClick, 
  onOrderOnlineClick 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurant, setRestaurant] = useState(propRestaurant || null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        
        let currentRestaurant = propRestaurant;
        
        // If we have restaurantId but no restaurant prop, fetch the restaurant
        if (restaurantId && !propRestaurant) {
          const restaurantData = await restaurantApi.getRestaurantById(restaurantId);
          currentRestaurant = restaurantData.restaurant;
          setRestaurant(currentRestaurant);
        }

        // Fetch all related data if we have restaurantId or currentRestaurant
        const idToUse = restaurantId || currentRestaurant?._id;
        
        if (idToUse) {
          const [
            menuResponse, 
            reviewsResponse, 
            photosResponse, 
            categoriesResponse, 
            offersResponse
          ] = await Promise.all([
            restaurantApi.getRestaurantMenu(idToUse).catch(() => ({ foods: [] })),
            restaurantApi.getRestaurantReviews(idToUse).catch(() => ({ reviews: [] })),
            restaurantApi.getRestaurantPhotos(idToUse, currentRestaurant).catch(() => ({ photos: [] })),
            restaurantApi.getRestaurantCategories(idToUse).catch(() => ({ categories: [] })),
            restaurantApi.getRestaurantOffers(idToUse).catch(() => ({ offers: [] }))
          ]);

          setMenu(menuResponse.foods || []);
          setReviews(reviewsResponse.reviews || []);
          setPhotos(photosResponse.photos || []);
          setCategories(categoriesResponse.categories || []);
          setOffers(offersResponse.offers || []);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data');
        setLoading(false);
      }
    };

    if (restaurantId || propRestaurant) {
      fetchRestaurantData();
    } else {
      setLoading(false);
    }
  }, [restaurantId, propRestaurant]);

  // Format restaurant data for display
  const getRestaurantDetails = () => {
    if (!restaurant) return null;

    return {
      address: restaurant.address || restaurant.Coords?.address || "Address information not available",
      timing: restaurant.Time || restaurant.timing || "Check timing with restaurant",
      price: restaurant.price || "Price not available",
      phone: restaurant.phone || "Contact not available",
      cuisine: restaurant.cuisine || restaurant.Title || "Cuisine information not available",
      offers: offers.length > 0 ? offers : [],
      photos: photos.length > 0 ? photos : (restaurant.ImageURL ? [{ url: restaurant.ImageURL, title: restaurant.Title }] : []),
      rating: restaurant.Rating || 0,
      ratingCount: restaurant.RatingCount || 0,
      isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
      logo: restaurant.Logourl || null,
      image: restaurant.ImageURL || null
    };
  };

  // Group menu items by category
  const getMenuByCategory = () => {
    if (!menu || menu.length === 0) return {};
    
    return menu.reduce((acc, item) => {
      const category = item.Category || item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Call respective callbacks if provided
    switch(tab) {
      case 'reviews':
        if (onReviewsClick) onReviewsClick(restaurantId || restaurant?._id);
        break;
      case 'book':
        if (onBookTableClick) onBookTableClick(restaurantId || restaurant?._id);
        break;
      case 'menu':
        if (onMenuClick) onMenuClick(restaurantId || restaurant?._id);
        break;
      case 'orderOnline':
        if (onOrderOnlineClick) onOrderOnlineClick(restaurantId || restaurant?._id);
        break;
      default:
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="restaurant-detail-compact loading-state">
        <div className="loading-spinner">Loading restaurant details...</div>
      </div>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <div className="restaurant-detail-compact error-state">
        <p className="error-message">{error || 'Restaurant not found'}</p>
        <button className="back-btn-compact" onClick={onBack}>← Go Back</button>
      </div>
    );
  }

  const details = getRestaurantDetails();
  const menuByCategory = getMenuByCategory();

  const renderOverviewContent = () => (
    <>
      {/* Photos Section */}
      {details.photos && details.photos.length > 0 && (
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
                <img src={photo.url || photo} alt={photo.title || `${restaurant.Title} ${index + 1}`} />
                {index === 2 && details.photos.length > 3 && (
                  <div className="photo-overlay">+{details.photos.length - 3}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dining Offers */}
      {offers && offers.length > 0 && (
        <div className="offers-section-compact">
          <h3 className="section-title">Dining Offers</h3>
          <p className="offer-subtitle">Tap on any offer to know more</p>
          
          <div className="offer-cards-compact">
            {offers.slice(0, 3).map((offer, index) => (
              <div key={index} className="offer-card-compact">
                <span className={`offer-badge ${offer.type?.toLowerCase() || 'instant'}`}>
                  {offer.type || 'INSTANT OFFER'}
                </span>
                <h4>{offer.title}</h4>
                <p>{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Section */}
      {categories && categories.length > 0 && (
        <div className="menu-section-compact">
          <h3 className="section-title">Menu</h3>
          <div className="cuisines-compact">
            {categories.slice(0, 5).map((category, index) => (
              <span key={index} className="cuisine-tag">{category.name}</span>
            ))}
          </div>
          <button className="see-all-menu" onClick={() => handleTabClick('menu')}>
            See all menus →
          </button>
        </div>
      )}

      {/* Popular Dishes */}
      {menu && menu.length > 0 && (
        <div className="menu-preview-compact">
          <h3 className="section-title">Popular Dishes</h3>
          <div className="dishes-preview">
            {menu.slice(0, 5).map((item, index) => (
              <div key={index} className="dish-preview-item">
                <span className="dish-name">{item.Title || item.name}</span>
                <span className="dish-price">₹{item.Price || item.price}</span>
                {item.veg && <span className="veg-badge">🟢</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Reservation */}
      <div className="reservation-compact">
        <h3 className="section-title">Table reservation</h3>
        <div className="reservation-card-compact">
          <span className="reservation-offer">● Available offers on table booking</span>
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
      </div>
    </>
  );

  const renderReviewsContent = () => (
    <div className="reviews-content">
      <h3 className="section-title">All Reviews ({reviews.length})</h3>
      <div className="reviews-container">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id || review.id} className="review-card">
              <div className="user-info">
                <div className="user-name">{review.userName || review.user?.name || 'Anonymous'}</div>
                <div className="user-stats">{review.userStats || `${review.helpful || 0} helpful votes`}</div>
              </div>
              <div className="review-content">
                <div className="review-meta">
                  <span className="review-type">{review.type || 'DELIVERY'}</span>
                  <span className="review-time">
                    {review.time || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently')}
                  </span>
                </div>
                {review.rating && (
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                )}
                <p className="review-text">{review.review || review.comment}</p>
                <div className="review-actions">
                  <div className="review-stats">
                    <span className="votes">{review.helpful || 0} found this helpful</span>
                  </div>
                  <div className="action-buttons">
                    <button className="action-btn helpful">Helpful</button>
                    <button className="action-btn share">Share</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet for this restaurant</p>
        )}
      </div>
    </div>
  );

  const renderPhotosContent = () => (
    <div className="photos-content">
      <h3 className="section-title">Photos of {restaurant.Title || restaurant.name}</h3>
      <div className="photos-grid-full">
        {details.photos && details.photos.length > 0 ? (
          details.photos.map((photo, index) => (
            <div key={index} className="photo-item-full">
              <img src={photo.url || photo} alt={photo.title || `${restaurant.Title || restaurant.name} ${index + 1}`} />
            </div>
          ))
        ) : (
          <div className="no-photos-full">No photos available for this restaurant</div>
        )}
      </div>
    </div>
  );

  const renderMenuContent = () => (
    <div className="menu-content-full">
      <h3 className="section-title">Full Menu</h3>
      {Object.keys(menuByCategory).length > 0 ? (
        Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="menu-category">
            <h4 className="category-title">{category} ({items.length})</h4>
            <div className="category-items">
              {items.map((item, index) => (
                <div key={index} className="menu-item">
                  <div className="item-info">
                    <h5 className="item-name">{item.Title || item.name}</h5>
                    <p className="item-description">{item.Description || item.description || item.desc || ''}</p>
                    <span className="item-price">₹{item.Price || item.price}</span>
                    {item.veg !== undefined && (
                      <span className="veg-badge">{item.veg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                    )}
                  </div>
                  {item.ImageURL && (
                    <div className="item-image">
                      <img src={item.ImageURL} alt={item.Title || item.name} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Menu not available for this restaurant</p>
      )}
    </div>
  );

  const renderBookContent = () => (
    <div className="book-content-preview">
      <h3 className="section-title">Book a Table at {restaurant.Title || restaurant.name}</h3>
      <p>Click below to start your reservation process</p>
      <button className="start-booking-btn" onClick={() => onBookTableClick && onBookTableClick(restaurantId || restaurant?._id)}>
        Start Booking Process →
      </button>
    </div>
  );

  const renderOrderOnlineContent = () => (
    <div className="order-online-content">
      <h3 className="section-title">Order Online from {restaurant.Title || restaurant.name}</h3>
      {menu && menu.length > 0 ? (
        <div className="order-online-menu">
          <div className="menu-categories-sidebar">
            {Object.keys(menuByCategory).map(category => (
              <button key={category} className="category-sidebar-btn">
                {category}
              </button>
            ))}
          </div>
          <div className="menu-items-container">
            {Object.entries(menuByCategory).map(([category, items]) => (
              <div key={category} className="menu-category-section">
                <h4>{category}</h4>
                {items.map((item, index) => (
                  <div key={index} className="order-menu-item">
                    <div className="order-item-info">
                      <h5>{item.Title || item.name}</h5>
                      <p className="item-description">{item.Description || item.description || item.desc || ''}</p>
                      <span className="item-price">₹{item.Price || item.price}</span>
                      {item.veg !== undefined && (
                        <span className="veg-badge-small">{item.veg ? '🟢' : '🔴'}</span>
                      )}
                    </div>
                    <button className="add-to-cart-btn">ADD</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Online ordering not available for this restaurant</p>
      )}
    </div>
  );

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
      case 'orderOnline':
        return renderOrderOnlineContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className="restaurant-detail-compact">
      {/* Header */}
      <div className="detail-header-compact">
        <button className="back-btn-compact" onClick={onBack}>←</button>
        <div className="header-title">
          <h1 className="restaurant-name-compact">{restaurant.Title || restaurant.name}</h1>
          {details.rating > 0 && (
            <div className="rating-badge">
              ⭐ {details.rating} ({details.ratingCount} ratings)
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="basic-info-compact">
        <p className="cuisine-compact">{details.cuisine}</p>
        <p className="address-compact">{details.address}</p>
        
        <div className="info-row-compact">
          <span className="timing-compact">
            🕒 {details.timing}
            {!details.isOpen && <span className="closed-badge"> (Closed)</span>}
          </span>
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
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </span>
        <span className={`tab-compact ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => handleTabClick('photos')}>
          Photos {photos.length > 0 && `(${photos.length})`}
        </span>
        <span className={`tab-compact ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => handleTabClick('menu')}>
          Menu {menu.length > 0 && `(${menu.length})`}
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