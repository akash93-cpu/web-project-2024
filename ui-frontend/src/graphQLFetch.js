const isomorphicFetch = require('isomorphic-fetch');

// common function used to fetch data for GraphQL queries 
export default async function graphQLFetchData(query, variables = {}) { // common function to fetch/execute GraphQL queries
    try {
        const response = await isomorphicFetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("API data:", result);

        if (result.errors) {
            console.log(result.errors);
        }
        return result.data;
    } catch (e) {
        alert(`Error getting data from server: ${e.message}`);
    }
}

// used only for query related args
export async function logoutFunction(query) {
    try {
        const response = await isomorphicFetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ query })
        });
        const body = await response.text();
        const result = JSON.parse(body);
        // console.log(result.data);
        return result.data;
    } catch (err) {
        throw new Error(`Error getting data from server! ${err}`);
    }
}