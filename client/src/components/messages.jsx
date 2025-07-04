import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const ChatBox = ({ userId = "123456789012345678901234", otherUserId = "123456789012345678901235"}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join own room
    socket.emit("join", userId);

    // Fetch chat history
    fetch(`http://localhost:3001/messages/${userId}/${otherUserId}`)
      .then(res => res.json())
      .then(setMessages);

    // Listen for new messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { from: userId, to: otherUserId, message: input, timestamp: new Date() };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
    // Optionally, POST to /messages to persist
    fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, width: 300 }}>
      <div style={{ height: 200, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === userId ? "right" : "left" }}>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ width: "18%" }}>Send</button>
    </div>
  );
};

export default ChatBox;
