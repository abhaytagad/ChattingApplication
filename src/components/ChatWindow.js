import React, { useContext, useEffect, useState, useRef } from "react";
import { APIcontext } from "../context/UserContext";

const ChatWindow = () => {
  const { messages, userId } = useContext(APIcontext);
  const [hasMessages, setHasMessages] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setHasMessages(messages && messages.length > 0);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 p-4 overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {hasMessages ? (
          messages.map((message, index) =>
            message.from === userId || message.to === userId ? (
              <div
                key={index}
                className={`flex items-end mb-4 ${
                  message.from === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 rounded-lg shadow-md max-w-xs ${
                    message.from === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <small className="block text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            ) : (
              <p></p>
            )
          )
        ) : (
          <p className="text-center text-gray-200">No messages to display</p>
        )}
        <div ref={bottomRef} /> {/* The div that we will scroll into view */}
      </div>
    </div>
  );
};

export default ChatWindow;
