/**
 * @fileoverview Main React component for the Talk2Me therapy chatbot application.
 * This component implements a chat interface using the chatscope UI kit,
 * providing real-time interaction with the therapy chatbot.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import { supabase } from "../../supabase";
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
import { LogOut } from 'lucide-react';
import "./ChatInterface.css";
import SessionHistory from "../SessionHistory/SessionHistory";

function ChatInterface() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  console.log("Current user:", {user});
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([
    { message: "Hi, I'm Talk2Me! What's on your mind?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const storeMessage = async (content, sender) => {
    console.log("Attempting to store message:", { content, sender, userId: user.id, sessionId });
    try {
        const { error: supabaseError } = await supabase
            .from('messages')
            .insert({
                user_id: user.id,
                content,
                sender,
                session_id: sessionId
            });

        if (supabaseError) {
            console.error("Supabase error:", supabaseError);
            throw supabaseError;
        }
        console.log("Message stored successfully");
    } catch (error) {
        console.error('Error storing message:', error);
        throw new Error('Failed to store message');
    }
};

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newMessage = { message: text, sender: "user", timestamp: new Date() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Store user message
      await storeMessage(text, 'user').catch(error => {
        console.error('Failed to store user message:', error);
        // Continue chat flow even if storage fails
      });

      // Get bot response
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId
        })
      });

      const data = await response.json();
      const botMessage = {
        message: data.message,
        sender: "bot",
        timestamp: new Date()
      };

      // Store bot message
      await storeMessage(data.message, 'bot').catch(error => {
        console.error('Failed to store bot message:', error);
        // Continue chat flow even if storage fails
      });

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
      <div className="chat-layout">
        <div className="chat-window">
          <MainContainer>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content userName="Talk2Me" />
                <ConversationHeader.Actions>
                  <button 
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList 
                typingIndicator={
                  isTyping ? <TypingIndicator content="Talk2Me is thinking..." /> : null
                }
              >
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
              <MessageInput 
                placeholder="Type your message here..." 
                onSend={handleSend} 
                attachButton={false} 
              />
            </ChatContainer>
          </MainContainer>
        </div>
        <div className="history-sidebar">
          <SessionHistory />
        </div>
      </div>
    </div>
  );  
}

export default ChatInterface;