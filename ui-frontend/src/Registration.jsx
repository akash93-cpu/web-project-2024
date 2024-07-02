import React from "react";
import graphQLFetchData from "./graphQLFetch.js";
import { useNavigate } from "react-router-dom";
import { Form, FormControl } from 'react-bootstrap';
import "../css/register.css";

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.createUser;
        const variables = { // variables need to be passed directly, not under 'data'
            email: form.email.value.trim(),
            password: form.password.value.trim(),
            confirm: form.confirm.value.trim(),
            username: form.username.value.trim(),
        };
        const query = `mutation createUser($email: String!, $password: String!, $confirm: String!, $username: String!){
            createUser(userInput: {
              email: $email,
              password: $password,
              confirm: $confirm,
              username: $username,
            }) {
              _id
              token
              email
            }
          }`
          try {
            await graphQLFetchData(query, variables);
            this.props.navigate("/login");
          } catch (err) {
            throw err;
          }
    }

    render(){
        return (
            <>
            <div className="registration-body">
                <div className="p-tag-class">
                    <p id="top-tag">Register a free account {">>"} Enhance your experience.</p>
                </div>
                    <div className="wrapper-register">
                        <h2 id="r-text">Registration</h2>
                        <Form name="createUser" className="form-register" onSubmit={this.handleSubmit}>
                            <div className="input-box">
                                <FormControl id="input-r" name="username" type="text" placeholder="Enter a username" required />
                            </div>
                            <div className="input-box">
                                <FormControl id="input-r" name="email" type="text" placeholder="Enter your email" required />
                            </div>
                            <div className="input-box">
                                <FormControl id="input-r" name="password" type="password" placeholder="Create password" required maxLength={16}/>
                            </div>
                            <div className="input-box">
                                <FormControl id="input-r" name="confirm" type="password" placeholder="Confirm password" required maxLength={16}/>
                            </div>
                            <div className="center-register-button">
                            <button id="register-button" type="submit">Register as User</button>
                            </div>
                            <div className="text">
                                <h3 id="h3-r-tag">Already have an account? <a id="link-to" href="/login">Login</a></h3>
                            </div>
                        </Form>
                    </div>
            </div>
            </>
        )
    }
}

export default function RegisterWrapper() {
    const navigate = useNavigate();
    return <Registration navigate={navigate} />
}