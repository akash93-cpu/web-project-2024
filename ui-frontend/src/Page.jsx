import React from "react";
import ReactDOM from "react-dom";
import Navigation from "./Navbar.jsx";
// import ProductsList from "./App.jsx";
import Footer from "./Footer.jsx";
import Contents from "./Contents.jsx";

export default function Page() {
    return (
        <React.Fragment>
            <Navigation />
            <Contents />
            {/* <ProductsList /> */}
            <Footer />
        </React.Fragment>
    )
}

const element = <Page />;
ReactDOM.render(element, document.getElementById('contents'));

if (module.hot) {
    module.hot.accept();
}