import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./Navbar.jsx";
// import ProductsList from "./App.jsx";
import Footer from "./Footer.jsx";
// import Contents from "./Contents.jsx";
import Index from "./IndexPage.jsx";

export default function Page() {
    return (
        <div>
            <Navigation />
            <Index />
            <Footer />
        </div>
    );
}

const element = (
    <Router>
        <Page />
    </Router>
);

ReactDOM.render(element, document.getElementById('contents'));

if (module.hot) {
    module.hot.accept();
}