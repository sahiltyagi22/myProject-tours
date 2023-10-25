const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const slug = require('slugify')

const tourSchmea = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required in tours name section'],
    unique: true,
    trim: true,
    maxLength : [40 , 'A tour name must have less or equal to 40'],
    minLength : [8 , 'Name must have atleast 8 characters']
  },

  slug : String,

  duration:{
    type: Number,
    required: [true, 'a tour must hava a duration'],
  },

  maxGroupSize:{
    type: Number,
    required: [true, 'a tour must have a group size'],
  },

  difficulty:{
    type: String,
    required: [true, 'a tour must have a difficulty level'],
    enum : ['easy' , 'meduim' , 'difficult'] 
  },

  ratingsAverage:{
    type: Number,
    default: 4.5,
    min : [1 , "A rating section should have atleast a single rating"],
    max : [5, 'cant rate a tour above 5']
  },

  ratingsQuantity:{
    type: Number,
    default: null,
  },

  price:{
    type: Number,
    required: [true, 'tour price field is required'],
  },

  priceDiscount: {
    type: Number,
    validate : {
      validator : function(val){
        return val < this.price
    } ,
    message : "Discounted price cannot be higher than the actual price"
    }
  },

  summary: {
    type: String,
    trim: true,
    required : [true, 'a tour must have a summary']
  },

  description : {
    type : String,
    trim : [ , 'a tour must have a description']
  },

  imageCover :{
    type : [String],
    required : [true , 'a tour must have a image cover']
  },

  images : [String],

  secretTour : {
    type : Boolean,
    default : false
  },

  createdAt : {
    type : Date,
    default : Date.now(),
    select : false
  },

  startDates : [Date]
   
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

// Virtual Property
tourSchmea.virtual('durationWeeks').get(function(){
  return this.duration/7
})

//  Document Middleware

// tourSchmea.pre('save' , function(next){
//   this.slug = slugify(this.name , {lower : true})
//   next()
// })

// tourSchmea.post('save' , function(doc , next){
//   console.log(doc)
//   next()
// })

// Document Middleware

tourSchmea.pre('find' , function(next){
this.find({secretTour : {$ne : true}})
next()
})

tourSchmea.pre('findOne' , function(next){
this.find({secretTour : {$ne : true}})
next()
})


//  Aggregation Middleware

tourSchmea.pre('aggregate' , function(next){
this.pipeline().unshift({$match : { secretTour : {$ne : true}}})
next()
})

 
const TourModel = new mongoose.model('TourModel', tourSchmea);

module.exports = TourModel;
