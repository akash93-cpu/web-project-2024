const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { Product } = require('./models.js');
const { User } = require('./models.js');
const { Admin } = require('./models.js');
const { Blog } = require('./models.js');
const validator = require('validator');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const tokenStore = new Map();

function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        randomString += charset.charAt(randomIndex);
    }
    return randomString;
}

const resolvers = {

    // QUERIES -- QUERIES -- QUERIES -- QUERIES -- QUERIES -- QUERIES -- QUERIES -- QUERIES
    Query: {
        getProducts: async () => await Product.find({}).exec(), // return all products in the db
        productFilter: async (_, { filter }) => { // filter products by category - search query
            const query = {};
            if (filter) {
                if (filter.category) {
                    query.category = filter.category;
                } else if (query.category == null) throw new Error("Please enter a category!");
            }
            return await Product.find(query);
        },
        returnAllPosts: async () => await Blog.find({}).exec(), // return all blog posts
        countProducts: async () => { // count all products in the db
            try {
                const count = await Product.countDocuments({}).exec();
                return { count };
            } catch (e) {
                return e.message;
            }
        },
        countAllUsers: async () => { // counts all registered users in db
            try {
                const countUsers = await User.countDocuments({}).exec();
                return { countUsers };
            } catch (e) {
                return e.message;
            }
        },
        countAllAdmins: async () => { // counts all admins in db
            try {
                const countAdmins = await Admin.countDocuments({}).exec();
                return { countAdmins };
            } catch (e) {
                return e.message;
            }
        },
        
        // user/admin related queries
        userLogin: async (_, args, { res }) => { // user login
            const { email, password } = args;
            try {
                const userExist = await User.findOne({ email: email });
                if (!userExist) throw new Error (`User with email ${ email } does not exist! Please register!`);    

                const checkPasswordIsValid = bcrpyt.compareSync(password, userExist.password);
                if (!checkPasswordIsValid) throw new Error('Incorrect password!');

                const token = jwt.sign({ id: userExist._id, username: userExist.username }, process.env.JWT_SECRET_KEY, {
                    expiresIn: 1 * 24 * 60 * 60, // 1 day
                });

                // clear admin cookie if admin cookie is present
                res.clearCookie('adminToken', { path: '/' });

                // setting the cookie --user
                const expires = new Date(Date.now() + 30 * 1000); // 30 second expiry time
                res.cookie('userToken', token, 
                { path: '/', secure: true, withCredentials: true, expires: expires, httpOnly: true });


                // router.post('/login', async (req, res) => { // not used
                //     res.cookie('jwtToken', token, 
                //     { httpOnly: true, withCredentials: true })
                // });

                return { token, password: null, ...userExist._doc };
            } catch (err) {
                throw err;
            }
        },
        adminLogin: async (_, args, { res }) => { // admin login
            const { email, password } = args;
            try {
                const adminExist = await Admin.findOne({ email: email });
                if (!adminExist) throw new Error (`Admin with email ${ email } does not exist! Please register!`);

                const checkPasswordIsValid = bcrpyt.compareSync(password, adminExist.password);
                if (!checkPasswordIsValid) throw new Error('Incorrect password!');

                const token = jwt.sign({ id: adminExist._id }, process.env.JWT_SECRET_KEY_2, {
                    expiresIn: 1 * 24 * 60 * 60, // 1 day
                });

                // clear user cookie if user cookie is present
                res.clearCookie('userToken', { path: '/' }); 

                // setting the cookie --admin
                const expires = new Date(Date.now() + 60 * 1000); // 60 second expiry time
                res.cookie('adminToken', token,
                { path: '/', secure: true, withCredentials: true, expires: expires, httpOnly: true });

                return { token, password: null, ...adminExist._doc };
            } catch (err) {
                throw err;
            }
        },
        verifyTokenUser: async (_, args, { res, req }) => { // verify user token -- also used in the frontend to logout a user/admin
            try {
                res.clearCookie('userToken', { path: '/' });
                res.clearCookie('adminToken', { path: '/' });
                const decodedUserToken = jwt.verify(args.token, process.env.JWT_SECRET_KEY);
                const user = await User.findOne({ _id: decodedUserToken.id });
                return { ...user._doc, password: null };
            } catch (err) {
                throw err;
            }
        },
        currentLoggedInUser: async (_, __, { req }) => { // to get current logged in user
            try {
                const userToken = req.cookies.userToken;
                if (!userToken) {
                    throw new Error("No Token!");
                }
        
                const decodedSomeUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
                const user = await User.findOne({ _id: decodedSomeUser.id });
        
                if (!user) {
                    throw new Error("User not found!");
                }
        
                // Ensure userName is not null before accessing username property
                if (!user.username) {
                    throw new Error("Username not found for the user!");
                }
        
                return { userName: user.username }; // Return an object with userName field
            } catch (err) {
                throw err;
            }
        },
        forgotUserPassword: async (_, { email }) => { // Forgot Password - retrieve user email - if user exists - email password via email 
            try {
                // Retrieve user from database 
                const user = await User.findOne({ email });
                if (user) {
                    const token = crypto.randomBytes(20).toString('hex');

                    tokenStore.set(token, {
                        userId: user._id,
                        expires: Date.now() + 86400000 // 24 hour expiration
                    });
        
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.USER,
                            pass: process.env.APP_PASSWORD,
                        },
                        tls: {
                            rejectUnauthorized: false // This line allows you to use self-signed certificates, remove it in production
                        }
                    });
                    
                    const mailOptions = {
                        from: {
                            name: 'Akash-test',
                            address: process.env.USER
                        },
                        to: user.email,
                        subject: "IT Lite - Password Reset",
                        text: `You requested a password reset. Please click \n http://localhost:5000/reset-password/${token} \n
                        to reset your password.`,
                    };
                    
                    const sendMail = async (transporter, mailOptions) => {
                        try {
                            let info = await transporter.sendMail(mailOptions);
                            console.log("Email sent: " + info.response);
                            console.log(mailOptions);
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    
                    sendMail(transporter, mailOptions);
                    // next steps 
                    setTimeout(() => {
                        if (tokenStore.has(token)) {
                            tokenStore.delete(token);
                        }
                    }, 86400000);

                    console.log("Contents of tokenStore:"); // used to check contents of stored tokens
                    tokenStore.forEach((value, key) => {
                        console.log(`${key}:`, value);
                    });

                }

                if (!user) {
                    throw new Error(`User with email ${email} not found.`);
                }

                return user;
            } catch (error) {
                throw new Error(error.message);
            }
        }

    },
    
    // MUTATIONS -- MUTATIONS -- MUTATIONS -- MUTATIONS -- MUTATIONS -- MUTATIONS -- MUTATIONS -- MUTATIONS 
    Mutation: {
        addProducts: async (_, args) => { // add product
            try {
                let res = await Product.create(args);
                return res;
            } catch (e) {
                return e.message;
            }
        },
        updateProducts: async (_, args) => { // update product
            const { product_id, changes } = args;
            try {
                const updatedProduct = await Product.findOneAndUpdate(
                    { product_id: product_id },
                    { $set: changes },
                    { new: true }
                );
                console.log(updatedProduct);
                return updatedProduct;
            } catch (error) {
                return error.message;
            }
        },
        addUserRating: async (_, args, { req }) => { // add a rating to a Product 
            const { product_id, userRating } = args;
            // product_id - only used for finding and querying for a Product
            const userToken = req.cookies.userToken; // requesting user token to add a rating to a product
            if (userRating.rating < 1) {
                throw new Error("Error! Please enter a value btw 1 - 5");
            }
            if (userRating.rating > 5) {
                throw new Error("Error! Please enter a value btw 1 - 5");
            }
            if (userToken) {
                try {
                    const productFinder = await Product.findOne({ product_id: product_id });
    
                    if (!productFinder) throw new Error("Error! Product does not exist!");
                    productFinder.rating.push(userRating.rating);
                    await productFinder.save();
                    return productFinder;
                } catch (error) {
                    return error.message;
                }
            }
            else if (!userToken) {
                throw new Error("You must be logged in to add a rating!");
            }
        },
        createUser: async (_, args) => { // create user
            const { email, password, username, confirm } = args.userInput;
            try {
                if (!email || !password || !username || !confirm) {
                    throw Error("Please enter all fields!");
                }
                if (password.length > 16) { // checks if password is correct length
                    throw Error('Password too long!');
                }
                if (password.length < 8) { // checks if password is correct length
                    throw Error('Password too short!');
                }

                // validators
                if (!validator.isEmail(email)) {
                    throw Error("Email not valid!");
                }
                if (!validator.isAlphanumeric(username)) throw Error("Username cannot contain special characters!");
                if (!validator.isStrongPassword(password)){
                    throw Error('Password not strong enough!');
                }

                const existingOtherUser = await Admin.findOne({ email });
                if (existingOtherUser) {
                    throw new Error(`Admin with email: ${ email } is already registered! Cannot
                    re-register as a User!`);
                }

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error(`User with email: ${ email } already exists!`);
                }
                const userName = await User.findOne({ username });
                if (userName) {
                    throw new Error(`Username ${ username } already exists!`)
                }
                if (password !== confirm) {
                    throw new Error('Passwords do not match!');
                }
                const hashedPassword = await bcrpyt.hash(password, 10);
                const user = new User({
                    email,
                    username,
                    password: hashedPassword,
                    role: "user",
                }, (err) => { if (err) throw err; });
                user.save();

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
                console.log('user created successfully!', user);            
                return { token, password: null, ...user._doc }
    
            } catch (error) {
                throw error;
            } 
        },
        createAdmin: async (_, args) => { // create admin
            const { email, password, username, confirm } = args.adminInput;
            try {
                if (!email || !password || !username || !confirm) {
                    throw Error("Please enter all fields!");
                }
                if (password.length > 16) { // checks if password is correct length
                    throw Error('Password too long!');
                }
                if (password.length < 8) { // checks if password is correct length
                    throw Error('Password too short!');
                }

                // validators
                if (!validator.isEmail(email)) {
                    throw Error("Email not valid!");
                }
                if (!validator.isAlphanumeric(username)) throw Error("Admin username cannot contain special characters!");
                if (!validator.isStrongPassword(password)){
                    throw Error('Password not strong enough!');
                }
                
                const existingOtherUser = await User.findOne({ email });
                if (existingOtherUser) {
                    throw new Error(`Another user with email: ${ email } already exists 
                    in the User database!`);
                }

                const existingUser = await Admin.findOne({ email });
                if (existingUser) {
                    throw new Error(`Admin with email: ${ email } already exists!`);
                }
                const userName = await Admin.findOne({ username });
                if (userName) {
                    throw new Error(`Admin ${ username } already exists!`)
                }
                if (password !== confirm) {
                    throw new Error('Passwords do not match!');
                }
                const hashedPassword = await bcrpyt.hash(password, 10);
                const admin = new Admin({
                    email,
                    username,
                    password: hashedPassword,
                    role: "admin",
                }, (err) => { if (err) throw err; });
                admin.save();

                const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY_2);
                console.log('admin created successfully!', admin);            
                return { token, password: null, ...admin._doc }
    
            } catch (error) {
                throw error;
            } 
        },
        createBlog: async(_, args, { req }) => {

            // requesting cookie 
            const userToken = req.cookies.userToken;
            const decodedSomeUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ _id: decodedSomeUser.id });
            
            const { title, content } = args.blogInput;
            try {
                if (userToken) {
                    if (!title.trim()) throw Error('Please enter a title!');
                    if (title.length > 15) throw Error('Title too long!');
                    if (content.length > 50) throw Error('Content too long!');
                    const blog = new Blog({
                        postID: generateRandomString(5),
                        title,
                        content,
                        author: user.username,
                        createdAt: Date.now(),
                    }, (err) => { if (err) throw err; });
                    blog.save();
                    return { title, content, author: user.username, createdAt: Date.now() };
                }

            } catch (error) {
                return error;
            }
        },
        updateUserPost: async(_, args, { req }) => { // edit user post by user
            const { changes, postID } = args;

            // requesting cookie    
            const userToken = req.cookies.userToken;
            const decodedUser = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
            const usernameFind = await User.findOne({ _id: decodedUser.id });
            const correctUsername = usernameFind.username;
            console.log(correctUsername);

            try {
                const usernameOfBlogPost = await Blog.findOne({ postID: postID });
                const blogUser = usernameOfBlogPost.author;
                if (correctUsername === blogUser) {
                    const updatedPost = await Blog.findOneAndUpdate(
                        { postID: postID },
                        { $set: changes },
                        { new: true },
                    );
                    return updatedPost;
                }
            } catch (error) {
                return error.message;
            }
        },
        deletePost: async(_, args, { req }) => {
            const { postID } = args;

            // requesting cookie
            const userToken = req.cookies.userToken;
            // for admin purposes
            const adminToken = req.cookies.adminToken;
            
            try {
                if (adminToken) {
                    const deletedPostByAdmin = await Blog.findOneAndDelete({ postID: postID });
                    return deletedPostByAdmin;
                }
                const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
                const usernameFind = await User.findOne({ _id: decodedToken.id });
                const correctUser = usernameFind.username;
                const usernameOfBlogPostToDelete = await Blog.findOne({ postID: postID });
                const blogUser = usernameOfBlogPostToDelete.author;            

                if (correctUser === blogUser) {
                    const deletedPost = await Blog.findOneAndDelete({ postID: postID });
                    return deletedPost;
                }
                
            } catch (error) {
                return error.message;
            }
        },
        resetUserpassword: async (_, args) => {
            const { token, newPassword } = args;
            const storedToken = tokenStore.get(token);
            if (!storedToken || storedToken.expires < Date.now()) { // checks if stored token is valid
                throw new Error('Password reset token is invalid or has expired.');
            }
            try {
                const user = await User.findById(storedToken.userId);
                if (!user) {
                    throw new Error('User not found.');
                }
                // validation of new password
                if (newPassword.length > 16) throw new Error('New password too long!');
                if (newPassword.length < 8) throw new Error('New password too short!');
                if (!validator.isStrongPassword(newPassword)) throw new Error('New Password not strong enough!');
                // complete hashing of password and then save
                const newPasswordHashed = await bcrpyt.hash(newPassword, 10);
                user.password = newPasswordHashed;
                await user.save();
                tokenStore.delete(token);

                return user;
            } catch (error) {
                throw new Error(error);
            }
      
        }
    }
};

