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
    }],
    averageRating: Number, 
});

// Pre-save hook to calculate average rating
productSchema.pre('save', function(next) {
    if (this.rating && this.rating.length > 0) {
        const totalRating = this.rating.reduce((acc, curr) => acc + curr, 0);
        const preCalculatedValue = totalRating / this.rating.length;
        this.averageRating = Math.round(preCalculatedValue * 100) / 100;
        // this.averageRating = totalRating / this.rating.length;
    } else {
        this.averageRating = 0;
    }
    next();
});

/**User schema -> used to create a user in the database. */
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

/**Admin schema -> used to create an admin in the database. */
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

/**Blog schema -> used to create user posts in the database. */
const blogSchema = new Schema({
    postID: {
        type: String,
        index: true,
    },
    title: {
        required: true,
        type: String,
        maxlength: 15,
    },
    content: {
        type: String,
        maxlength: 50,
    },
    createdAt: { // UTC timezone
        type: Date, 
    },
    author: {
        type: String,
        required: true,
    }
})

const Product = mongoose.model('Product', productSchema);

const User = mongoose.model('User', userSchema);

const Admin = mongoose.model('Admin', adminSchema);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Product, User, Admin, Blog };