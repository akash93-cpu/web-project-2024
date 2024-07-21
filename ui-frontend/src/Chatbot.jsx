import React, { useState } from "react";
import "../css/chatbot.css"; // Import your CSS file for styling

export default function Chatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [iconClicked, setIconClicked] = useState(false);

    const handleMessageSubmit = async () => {
        const response = await fetch('http://localhost:5001/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages([...messages, { text: input, sender: 'You' }, { text: data.answer, sender: 'Chatbot' }]);
        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const toggleIcon = () => {
        setIconClicked(!iconClicked); // Toggle the state true/false
    };

    return (
        <>
            <div className="button-container">
                <button className="brutalist-button openai button-1" onClick={() => { toggleChatbot(); toggleIcon(); }}>
                    <div className="bot-logo">
                        <img src={iconClicked ? "https://cdn-icons-png.flaticon.com/64/15862/15862424.png" : "https://cdn-icons-png.flaticon.com/64/1693/1693894.png"} />
                    </div>
                    <div className="button-text">
                        <span>Powered By</span>
                        <span>Node-NLP</span>
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.sender}: </strong>
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="messageBox">
                        <input id="messageInput"
                            type="text"
                            placeholder="Ask me a question..."
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleMessageSubmit();
                                }
                            }}
                        />
                        <button id="sendButton" onClick={handleMessageSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                <path
                                    fill="none"
                                    d="M646.293 331.888L17.7538 
                                    17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                                <path
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="33.67"
                                    stroke="#6c6c6c"
                                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 
                                    331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}