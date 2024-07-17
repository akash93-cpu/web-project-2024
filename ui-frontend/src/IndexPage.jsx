import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import Contents from "./Contents.jsx";
import ProductsList from "./App.jsx";
import FAQ from "./FAQs.jsx";
import AboutUsPage from "./AboutUs.jsx";
import Posts from "./Posts.jsx";
import Quiz from "./Quiz.jsx";
import Feeds from "./Feeds.jsx";
import Chatbot from "./Chatbot.jsx";
import Reviews from "./Reviews.jsx";
import SignIn from "./SignInItem.jsx";
import SignInAdmin from './AdminLogin.jsx';
import Registration from './Registration.jsx';
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPasswordComponent from "./ResetPassword.jsx";
import ContactUsPage from "./ContactUs.jsx";
import NotFoundPage from "./404Page.jsx";

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
            <Route path="/forgotpassword" element={<ForgotPassword />}/>
            <Route path="/reset-password/:token" element={<ResetPasswordComponent />}/>
            <Route path="/blog" element={<Posts />}/>
            <Route path="/reviews" element={<Reviews />}/>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/chatbot" element={<Chatbot />}/>
            <Route path="/faq" element={<FAQ />}/>
            <Route path="/about-us" element={<AboutUsPage />}/>
            <Route path="/contact-us" element={<ContactUsPage />}/>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    )
}