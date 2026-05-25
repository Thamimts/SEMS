const express = require('express');
const EmergencyController = require('../controllers/emergencyController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Emergency management
router.post('/activate', EmergencyController.activateEmergency);
router.post('/:emergencyId/deactivate', EmergencyController.deactivateEmergency);
router.get('/:emergencyId', EmergencyController.getEmergency);
router.get('/vehicle/:vehicleId/active', EmergencyController.getActiveEmergency);
router.get('/vehicle/:vehicleId/history', EmergencyController.getEmergencyHistory);

// Hospital operations
router.post('/nearby-hospitals', EmergencyController.getNearbyHospitals);
router.post('/:emergencyId/nearby-vehicles', EmergencyController.getNearbyVehicles);

// Green corridor
router.post('/:emergencyId/green-corridor/activate', EmergencyController.activateGreenCorridor);
router.post('/:emergencyId/green-corridor/deactivate', EmergencyController.deactivateGreenCorridor);

// Status updates
router.put('/:emergencyId/status', EmergencyController.updateEmergencyStatus);

module.exports = router;
