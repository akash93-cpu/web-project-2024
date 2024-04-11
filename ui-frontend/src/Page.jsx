import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Index from "./IndexPage.jsx";

// render page
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