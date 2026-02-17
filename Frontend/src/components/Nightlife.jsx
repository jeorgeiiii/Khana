import React from "react";
import "./Nightlife.css";

const bars = [
  {
    name: "Firangi Cafe And Bar",
    cuisine: "North Indian, Continental",
    price: "₹1,500 for two",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Terazza Bar and Kitchen",
    cuisine: "North Indian, Chinese, Italian",
    price: "₹1,300 for two",
    rating: "4.1",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Underdoggs",
    cuisine: "Continental, Pasta, Desserts",
    price: "₹1,500 for two",
    rating: "New",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
  }
];

const Nightlife = ({ onBarClick }) => (
  <div className="nightlife-container">
    <h2>Nightlife: Night clubs, pubs and bars in Indore</h2>
    <div className="bars-list">
      {bars.map((bar, idx) => (
        <div key={idx} className="bar-card" onClick={() => onBarClick(bar)}>
          <img src={bar.img} alt={bar.name} className="bar-img" />
          <div className="bar-info">
            <h3>{bar.name}</h3>
            <div>{bar.cuisine}</div>
            <div>{bar.price}</div>
            <span className="bar-rating">{bar.rating}★</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Nightlife;