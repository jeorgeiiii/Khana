import React from "react";
import "./Ex.css";

function Card({ onRestaurantClick }) {
    const food = [
  {
    "name": "Olio - The Wood Fired Pizzeria",
    "cuisine": "Pizza",
    "discount": "50% OFF",
    "price": "¥100 for one",
    "time": "36 min",
    "rating": "4.5",
    "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Apna Sweets",
    "cuisine": "Desserts, Ice Cream, Juice...",
    "discount": "75% OFF",
    "price": "¥150 for one",
    "time": "27 min",
    "rating": "4.4",
    "img": "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Vinay Hotel",
    "cuisine": "North Indian, Mughlai, Sea...",
    "discount": "Flat 25% OFF",
    "price": "¥200 for one",
    "time": "32 min",
    "rating": "4.0",
    "img": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Cafe Mocha",
    "cuisine": "Coffee, Bakery, Sandwiches",
    "discount": "Buy 1 Get 1",
    "price": "¥250 for two",
    "time": "25 min",
    "rating": "4.6",
    "img": "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Spice Garden",
    "cuisine": "Chinese, Thai, Asian",
    "discount": "40% OFF",
    "price": "¥180 for one",
    "time": "44 min",
    "rating": "4.7",
    "img": "https://images.unsplash.com/photo-1517244683847-7456b63c5969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Burger Bliss",
    "cuisine": "Burgers, Fast Food, Shakes",
    "discount": "30% OFF",
    "price": "¥120 for one",
    "time": "28 min",
    "rating": "4.3",
    "img": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Tandoori Nights",
    "cuisine": "Indian, BBQ, Kebabs",
    "discount": "20% OFF",
    "price": "¥300 for two",
    "time": "38 min",
    "rating": "4.8",
    "img": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Sushi Express",
    "cuisine": "Japanese, Sushi, Asian",
    "discount": "15% OFF",
    "price": "¥350 for two",
    "time": "40 min",
    "rating": "4.9",
    "img": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Pasta Paradise",
    "cuisine": "Italian, Pasta, Mediterranean",
    "discount": "Buy 2 Get 1",
    "price": "¥220 for one",
    "time": "35 min",
    "rating": "4.5",
    "img": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Green Leaf Salad Bar",
    "cuisine": "Healthy, Salads, Vegan",
    "discount": "10% OFF",
    "price": "¥180 for one",
    "time": "22 min",
    "rating": "4.2",
    "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Deli Corner",
    "cuisine": "Sandwiches, Wraps, Soups",
    "discount": "Combo Offer",
    "price": "¥150 for one",
    "time": "20 min",
    "rating": "4.4",
    "img": "https://images.unsplash.com/photo-1551504734-b464e32a163a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  },
  {
    "name": "Chaat Bazaar",
    "cuisine": "Street Food, Snacks, Indian",
    "discount": "50% OFF",
    "price": "¥100 for one",
    "time": "30 min",
    "rating": "4.6",
    "img": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
  }
];

  return (
    <div className="food-list">
      {food.map((item, idx) => (
        <div 
          className="food-card" 
          key={idx}
          onClick={() => onRestaurantClick(item)}
          style={{ cursor: 'pointer' }}
        >
          <div className="food-img-wrapper">
            {(idx === 0 || idx === 2) && (
              <span className="promoted-label">Promoted</span>
            )}
            <img className="food-img" src={item.img} alt={item.name} />
            <span className="discount-label">{item.discount}</span>
          </div>
          <div className="food-details">
            <div className="food-title-row">
              <span className="foodname">{item.name}</span>
              <span className="food-rating-badge">{item.rating}★</span>
            </div>
            <div className="foodcuisine">{item.cuisine}</div>
            <div className="food-price-row">
              <span className="foodprice">{item.price}</span>
              <span className="foodtime">{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;