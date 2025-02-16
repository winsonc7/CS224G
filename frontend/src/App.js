/**
 * @fileoverview Main React component for the Talk2Me therapy chatbot application.
 * This component implements a chat interface using the chatscope UI kit,
 * providing real-time interaction with the therapy chatbot.
 */

import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import "./App.css";
import therapistSmile from './assets/therapist/Therapist-F-Smile.png';

/**
 * Main application component that renders the chat interface
 * and handles message exchange with the backend server.
 * 
 * @component
 * @returns {JSX.Element} The rendered chat interface
 */
function App() {
  const [messages, setMessages] = useState([
    { message: "Hi, I'm Talk2Me! What's on your mind?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentTherapistImage, setCurrentTherapistImage] = useState(therapistSmile);

  /**
   * Handles sending messages to the backend server and updating the chat UI.
   * 
   * @param {string} text - The message text to send
   * @returns {Promise<void>}
   */
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newMessage = { message: text, sender: "user", timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setIsTyping(true);
    setIsImageLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          sessionId: 'default'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
      
      if (data.therapistImage) {
        setCurrentTherapistImage(data.therapistImage);
      }

      // Updated audio handling
      if (data.audioData) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); // Clean up the URL after playing
        };
        
        audio.play().catch(e => console.error("Audio playback error:", e));
      }

      setMessages([
        ...messages,
        newMessage,
        { message: data.message, sender: "bot", timestamp: new Date() }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...messages,
        { message: "Sorry, I encountered an error. Please try again.", sender: "bot", timestamp: new Date() }
      ]);
    } finally {
      setIsTyping(false);
      setIsImageLoading(false);
    }
  };

  // Add image load handler
  const handleImageLoad = (e) => {
    console.log('New therapist image loaded:', {
      dimensions: {
        width: e.target.naturalWidth,
        height: e.target.naturalHeight
      },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="app-container">
      <div className="image-box">
        <div className="therapist-image-frame">
          <img 
            src={currentTherapistImage} 
            alt="AI Therapist"
            className={`therapist-image ${isImageLoading ? 'loading' : ''}`}
            onLoad={handleImageLoad}
          />
        </div>
      </div>
      <div className="chat-window">
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Content 
                userName="Talk2Me"
              />
            </ConversationHeader>
            <MessageList 
              typingIndicator={isTyping ? <TypingIndicator content="Talk2Me is thinking..." /> : null}
              className="message-list"
            >
              {messages.map((msg, i) => (
                <Message 
                  key={i}
                  model={{
                    message: msg.message,
                    sender: msg.sender,
                    direction: msg.sender === "user" ? "outgoing" : "incoming",
                    position: "single"
                  }}
                >
                  <Message.Header sender={msg.sender === "bot" ? "Talk2Me" : "You"} />
                </Message>
              ))}
            </MessageList>
            <MessageInput 
              placeholder="Type your message here..."
              onSend={handleSend}
              attachButton={false}
              className="message-input"
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
