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

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required!"],
        min: 8,
        max: 16,
    },
    username: {
        type: String,
        required: [true, "Username required!"],  
    },
    role: {
        type: String,
        default: "user",
    },
});

const Product = mongoose.model('Product', productSchema);

const User = mongoose.model('User', userSchema);

module.exports = { Product, User };