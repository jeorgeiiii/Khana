import React from 'react';
import '../App.css';

function Reviews({ restaurant, onBack }) {
  // Sample reviews data
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
    },
    {
      id: 3,
      userName: "Sandeep",
      userStats: "0 reviews • 0 Followers",
      type: "DELIVERY",
      time: "20 hours ago",
      review: "please don't order this item it's so pulver",
      helpful: 15,
      comments: 0
    },
    {
      id: 4,
      userName: "Meghraj Paliwal",
      userStats: "0 reviews • 0 Followers",
      type: "DELIVERY",
      time: "6 days ago",
      review: "",
      helpful: 0,
      comments: 0
    },
    {
      id: 5,
      userName: "",
      userStats: "",
      type: "DELIVERY",
      time: "13 days ago",
      review: "Worst ever food never order again",
      helpful: 0,
      comments: 0
    }
  ];

  return (
    <div className="reviews-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <span onClick={onBack}>Home</span> / <span>India</span> / <span>Indore</span> / <span>Old Palsia</span> / <span>{restaurant?.name}</span> / <span>Reviews</span>
      </div>

      {/* Page Header */}
      <div className="reviews-header">
        <h1>{restaurant?.name} Reviews</h1>
        <div className="reviews-subtitle">All Reviews</div>
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            {/* User Info */}
            {review.userName && (
              <div className="user-info">
                <div className="user-name">{review.userName}</div>
                {review.userStats && <div className="user-stats">{review.userStats}</div>}
              </div>
            )}

            {/* Review Content */}
            <div className="review-content">
              <div className="review-meta">
                <span className="review-type">{review.type}</span>
                <span className="review-time">{review.time}</span>
              </div>
              
              {review.review && (
                <p className="review-text">{review.review}</p>
              )}

              {/* Review Actions */}
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

      {/* Follow Button */}
      <div className="follow-section">
        <button className="follow-btn">Follow</button>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={onBack}>
        ← Back to Restaurant
      </button>
    </div>
  );
}

export default Reviews;