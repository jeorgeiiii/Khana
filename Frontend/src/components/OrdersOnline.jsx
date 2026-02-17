
import React from "react";
import "./OrdersOnline.css";

const categories = [
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

const combos = [
  {
    name: "Dal Makhani Rice Bowl",
    price: "₹279",
    desc: "Dal Makhani+Jeera Rice+Masala Onions"
  },
  {
    name: "Veg Hakka Noodles with Chilli Paneer",
    price: "₹349",
    desc: "Noodles tossed with a savory blend of soy sauce and chilli sauce, while ..."
  },
  {
    name: "Veg Hakka Noodles with Manchurian",
    price: "₹299",
    desc: "A classic Chinese inspired veg dish featuring stir fried noodles and crispy manchurian ..."
  },
  {
    name: "Veg Fried Rice with Chilli Paneer",
    price: "₹349",
    desc: "A popular veg dish that combines the savory goodness of fried rice with ..."
  },
  {
    name: "Veg Fried Rice with Manchurian",
    price: "₹299",
    desc: "The fried rice is typically made with vegetables like carrots, peas, corn and ..."
  },
  {
    name: "Aloo Tikki Burger Combo",
    price: "₹249",
    desc: "Aloo Tikki Burger+Fries+Cold Coffee"
  },
  {
    name: "Italian Feast Combo",
    price: "₹399",
    desc: "Pasta+Garlic Bread+Cold Drink"
  }
];

const OrderOnline = ({ onBack }) => (
  <div className="order-online-container">
    <nav className="order-online-tabs">
      <span className="tab">Overview</span>
      <span className="tab active">Order Online</span>
      <span className="tab">Reviews</span>
      <span className="tab">Photos</span>
      <span className="tab">Menu</span>
      <span className="tab">Book a Table</span>
    </nav>
    <div className="order-online-main">
      <aside className="order-online-sidebar">
        {categories.map((cat, idx) => (
          <div key={idx} className={`sidebar-category${idx === 0 ? " active" : ""}`}>
            {cat.name} <span className="count">({cat.count})</span>
          </div>
        ))}
      </aside>
      <section className="order-online-content">
        <div className="order-online-header">
          <h2>Order Online</h2>
          <span className="live-track">🟢 Live track your order</span>
          <span className="delivery-time">52 min</span>
          <input className="search-menu" placeholder="Search within menu" />
        </div>
        <h3>Pocket Friendly Combos</h3>
        <div className="combo-list">
          {combos.map((combo, idx) => (
            <div key={idx} className="combo-item">
              <div className="combo-title">
                <span className="veg-dot" /> {combo.name}
              </div>
              <div className="combo-price">{combo.price}</div>
              <div className="combo-desc">{combo.desc}</div>
              <a className="read-more" href="#">read more</a>
            </div>
          ))}
        </div>
      </section>
    </div>
    <button className="back-btn" onClick={onBack}>← Back</button>
  </div>
);

export default OrderOnline;