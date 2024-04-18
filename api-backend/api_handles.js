const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { Product } = require('./models.js');
// const { error } = require('console');

const resolvers = {
    Query: {
        getProducts: async () => await Product.find({}).exec(),
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
        addProducts: async (_, args) => {
            try {
                let res = await Product.create(args);
                return res;
            } catch (e) {
                return e.message;
            }
        },
        updateProducts: async (_, args) => {
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