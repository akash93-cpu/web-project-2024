import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import Contents from "./Contents.jsx";
import ProductsList from "./App.jsx";

const NotFound = () => {
    return (
        <h1 style={{textAlign: 'center'}}>404 ERROR</h1>
    )
}

export default function Index() {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Contents />} />
            <Route path="/landing" element={<ProductsList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>

    )
}