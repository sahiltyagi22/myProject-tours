const express = require('express');
const router = express.Router();

const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');

// router.param('id',tourController.checkID)

//   ROUTES
router
  .route('/top-5-cheap')
  .get(tourController.topCheap, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(authController.protect, tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(authController.protect, tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route('/:id')
  .get(authController.protect, tourController.findParticularTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour,
  );

module.exports = router;
