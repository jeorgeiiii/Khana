import React, { useState } from "react";
import Header from "./components/Header";
import Card from "./components/Ex";
import RestaurantDetail from "./components/RestaurantDetails";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import Book from "./components/Book";
import Menu from "./components/menu";
import OrderOnline from "./components/OrdersOnline";
// Nightlife import hata diya

import "./App.css";

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedRestaurant(null);
  };

  const handleReviewsClick = () => {
    setCurrentView('reviews');
  };

  const handleBookTableClick = () => {
    setCurrentView('book');
  };

  const handleMenuClick = () => {
    setCurrentView('menu');
  };

  const handleOrderOnlineClick = () => {
    setCurrentView('orderOnline');
  };

  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch(currentView) {
      case 'book':
        return (
          <Book 
            restaurant={selectedRestaurant} 
            onBack={() => setCurrentView(selectedRestaurant ? 'detail' : 'home')}
          />
        );
      case 'reviews':
        return (
          <Reviews 
            restaurant={selectedRestaurant} 
            onBack={() => setCurrentView(selectedRestaurant ? 'detail' : 'home')}
          />
        );
      case 'menu':
        return (
          <Menu />
        );
      case 'orderOnline':
        return (
          <OrderOnline onBack={selectedRestaurant ? () => setCurrentView('detail') : handleBackToHome} />
        );
      case 'detail':
        return (
          <RestaurantDetail 
            restaurant={selectedRestaurant} 
            onBack={handleBackToHome}
            onReviewsClick={handleReviewsClick}
            onBookTableClick={handleBookTableClick}
            onMenuClick={handleMenuClick}
            onOrderOnlineClick={handleOrderOnlineClick}
          />
        );
      case 'home':
      default:
        return (
          <>
            <Card onRestaurantClick={handleRestaurantClick} />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;