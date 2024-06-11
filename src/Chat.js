import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';

const notificationSound = new Audio('/websocket-client/public/notification.mp3'); // Path to your notification sound file
// notificationSound.play();

const socket = io('http://localhost:5000');

const ChatContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const MessageContainer = styled.div`
    margin-bottom: 10px;
`;

const MessageText = styled.p`
    margin: 5px 0;
    color:black;
`;

const MessageDetails = styled.div`
    font-size: 12px;
    color: #666;
`;

const playNotificationSound = () => {
    notificationSound.play();
};

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState('');

    const [notificationSound] = useState(new Audio('/websocket-client/public/notification.mp3'));

    const playNotificationSound = () => {
        notificationSound.play();
    };


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            playNotificationSound(); // Play notification sound on message reception
        });

        socket.on('typing', (username) => {
            setTypingUser(username);
        });

        socket.on('stopTyping', () => {
            setTypingUser('');
        });

        return () => {
            socket.off('message');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, []);

    const handleTyping = () => {
        clearTimeout(timeout);
        socket.emit('typing', 'User');

        timeout = setTimeout(() => {
            socket.emit('stopTyping');
        }, 2000);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('message', { text: message });
        setMessage('');
        socket.emit('stopTyping');
    };

    let timeout;



    return (
        <ChatContainer>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={playNotificationSound}
                />
                <button type="submit">Send</button>
            </form>
            {typingUser && <p>{typingUser} is typing...</p>}
            {messages.map((msg, index) => (
                <MessageContainer key={index}>
                    <MessageText>{msg.text}</MessageText>
                    <MessageDetails>
                        <span>{msg.deviceName}</span> - <span>{new Date(msg.timestamp).toLocaleString()}</span>
                    </MessageDetails>
                </MessageContainer>
            ))}
        </ChatContainer>
    );
};

export default Chat;
