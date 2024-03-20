class Home extends React.Component {
    render() {
        return (
            <div>Welcome to the homepage!</div>
        )
    }
}

function ProductRow(props) {
    const products = props.products;
    return (
        <tr style={{textAlign: 'center'}}>
            <td>{products.product_id}</td>
            <td>{products.title}</td>
            <td>{products.description}</td>
            <td>{products.category}</td>
            <td>{products.rating}</td>
        </tr>
    );
}

function ProductsTable(props) {
    const productRows = props.products.map(products =>
        <ProductRow key={products.id} products={products} />
    );
    return (
        <table className="bordered-table">
            <thead>
                <tr style={{textAlign: 'center'}}>
                    <th>Product ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
        </table>
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

class ProductsList extends React.Component {
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
                <h1>Product Listings</h1>
                <Home />
                <hr />
                <ProductsTable products={this.state.products}/>
                <hr />
                </React.Fragment>
        )
    }
}

const element = <ProductsList />;
ReactDOM.render(element, document.getElementById('contents'));