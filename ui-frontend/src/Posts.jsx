import React from "react";
import blogHeaderImage from '../images/blog-unsplash.jpg';
import _fetch from "isomorphic-fetch";
import Card from 'react-bootstrap/Card';
import '../css/blogcss.css';

function BlogHeader() {
    const styles = {
        blogHeader: {
            backgroundImage: `url(${blogHeaderImage})`,
            display: "grid",
            height: "50vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
        blogBannerText: {
            fontSize: "32px",
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            textAlign: "center",
            fontFamily: "Fira Code",
        }
    }   
    return (
        <div style={styles.blogHeader}>
            <h1 id="blog-text" style={styles.blogBannerText}>Welcome to our Blog feed. A place where all users share ideas and thoughts.</h1>
        </div>
    )
}

async function graphQLFetchData(query, variables = {}) {
    try {
        const response = await _fetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("API data: ", result);

        if (result.errors) {
            console.log(result.errors);
        }
        return result.data;
    } catch (e) {
        alert(`Error getting data from server: ${e.message}`);
    }
}

function PostCards(props) {

    const styles = {
        cardDiv: {
            display: 'flex',
            alignItems: 'center',
            flex: '1',
            margin: '2.5rem',
        },
        mainDiv: {
            display: 'flex',
            alignContent: 'center',
            marginLeft: '3.5rem',
        },
    }
    const posts = props.posts;
        return (
        <div className="main-div" style={styles.mainDiv}>
            <div className="card-div" style={styles.cardDiv}>
                <Card className="card-single" style={{ width: '14rem', height: '13rem' }}>
                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '16px' }}>
                           Title {posts.title}</Card.Title>
                        <hr style={{ margin: '25px -17px' }} />
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '14px', fontWeight: 'bold' }}>
                            {posts.content}</Card.Subtitle>
                        <Card.Text style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '11px' }}>
                            Date: {posts.createdAt}</Card.Text>
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '12px' }}>
                            By: {posts.author}</Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

function PostTable(props) {
    const postRows = props.posts.map(posts =>
        <PostCards key={posts.id} posts={posts} />
    );
    return (
        <div className="background-div" style={{display: 'flex', flexWrap: 'wrap'}}>
            {postRows}
        </div>
    );
}

export default class Posts extends React.Component {
    constructor() {
        super();
        this.state = { posts: [] };
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        const query = `query {
            returnAllPosts {
                title
                content
                createdAt
                author
            }
        }`
        const data = await graphQLFetchData(query);
        if (data) {
            this.setState({ posts: data.returnAllPosts });
        }
    }

    render() {
        return (
            <>
            <BlogHeader />
            <PostTable posts={this.state.posts}/>
            </>
        )
    }
}