let appServer = null;
async function startServer(app) {
    const enableCors = ((console.log('cors')) || 'true') === 'true';
    let cors;
    if (enableCors) {
        const allowedOrigins = ['http://localhost:5000', 'https://studio.apollographql.com'];
        const methods = ["GET", "POST", "PUT", "DELETE"];
        cors = { origin: allowedOrigins, methods, credentials: true }
    } else {
        cors = 'false';
    }
    appServer = new ApolloServer({
        typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
        resolvers,
        context: ({ res, req }) => ({ res, req }),
    });
    await appServer.start();
    appServer.applyMiddleware({ app, path: '/graphql-server', cors });
}

module.exports = { startServer } // removed router

// frequently used GraphQL queries -> copy+paste into graphQL editor : 

// mutation createUser{
//     createUser(userInput: {
//       email: "someone2@email.com",
//       password: "Password123!",
//       confirm: "Password123!",
//       username: "Person1",
//     }) {
//       _id
//       token
//       email
//     }
//   }
  
//   query userLogin{
//     userLogin(email: "someone@email.com", password: "Password123!") {
//       _id
//       token
//       email
//     }
//   }
  
//   query verifyTokenUser {
//     verifyTokenUser(token: "") {
//       _id
//       email
//     }
//   }
  
// unused 
// const server = new ApolloServer({
//     typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
//     resolvers,
//     formatError: (error) => {
//         console.log(error);
//         return error;
//     }
// });

// function installHandler(app) {
//     const enableCors = ((console.log('cors')) || 'true') === 'true';
//     console.log('CORS Settings:', enableCors);
//     let cors;
//     if (enableCors) {
//         const origin = 'http://localhost:8000';
//         const methods = 'POST';
//         cors = { origin, methods }
//     } else {
//         cors = 'false';
//     }
//     server.applyMiddleware({ app, path: '/graphql', cors });
// };

// module.exports = { installHandler }