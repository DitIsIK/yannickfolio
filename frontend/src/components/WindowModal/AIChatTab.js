import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../styles/AIChatTab.css";

const API_URL = process.env.REACT_APP_API_URI;

// Suggested questions to display on the intro screen.
const suggestedQuestions = [
  "What projects have you worked on?",
  "Tell me about your experience.",
  "What skills do you excel in?",
  "How did you start your career?",
  "What are your future goals?",
];

const AIChatTab = () => {
  // Chat state, loading, and query.
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  // Initial welcome state.
  const [showIntro, setShowIntro] = useState(true);

  // Ref to the container so we can auto-scroll.
  const chatContainerRef = useRef(null);

  // Smoothly scroll to latest message when chatHistory changes.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Hide intro state after 6 seconds or once the user starts typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSuggestionClick = (question) => {
    setQuery(question);
    setShowIntro(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    // Clear the intro immediately.
    setShowIntro(false);

    // Add the user's query as a message.
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedQuery,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      // Make the API call to your backend endpoint.
      const response = await axios.post(`${API_URL}/ai/ask-chat`, {
        query: trimmedQuery,
      });
      // Create the AI answer message.
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.data.answer,
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing query:", error);
      const errorMsg = {
        id: Date.now() + 2,
        sender: "ai",
        text: "Sorry, there was an error processing your query.",
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="chat-title">Kartavya's ChatBot</h1>
      </header>
      <div className="chat-box" ref={chatContainerRef}>
        {showIntro ? (
          <div className="intro-section">
            <div className="intro-message">
              Hi there! I’m Kartavya’s ChatBot. I can help you explore my
              portfolio and answer your questions.
            </div>
            <div className="suggestions">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        {loading && (
          <div className="message ai-message loading-message">
            <div className="spinner"></div>
            Loading...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me something..."
          className="chat-input"
          disabled={loading}
        />
        <button type="submit" className="chat-button" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default AIChatTab;
