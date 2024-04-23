const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { Product } = require('./models.js');
const { User } = require('./models.js');
const validator = require('validator');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const { error } = require('console');

const resolvers = {
    Query: {
        getProducts: async () => await Product.find({}).exec(), // return all products
        countProducts: async () => {
            try {
                const count = await Product.countDocuments({}).exec();
                return { count };
            } catch (e) {
                return e.message;
            }
        }
    },
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
                // validators
                if (!validator.isEmail(email)) {
                    throw Error("Email not valid!");
                }
                if (!validator.isStrongPassword(password)){
                    throw Error('Password not strong enough!');
                }
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('User already exists!');
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
        }
    }
};

let appServer = null;
async function startServer(app) {
    const enableCors = ((console.log('cors')) || 'true') === 'true';
    let cors;
    if (enableCors) {
        const origin = 'http://localhost:8000';
        const methods = 'POST';
        cors = { origin, methods }
    } else {
        cors = 'false';
    }
    appServer = new ApolloServer({
        typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
        resolvers,
    });
    await appServer.start();
    appServer.applyMiddleware({ app, path: '/graphql-server' });
}

module.exports = { startServer }

// copy+paste into graphQL editor to use createUser: 

// mutation {
//     createUser(userInput: {
//       email: "test@email.com",
//       password: "Password123!",
//       confirm: "Password123!",
//       username: "Akash1",
//     }) {
//       _id
//       token
//       email
//     }
//   }

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