import React, { useState, useEffect, useContext, useRef } from "react";
import { APIcontext } from "../context/UserContext";

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { messages, setmessages, userId, otherId } = useContext(APIcontext);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:4000");

    socket.current.onopen = () => {
      console.log("Connected to WebSocket server");
      const authData = {
        type: "auth",
        userId: userId,
        Token: localStorage.getItem("Token"),
      };
      socket.current.send(JSON.stringify(authData));
    };

    socket.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === "message") {
        console.log("Server response:", data.message);
        setmessages((prevMessages) => [
          ...prevMessages,
          {
            from: data.from,
            to: data.to,
            message: data.message,
            timestamp: new Date(),
          },
        ]);
      } else if (data.type === "error") {
        console.error("Server error:", data.message);
      } else if (data.type === "new_message") {
        setmessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [userId, setmessages]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setIsSending(true);

      const messageData = {
        type: "message",
        userId: userId,
        to: otherId,
        message: input,
        Token: localStorage.getItem("Token"),
      };

      socket.current.send(JSON.stringify(messageData));

      setmessages((prevMessages) => [
        ...prevMessages,
        { from: userId, to: otherId, message: input, timestamp: new Date() },
      ]);
      setInput("");
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-gray-800 flex items-center border-t border-gray-700">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 bg-gray-700 text-gray-300 p-2 rounded-lg outline-none placeholder-gray-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className={`ml-4 p-2 rounded-full ${
          isSending
            ? "bg-blue-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-400"
        } transition duration-150 ease-in-out`}
        disabled={isSending}
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default MessageInput;
