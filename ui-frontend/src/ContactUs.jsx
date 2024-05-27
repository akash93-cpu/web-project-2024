import React from "react";
import '../css/contactus.css';
import contactUsImg from '../images/contactus-unsplash.jpg';

export default function ContactUsPage() {

    const styles = {
        mainDiv: {
            backgroundImage: `url(${contactUsImg})`,
            display: "grid",
            height: "100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        }
    }

    return (
        <>
        <div className="contact-us-main" style={styles.mainDiv}>
        <div class="container-contact-us">
        <h1 id="h1-contact">Contact Us</h1>
      <form action="https://fabform.io/f/{insert-form-id-here}" method="post">
            <div class="form-group">
                <label id="label-contact" for="name">Name:</label>
                <input id="input-contact" type="text" name="name" required />
            </div>
            <div class="form-group">
                <label id="label-contact" for="email">Email:</label>
                <input id="input-contact" type="email" name="email" required />
            </div>
            <div class="form-group">
                <label id="label-contact" for="message">Message:</label>
                <textarea id="message-contact" name="message" required></textarea>
            </div>
            <div class="form-group">
                <button id="contact-us-btn" type="submit">Submit</button>
            </div>
        </form>
    </div>
        </div>
        </>
    )
}