import React, { useState } from 'react';
import axios from 'axios';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    Title: '',
    cuisine: '',
    price: '',
    discount: '',
    deliveryTime: '',
    address: '',
    phone: '',
    promoted: false
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Create FormData to send file and data
      const data = new FormData();
      data.append('image', image); // 'image' must match the field name in backend
      data.append('Title', formData.Title);
      data.append('cuisine', formData.cuisine);
      data.append('price', formData.price);
      data.append('discount', formData.discount);
      data.append('deliveryTime', formData.deliveryTime);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('promoted', formData.promoted);

      // Get auth token from localStorage
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/v1/upload/restaurant',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUploadedImageUrl(response.data.imageUrl);
        alert('Restaurant added successfully!');
        // Reset form
        setFormData({
          Title: '',
          cuisine: '',
          price: '',
          discount: '',
          deliveryTime: '',
          address: '',
          phone: '',
          promoted: false
        });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Error adding restaurant: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-form" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Add New Restaurant</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Image Upload Field */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Restaurant Image <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            required 
            style={{ marginBottom: '10px' }}
          />
          {preview && (
            <div>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            </div>
          )}
        </div>

        {/* Restaurant Name */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Restaurant Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.Title}
            onChange={(e) => setFormData({...formData, Title: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Cuisine */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Cuisine <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.cuisine}
            onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
            required
            placeholder="e.g., Pizza, Italian, Fast Food"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Price */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Price (e.g., ₹200 for two)
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="₹200 for two"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Discount */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Discount (e.g., 50% OFF)
          </label>
          <input
            type="text"
            value={formData.discount}
            onChange={(e) => setFormData({...formData, discount: e.target.value})}
            placeholder="50% OFF"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Delivery Time */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Delivery Time (e.g., 30 min)
          </label>
          <input
            type="text"
            value={formData.deliveryTime}
            onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
            placeholder="30 min"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Address */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Address <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Phone */}
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Promoted Checkbox */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={formData.promoted}
              onChange={(e) => setFormData({...formData, promoted: e.target.checked})}
            />
            <span style={{ marginLeft: '8px' }}>Promoted Restaurant (Featured)</span>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={uploading}
          style={{
            backgroundColor: '#ff5722',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {uploading ? 'Uploading...' : 'Add Restaurant'}
        </button>

        {/* Show uploaded image URL */}
        {uploadedImageUrl && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <p><strong>Image uploaded to Cloudinary:</strong></p>
            <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '200px', height: '120px', objectFit: 'cover' }} />
            <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{uploadedImageUrl}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddRestaurant;