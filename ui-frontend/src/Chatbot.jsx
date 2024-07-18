import React, { useState } from "react";

export default function Chatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleMessageSubmit = async () => {
        const response = await fetch('http://localhost:5001/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages([...messages, { text: input, sender: 'User' }]);
        setMessages([...messages, { text: data.answer, sender: 'Chatbot' }]);
        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}: </strong>
                        {message.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleMessageSubmit();
                    }
                }}
            />
            <button onClick={handleMessageSubmit}>Send</button>
        </>
    );
}
