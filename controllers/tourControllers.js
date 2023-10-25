const { runInNewContext } = require('vm');
const TourModel = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeature');
const asyncError = require('./../utils/asyncError');
const AppError = require('./../utils/appError');


require('perf_hooks');
const { resourceUsage, features } = require('process');

exports.topCheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

// getting all route function
exports.getAllTours = asyncError(async (req, res) => {
  // EXECUTE QUERY
  let feature = new APIFeatures(TourModel.find(), req.query)
    .filter()
    // .sort()
    .limitField()
    .pagination();
  const tours = await feature.query;

  // send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});


//  Creating a new route function
exports.createTour = asyncError(async (req, res) => {
  const newTour = await TourModel.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});


// finding a particular route function
exports.findParticularTour = asyncError(async (req, res) => {
  
  
  const tour = await TourModel.findById(req.params.id);
  console.log(tour);

  if(!tour){
    return next(new AppError('no tour found with this id' , 404))
    // res.send("not found")
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//  Update route function
exports.updateTour = asyncError(async (req, res) => {
  let tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return next(new AppError('no tour found with this id' , 404))
    // res.send("not found")
  }

  res.status(200).json({
    status: 'updated',
    data: {
      tour,
    },
  });
});


// Delete route function
exports.deleteTour = asyncError(async (req, res) => {
  const tour = await TourModel.findByIdAndDelete(req.params.id);

  if(!tour){
    return next(new AppError('no tour found with this id' , 404))
    // res.send("not found")
  }
  res.status(200).json({
    message: 'tour deleted',
  });
});


// Tour stats function
exports.getTourStats = asyncError(async (req, res) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'statics',
    data: {
      stats,
    },
  });
});


// Getting monthly plan function
exports.getMonthlyPlan = asyncError(async (req, res) => {
  const year = req.params.year * 1;

  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
  ]);

  res.status(200).json({
    status: 'plans',
    plans: plan.length,
    data: {
      plan,
    },
  });
});
