import React from "react";
import image from "../images/unsplash-homepage.png";
import BannerCounter from "./CounterBanner.jsx";
import "../css/contentcss.css";

// homepage
export default function Contents() {
    const styles = {
        tag1 : {
            fontFamily: "Fira Code",
            fontSize: "24px",    
            color: "white",
            position: "absolute",
            top: "37%",
            left: "43%",
            textAlign: "center"
        },
        tag2: {
            fontFamily: "Fira Code",
            fontSize: "24px",    
            color: "white",
            position: "absolute",
            top: "48%",
            left: "39%",
            textAlign: "center"
        },
        buttonSpace: {
            display: "grid",
            placeItems: "center",
            fontFamily: "Fira Code",
            position: "absolute",
            top: "60%",
            left: "45.5%",
        }
    }
    return (
        <>
            <div id="home" style={{ backgroundImage: `url(${image})` }}>
                <div className="effects">
                    <p className="slide-up" style={styles.tag1}>Welcome to IT Lite</p>
                    <span className="effect-2" style={styles.tag2}>Start learning to code today!</span>
                    <a href="/landing" className="link-1" style={styles.buttonSpace}>Proceed to site</a>
                </div>
            </div>
            <div className="banner">
                <h1 class="banner-title">Connecting Students To Developers</h1>
                <p class="banner-description">IT Lite offers every student to work with real software developers 
                    in the programming and software development industry, enabling individuals to get employment 
                    in this field while providing developers an opportunity to showcase thier skills with a more 
                    streamlined and efficient coding experience.
                </p>
                <div class="icon-container">
                    <div class="icon-wrapper">
                        <div class="icon-ring">
                            <span class="icon"><img src="https://cdn-icons-png.flaticon.com/64/3749/3749784.png" alt="Developer" /></span>
                        </div>
                        <span class="icon-text">Develop</span>
                    </div>
                    <div class="icon-wrapper">
                        <div class="icon-ring">
                            <span class="icon"><img src="https://cdn-icons-png.flaticon.com/64/2885/2885427.png" alt="Connect" /></span>
                        </div>
                        <span class="icon-text">Connect</span>
                    </div>
                    <div class="icon-wrapper">
                        <div class="icon-ring">
                            <span class="icon"><img src="https://cdn-icons-png.flaticon.com/64/924/924915.png" alt="Coder" /></span>
                        </div>
                        <span class="icon-text">Code</span>
                    </div>
                    <div class="icon-wrapper">
                        <div class="icon-ring">
                            <span class="icon"><img src="https://cdn-icons-png.flaticon.com/64/4185/4185714.png" alt="E-Learning" /></span>
                        </div>
                        <span class="icon-text">Learn</span>
                    </div>
                </div>
            </div>
            <div>
                <BannerCounter />
            </div>
        </>
    )
}