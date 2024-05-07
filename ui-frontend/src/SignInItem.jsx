import React from "react";
// import axios from "axios";
import _fetch from "isomorphic-fetch";
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import { Form, FormControl } from 'react-bootstrap';
import { Envelope, BracesAsterisk } from 'react-bootstrap-icons';
import '../css/signin.css';
import bgLoginImage from '../images/unsplash-login.png';


async function postUserData(query, variables = {}) {
    try {
        const response = await _fetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ query, variables })
        })
        const body = await response.text();
        const result = JSON.parse(body);
        return result.data;
    } catch (err) {
        alert(`Error!`, err);
    }
}

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            emailState: null,
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const cookies = new Cookies();
        const form = document.forms.userLogin;
        const variables = { // variables need to be passed directly, not under 'data'
            email: form.email.value.trim(),
            password: form.password.value.trim(),
        };
        const query = `query userLogin($email: String!, $password: String!) {
                userLogin(email: $email, password: $password) {
                    _id
                    token
                    email
                    username
                }
            }`
        try {
            const userData = await postUserData(query, variables);
            console.log("User login data from API -> ", userData);
            // console.log(userData.userLogin.username);
            const token = userData.userLogin.token; // the user token
            const emailData = userData.userLogin.email;
            if (token) {
                const expires = new Date(Date.now() + 20 * 1000); // 20 second expiry time
                cookies.set('userToken', token, { path: '/', expires: expires, secure: true, httpOnly: false });
                this.setState({ emailState: emailData });
                this.props.navigate('/landing');
            }
            return userData;
        } catch (err) {
            console.error('Error submitting login data:', err);
        }
    }

    render() {
        const styles = {
            loginBg: {
                backgroundImage: `url(${bgLoginImage})`,
                height: "100vh",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",    
            }
        }
        // const { emailState } = this.state;
        return (
            <>
                <div className="body-login" style={styles.loginBg}>
                    <div class="container-login">
                        <div class="wrapper-login">
                            <div className="title-login"><span>Login Form</span></div>
                            <Form name="userLogin" className="login-form-main">
                                <div className="row-login">
                                    
                                    <Envelope className="i"></Envelope>
                                    <FormControl id="input-login" type="text" placeholder="Email" required name="email"/>
                                </div>
                                <div className="row-login">
                                    <BracesAsterisk className="i"></BracesAsterisk>
                                    <FormControl id="input-login" 
                                    autoFocus type="password" placeholder="Password" required name="password" maxLength={16}/>
                                </div>
                                {/* <div class="pass"><a href="#">Forgot password?</a></div> */}
                                <div className="center-login-button">
                                    <button id="submit-button-login" onClick={this.handleSubmit}>Submit</button>
                                </div>
                                <div className="signup-link">Not a member? <a id="register-link" href="/register">Signup now</a></div>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default function SignInWrapper() {
    
    const navigate = useNavigate();
    return <SignIn navigate={navigate} />;
}