const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server-express');
const { Product } = require('./models.js');

// --------------------------- example test 
// const typeDefs = gql` 
//   type Query {
//     hello(name: String): String!
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: (_, { name }) => `Hey ${name}!`,
//   },
// };

// test('returns hello with the provided name', async () => {
//   const testServer = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   const { errors, data } = await testServer.executeOperation({
//     query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
//     variables: { name: 'world' },
//   });

//   // Check if there are any errors
//   expect(errors).toBeUndefined();

//   // Check if the data is as expected
//   expect(data?.hello).toBe('Hey world!');
// });

// test 1 - return data from getProducts query using mock data
jest.mock('./models.js', () => ({
  Product: {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{
        "product_id": "testID", 
        "title": "test", 
        "description": "xxx", 
        "category": 'tests', 
        "rating": [1, 2], 
        "averageRating": 1.5}])
    })
  }
}));
const resolvers = {
  Query: {
    getProducts: async () => await Product.find({}).exec(),
  },
};

test('returns a list of all db entries --using mock data', async () => {
  const testServer = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
    resolvers
  })
  const { errors, data } = await testServer.executeOperation({
    query: `{
              getProducts {
                  product_id 
                  title
                  description
                  category
                  rating
                  averageRating
              }
          }`,
    
});
expect(errors).toBeUndefined();
expect(data?.getProducts).toEqual([{
  "product_id": "testID", 
  "title": "test", 
  "description": "xxx", 
  "category": 'tests', 
  "rating": [1, 2],
  "averageRating": 1.5}]);
});