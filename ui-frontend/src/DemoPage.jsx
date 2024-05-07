import React from "react";
import Button from "react-bootstrap/Button";
import headerImage from "../images/header-unsplash.png";
import { InfoCircle } from "react-bootstrap-icons";
import "../css/demopagecss.css";

// header 
export default function HeaderContent() {
    const style = {
        headerDiv: {
            backgroundImage: `url(${headerImage})`,
            display: "grid",
            height: "50vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
        bannerText: {
            fontSize: "28px",
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            textAlign: "center",
            fontFamily: "Fira Code",
            color: "white",
        },
        bannerText2: {
            fontSize: "21px",
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            textAlign: "center",
            fontFamily: "Fira Code",
            color: "white",
        },
        button1: {
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            fontFamily: "Fira Code",
        },
        icon: {
            marginBottom: "2px",
        }
    }
    return (
        <div style={style.headerDiv}>
            <h1 className="banner-tag-1" style={style.bannerText}>Browse Courses</h1>
            <h2 className="banner-tag-2" style={style.bannerText2}>Find a course that perfectly suits your needs</h2>
            <div style={style.button1}>
                <a href="/faq"><Button id="button-1"><InfoCircle id="icon-1" style={style.icon} size={25} /> Find out more</Button></a>
            </div>
        </div>
    )
}