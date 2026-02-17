import React, { useState } from 'react';
import './Book.css';

function Book({ restaurant, onBack }) {
  const [bookingStep, setBookingStep] = useState('select-slot'); // 'select-slot', 'choose-offer', 'review-details', 'booking-cancelled'
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('');

  // Sample data
  const timeSlots = [
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM',
    '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM',
    '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM'
  ];

  const offers = [
    { id: 1, discount: '30% OFF', requirement: '25 cover charge required' },
    { id: 2, discount: '10% OFF', requirement: 'No cover charge required' }
  ];

  // Render different steps
  const renderStepContent = () => {
    switch(bookingStep) {
      case 'select-slot':
        return renderSelectSlot();
      case 'choose-offer':
        return renderChooseOffer();
      case 'review-details':
        return renderReviewDetails();
      case 'booking-cancelled':
        return renderBookingCancelled();
      default:
        return renderSelectSlot();
    }
  };

  const renderSelectSlot = () => (
    <div className="booking-step">
      <h2>Select your booking details</h2>
      <div className="booking-details">
        <div className="detail-item">
          <span className="label">Today</span>
          <span className="value">28 Sep</span>
        </div>
        <div className="detail-item">
          <span className="label">1 guest</span>
        </div>
        <div className="detail-item">
          <span className="label">Lunch</span>
        </div>
      </div>

      <h3>Select slot</h3>
      <div className="time-slots-grid">
        {timeSlots.map((slot, index) => (
          <div 
            key={index} 
            className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
            onClick={() => setSelectedSlot(slot)}
          >
            <div className="slot-time">{slot}</div>
            <div className="slot-offers">2 offers</div>
          </div>
        ))}
      </div>

      <button 
        className="proceed-btn"
        onClick={() => setBookingStep('choose-offer')}
        disabled={!selectedSlot}
      >
        Next
      </button>
    </div>
  );

  const renderChooseOffer = () => (
    <div className="booking-step">
      <h2>Choose an offer</h2>
      
      <div className="offers-list">
        {offers.map(offer => (
          <div 
            key={offer.id} 
            className={`offer-option ${selectedOffer === offer.id ? 'selected' : ''}`}
            onClick={() => setSelectedOffer(offer.id)}
          >
            <div className="offer-discount">FLAT {offer.discount}</div>
            <div className="offer-requirement">{offer.requirement}</div>
          </div>
        ))}
      </div>

      <button 
        className="proceed-btn"
        onClick={() => setBookingStep('review-details')}
        disabled={!selectedOffer}
      >
        Proceed to cart
      </button>
    </div>
  );

  const renderReviewDetails = () => (
    <div className="booking-step">
      <h2>Review booking details</h2>
      
      <div className="booking-summary">
        <div className="summary-item">
          <span>Today 28 Sep at 4:30 PM</span>
        </div>
        <div className="summary-item">
          <span>1 guest</span>
        </div>
        <div className="summary-item">
          <span>Moti Mahal Delux</span>
          <span className="address">By Pass Road (South), Indore</span>
        </div>
        <div className="summary-item offer">
          <span>Flat 10% OFF</span>
          <span className="offer-desc">Pay bill between 4:30 PM - 10:30 PM</span>
        </div>
      </div>

      <div className="special-request">
        <button className="add-request-btn">+ Add special request</button>
        <p className="request-note">
          The restaurant will try their best to allot your desired seat. However, no cancellation or refund will be possible if your request is not met.
        </p>
      </div>

      <div className="terms-section">
        <h3>Terms and conditions</h3>
        <ul className="terms-list">
          <li>Please arrive 15 minutes prior to your reservation time.</li>
          <li>An internet handling fee will be applied as a convenience fee during final bill payment</li>
          <li>Cover charges, if charged, will be adjusted in your final bill while payment via Zomato app</li>
          <li>Extra offer or a freebie, if applicable, can be availed ONLY by pre-booking a slot at the restaurant</li>
          <li>Restaurants have limited slots with extra offers or freebies</li>
          <li>An offer on an app cannot be clubbed with other offers running at the restaurant</li>
          <li>This offer may not apply to bottled drinks, buffets, pre-discounted platters/combos/meals, select seasonal or seafood items, tobacco products, or special menus at the restaurant's discretion</li>
          <li>Zomato has no role to play on taxes and charges levied by the Government and restaurants</li>
          <li>The offer will only be honored for selected number of guests or fewer</li>
          <li>Cover charges cannot be refunded if slot is cancelled within 30 minutes of slot start time</li>
          <li>Additional service charge on the bill is up to restaurants discretion</li>
          <li>Other T&Cs may apply</li>
        </ul>
      </div>

      <button 
        className="book-now-btn"
        onClick={() => setBookingStep('booking-cancelled')}
      >
        Book Now
      </button>
    </div>
  );

  const renderBookingCancelled = () => (
    <div className="booking-step cancelled">
      <div className="cancelled-header">
        <h2>Booking cancelled</h2>
        <p>Your booking has been cancelled.</p>
      </div>

      <div className="cancelled-details">
        <div className="detail-card">
          <div className="detail-row">
            <strong>Today</strong> 28 Sep at 5:45 PM
          </div>
          <div className="detail-row">
            <strong>Moti Mahal Delux</strong>
          </div>
          <div className="detail-row">
            By Pass Road (South), Indore
          </div>
          <button className="book-again-btn" onClick={() => setBookingStep('select-slot')}>
            Book again
          </button>
        </div>

        <div className="detail-card">
          <div className="detail-row">
            <strong>1 guest</strong>
          </div>
          <div className="offer-info">
            <strong>Flat 10% OFF</strong>
            <span>Pay bill between 5:45 PM - 11:45 PM</span>
          </div>
        </div>
      </div>

      <div className="restaurant-info">
        <h4>Moti Mahal Delux</h4>
        <p>By Pass Road (South), Indore</p>
        <div className="phone-info">
          <strong>Phone</strong>
          <span>8962410485, 8952410485</span>
        </div>
        <button className="direction-btn">Directions</button>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <h5>ABOUT ZOMATO</h5>
          <span>Who We Are</span>
          <span>Blog</span>
          <span>Work With Us</span>
          <span>Investor Relations</span>
          <span>Report Fraud</span>
          <span>Press Kit</span>
          <span>Contact Us</span>
        </div>
        
        <div className="footer-column">
          <h5>ZOMAVERSE</h5>
          <span>Zomato</span>
          <span>Blinkit</span>
          <span>Feeding India</span>
          <span>Hyperpure</span>
        </div>
        
        <div className="footer-column">
          <h5>FOR RESTAURANTS</h5>
          <span>Partner With Us</span>
          <span>Apps For You</span>
        </div>
        
        <div className="footer-column">
          <h5>LEARN MORE</h5>
          <span>Privacy</span>
          <span>Security</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="book-page">
      {/* Header */}
      <div className="book-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Book a Table</h1>
      </div>

      {/* Progress Steps */}
      {bookingStep !== 'booking-cancelled' && (
        <div className="progress-steps">
          <div className={`step ${bookingStep === 'select-slot' ? 'active' : ''}`}>
            <span>1</span>
            <span>Select Slot</span>
          </div>
          <div className={`step ${bookingStep === 'choose-offer' ? 'active' : ''}`}>
            <span>2</span>
            <span>Choose Offer</span>
          </div>
          <div className={`step ${bookingStep === 'review-details' ? 'active' : ''}`}>
            <span>3</span>
            <span>Review</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="book-content">
        {renderStepContent()}
      </div>
    </div>
  );
}

export default Book;