const Cart = require('../models/cart');
const User = require('../models/User');

// Get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        
        let cart = await Cart.findOne({ userId })
            .populate('items.foodId', 'Title ImageURL');
        
        if (!cart) {
            cart = {
                items: [],
                subtotal: 0,
                totalAmount: 0
            };
        }
        
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        const { foodId, name, price, quantity, image, restaurantId, restaurantName, restaurantAddress } = req.body;
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                restaurantId,
                restaurantName,
                restaurantAddress
            });
        }
        
        // Check if item already exists
        const existingItem = cart.items.find(item => item.foodId?.toString() === foodId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                foodId,
                name,
                price,
                quantity,
                image
            });
        }
        
        // Update restaurant info if changed
        if (restaurantId) {
            cart.restaurantId = restaurantId;
            cart.restaurantName = restaurantName;
            cart.restaurantAddress = restaurantAddress;
        }
        
        // Calculate totals
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.totalAmount = cart.subtotal;
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to cart'
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        const { itemId, quantity } = req.body;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const item = cart.items.find(item => item._id.toString() === itemId);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        item.quantity = quantity;
        
        // Remove item if quantity is 0
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        }
        
        // Recalculate totals
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.totalAmount = cart.subtotal;
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart'
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        const { itemId } = req.params;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        
        // Recalculate totals
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.totalAmount = cart.subtotal;
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from cart'
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        
        await Cart.findOneAndDelete({ userId });
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};