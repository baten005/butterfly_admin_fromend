import React, { useState, useEffect } from "react";
import "../Styles/chatUi.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosinstance from "../AxiosInstance/axiosinstance";
import "react-toastify/dist/ReactToastify.css";
import { BiSupport } from "react-icons/bi";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [dummyChats, setDummyChats] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1170);
  const [unreadCounts, setUnreadCounts] = useState([]);

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
  };

  const fetchChatUsers = async () => {
    try {
      const { data } = await axiosinstance.get("/support/chats");
      //console.log(data,"k k chat sup")
      setDummyChats(data);
    } catch (error) {
      console.error("Error fetching chat users", error);
      toast.error("Failed to fetch chat users.");
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axiosinstance.get(`/admin/support_chat/${userId}`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages", error);
      toast.error("Failed to fetch messages.");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const messagePayload = {
        message: newMessage,
        receiver: selectedChat.userId,
      };

      const { data } = await axiosinstance.post("/admin/support_chat", messagePayload);

      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message", error);
      toast.error("Failed to send message.");
    }
  };
 
  const markMessagesAsRead = async (userId) => {
    try {
      await axiosinstance.put(`/mark-read`, { userId });
      fetchChatUsers(); 
    } catch (error) {
      console.error("Error marking messages as read", error);
    }
  };

  const scrollToBottom = () => {
    const chatBody = document.querySelector(".chat-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight + 10;
    }
  };


  const handleChatClick = (chat) => {
    //console.log(chat,"dekhi ki ase")
    setSelectedChat(chat);
    setShowSidebar(false);
    fetchMessages(chat.userId);
    markMessagesAsRead(chat.userId);
  };

  const handleBackButtonClick = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  useEffect(() => {
    //console.log("call ki hoi?");
    fetchChatUsers();
    const interval = setInterval(fetchChatUsers, 25000);
    return () => clearInterval(interval);
  }, []);

  //console.log(unreadCounts,"theese are");

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
          {dummyChats!=null && dummyChats.map((chat) => (
            <li key={chat.id} onClick={() => handleChatClick(chat)}>
              <img src={`https://backend.butterfly.hurairaconsultancy.com/${chat.avatar}`} alt={`${chat.fullName} avatar`} className="chat-avatar" />
              <div className="chat-info">
                <span className="chat-name">{chat.fullName}</span>
                {chat.unreadCount>0?<span style={{color:"Red",fontWeight:"bolder"}}>{chat.unreadCount}</span>:''}
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
                {selectedChat.fullName}
              </h3>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender === "admin" ? "user" : "bot"}`}>
                  {message.sender==='admin'?<BiSupport/>:<img src={`https://backend.butterfly.hurairaconsultancy.com/${selectedChat.avatar}`} alt="avatar" className="message-avatar" />}
                  <p className="message-text">{message.message}</p>
                </div>
              ))}
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
