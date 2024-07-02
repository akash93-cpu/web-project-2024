import React, { useState } from "react";
import graphQLFetchData from "./graphQLFetch.js";

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

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
                           Average Rating: {products.averageRating}/5</Card.Subtitle>
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

function FilterSearch() {

    const [selectedString, setSelectedString] = useState(null);
    const [showModal2, setShowModal2] = useState(false);

    const [searchResults, setSearchResults] = useState({ results: [] });

    const handleCloseModal2 = () => {
        setShowModal2(false);
    };

    const handleStringSelect = async (string) => {
        setSelectedString(string);
        await handleSearchSubmit(string); // Trigger search with the updated selectedString
    }
    
    const handleSearchSubmit = async (selected) => {
        if (!selected) return; // Ensure a category is selected before submitting

        const variables = {
            filter: { category: selected },
        };
        const query = `query ProductFilter($filter: ProductFilterInput!) {
            productFilter(filter: $filter) {
                product_id
                title
                category
                description
                averageRating
            }
        }`;

        try {
            const searchResult = await graphQLFetchData(query, variables);
            if (searchResult) {
                setSearchResults({ results: searchResult.productFilter });
            }
            setShowModal2(true); // Open the modal after successful fetch
            // console.log("data from var", searchResult);
        } catch (err) {
            alert("Filter/Search error!", err);
        }
    }

    return (
        <div className="filter-search" style={{ display: 'flex', flexWrap: 'wrap', backgroundImage: `url(${bgProductImg})` }}>
            <div className="dropdown-search">
                <Form onSubmit={(e) => { e.preventDefault(); }}>
                    <Form.Group>
                        <Dropdown onSelect={handleStringSelect}>
                            <Dropdown.Toggle>
                                {selectedString === null ? 'Filter/Search by category' : selectedString}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {["Programming", "Databases", "Cybersecurity", "Testing"].map((string) => (
                                    <Dropdown.Item key={string} eventKey={string} href="#">
                                        {string}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Form>
            </div>
                        {/* Modal Component */}
                        <Modal show={showModal2} onHide={handleCloseModal2} className="filter-modal">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-search-title">Filter/Search results: {selectedString}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className="filter-table">
                        <thead className="search-table">
                            <tr>
                                <th>product_id</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Average Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.results.map((a => (
                                <tr key={a} className="search-table">
                                    <td>{a.product_id}</td>
                                    <td>{a.title}</td>
                                    <td>{a.description}</td>
                                    <td>{a.averageRating}</td>
                                </tr>
                            )))}
                        </tbody>
                    </Table>
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
                    <FilterSearch />
                    <ProductsTable products={this.state.products} />
                    <hr />
            </React.Fragment>
        )
    }
}