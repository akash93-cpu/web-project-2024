const mongoose = require('mongoose');
const { Schema } = mongoose;

/**Product schema -> used to create and find all Product documents in 
the database. */
const productSchema = new Schema({
    // product_id field - default index
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