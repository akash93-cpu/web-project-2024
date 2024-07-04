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
        <div>
            <BannerCounter />
        </div>
        </>
    )
}