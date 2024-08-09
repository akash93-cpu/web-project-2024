const fs = require('fs');
const jwt = require('jsonwebtoken');
const { ApolloServer, gql } = require('apollo-server-express');
const { Product } = require('./models.js');
const { Blog } = require('./models.js');
const { User } = require('./models.js');
require('dotenv').config();

// ------------------------------------------ 
const product1 = {
  product_id: "testID",
  title: "test",
  description: "xxx",
  category: 'test-cat-1',
  rating: [1, 2],
  averageRating: 1.5
}

const product2 = {
  product_id: "testID2",
  title: "test2",
  description: "zxg",
  category: 'test-cat-2',
  rating: [1, 2],
  averageRating: 1.5
}

const allProducts = [ product1, product2 ];

jest.mock('./models.js', () => ({ // mock data here for test1, test2 and test4
  Product: {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        product1, product2
      ])
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(allProducts.length)
    }),
  },
  Blog: {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{
        postID: "xkwu!4",
        title: "test-title",
        content: "test-content",
        createdAt: "2024-05-16T07:31:50.616+00:00",
        author: "Nobody"
      }])
    })
  },
  User: {
    findOne: jest.fn().mockResolvedValue(userDetails),
  }
}));
// ------------------------------------------ 
async function test1() { // test 1 - return data from getProducts query using mock data
  const resolvers = {
    Query: {
      getProducts: async () => await Product.find({}).exec(),
    },
  };
  
  test('returns a list of all db entries[products] --using mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
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
  expect(data?.getProducts).toEqual([
    product1, product2
    ]);
  });
}
// ------------------------------------------ 
async function test2() { // test 2 - return data from returnAllPosts query using mock data
  const resolvers = {
    Query: {
      returnAllPosts: async () => await Blog.find({}).exec(), // limit removed for test purposes
    },
  };
  
  test('returns a list of all db entries[blog] --using mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
    const { errors, data } = await testServer.executeOperation({
      query: `{
                returnAllPosts {
                postID
                title
                content
                createdAt
                author
            }
          }`,
      
  });
  expect(errors).toBeUndefined();
  expect(data?.returnAllPosts).toEqual([{
    postID: "xkwu!4",
        title: "test-title",
        content: "test-content",
        createdAt: "2024-05-16T07:31:50.616+00:00",
        author: "Nobody"
    }]);
  });
}
// ------------------------------------------ 
async function test3() { // test 3 - filter data from productFilter
  const filterProduct = {
    product_id: "filterTestID",
    title: "testFilter",
    description: "xFilter",
    category: 'test-filter',
    averageRating: 1.5  
  };

  const Product = {
    find: jest.fn().mockImplementation((query) => {
      if (query.category === 'test-filter') {
        return Promise.resolve([filterProduct]);
      } else {
        return Promise.resolve([]);
      }
    }),
  };

  const resolvers = {
    Query: {
      productFilter: async (_, { filter }) => { 
        const query = {};
        if (filter) {
          if (filter.category) {
            query.category = filter.category;
          } else {
            throw new Error("Please enter a category!");
          }
        }
        return await Product.find(query);
      },
    }
  };

  test('returns query based on filter obj[products] --using mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
      resolvers
    });

    // Test for the category that matches
    let { errors, data } = await testServer.executeOperation({
      query: `query ProductFilter($filter: ProductFilterInput!) {
                productFilter(filter: $filter) {
                  product_id
                  title
                  category
                  description
                  averageRating
                } 
              }`,
      variables: { filter: { category: "test-filter" } }
    });
    expect(errors).toBeUndefined();
    expect(data?.productFilter).toEqual([ filterProduct ]);

    // Test for the category that does not match
    ({ errors, data } = await testServer.executeOperation({
      query: `query ProductFilter($filter: ProductFilterInput!) {
                productFilter(filter: $filter) {
                  product_id
                  title
                  category
                  description
                  averageRating
                } 
              }`,
      variables: { filter: { category: "no-match" } }
    }));
    expect(errors).toBeUndefined();
    expect(data?.productFilter).toEqual([]);
  });
}
// ------------------------------------------ 
async function test4() { // test 4 - returns total number of entries using countProducts
  const resolvers = {
    Query: {
      countProducts: async () => {
        try {
          const count = await Product.countDocuments({}).exec();
          return { count };
        } catch (e) {
          return { count: 0 };
        }
      }
    }
  };

  test('count all mock data in products --returns an int.', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
    const { errors, data } = await testServer.executeOperation({
      query: `query CountProducts {
                    countProducts {
                        count
                    }}`
    });
    expect(errors).toBeUndefined();
    expect(data?.countProducts.count).toEqual(2);
  });
}
// ------------------------------------------
const userDetails = {
  _id: "6627f29a63557176c8062867", 
  email: "testuser@test.com",
  password: "TestPassword123!", 
  username: "TestUser",
  role: "user",
} 

async function test5() { // test 5 - user login from provided variables using userLogin --token is returned upon successful tests
  const resolvers = {
    Query: {
      userLogin: async (_, args) => { // user login
        const { email, password } = args;
        try {
          const userExist = await User.findOne({ email: email });
          if (!userExist) throw new Error(`User with email ${ email } does not exist! Please register!`);
          
          const userEmail = userExist.email;
          const userPassword = userExist.password;
          if (password === userPassword && email === userEmail) {
            const token = jwt.sign({ id: userExist._id, username: userExist.username }, process.env.JWT_SECRET_KEY, {
              expiresIn: 1 * 24 * 60 * 60, // 1 day
            });
  
            return { token, password: null, ...userExist };
          }
        } catch (err) {
          throw err;
        }
      },
    }
  }
  
  test('return token on successful login[user] --using userDetails mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
    const { errors, data } = await testServer.executeOperation({
      query: `query userLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                  _id
                  token
                  email
                  username
                }
            }`,
      variables: { email: "testuser@test.com", password: "TestPassword123!" },
    });
    expect(errors).toBeUndefined();
    expect(data?.userLogin).toEqual(
      {
        _id: "6627f29a63557176c8062867",
        token: expect.any(String),
        email: "testuser@test.com",
        username: "TestUser",
      } 
    );
  });

  test('return null on failed user login using wrong password[user] --using userDetails mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
    const { errors, data } = await testServer.executeOperation({
      query: `query userLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                  _id
                  token
                  email
                  username
                }
            }`,
      variables: { email: "testuser@test.com", password: "FailPassword123!" },
    });
    expect(errors).toBeUndefined();
    expect(data?.userLogin).toEqual(null);
  });

  test('return null on failed user login using wrong username[user] --using userDetails mock data', async () => {
    const testServer = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'), 
      resolvers
    });
    const { errors, data } = await testServer.executeOperation({
      query: `query userLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                  _id
                  token
                  email
                  username
                }
            }`,
      variables: { email: "failtest@test.com", password: "TestPassword123!" },
    });
    expect(errors).toBeUndefined();
    expect(data?.userLogin).toEqual(null);
  });
}

test1();
test2();
test3();
test4();
test5();