/**
 * @fileoverview Main React component for the Talk2Me therapy chatbot application.
 * This component implements a chat interface using the chatscope UI kit,
 * providing real-time interaction with the therapy chatbot.
 */

import React, { useState } from "react";
import { useAuth } from "../Authentication/AuthContext";  // Import authentication context
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Button,
} from "@chatscope/chat-ui-kit-react";
import "./ChatInterface.css";

/**
 * Main application component that renders the chat interface
 * and handles message exchange with the backend server.
 * 
 * @component
 * @returns {JSX.Element} The rendered chat interface
 */
function App() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState([
    { message: "Hi, I'm Talk2Me! What's on your mind?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Handles sending messages to the backend server and updating the chat UI.
   * 
   * @param {string} text - The message text to send
   * @returns {Promise<void>}
   */
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newMessage = { message: text, sender: "user", timestamp: new Date() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: 'default'
        })
      });

      const data = await response.json();
      const botMessage = {
        message: data.message,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        message: "Sorry, I'm having trouble connecting to the server.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
        <div className="chat-window">
          <MainContainer>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content userName="Talk2Me" />
              </ConversationHeader>
              <MessageList typingIndicator={isTyping ? <TypingIndicator content="Talk2Me is thinking..." /> : null}>
                {messages.map((msg, i) => (
                  <Message
                    key={i}
                    model={{
                      message: msg.message,
                      sender: msg.sender,
                      direction: msg.sender === "user" ? "outgoing" : "incoming",
                      position: "single",
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput placeholder="Type your message here..." onSend={handleSend} attachButton={false} />
            </ChatContainer>
          </MainContainer>
        </div>
    </div>
  );
}

export default App;
