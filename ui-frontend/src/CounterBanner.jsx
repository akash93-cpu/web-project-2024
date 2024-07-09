import React, { useState, useEffect, useRef } from "react";
import graphQLFetchData from "./graphQLFetch.js";
import { CodeSlash, People, PersonGear, CardText } from 'react-bootstrap-icons';
import { Container, Row, Col } from 'react-bootstrap';
import CountUp from 'react-countup';

import '../css/othercss.css';
import bgImage from '../images/counter-bg-unsplash.jpg';

function useOnScreen(options) { // custom hook for activating on scroll-down
    const ref = useRef();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(ref.current);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
}

export default function BannerCounter() {
    const [coursesCount, setCoursesCount] = useState(0);
    const [countUsers, setCountUsers] = useState(0);
    const [countAdmins, setCountAdmins] = useState(0);
    const [countPosts, setCountPosts] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const query = `query CountProducts {
                    countProducts {
                        count
                    }
                }`;

            try {
                const data = await graphQLFetchData(query);
                if (data && data.countProducts) {
                    setCoursesCount(data.countProducts.count);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    useEffect(() => {
        async function fetchDataUsers() {
            const query = `query CountAllUsers {
  countAllUsers {
    countUsers
  }
}`;
            try {
                const data = await graphQLFetchData(query);
                if (data && data.countAllUsers) {
                    setCountUsers(data.countAllUsers.countUsers);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchDataUsers();
    }, [])

    useEffect(() => {
        async function fetchDataAdmin() {
            const query = `query CountAllAdmins {
  countAllAdmins {
    countAdmins
  }
}`;
            try {
                const data = await graphQLFetchData(query);
                if (data && data.countAllAdmins) {
                    setCountAdmins(data.countAllAdmins.countAdmins);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchDataAdmin();
    }, []);

    useEffect(() => {
        async function fetchDataPosts() {
            const query = `query CountAllPosts {
  countAllPosts {
    countPosts
  }
}`;
            try {
                const data = await graphQLFetchData(query);
                if (data && data.countAllPosts) {
                    setCountPosts(data.countAllPosts.countPosts);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchDataPosts();
    }, []);

    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

    const counterData = [
        { icon: <CodeSlash id="counter-icons" size={52} />, value: coursesCount, label: 'Courses' },
        { icon: <People id="counter-icons" size={52} />, value: countUsers, label: 'Users' },
        { icon: <PersonGear id="counter-icons" size={52} />, value: countAdmins, label: 'Admins' },
        { icon: <CardText id="counter-icons" size={52} />, value: countPosts, label: 'Posts' },
    ];

    return (
        <>
            <div className="counter-div" ref={ref}>
                <Container fluid className="bg-light py-5" id="counter-container" style={{ backgroundImage: `url(${bgImage})` }}>
                    <Row className="text-center">
                        {counterData.map((item, index) => (
                            <Col key={index} xs={6} md={3} className="mb-4 mb-md-0">
                                <div className="text-primary mb-3">{item.icon}</div>
                                <h2 className="font-weight-bold" style={{ fontSize: '39px' }}>
                                    {isVisible ? (
                                        <CountUp end={item.value} duration={3.5} />
                                    ) : (
                                        0
                                    )}
                                </h2>
                                <p className="text-muted" style={{ fontSize: '20px' }}>{item.label}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    );
}