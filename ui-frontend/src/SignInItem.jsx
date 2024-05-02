import React from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Cookies } from 'react-cookie';
import { Form, FormGroup, FormControl } from 'react-bootstrap';

async function postUserData(query, variables = {}) {
    try {
        const response = await fetch('http://localhost:3000/graphql-server', {
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
                }
            }`
        try {
            const userData = await postUserData(query, variables);
            console.log(userData.userLogin.email);
            console.log(userData.userLogin.token);
            const token = userData.userLogin.token; // the user token
            // const expires = new Date();
            if (token) {
                const expires = new Date(Date.now() + 10 * 1000); // 10 second expiry time
                cookies.set('userToken', token, { path: '/', expires: expires, secure: true });
                this.props.navigate('/landing');
            }
            return userData;
        } catch (err) {
            console.error('Error submitting login data:', err);
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        const cookies = new Cookies();
        cookies.remove('userToken');
    }

    render() {
        return (
            <>
                <div style={{ marginLeft: '25rem', marginRight: '25rem', margin: '5rem', display: 'flexbox', alignContent: 'center', overflow: 'hidden' }}>
                    <Form name="userLogin">
                        <FormGroup>
                            <label>User Email</label>
                            <FormControl autoFocus name="email" />
                        </FormGroup>
                        <FormGroup>
                            <label>Password</label>
                            <FormControl autoFocus name="password" />
                        </FormGroup>
                    </Form>
                    <button type="button" onClick={this.handleSubmit}>Test Submit</button>
                    <button type="button" onClick={this.handleLogout}>Logout</button>
                </div>
            </>
        );
    }
}

export default function SignInWrapper() {
    
    const navigate = useNavigate();
    return <SignIn navigate={navigate} />;
}