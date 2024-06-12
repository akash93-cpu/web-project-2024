import React, { useState } from "react";
import _fetch from "isomorphic-fetch";

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

import HeaderContent from "./DemoPage.jsx";
import bgProductImg from '../images/products-bg-unsplash.jpg';
import "../css/othercss.css";

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

async function graphQLFetchData(query, variables = {}) {
    try {
        const response = await _fetch('http://localhost:3000/graphql-server', {
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
        
function ProductCard(props) {

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        const form = document.forms.addUserRating;
        const variables = {
            product_id: products.product_id,
            userRating: { rating: parseInt(selectedValue) },
        };
        console.log("Form data :", variables);

        const query = `mutation addUserRating($product_id: String!, $userRating: RatingInput!) {
  addUserRating(product_id: $product_id, userRating: $userRating) {
    product_id
    rating
  }
}`

        try {
            await graphQLFetchData(query, variables);
            window.location.reload();
        } catch (err) {
            alert(err);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleRateClick = (products) => { 
        setSelectedProduct(products);
        setShowModal(true);
    };

    const [selectedValue, setSelectedValue] = useState(null);

    const handleSelect = (number) => {
      setSelectedValue(number);
    };
  

    const styles = {
        cardDiv: {
            display: 'flex',
            alignItems: 'center',
            flex: '1',
            margin: '2.5rem',
        },
        mainDiv: {
            display: 'flex',
            alignContent: 'center',
            marginLeft: '3.5rem',
        },
    }

    const products = props.products;
    return (
        <div className="main-div" style={styles.mainDiv}>
            <div className="card-div" style={styles.cardDiv}>
                <Card className="card-single" style={{ width: '14rem', height: '14.5rem' }}>
                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '16px' }}>
                            {products.title}</Card.Title>
                        <hr style={{ margin: '25px -17px' }} />
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '14px', fontWeight: 'bold' }}>
                            {products.product_id}</Card.Subtitle>
                        <Card.Text style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '11px' }}>
                            Category: {products.category}</Card.Text>
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '12px' }}>
                           Average Rating: {products.averageRating}</Card.Subtitle>
                        <Card.Text style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '13px' }}>
                            {products.description}</Card.Text>
                    </Card.Body>
                        <Button id="ratings-btn" onClick={() => handleRateClick(props.products)}>Rate</Button>
                </Card>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="ratings-modal">

                <Modal.Header closeButton>
                    <Modal.Title style={{fontFamily: 'Fira Code'}}>
                        Rate this product - {'{'}{products.product_id}{'}'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{fontFamily: 'Fira Code'}}>{products.title}</p>
                    
                    <Form className="ratings-form" name="addUserRating" onSubmit={handleRatingSubmit}>
                        <Form.Group>
                            <Form.Label className="dropdown-toggle-form">Add a rating: </Form.Label>
                            <Dropdown className="inline-dropdown" onSelect={handleSelect}>
                                <Dropdown.Toggle id="dropdown-toggle" variant="primary" >
                                    {selectedValue === null ? 'Select a number' : selectedValue}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {[1, 2, 3, 4, 5].map((number) => (
                                        <Dropdown.Item key={number} eventKey={number} href="#">
                                            {number}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Button variant="primary" className="float-end" id="btn-submit-1" type="submit">Submit rating</Button>
                    </Form>
                </Modal.Body>

            </Modal>

        </div>


    );
}

function ProductsTable(props) {
    const productRows = props.products.map(products =>
        <ProductCard key={products.id} products={products} />
    );
    return (
        <div className="background-div" style={{display: 'flex', flexWrap: 'wrap', backgroundImage: `url(${bgProductImg})`}}>
            {productRows}
        </div>
    );
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
                averageRating
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
                    {/* <h1 style={{textAlign: 'center', fontFamily: 'Fira Code'}}>Product Listings</h1> */}
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