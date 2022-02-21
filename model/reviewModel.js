const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review Cannot Be Empty']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    tours: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour'
        },
    ],
    users: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ] 
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review