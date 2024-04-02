import React from "react";
import image from "../images/unsplash-homepage.png";
import "./contentcss.css";

export default function Contents() {
    const styles = {
        tag1 : {
            display: "block",
            fontFamily: "Fira Code",
            fontSize: "24px",    
            color: "white",
            position: "absolute",
            top: "37%",
            left: "43%",
            textAlign: "center"
        },
        tag2: {
            display: "flex",
            fontFamily: "Fira Code",
            fontSize: "24px",    
            color: "white",
            position: "absolute",
            top: "48%",
            left: "39%",
            textAlign: "center"
        },
        buttonSpace: {
            display: "flex",
            fontFamily: "Fira Code",
            position: "absolute",
            top: "60%",
            left: "48.5%",
        }
    }
    return (
        <div id="home" style={{ backgroundImage: `url(${image})` }}>    
            <div className="effects">
                <p className="slide-up" style={styles.tag1}>Welcome to IT Lite</p>
                <span className="effect-2" style={styles.tag2}>Start learning to code today!</span>
                <button style={styles.buttonSpace}>Enter</button>
            </div>
        </div>
    )
}