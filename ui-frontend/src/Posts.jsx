import React, { useState } from "react";
import blogHeaderImage from '../images/blog-unsplash.jpg';
import _fetch from "isomorphic-fetch";
import Card from 'react-bootstrap/Card';
import { NodePlus, Pencil, Trash } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../css/blogcss.css';
import blogBgImage from '../images/blog-bg-unsplash.jpg';

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
            <h1 id="blog-text" style={styles.blogBannerText}>Welcome to our blog feed. A place where all users share ideas and thoughts.</h1>
        </div>
    )
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}
  
async function graphQLFetchData(query, variables = {}) {
    try {
        const response = await _fetch('http://localhost:3000/graphql-server', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body);
        console.log("API data:", result);

        if (result.errors) {
            console.log(result.errors);
        }
        return result.data;
    } catch (e) {
        alert(`Error getting data from server: ${e.message}`);
    }
}

function PostCards(props) {

    const [isHovered, setIsHovered] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handlePostUpdate = async (e) => {
        e.preventDefault();
        const form = document.forms.updateUserPost;
        const variables = { 
            postID: posts.postID,
            title: form.title.value.trim(),
            content: form.content.value.trim(),
        };
        const query = `mutation updateUserPost($postID: String!, $title: String!, $content: String!) {
            updateUserPost(postID: $postID, changes: {
              title: $title,
              content: $content,
            }) {
              postID
              title
              content
            }
          }`
          try {
            await graphQLFetchData(query, variables);
            // handleClose();
            window.location.reload();
          } catch(err) {
            throw err;
          } 
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleEditClick = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const styles = {
        cardDiv: {
            display: 'flex',
            alignItems: 'center',
            flex: '1',
            margin: '2.5rem',
            justifyContent: 'center',
            height: '100vh',
        },
        mainDiv: {
            display: 'flex',
            alignContent: 'center',
            marginLeft: '3.5rem',
            marginTop: '-200px',
        },
    }
    const posts = props.posts;
    const formattedDate = formatDate(posts.createdAt);

        return (
        <div className="main-div-blog-card" style={styles.mainDiv}>
            <div className="card-div" style={styles.cardDiv}>
                <Card className="blog-card-single" onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} style={{ width: '15rem', height: '15rem' }}>
                    <Card.Body>
                        <Card.Title style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '16px' }}>
                           Title: {posts.title}</Card.Title>
                        <hr style={{ margin: '25px -17px' }} />
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '14px', fontWeight: 'bold' }}>
                            {posts.content}</Card.Subtitle>
                        <Card.Text style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '11px', marginTop: '25px' }}>
                            Date: {formattedDate}</Card.Text>
                        <Card.Subtitle style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '12px' }}>
                            By: {posts.author}</Card.Subtitle>
                    {isHovered &&
                        <Button className="float-end" id="edit-post-btn" onClick={() => handleEditClick(props.posts)}><Pencil size={15} /></Button>
                        }
                    {isHovered &&
                    <Button id="edit-post-btn"><Trash size={15}/></Button>
                    }
                    </Card.Body>
                </Card>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="post-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post {'{'}{posts.postID}{'}'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form name="updateUserPost" onSubmit={handlePostUpdate}>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>{selectedPost && posts.title}</Form.Label>
                            <Form.Control
                                name="title"
                                placeholder="Enter a new title"
                                autoFocus
                                required
                                maxLength={15}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>{selectedPost && posts.content}</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter new content" required maxLength={50} name="content" rows={2} />
                        </Form.Group>
                        <Button variant="primary" className="float-end" type="submit">
                                Edit Now
                            </Button>

                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
}

function PostTable(props) {
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePost = async (e) => {
        e.preventDefault();
        const form = document.forms.createBlog;
        const variables = { 
            title: form.title.value.trim(),
            content: form.content.value.trim(),
        };
        const query = `mutation createBlog($title: String!, $content: String!) {
            createBlog(blogInput: {
              title: $title
              content: $content
            }) {
              title
              content
              createdAt
            }
          }`
          try {
            await graphQLFetchData(query, variables);
            handleClose();
            window.location.reload();
          } catch(err) {
            throw err;
          } 
    }
    
    const postRows = props.posts.map(posts =>
        <PostCards key={posts.id} posts={posts} />);
    return (
        <>
        <div style={{ backgroundImage: `url(${blogBgImage})` }}>
            <button id="create-post-button" onClick={handleOpen}>
                <NodePlus id="create-icon" className="icon-create" size={25}/>
                Create New Post</button>
                <div className="blog-div-main">
                    {postRows}
                </div>
                
                <Modal className="post-modal" show={open} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Create A Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form name="createBlog" onSubmit={handlePost}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    name="title"
                                    autoFocus
                                    required
                                    maxLength={15}
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Post content</Form.Label>
                                <Form.Control as="textarea" required maxLength={50} name="content" rows={2} />
                            </Form.Group>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" className="float-end" type="submit">
                                Create Now
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

        </div>
        </>
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
                postID
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