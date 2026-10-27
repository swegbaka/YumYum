const Food = require("../models/foodModel");

// const beef = JSON.parse(
//   fs.readFileSync(`${__dirname}/../Crookie/beefReceipe.JSON`)
// );

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAPI = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const beef = await Food.find(queryObj);

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: beef.length,
    data: {
      beef,
    },
  });

  // try {
  //   // BUILD QUERY
  //   const queryObj = { ...req.query };
  //   const excludedFields = ["page", "sort", "limit", "fields"];
  //   excludedFields.forEach((el) => delete queryObj[el]);

  //   //ADVANCED FILTER
  //   let queryStr = JSON.stringify(queryObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //   //EXECUTE QUERY
  //   const beef = await Beef.find(queryObj);

  //   //SEND RESPONSE
  //   res.status(200).json({
  //     status: "success",
  //     results: beef.length,
  //     data: {
  //       beef,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err,
  //   });
  // }
});
