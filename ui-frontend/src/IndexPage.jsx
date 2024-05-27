import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import Contents from "./Contents.jsx";
import ProductsList from "./App.jsx";
import FAQ from "./FAQs.jsx";
import AboutUsPage from "./AboutUs.jsx";
import Posts from "./Posts.jsx";
import NotFoundPage from "./404Page.jsx";
import SignIn from "./SignInItem.jsx";
import SignInAdmin from './AdminLogin.jsx';
import Registration from './Registration.jsx';
import ContactUsPage from "./ContactUs.jsx";

// index page
export default function Index() {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Contents />} />
            <Route path="/landing" element={<ProductsList />} />
            <Route path="/login" element={<SignIn />}/>
            <Route path="/admin" element={<SignInAdmin />}/> 
            <Route path="/register" element={<Registration />}/>
            <Route path="blog" element={<Posts />}/>
            <Route path="/faq" element={<FAQ />}/>
            <Route path="/about-us" element={<AboutUsPage />}/>
            <Route path="/contact-us" element={<ContactUsPage />}/>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    )
}