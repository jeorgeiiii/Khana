import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(saved);
    } catch (error) {
      console.error('Failed to load favorites', error);
      setFavorites([]);
    }
  }, []);

  const removeFavorite = (id) => {
    const next = favorites.filter((item) => item._id !== id);
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
      <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: '#e23744', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
        ← Back to home
      </button>
      <h1 style={{ marginTop: 16, fontSize: 28 }}>Your favorites</h1>
      <p style={{ color: '#666' }}>Saved restaurants and dishes will show up here.</p>

      {favorites.length === 0 ? (
        <div style={{ marginTop: 24, padding: 20, border: '1px solid #eee', borderRadius: 12, background: '#fff' }}>
          No favorites yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          {favorites.map((item) => (
            <div key={item._id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.Title || item.name}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{item.cuisine || item.address || 'Saved item'}</div>
              </div>
              <button onClick={() => removeFavorite(item._id)} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '8px 12px', background: '#fff', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
