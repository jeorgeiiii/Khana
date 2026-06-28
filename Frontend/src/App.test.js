import { filterRestaurants } from './components/Ex';

describe('filterRestaurants', () => {
  test('filters to pure veg restaurants when the toggle is enabled', () => {
    const restaurants = [
      { _id: '1', Title: 'Green Bowl', cuisine: 'Vegetarian, Indian', veg: true },
      { _id: '2', Title: 'Spice House', cuisine: 'North Indian, Chinese' },
    ];

    const result = filterRestaurants(restaurants, { pureVeg: true, cuisine: 'All' });

    expect(result.map((restaurant) => restaurant._id)).toEqual(['1']);
  });

  test('filters by selected cuisine with case-insensitive matching', () => {
    const restaurants = [
      { _id: '1', Title: 'Italian Spot', cuisine: 'Italian, Pizza' },
      { _id: '2', Title: 'North Indian House', cuisine: 'North Indian, Mughlai' },
    ];

    const result = filterRestaurants(restaurants, { pureVeg: false, cuisine: 'italian' });

    expect(result.map((restaurant) => restaurant._id)).toEqual(['1']);
  });
});
