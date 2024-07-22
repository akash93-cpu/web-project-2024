import React from "react";
import '../css/feeds.css';
import tweets from './all_tweets.json';
import feedsBg from '../images/feeds-unsplash.jpg';
import Card from 'react-bootstrap/Card';
import { Carousel } from 'react-bootstrap';
import ExtraFeedsSection from "./FeedsExtraSection.jsx";

export default function Feeds() {
    
    const twitterData = tweets.slice(0, 9);
    console.log("All tweets: ", twitterData);

    return (
        <div className="feeds-main" style={{backgroundImage: `url(${feedsBg})`}}>
            <div className="body-feeds">
                <p id="p-tag2">Some tweets from the techroom</p>
                <div className="tweet-card">
                {twitterData.map((item, index) => (
                    <Card className="card-t" key={index}>{item.content}</Card>
                ))}
                </div>
            </div>
            
            <div className="feeds-carousel">
                <Carousel>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://massivepixel.io/wp-content/uploads/2022/02/how-to-create-nodejs-rest-api.png" text="First slide" />
                        <Carousel.Caption>
                            <h3>JavaScript API Tutorials</h3>
                            <a style={{color: 'antiquewhite'}} href="https://rapidapi.com/blog/build-rest-api-node-js/">Learn how to build REST APIs with Node.js</a>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://media.licdn.com/dms/image/D5612AQFzPoxxgYLFKw/article-cover_image-shrink_720_1280/0/1710176622623?e=2147483647&v=beta&t=VVGGe0KEMm5HjOiPuV-exREh0udi79v8TCG2cyGvSEc"
                            text="Second slide" />
                        <Carousel.Caption>
                            <h3>Database Design</h3>
                            <a style={{color: 'antiquewhite'}} href="https://www.integrate.io/blog/the-sql-vs-nosql-difference/#:~:text=SQL%20databases%20are%20vertically%20scalable,data%20like%20documents%20or%20JSON.">
                                See and visualize how different databases work</a>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="d-block w-100" src="https://d1m75rqqgidzqn.cloudfront.net/wp-data/2020/11/04235853/iStock-901609212.jpg" text="Third slide" />
                        <Carousel.Caption>
                            <h3>Become A Cybersecurity Expert</h3>
                            <a style={{color: 'antiquewhite'}} href="https://www.mygreatlearning.com/blog/cyber-security-career-path-programming-languages-professional-must-know/">
                                Master the skills that will set yourself as an expert in the cybersecurity space
                            </a>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>

            </div>

                <div>
                    <ExtraFeedsSection />
                </div>
        </div>
    );
}