import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Card from "./components/Ex";
import RestaurantDetail from "./components/RestaurantDetails";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import Book from "./components/Book";
import Menu from "./components/menu";
import OrderOnline from "./components/OrdersOnline";
import AddRestaurant from './components/Admin/AddRestaurant';
import LocationSelector from './components/LocationSelector';
import Profile from './pages/Profile';
import Checkout from './components/Checkout';
import Nightlife from './components/Nightlife';
import CartPage from './pages/CartPage';
import DeliveryDashboard from './components/DeliveryBoy/DeliveryDashboard';
import CustomerTrackOrder from './pages/CustomerTrackOrder';
import OrderConfirmation from './pages/OrderConfirmation';
// Login imports
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RefrshHandler from "./RefrshHandler";
import "./App.css";

// Home component
function HomeContent({ 
  selectedRestaurant, 
  setSelectedRestaurant, 
  currentView, 
  setCurrentView,
  selectedLocation,      
  setSelectedLocation,
  cartItems,
  setCartItems,
  setShowCheckout,
  selectedRestaurantForCart,
  setSelectedRestaurantForCart
}) {
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurant) => {
    console.log('Selected restaurant:', restaurant);
    setSelectedRestaurant(restaurant);
    setCurrentView('detail');
    navigate('/home');
  };

  const handleBarClick = (bar) => {
    console.log('Selected bar:', bar);
  };

  const addToCart = (item, restaurant) => {
    console.log('Added to cart:', item);
    
    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingIndex = existingCart.findIndex(i => i._id === item._id);
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    
    setCartItems(existingCart);
    setSelectedRestaurantForCart(restaurant);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedRestaurant(null);
    navigate('/home');
  };

  const handleReviewsClick = (restaurantId) => {
    console.log('Reviews clicked for:', restaurantId);
    setCurrentView('reviews');
  };

  const handleBookTableClick = (restaurantId) => {
    console.log('Book table clicked for:', restaurantId);
    setCurrentView('book');
  };

  const handleMenuClick = (restaurantId) => {
    console.log('Menu clicked for:', restaurantId);
    setCurrentView('menu');
  };

  const handleOrderOnlineClick = (restaurantId) => {
    console.log('Order online clicked for:', restaurantId);
    setCurrentView('orderOnline');
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    setSelectedRestaurant(null);
    navigate('/home');
  };

  const handleAddRestaurantClick = () => {
    navigate('/admin/add-restaurant');
  };

  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab);
    setCurrentView(tab);
  };

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
          <Menu 
            restaurant={selectedRestaurant}
            onBack={() => setCurrentView(selectedRestaurant ? 'detail' : 'home')}
            addToCart={addToCart}
          />
        );
      case 'orderOnline':
        return (
          <OrderOnline 
            restaurant={selectedRestaurant}
            onBack={selectedRestaurant ? () => setCurrentView('detail') : handleBackToHome}
            addToCart={addToCart}
            cartItems={cartItems}
          />
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
            addToCart={addToCart}
          />
        );
      case 'nightlife':
        return (
          <>
            <div className="home-header">
              <h1>Nightlife in {selectedLocation}</h1>
            </div>
            <LocationSelector 
              onLocationChange={setSelectedLocation} 
              currentLocation={selectedLocation}
            />
            <Nightlife 
              onBarClick={handleBarClick}
              location={selectedLocation}
            />
            <Footer />
          </>
        );
      case 'diningOut':
        return (
          <>
            <div className="home-header">
              <h1>Dining Out in {selectedLocation}</h1>
            </div>
            <LocationSelector 
              onLocationChange={setSelectedLocation} 
              currentLocation={selectedLocation}
            />
            <Card 
              onRestaurantClick={handleRestaurantClick} 
              location={selectedLocation}
            />
            <Footer />
          </>
        );
      case 'home':
      default:
        return (
          <>
            <div className="home-header">
              <h1>Restaurants Near You</h1>
              <button 
                onClick={handleAddRestaurantClick}
                className="add-restaurant-btn"
                style={{
                  backgroundColor: '#ff5722',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  margin: '10px 0'
                }}
              >
                + Add Restaurant (Admin)
              </button>
            </div>
            <LocationSelector 
              onLocationChange={setSelectedLocation} 
              currentLocation={selectedLocation}
            />
            <Card 
              onRestaurantClick={handleRestaurantClick} 
              location={selectedLocation}
            />
            <Footer />
          </>
        );
    }
  };

  return (
    <>
      <Header 
        onTabChange={handleTabChange}
        currentView={currentView}
        selectedLocation={selectedLocation}
        cartItems={cartItems}
        setShowCheckout={setShowCheckout}
      />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </>
  );
}

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Indore');
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedRestaurantForCart, setSelectedRestaurantForCart] = useState(null);

  // Check authentication on load
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    const savedRestaurant = localStorage.getItem('selectedRestaurant');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setSelectedRestaurantForCart(JSON.parse(savedRestaurant));
    }
  }, []);

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
  };

  const AdminRoute = ({ element }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const isAdmin = user.role === 'admin' || user.email === 'test@example.com';
    
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    if (!isAdmin) {
      return <Navigate to="/home" />;
    }
    
    return element;
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedRestaurantForCart(null);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('selectedRestaurant');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Route */}
          <Route path="/admin/add-restaurant" element={
            <AdminRoute element={<AddRestaurant />} />
          } />
          
          {/* Protected Routes */}
          <Route path="/home" element={
            <PrivateRoute element={
              <HomeContent 
                selectedRestaurant={selectedRestaurant}
                setSelectedRestaurant={setSelectedRestaurant}
                currentView={currentView}
                setCurrentView={setCurrentView}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                cartItems={cartItems}
                setCartItems={setCartItems}
                setShowCheckout={setShowCheckout}
                selectedRestaurantForCart={selectedRestaurantForCart}
                setSelectedRestaurantForCart={setSelectedRestaurantForCart}
              />
            } />
          } />
          
          <Route path="/profile" element={
            <PrivateRoute element={<Profile />} />
          } />

          <Route path="/cart" element={
            <PrivateRoute element={<CartPage />} />
          } />

          <Route path="/checkout" element={
            <PrivateRoute element={
              <Checkout
                cartItems={cartItems}
                restaurant={selectedRestaurantForCart}
                onClose={() => navigate('/home')}
                clearCart={clearCart}
              />
            } />
          } />

          <Route path="/order-confirmation/:orderId" element={
            <PrivateRoute element={<OrderConfirmation />} />
          } />

          <Route path="/delivery-dashboard/:orderId" element={
            <PrivateRoute element={<DeliveryDashboard />} />
          } />
          
          <Route path="/track-order/:orderId" element={
            <PrivateRoute element={<CustomerTrackOrder />} />
          } />
          
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          } />
        </Routes>
        
        {/* Checkout Modal */}
        {showCheckout && (
          <Checkout
            cartItems={cartItems}
            restaurant={selectedRestaurantForCart}
            onClose={() => setShowCheckout(false)}
            clearCart={clearCart}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;