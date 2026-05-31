const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzqnznhui',
  api_key: '569363245856647',
  api_secret: 'sxX3vFW_E2xLrU18GzOoc3gIfQ0'
});

async function testUpload() {
  try {
    // Ye koi bhi public image ka URL dalo
    const result = await cloudinary.uploader.upload('https://images.unsplash.com/photo-1513104890138-7c749659a591', {
      folder: 'zomoro/test',
      public_id: 'test-pizza'
    });
    
    console.log('✅ Upload successful!');
    console.log('Image URL:', result.secure_url);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

testUpload();