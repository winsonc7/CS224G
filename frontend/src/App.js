import React, { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Avatar,
  Status,
} from "@chatscope/chat-ui-kit-react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { message: "Hello! I'm your AI assistant. How can I help you today?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Simulate random online status changes
    const interval = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const newMessage = { message: text, sender: "user", timestamp: new Date() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        message: "I'm processing your request. This is a placeholder response while we develop the actual AI functionality.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([...newMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="app-container">
      <div className="chat-window">
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <Avatar src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%238B5CF6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='20' font-weight='bold'%3EAI%3C/text%3E%3C/svg%3E" name="AI Assistant" style={{ width: 40, height: 40 }} />
              <ConversationHeader.Content 
                userName="AI Assistant"
                info={isOnline ? "Online" : "Offline"}
              />
              <ConversationHeader.Actions>
                <Status status={isOnline ? "available" : "unavailable"} />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList 
              typingIndicator={isTyping ? <TypingIndicator content="AI is thinking..." /> : null}
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
                  <Message.Header sender={msg.sender === "bot" ? "AI Assistant" : "You"} />
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
