const Nightlife = require('../models/Nightlife');

// Get all nightlife places
const getAllNightlife = async (req, res) => {
    try {
        const places = await Nightlife.find({});
        res.status(200).json({
            success: true,
            total: places.length,
            nightlife: places
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nightlife places'
        });
    }
};

// Get nightlife by location
const getNightlifeByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const places = await Nightlife.find({ 
            location: { $regex: new RegExp(location, 'i') } 
        });
        
        res.status(200).json({
            success: true,
            total: places.length,
            location: location,
            nightlife: places
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nightlife by location'
        });
    }
};

// Get nightlife by ID
const getNightlifeById = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Nightlife.findById(id);
        
        if (!place) {
            return res.status(404).json({
                success: false,
                message: 'Nightlife place not found'
            });
        }
        
        res.status(200).json({
            success: true,
            nightlife: place
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching nightlife place'
        });
    }
};

// Add nightlife place (admin only)
const addNightlife = async (req, res) => {
    try {
        const nightlife = new Nightlife(req.body);
        await nightlife.save();
        res.status(201).json({
            success: true,
            message: 'Nightlife place added successfully',
            nightlife
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error adding nightlife place'
        });
    }
};

module.exports = {
    getAllNightlife,
    getNightlifeByLocation,
    getNightlifeById,
    addNightlife
};