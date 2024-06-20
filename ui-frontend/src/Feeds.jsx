import React from "react";
import '../css/feeds.css';
import tweets from './all_tweets.json';
import feedsBg from '../images/feeds-unsplash.jpg';
import Card from 'react-bootstrap/Card';

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
        </div>
    );
}