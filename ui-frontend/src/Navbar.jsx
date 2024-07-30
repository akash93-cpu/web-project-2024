import React, { useState, useEffect } from 'react';
import { logoutFunction } from './graphQLFetch.js';
import { useNavigate } from 'react-router-dom';
import graphQLFetchData from "./graphQLFetch.js";

import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { Form, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import toast, { Toaster } from "react-hot-toast";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import image from "../images/icon.png";
import "../css/othercss.css";

// navbar component
function Navigation() {

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.forms.updateUsername;
    const variables = {
      updatedUsername: form.username.value.trim(),
    }
    const query = `mutation UpdateUsername($updatedUsername: String!) {
      updateUsername(updatedUsername: $updatedUsername) {
      username
      }
    }`
    try {
      await graphQLFetchData(query, variables);
      form.reset();
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      toast.error(`${error}`, 
        { duration: 1500, className: 'error-toast' }
      )
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };


  useEffect(() => {
    const getUser = async () => {
      const query = `query CurrentLoggedInUser {
        currentLoggedInUser {
          userName
        }
      }`;

      try {
        const data = await logoutFunction(query);
        if (data) {
          // console.log("Current logged in user:", data.currentLoggedInUser.userName);
          setLoggedInUser(data.currentLoggedInUser.userName);
        } else {
          // console.log("No user logged in!");
          setLoggedInUser(null);
        }
      } catch (err) {
        console.error('Error getting user data!', err);
        clearInterval(interval); // Clear interval on error
      }
    };

    getUser(); // Initial fetch

    const interval = setInterval(getUser, 1000); // Fetch every t second(s)

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [setLoggedInUser]);
  
  const styles = {
    nav: {
      display: "flexbox",
      justifyContent: "center",
      marginLeft: 'auto',
    }, 
    mainBar: {
      background: "linear-gradient(32deg, rgba(122,142,150,0.9108018207282913) 52%, rgba(250,0,223,0.22452731092436973) 100%)",
      backdropFilter: "blur(0.8px)",
    },
    textColors: {
      fontFamily: "Fira Code",
      color: "white",
      textShadow: '2px 2px #B22222',
    },
    linkColors: {
      borderRadius: "1rem",
      fontFamily: "Fira Code",
      color: "BlanchedAlmond",
      textShadow: '2px 2px DeepPink',
    },
    linkText: {
      fontFamily: "Fira Code",
    },
  }
  
  const handleLogout = (e) => { // temporary as for now
    e.preventDefault();
    const query = `query verifyTokenUser {
      verifyTokenUser(token: "null") {
        _id
        email
      }
    }`
    logoutFunction(query);
    nav('/login');
  }

  return (
    <Navbar expand="lg" sticky='top' style={styles.mainBar}>
      <Container>
        <Navbar.Brand href="/" style={styles.textColors}><img src={image}/>
        <span className="text-link"> IT Lite</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className='navbar-links' style={styles.nav}>
            <Nav className="me-auto">

              {!loggedInUser &&
                <Nav.Link href="/login" id="link-1" style={styles.linkColors}>Login|Register</Nav.Link>
              }

              {loggedInUser &&
                <NavDropdown title={loggedInUser} id="basic-nav-dropdown">
                  <NavDropdown.Item style={styles.linkText} onClick={setShowModal}>Update your details</NavDropdown.Item>
                  <NavDropdown.Item style={styles.linkText} onClick={handleLogout}>Logout</NavDropdown.Item>
                  <Modal show={showModal} onHide={handleCloseModal} className='update-modal'>
                    <Modal.Header closeButton>
                      <Modal.Title id='title-update'>Update Username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className='update-modal-form'>
                        <Form name="updateUsername" onSubmit={handleSubmit}>
                          <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter new username" name="username" />
                          </Form.Group>
                          <Button type="submit" className='float-end mt-3'>Submit</Button>
                        </Form>
                      </div>
                    </Modal.Body>
                  </Modal>
                </NavDropdown>}

              <Nav.Link href="/blog" id="link-2" style={styles.linkColors}>Blog</Nav.Link>
              <NavDropdown title="More" id="basic-nav-dropdown" >
                <NavDropdown.Item href="/feeds" style={styles.linkText}>Feeds</NavDropdown.Item>
                <NavDropdown.Item href="/reviews" style={styles.linkText}>
                  Reviews
                </NavDropdown.Item>
                <NavDropdown.Item href="/contact-us" style={styles.linkText}>Contact Us</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/about-us" style={styles.linkText}>
                  About Us
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

          </div>
        </Navbar.Collapse>
      </Container>
      <Toaster />
    </Navbar>
  );
}

export default Navigation;