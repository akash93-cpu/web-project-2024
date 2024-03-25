import React from "react";
import ReactDOM from "react-dom";
import ProductsList from "./App.jsx";

export default function Page() {
    return (
        <React.Fragment>
            <ProductsList />
        </React.Fragment>
    )
}

const element = <Page />;
ReactDOM.render(element, document.getElementById('contents'));

if (module.hot) {
    module.hot.accept();
}