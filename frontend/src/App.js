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

function App() {
  const [messages, setMessages] = useState([
    { message: "Hi, I'm Talk2Me! What's on your mind?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
