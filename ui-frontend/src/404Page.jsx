import React from 'react';
import backgroundImage from '../images/404-error-page.png';
import "./404css.css";

export default function NotFoundPage() {
    const styles = {
        divImage: {
            display: "flexbox",
            height: "100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${backgroundImage})`
        },
        notFoundTag: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            textAlign: "center",
            color: "antiquewhite",
            fontFamily: "Fira Code",
        }
    }

    return (
        <div style={styles.divImage}>
            <h1 className='error-tag' style={styles.notFoundTag}>404 ERROR</h1>
        </div>
    );
}