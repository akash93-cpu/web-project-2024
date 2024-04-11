import React, { useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import image_faq from "../images/faq-unsplash.png";

// faq page
export default function FAQ() {

    const styles = {
        divFAQImage: {
            backgroundImage: `url(${image_faq})`,
            paddingLeft: "5rem",
            paddingRight: "5rem",
        }
    }

    const [activeKey, setActiveKey] = useState("0");

    const sections = [
        {
            title: "How do I register for a course?",
            content: `Registration is a simple process - add the COURSE_ID to the subject line
            of your email together with all your documents(incl. proof of payment, national ID copy) to registration@ITLite.com`
        },
        {
            title: "How long is a course?",
            content: `This will entirely depend on you as the student as to the time length you provide us with.`,
        },
        {
            title: "Will I receive a certificate/graduation at the end of each course?",
            content: `Yes. After completing each course you will be awarded with your own certificate 
            of completion.`,
        },
        {
            title: "How do I register on the system and post on the online forum?",
            content: `User registraton is easy on the online platform. Once you successfully register online you 
            can therefore post on forums and be able to discuss course-related content with other users.`,
        },
        {
            title: "What other features does this platform have to offer?",
            content: `Some of which are Twitter news feeds from the company and also small quizzes that 
            users & students can attempt.`,
        }
    ];

    const handleAccordionClick = (index) => {
        setActiveKey(activeKey ===
            index ? null : index);
    };

    return (
        <div style={styles.divFAQImage}>
            <h3 style={{paddingTop: "1em", fontFamily: "Fira Code", color: "whitesmoke"}}>Common FAQ's</h3>
            <div style={{paddingTop: "2em"}}>
            <Accordion style={{paddingBottom: '3em'}} activeKey={activeKey}>
                {sections.map((section, index) => (
                    <Card key={index}>
                        <Card.Header>
                            <Accordion.Header style={{fontFamily: "Fira Code"}}
                                // Convert index to a string
                                eventKey={index.toString()}
                                onClick={
                                    () =>
                                        handleAccordionClick(index.toString())}>
                                {section.title}
                            </Accordion.Header>
                        </Card.Header>
                        <Accordion.Collapse
                            eventKey={index.toString()}>
                            <Card.Body style={{fontFamily: "Fira Code"}}>
                                {section.content}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                ))}
            </Accordion>
            </div>
        </div>
    );
}