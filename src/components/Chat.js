import React, { useContext, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { APIcontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userId, setcontacts } = useContext(APIcontext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCont() {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.post(
          "http://localhost:4000/api/contacts",
          {
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setcontacts(response.data.contacts[0].contacts);
      } catch (error) {
        console.error(
          "Error fetching contacts:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    }

    getCont();
  }, [userId, navigate]);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
};

export default Chat;
