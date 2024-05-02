import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import image from "../images/icon.png";

// navbar component
function Navigation() {

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "auto",
    }, 
    mainBar: {
      background: "linear-gradient(45deg, rgba(116,120,130,1) 1%, rgba(215,215,215,0.7511379551820728) 100%)",
    },
    textColors: {
      fontFamily: "Fira Code",
      color: "white",
      textShadow: '2px 2px #B22222',
    },
    linkColors: {
      borderRadius: "1rem",
      fontFamily: "Fira Code",
      color: "DarkSlateGray",
      textShadow: '1px 1px DarkSlateBlue',
    },
    linkText: {
      fontFamily: "Fira Code",
    },
  }
  
  return (
    <Navbar expand="lg" sticky='top' style={styles.mainBar}>
      <Container>
        <Navbar.Brand href="/" style={styles.textColors}><img src={image}/>
        <span className="text-link"> IT Lite</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={styles.nav}>
            <Nav.Link href="/login" id="link-1" style={styles.linkColors}>Login|Register</Nav.Link>
            <Nav.Link href="#link" id="link-2" style={styles.linkColors}>Blog</Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown" >
              <NavDropdown.Item href="#action/3.1" style={styles.linkText}>Prices</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" style={styles.linkText}>
                Reviews
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3" style={styles.linkText}>Contact</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/about-us" style={styles.linkText}>
                About Us
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;