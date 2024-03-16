const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    product_id: {
        type: String,
        unique: true
    },
    title: String,
    category: String,
    description: String,
    rating: [{
        type: Number, min: 1, max: 5,
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };