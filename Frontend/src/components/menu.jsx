import React, { useState } from 'react';
import './menu.css';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('food');

  const menuData = {
    food: {
      title: "Food Menu",
      pages: 5,
      items: [
        { name: "CREATE A NEW CREAM", price: "₹180" },
        { name: "RELAX BANJAR", price: "₹150" },
        { name: "BALTER AND RADER", price: "₹220" },
        { name: "MONOLEY AND RAJARD", price: "₹200" },
        { name: "RESTAURANT SERVERIES", price: "₹250" },
        { name: "BOT CHOCOLATE SERVERIES", price: "₹170" }
      ]
    },
    beverages: {
      title: "Beverages",
      pages: 2,
      items: [
        { name: "RAJARD CHRISTEN", price: "₹90" },
        { name: "APARTMENTS", price: "₹80" },
        { name: "APPENDIX", price: "₹70" }
      ]
    },
    cafe: {
      title: "Café",
      pages: 1,
      items: [
        { name: "Espresso", price: "₹100" },
        { name: "Cappuccino", price: "₹120" },
        { name: "Latte", price: "₹140" },
        { name: "Mocha", price: "₹150" },
        { name: "Americano", price: "₹110" },
        { name: "Macchiato", price: "₹130" },
        { name: "Affogato", price: "₹160" }
      ]
    },
    groundTabs: {
      title: "Ground Tabs",
      pages: 1,
      items: [
        { name: "Tab 1", price: "₹100" },
        { name: "Tab 2", price: "₹200" },
        { name: "Tab 3", price: "₹400" },
        { name: "Tab 4", price: "₹500" },
        { name: "Tab 5", price: "₹600" },
        { name: "Tab 6", price: "₹800" },
        { name: "Tab 7", price: "₹900" }
      ]
    }
  };

  const tabOrder = ['food', 'beverages', 'cafe', 'groundTabs'];

  return (
    <div className="menu-container">
      <nav className="menu-nav">
        <a href="#overview">Overview</a>
        <a href="#order">Order Online</a>
        <a href="#reviews">Reviews</a>
        <a href="#photos">Photos</a>
        <a href="#menu" className="active">Menu</a>
        <a href="#book">Book a Table</a>
      </nav>

      <div className="menu-header">
        <h1>La Bohème Café Pizzeria Menu</h1>
      </div>

      <div className="menu-tabs">
        {tabOrder.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {menuData[tab].title} <span>{menuData[tab].pages} page{menuData[tab].pages > 1 ? 's' : ''}</span>
          </button>
        ))}
      </div>

      <div className="menu-content">
        <h2>{menuData[activeTab].title}</h2>
        <div className="menu-items">
          {menuData[activeTab].items.map((item, index) => (
            <div key={index} className="menu-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price}</span>
            </div>
          ))}
        </div>
        <div className="menu-pages">
          {menuData[activeTab].pages} page{menuData[activeTab].pages > 1 ? 's' : ''}
        </div>
      </div>

      <div className="menu-footer">
        <div className="related-searches">
          <h3>RELATED SEARCHES</h3>
          <p>Restaurants in Indore, Indore Restaurants, Rau restaurants, Best Rau restaurants, South Indore restaurants, Casual Dining in Indore, Casual Dining near me, Casual Dining in Rau, in Indore, near me, in Rau, Order food online in Rau, Order food online in Indore</p>
        </div>
        <div className="restaurants-around">
          <h3>RESTAURANTS AROUND RAU</h3>
          <p>mushkhedi restaurants, Rajendra Nagar restaurants, Morod restaurants, Annapurna Road restaurants</p>
        </div>
        <div className="frequent-searches">
          <h3>FREQUENT SEARCHES LEADING TO THIS PAGE</h3>
          <p>atha menu, atha rau menu, atha indore, atha indore menu, atha restaurant</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;