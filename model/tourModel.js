const mongoose = require('mongoose')
//const User = require('./userModel')
//const slugify = require('slugify')
//const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour must have less or equal then 40 character'],
        minLength: [10, 'A tour must have more or equal then 20 character'],
        //validate: [validator.isAlpha, 'Tour name must only contain character']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values:['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy,medium,difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: val => Math.round(val * 10) / 10   
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only point for to current doc on NEW document create can't on update
                return val < this.price; //100 < 200
            },
            message: 'Discount Price ({VALUE}) Should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //Geo JSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

//tourSchema.index({price: 1})
tourSchema.index({price: 1, ratingAverage: -1})
tourSchema.index({slug: 1})
tourSchema.index({startLocation: '2dsphere'})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

//Virtual Populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})



// tourSchema.pre('save',async  function(next) {
//     const guidesPromises = this.guides.map(async item => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next()
// })

//Document middleware: pre run before save() command and create() command
// tourSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, {lower:true});
//     next();
// })

//Document middleware: post run after save() command and create() command
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next()
// })

//Query Middleware 
tourSchema.pre(/^find/, function(next){
    this.start = Date.now()
    next()
})

tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangeAt'
    })
    next()
})

tourSchema.post(/^find/, function(doc, next){
    console.log(`Query Took ${Date.now() - this.start} milisecond`)
    next()
})



//Aggregation Middleware
// tourSchema.pre('aggregate', function(next){
//     console.log(this)
//     next()
// })


const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
