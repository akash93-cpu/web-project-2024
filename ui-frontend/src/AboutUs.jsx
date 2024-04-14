import React from "react";
import "./aboutus.css";
import aboutImage from "../images/about-unsplash.png";

// about us page
export default function AboutUsPage() {
    return (
        <div className="about">
        <h1>About Us</h1>
        <p>
          IT Lite - The leading platform in computer programming and training services.
          </p>
        <div className="about-info">
            <div className="about-img">
                <img src={aboutImage}/>
            </div>
            <div>
            <p> 
                IT Lite is a top leading provider in training services with 
                experienced professionals in the many tech sectors found throughout 
                the world. We are directly registered with the national training and 
                regulations board to ensure customers and clients have the best online
                learning experiences in our community. As a company we place a strong 
                emphasis on enhancing people's skills with respect to coding courses and 
                challenges. 
            </p>
                <a href="/faq"><button id="about-us-button">Have a question? See More {"->"}</button></a>
            </div>
        </div>
    </div>    
    )
}