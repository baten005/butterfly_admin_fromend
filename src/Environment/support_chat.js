import React, { useState, useEffect } from "react";
import "../Styles/chatUi.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dummyChats, setDummyChats] = useState([
    { id: 1, name: "John Doe", lastMessage: "Hello!", peerId: "1", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "Jane Smith", lastMessage: "See you soon!", peerId: "2", avatar: "https://via.placeholder.com/40" },
  ]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1270);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1270);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    responsiveBody: {
      width: isMobile ? "-webkit-fill-available" : "100%",
      overflowX: isMobile ? "auto" : "initial",
      zoom: isMobile ? "100%" : "initial",
    },
    // other styles
  };

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setShowSidebar(false);
    setMessages([
      { sender_id: "1", message: "Hello there!", avatar: "https://via.placeholder.com/40" },
      { sender_id: "2", message: "Hi, how are you?", avatar: "https://via.placeholder.com/40" },
    ]);
  };

  const handleBackButtonClick = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender_id: "1", message: newMessage, avatar: "https://via.placeholder.com/40" },
    ]);
    setTimeout(() => scrollToBottom(), 0);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    const chatBody = document.querySelector(".chat-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight + 10;
    }
  };

  return (
    <div className={`messenger-container`}>
      <div className={`chat-sidebar ${showSidebar ? "" : "show"}`}>
        <div style={{ display: "flex", alignItems: "end" }}>
          <Link to={`/dashboard`}>
            <FaArrowLeft />
          </Link>
          <h3 style={{ marginBottom: "0", width: "85%" }}>Chats</h3>
        </div>
        <ul>
          {dummyChats.map((chat) => (
            <li key={chat.id} onClick={() => handleChatClick(chat)}>
              <img src={chat.avatar} alt={`${chat.name} avatar`} className="chat-avatar" />
              <div className="chat-info">
                <span className="chat-name">{chat.name}</span>
                <br />
                <span className="chat-last-message">{chat.lastMessage}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`chat-window ${selectedChat ? "show" : ""}`}>
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>
                <span>
                  <button className="back-button" onClick={handleBackButtonClick}>
                    &#8592;
                  </button>
                </span>
                {selectedChat.name}
              </h3>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender_id === "1" ? "user" : "bot"}`}>
                  <img src={message.avatar} alt="avatar" className="message-avatar" />
                  <p className="message-text">{message.message}</p>
                </div>
              ))}

              {isTyping && (
                <div className={`message bot`}>
                  <img src="https://via.placeholder.com/40" alt="avatar" className="message-avatar" />
                  <p className="message-text">Typing...</p>
                </div>
              )}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Select a chat to start messaging.</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};



export default Chat;
