import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation() {

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "auto",
    }, 
    mainBar: {
      background: "linear-gradient(45deg, rgba(118,139,195,1) 1%, rgba(23,217,182,0.7511379551820728) 43%)",
    },
    textColors: {
      fontFamily: "Courier New",
      color: "white",
      textShadow: '2px 2px #B22222',
    },
    linkColors: {
      fontFamily: "Courier New",
      color: "DarkSlateBlue",
      textShadow: '1px 1px rebeccapurple',
    }
  }
  
  return (
    <Navbar expand="lg" sticky="top" style={styles.mainBar}>
      <Container>
        <Navbar.Brand href="#home" style={styles.textColors}>IT Lite</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={styles.nav}>
            <Nav.Link href="#home" style={styles.linkColors}>Login | Register</Nav.Link>
            <Nav.Link href="#link" style={styles.linkColors}>Blog</Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown" >
              <NavDropdown.Item href="#action/3.1" >Prices</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Reviews
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Contact</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
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