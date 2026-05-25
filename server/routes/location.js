const express = require('express');
const LocationController = require('../controllers/locationController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Location management
router.post('/update', LocationController.updateLocation);
router.get('/:vehicleId/current', LocationController.getCurrentLocation);
router.get('/:vehicleId/history', LocationController.getLocationHistory);

// Nearby operations
router.post('/nearby', LocationController.getNearbyVehicles);

// Batch operations
router.post('/positions', LocationController.getVehiclePositions);

module.exports = router;
