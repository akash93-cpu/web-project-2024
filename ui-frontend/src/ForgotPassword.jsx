import React from "react";
import graphQLFetchData from "./graphQLFetch.js";
import { Form, Button, Container, Row, Col, FormControl } from 'react-bootstrap';
import bgLoginImage from '../images/unsplash-login.png';
import '../css/othercss.css';

export default function ForgotPassword() {

    const styles = {
        forgotPasswordStyle: {
            backgroundImage: `url(${bgLoginImage})`,
            height: "100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = document.forms.forgotUserPassword;
        const variables = {
            email: form.email.value.trim(),
        }
        const query = `query ForgotUserPassword($email: String) {
  forgotUserPassword(email: $email) {
    username
  }
}`
        try {
            await graphQLFetchData(query, variables);
            form.reset();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="body-login" style={styles.forgotPasswordStyle}>
                <div className="forgot-password-div">
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col md="6">
                                <Form onSubmit={handleSubmit} name="forgotUserPassword">
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <FormControl type="email" placeholder="Enter email" name="email" />
                                        <Form.Text className="text-muted">
                                            We'll send you a password reset link to this email.
                                        </Form.Text>
                                    </Form.Group>
                                    <Button id="submit-forgotpassword-btn" variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}