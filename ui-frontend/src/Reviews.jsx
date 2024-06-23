import React from "react";
import '../css/reviews.css';
import { Card, Carousel } from 'react-bootstrap';

function ReviewHeader() {
    const styles = {
        mainHeader: {
            display: "grid",
            height: "50vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
        bannerText: {
            fontSize: "28px",
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            textAlign: "center",
            fontFamily: "Fira Code",
        }
    }
    return (
        <div style={styles.mainHeader} className="main-heading">
            <h1 id="blog-text" style={styles.bannerText}>Here resides our dearest client's reviews</h1>
        </div>
    )
}

const CardComponent = ({ title, description }) => {
    return (
      <div >
      <Card className="review-card-div" style={{ width: '18rem', margin: '16px', height: '15rem', marginTop: '50px', fontFamily: 'Fira Code', 
        transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'; // Shadow on hover
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; // Restore shadow
        }}>
        <Card.Body>
          <Card.Title id="review-card-title">{title}</Card.Title>
          <hr />
          <Card.Text id="review-card-description">{description}</Card.Text>
        </Card.Body>
      </Card>
      </div>
    );
  };

  const Corousel = () => {
    return (
      <Carousel data-bs-theme="light">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.inc.com/uploaded_files/image/1920x1080/getty_933383882_2000133420009280345_410292.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>Online e-learning with enhanced study</h5>
            <p>Start your journey as a software programmer today.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.amigoscode.com/assets/thumbnails/courses/functional-programming.webp"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Functional Programming</h5>
            <p>Learn the basics of functional programming and databases.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i.pinimg.com/originals/d4/c1/7d/d4c17d48d9e0a5ac9986887163f435ec.jpg"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Stay updated</h5>
            <p>
              With the latest trends in the realm of computer science.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  
  }

  const GridComponent = () => {
    // Dummy data for cards
    const cards = [
      { id: 1, title: 'David Rey', description: 'Compeleted the Programming 1 course - very satisfactory.' },
      { id: 2, title: 'Alex Mill', description: 'Gained a lot of knowledge using SQL and JS frameworks.' },
      { id: 3, title: 'John Smith', description: 'Started coding in many different programming languages and it was really worth the effort!' },
      { id: 4, title: 'Paul Sanchez', description: 'Learned a lot about software testing and debugging while finishing up the Testing courses.' },
      { id: 5, title: 'Michael Keys', description: 'A must for computer science enthusiasts who want to seek more and upgrade their knowledge in the field.' },
      { id: 6, title: 'Frank Gilbert', description: "Couldn't find a decent course outside this institution so I came here for it." },
      { id: 7, title: 'Anson Strev', description: 'Landed my first job as a junior Software Tester and Programmer using a few coding languages that I acquired from this space.' },
      { id: 8, title: 'Luis Pex', description: 'Definitely reccommend for first-time students who want to enhance their knowledge base in software development.' },
      { id: 9, title: 'Ionis Villdahu', description: 'I really liked the courses that I completed here. It was really informative and enjoyable.' },
      { id: 10, title: 'Carl Scott', description: 'The tutors could be a little bit better with online presentations but overall I really love this field.' },
      { id: 11, title: 'Rufilger Vildam', description: 'Great tutors and with a really friendly owner - a must for some students.' },
      { id: 12, title: 'Kanni Polis', description: 'Obtained my first certificate in software coding practices.' },
    ];
  
    return (
      <div className="container">
        <div className="row row-cols-4">
          {cards.map(card => (
            <div key={card.id} className="col mb-4">
              <CardComponent title={card.title} description={card.description} />
            </div>
          ))}
        </div>
      </div>
    );
  };




export default function Reviews() {

    return (
        <>
        <ReviewHeader />
        <div className="review-body">
            <div className="review-main">
                <GridComponent />
            </div>
          <div className="testimonial-carousel">
            <Corousel />
          </div>
        </div>
        </>
    )
}