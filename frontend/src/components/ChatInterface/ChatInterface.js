/**
 * @fileoverview Main React component for the Talk2Me therapy chatbot application.
 * This component implements a chat interface using the chatscope UI kit,
 * providing real-time interaction with the therapy chatbot.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentication/AuthContext";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Avatar
} from "@chatscope/chat-ui-kit-react";
import { ArrowLeft, Mic, Keyboard } from "lucide-react";
import "./ChatInterface.css";

function ChatInterface() {
  const { user } = useAuth();
  console.log("Current user:", {user});
  const [messages, setMessages] = useState([
    { message: "Hi! I'm Jennifer, Talk2Me's 24/7 AI therapist. What would you like to talk about?", sender: "bot" },
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSelectedMode, setHasSelectedMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // Add recognition state
  const [recognition, setRecognition] = useState(null);
  // Add state for mode change warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return;

    const newMessage = { message: text, sender: "user", timestamp: new Date() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
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
          sessionId: 'default',
          isVoiceMode: isVoiceMode
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
  }, [messages, isVoiceMode]);

  // Update the useEffect for speech recognition to include handleSend
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognition);
      }
    }
  }, [handleSend]); // Add handleSend as a dependency

  // Add toggle recording function
  const toggleRecording = useCallback(() => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  }, [recognition, isRecording]); // Add recognition and isRecording as dependencies

  // Update keyboard event handling to include toggleRecording
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isVoiceMode && event.code === 'Space') {
        event.preventDefault();
        toggleRecording();
      }
    };

    if (isVoiceMode) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isVoiceMode, toggleRecording]); // Add toggleRecording as a dependency

  // Initialize chat after mode selection
  const initializeChat = (mode) => {
    setIsVoiceMode(mode);
    setHasSelectedMode(true);
    setMessages([{ 
        message: `Hi, I'm Jennifer! ${mode ? 'Press space to start speaking.' : 'What\'s on your mind?'}`, 
        sender: "bot" 
    }]);
  };
  
  // Show warning modal when back button is clicked
  const handleBackButtonClick = () => {
    setShowWarningModal(true);
  };
  
  // Confirm going back to mode selection
  const confirmModeChange = () => {
    // Reset any ongoing recordings if in voice mode
    if (isVoiceMode && isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }
    setHasSelectedMode(false);
    setShowWarningModal(false);
  };
  
  // Cancel mode change
  const cancelModeChange = () => {
    setShowWarningModal(false);
  };

  return (
    <div className="chat__container">
      {!hasSelectedMode ? (
        <div className="chat__mode-selection">
          <h1 className="chat__mode-selection-title">Welcome to Talk2Me</h1>
          <p className="chat__mode-selection-subtitle">Choose how you'd like to interact:</p>
          <div className="chat__mode-buttons">
            <button onClick={() => initializeChat(false)} className="chat__mode-button">
              <span className="chat__mode-icon">
                <Keyboard size={32} />
              </span>
              <span className="chat__mode-label">Text Chat</span>
              <span className="chat__mode-description">Type to communicate</span>
            </button>
            <button onClick={() => initializeChat(true)} className="chat__mode-button">
              <span className="chat__mode-icon">
                <Mic size={32} />
              </span>
              <span className="chat__mode-label">Voice Chat</span>
              <span className="chat__mode-description">Speak to communicate</span>
            </button>
          </div>
        </div>
      ) : (
        
        <div className="chat__layout">
          
            <div className="chat__window">
            <MainContainer>
            <button 
                onClick={handleBackButtonClick} 
                className="chat__back-button" 
                title="Go back to chat mode selection"
                aria-label="Change chat mode"
            >
                <ArrowLeft size={18} />
                {isVoiceMode ? <Mic size={16} /> : <Keyboard size={16} />}
                <span>Change Chat Mode</span>
                
            </button>
                <ChatContainer>
                  
                <ConversationHeader>
                    <ConversationHeader.Content userName="Jennifer" />
                    
                </ConversationHeader>
                <MessageList 
                typingIndicator={isTyping ? <TypingIndicator content="Jennifer is thinking..." /> : null}
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
                      avatarPosition={msg.sender === "bot" ? "tl" : undefined}
                      avatarSpacer={msg.sender === "user"}
                    >
                    {msg.sender === "bot" && (
                      <Avatar src="/robot-icon.png" name="Jennifer" />
                    )}
                    <Message.Header sender={msg.sender === "bot" ? "Jennifer" : "You"} />
                    </Message>
                    ))}
                </MessageList>
                {isVoiceMode ? (
                    <div className="voice-controls">
                    <button 
                        onClick={toggleRecording}
                        className={`voice-button ${isRecording ? 'recording' : ''}`}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                    </div>
                ) : (
                    <MessageInput 
                        placeholder="Type your message here..."
                        onSend={handleSend}
                        attachButton={false}
                        sendButton={false}
                        className="message-input"
                    />
                )}
                </ChatContainer>
            </MainContainer>
            </div>
        </div>
      )}
      
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="chat__modal-overlay">
          <div className="chat__warning-modal">
            <div className="chat__warning-icon">⚠️</div>
            <h3 className="chat__warning-modal-title">Change Chat Mode?</h3>
            <p className="chat__warning-modal-text">Your current conversation will be reset if you return to mode selection.</p>
            <div className="chat__modal-buttons">
              <button className="chat__modal-button chat__modal-button--cancel" onClick={cancelModeChange}>
                Cancel
              </button>
              <button className="chat__modal-button chat__modal-button--confirm" onClick={confirmModeChange}>
                Change Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}
export default ChatInterface;