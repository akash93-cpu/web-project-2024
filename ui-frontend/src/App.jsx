import React from "react";
import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import HeaderContent from "./DemoPage.jsx";

// function ProductRow(props) {
//     const products = props.products;
//     return (
//         <tr>
//             <td>{products.product_id}</td>
//             <td>{products.title}</td>
//             <td>{products.description}</td>
//             <td>{products.category}</td>
//             <td>{products.rating}</td>
//         </tr>
//     );
// }

function ProductCard(props) {
    const products = props.products;
    return (
        <div style={{padding: "4px", display: "grid"}}>
        <Card style={{width: '12rem'}}>
            <Card.Body>
                <Card.Title>{products.title}</Card.Title>
                <Card.Subtitle>{products.product_id}</Card.Subtitle>
                <Card.Text>{products.category}</Card.Text>
                <Card.Subtitle>Rating={products.rating}</Card.Subtitle>
                <Card.Text>{products.description}</Card.Text>
            </Card.Body>
        </Card>
        </div>
    )
}

function ProductsTable(props) {
    const productRows = props.products.map(products =>
        <ProductCard key={products.id} products={products} />
    );
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {productRows}
        </div>
    );
}

async function graphQLFetchData(query, variables = {}) {
    try {
        const response = await fetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body)

        if (result.errors) {
            console.log(result.errors);
        }
        return result.data;
    } catch (e) {
        alert(`Error getting data from server: ${e.message}`);
    }
}

// main product page
export default class ProductsList extends React.Component {
    constructor() {
        super();
        this.state = { products: [] };
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            getProducts {
                product_id 
                title
                description
                category
                rating
            }
        }`
        const data = await graphQLFetchData(query);
        if (data) {
            this.setState({ products: data.getProducts })
        }
    }
    render() {
        return (
            <React.Fragment>
                <HeaderContent />
                    <h1 style={{textAlign: 'center'}}>Product Listings</h1>
                    <ProductsTable products={this.state.products} />
                    <hr />
            </React.Fragment>
        )
    }
}

// const element = <ProductsList />;
// ReactDOM.render(element, document.getElementById('contents'));

// if (module.hot) {
//     module.hot.accept();
// }