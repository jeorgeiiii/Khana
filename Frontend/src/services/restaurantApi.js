import axios from 'axios';

// Just update the URL, keep everything else exactly as is
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const restaurantApi = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await axios.get(`${API_URL}/resturant/getAll`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/resturant/get/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },

  // Get restaurant menu (food items) - FIXED URL
  getRestaurantMenu: async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/food/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      return { foods: [] };
    }
  },

  // Get restaurant reviews
  getRestaurantReviews: async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/review/get/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { reviews: [] };
    }
  },

  // Get restaurant photos (combine restaurant logo and food images) - FIXED URL
  getRestaurantPhotos: async (restaurantId, restaurantData) => {
    try {
      const photos = [];
      
      if (restaurantData?.Logourl) {
        photos.push({ url: restaurantData.Logourl, type: 'restaurant' });
      }
      
      if (restaurantData?.ImageURL) {
        photos.push({ url: restaurantData.ImageURL, type: 'restaurant' });
      }

      try {
        const foodResponse = await axios.get(`${API_URL}/food/restaurant/${restaurantId}`);
        if (foodResponse.data?.foods) {
          foodResponse.data.foods.forEach(food => {
            if (food.ImageURL) {
              photos.push({ url: food.ImageURL, type: 'food', foodName: food.Title });
            }
          });
        }
      } catch (foodError) {
        console.log('No food images found');
      }

      return { photos };
    } catch (error) {
      console.error('Error fetching photos:', error);
      return { photos: [] };
    }
  },

  // Get restaurant categories (from food items) - FIXED URL
  getRestaurantCategories: async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/food/restaurant/${restaurantId}`);
      if (response.data?.foods) {
        const categories = [...new Set(response.data.foods.map(food => food.category || food.Category || 'Other'))];
        return { categories: categories.map(cat => ({ name: cat })) };
      }
      return { categories: [] };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [] };
    }
  },

  // Get restaurant offers
  getRestaurantOffers: async (restaurantId) => {
    try {
      return { 
        offers: [
          {
            title: "Flat 10% OFF",
            description: "on bill payments",
            type: "INSTANT"
          },
          {
            title: "Get a scratch card",
            description: "after every transaction",
            type: "SURPRISE"
          }
        ] 
      };
    } catch (error) {
      console.error('Error fetching offers:', error);
      return { offers: [] };
    }
  },

  // Create restaurant (admin only)
  createRestaurant: async (restaurantData, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/resturant/create`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  // Delete restaurant (admin only)
  deleteRestaurant: async (restaurantId, token) => {
    try {
      const response = await axios.delete(
        `${API_URL}/resturant/delete/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  }
};

export default restaurantApi;