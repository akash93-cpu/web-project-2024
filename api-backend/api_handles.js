const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { Product } = require('./models.js');
const { User } = require('./models.js');
const { Admin } = require('./models.js');
const validator = require('validator');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const resolvers = {

    // queries
    Query: {
        getProducts: async () => await Product.find({}).exec(), // return all products in the db
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

                // setting the cookie
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
        adminLogin: async (_, args) => { // admin login
            const { email, password } = args;
            try {
                const adminExist = await Admin.findOne({ email: email });
                if (!adminExist) throw new Error (`Admin with email ${ email } does not exist! Please register!`);

                const checkPasswordIsValid = bcrpyt.compareSync(password, adminExist.password);
                if (!checkPasswordIsValid) throw new Error('Incorrect password!');

                const token = jwt.sign({ id: adminExist._id }, process.env.JWT_SECRET_KEY_2, {
                    expiresIn: 600, // 10 minutes
                });

                return { token, password: null, ...adminExist._doc };
            } catch (err) {
                throw err;
            }
        },
        verifyTokenUser: async (_, args, { res }) => { // verify user token -- also used in the frontend to logout a user
            try {
                res.clearCookie('userToken', { path: '/' }); 
                const decodedUserToken = jwt.verify(args.token, process.env.JWT_SECRET_KEY);
                const user = await User.findOne({ _id: decodedUserToken.id });
                return { ...user._doc, password: null };
            } catch (err) {
                throw err;
            }
        }
    },
    
    // mutations
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