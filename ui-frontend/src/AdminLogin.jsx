import React from "react";
// import axios from "axios";
import _fetch from "isomorphic-fetch";
import { useNavigate } from "react-router-dom";
import { Form, FormControl } from 'react-bootstrap';
import { Envelope, BracesAsterisk, Eye, EyeSlash } from 'react-bootstrap-icons';
import '../css/signin.css';
import bgLoginImage from '../images/admin-unsplash.jpg';

async function postAdminData(query, variables = {}) {
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

class SignInAdmin extends React.Component {
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
        const form = document.forms.adminLogin;
        const variables = { // variables need to be passed directly, not under 'data'
            email: form.email.value.trim(),
            password: form.password.value.trim(),
        };
        const query = `query adminLogin($email: String!, $password: String!) {
                adminLogin(email: $email, password: $password) {
                    _id
                    email
                    token
                }
            }`
        try {
            const adminData = await postAdminData(query, variables);
            console.log("Admin login data from API -> ", adminData);
            // console.log(adminData.adminLogin.username);
            const token = adminData.adminLogin.token; // the user token
            const emailData = adminData.adminLogin.email;
            console.log(emailData);
            if (token) {
                this.setState({ emailState: emailData });
                this.props.navigate('/landing');
                form.reset();
            }
            return adminData;
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
            },
            adminDivButton: {
                marginTop: '35px',
            }
        }
        // const { emailState } = this.state;
        const { visible, password } = this.state;
        return (
            <>
                <div className="body-login" style={styles.loginBg}>
                    <div class="container-login">
                        <div class="wrapper-login">
                            <div className="title-login-admin"><span>Admin Login Portal</span></div>
                            <Form name="adminLogin" className="login-form-main" onSubmit={this.handleSubmit}>
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
                                {/* <div class="pass"><a href="#">Forgot password?</a></div> */}
                                <div className="center-login-button"><button id="submit-button-login" type="submit" style={styles.adminDivButton}>Submit</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default function SignInAdminWrapper() {

    const navigate = useNavigate();
    return <SignInAdmin navigate={navigate} />;
}