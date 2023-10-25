class APIFeatures {
    constructor(query, queryString) {
      (this.query = query), (this.queryString = queryString);
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excluded = ['page', 'sort', 'limit', 'fields'];
  
      excluded.forEach((el) => delete queryObj[el]);
      // console.log(req.query);
      // console.log(queryObj);
  
      // ADVANCE FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gt|gte|lte|lt)\b/g,
        (match) => `$${match}`,
      );
  
      // let query = TourModel.find(JSON.parse(queryString));
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    // sort() {
    //   if (this.queryString.sort) {
    //     let sortBy = req.query.sort.split(',').join(' ');
    //     console.log(this.query);
    //     console.log(sortBy);
    //     this.query = this.query.sort(sortBy);
    //   } else {
    //     this.query = this.query.sort('-createdAt');
    //   }
    //   return this;
    // }
  
    limitField() {
      if (this.queryString.fields) {
        let fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    pagination() {
      let page = this.queryString.page * 1 || 1;
      let limit = this.queryString.limit * 1 || 100;
  
      let skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = APIFeatures