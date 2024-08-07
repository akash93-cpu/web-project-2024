import React from "react";
// import axios from "axios";
import graphQLFetchData from "./graphQLFetch.js";
import { useNavigate } from "react-router-dom";
import { Form, FormControl } from 'react-bootstrap';
import { Envelope, BracesAsterisk, Eye, EyeSlash } from 'react-bootstrap-icons';
import toast, { Toaster } from "react-hot-toast";
import '../css/signin.css';
import bgLoginImage from '../images/unsplash-login.png';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            emailState: null,
            visible: false,
            password: '',
        }
    }
    toggleVisibility = () => {
        this.setState((prevState) => ({
            visible: !prevState.visible
        }));
    };


    async handleSubmit(e) {
        e.preventDefault();
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
            const userData = await graphQLFetchData(query, variables);
            console.log("User login data from API -> ", userData);
            // console.log(userData.userLogin.username);
            const token = userData.userLogin.token; // the user token
            const emailData = userData.userLogin.email;
            const userName = userData.userLogin.username;
            console.log(userName);
            if (token) {
                this.setState({ emailState: emailData });
                this.props.navigate('/landing');
                form.reset();
            }
            return userData;
        } catch (err) {
            toast.error("Error logging in! Please verify credentials!", {
                duration: 1500,
                className: 'error-toast',
            });
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
        const { visible, password } = this.state;
        return (
            <>
                <div className="body-login" style={styles.loginBg}>
                    <div class="container-login">
                        <div class="wrapper-login">
                            <div className="title-login"><span>Login</span></div>
                            <Form name="userLogin" className="login-form-main" onSubmit={this.handleSubmit}>
                                <div className="row-login">
                                    <Envelope className="i"></Envelope>
                                    <FormControl id="input-login" type="text" placeholder="Email" required name="email" />
                                </div>
                                <div className="row-login">
                                    <BracesAsterisk className="i"></BracesAsterisk>
                                    <FormControl id="input-login" onChange={(e) => this.setState({ password: e.target.value })}
                                        autoFocus type={visible ? 'text' : 'password'} placeholder="Password" required name="password" minLength={8} maxLength={16} />
                                </div>
                                <button id="show-hide-password-btn-1" type="button" onClick={this.toggleVisibility}>
                                    {visible ? <Eye /> : <EyeSlash />} Password
                                </button>
                                <div className="center-login-button"><button id="submit-button-login" type="submit">Submit</button>
                                </div>
                                <div className="signup-link"><a id="register-link" href="/forgotpassword">Forgot Password</a></div>
                                <div className="signup-link">Not a member? <a id="register-link" href="/register">Signup</a></div>
                            </Form>
                        </div>
                    </div>
                </div>
                <Toaster />
            </>
        );
    }
}

export default function SignInWrapper() {

    const navigate = useNavigate();
    return <SignIn navigate={navigate} />;
}