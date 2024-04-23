import React from "react";
import "./aboutus.css";
import aboutImage from "../images/about-unsplash.png";
import about_1 from "../images/about-1-unsplash.png";
import about_2 from "../images/about-2-unsplash.png";
import about_3 from "../images/about-3-unsplash.png";

// about us page
export default function AboutUsPage() {
    return (
        <>
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

    <div className="extra-content" style={{fontFamily: 'Fira Code'}}>
    <div class="content-container">
  <div class="col-container">
    <div class="column-one">
      <h1 class="xl-font"><b>What's in it for you?</b></h1>
      <h1 class="l-font"><b>We give you the best online services we can offer by focusing a lot on 
        individual skills such as engaging in practical scenarios in coding courses as well as 
        mentoring you into making the right choices when it comes to choosing a career path.</b></h1>
    </div>
    <div class="column-two">
        <img className="img-extra" src={about_1} width="335" height="471"/>
    </div>
  </div>
</div>

<div class="content-container">
  <div class="col-container">
    <div class="column-two">
      <img className="img-extra" src={about_2} alt="CSS" width="335" height="471" />
    </div>
    <div class="column-one">
      <h1 class="xl-font"><b>Explore more</b></h1>
      <h1 class="l-font"><b>When you have successfully completed a course we provide you with the tools and 
        resources to take on further challenges such as international coding exams in which you 
        could obtain a globally recognised certificate in a variety of coding fields.</b></h1>
    </div>
  </div>
</div>

<div class="content-container">
  <div class="col-container">
    <div class="column-one">
      <h1 class="xl-font"><b>Our passion and history</b></h1>
      <h1 class="l-font"><b>It all started as a small online codebase in 2021 and now we're here. We aim to please our audience which comprises mostly of students and other
        individuals looking to expand their knowledge levels in various activities including the above-mentioned 
        programming choices.</b></h1>
    </div>
    <div class="column-two">
        <img className="img-extra" src={about_3} width="335" height="471" />
    </div>
  </div>
</div>
    </div>
    </>
    
    )
}