import { useState } from "react";
import { Send, Bot, User, X, FileText } from "lucide-react";
import axios from "axios";
import "./ChatBox.css";

export default function ChatBox({ pdfText }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestedQuestions = [
    "What is the main topic of this document?",
    "Can you summarize the key points?", 
    "What are the conclusions or recommendations?"
  ];

  const handleAsk = async (customQuestion = null) => {
    const questionToAsk = customQuestion || question;
    if (!questionToAsk.trim()) return;

    setLoading(true);
    setShowSuggestions(false); // Hide suggestions after first question
    
    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { type: 'user', content: questionToAsk }
    ]);
    
    if (!customQuestion) {
      setQuestion("");
    }

    try {
      const res = await axios.post("http://localhost:8000/chat/", {
        question: questionToAsk,
        context: pdfText,
      });

      // Add bot response
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: res.data.response }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: "❌ Failed to get answer." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleAsk(suggestion);
  };

  return (
    <div className="chat-container">
      {/* Document Ready Banner */}
      {showSuggestions && (
        <div className="document-ready-banner">
          <div className="banner-content">
            <div className="banner-header">
              <FileText className="document-icon" size={24} />
              <h2>Your document is ready!</h2>
              <button 
                className="close-banner"
                onClick={() => setShowSuggestions(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p className="banner-subtitle">
              You can now ask questions about your document. For example:
            </p>
            <div className="suggested-questions">
              {suggestedQuestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  • "{suggestion}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className="chat-message-block">
              {msg.type === 'user' ? (
                <div className="chat-user-question">
                  <div className="user-message">
                    <User size={16} />
                    <p>{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="chat-bot-answer">
                  <div className="chat-bot-icon">
                    <Bot size={20} />
                  </div>
                  <div className="chat-bot-text">
                    <p>{msg.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="chat-bot-answer">
              <div className="chat-bot-icon">
                <Bot size={20} />
              </div>
              <div className="chat-bot-text">
                <div className="loading-container">
                  <div className="spinner"></div>
                  <span>Analysing...this might take few seconds...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask about the document..."
            disabled={loading}
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="chat-send-btn"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}