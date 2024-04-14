import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import Contents from "./Contents.jsx";
import ProductsList from "./App.jsx";
import FAQ from "./FAQs.jsx";
import AboutUsPage from "./AboutUs.jsx";
import NotFoundPage from "./404Page.jsx";

// index page
export default function Index() {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Contents />} />
            <Route path="/landing" element={<ProductsList />} />
            <Route path="/faq" element={<FAQ />}/>
            <Route path="/about-us" element={<AboutUsPage />}/>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    )
}