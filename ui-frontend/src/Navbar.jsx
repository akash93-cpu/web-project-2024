import React, { useState, useEffect } from 'react';
import _fetch from "isomorphic-fetch";
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import image from "../images/icon.png";

async function logoutFunction(query) {
  try {
      const response = await _fetch('http://localhost:3000/graphql-server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ query })
      })
      const body = await response.text();
      const result = JSON.parse(body);
      // console.log(result.data);
      return result.data;
  } catch (err) {
      alert(`Error!`, err);
  }
}

// navbar component
function Navigation() {

  const [loggedInUser, setLoggedInUser] = useState(null);
  const nav = useNavigate();

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
        console.error('Error for user!', err);
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
  
  const handleLogout = (e) => { // temporary as for now
    e.preventDefault();
    const query = `
    query verifyTokenUser {
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
                  <NavDropdown.Item style={styles.linkText}>Update Password</NavDropdown.Item>
                  <NavDropdown.Item style={styles.linkText} onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              }

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
    </Navbar>
  );
}

export default Navigation;