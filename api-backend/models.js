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
        // minlength: 8, not used
        // maxlength: 16,
    },
    username: {
        type: String,
        required: [true, "Username required!"],
        index: {
            unique: true,
        } 
    },
    role: {
        type: String,
        default: "user",
    },
});

const adminSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required!"],
        // minlength: 8, not used
        // maxlength: 16,
    },
    username: {
        type: String,
        required: [true, "Username required!"],
        index: {
            unique: true,
        } 
    },
    role: {
        type: String,
        default: "admin",
    },
});

const Product = mongoose.model('Product', productSchema);

const User = mongoose.model('User', userSchema);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Product, User, Admin };