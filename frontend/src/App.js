import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "./App.css"; 

function App() {
  const [messages, setMessages] = useState([
    { message: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { message: text, sender: "user" }];
    setMessages(newMessages);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setMessages([...newMessages, { message: "I'm just a bot!", sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <MainContainer style={{ width: "400px", height: "600px" }}>
        <ChatContainer>
          <MessageList typingIndicator={isTyping ? <TypingIndicator content="Bot is typing..." /> : null}>
            {messages.map((msg, i) => (
              <Message key={i} model={{ message: msg.message, sender: msg.sender, direction: msg.sender === "user" ? "outgoing" : "incoming" }} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type a message..." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default App;
