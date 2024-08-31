import React, { useContext } from "react";
import { APIcontext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { contacts, userId, setmessages, setotherId, clearState, token } =
    useContext(APIcontext);
  const navigate = useNavigate();
  let otherUserId;

  function onSelectUser(contactId) {
    otherUserId = contactId;
    setotherId(contactId);
    const fetchChatData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/chats",
          {
            userId: userId,
            otherUserId: otherUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setmessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat data:", error);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    if (userId && otherUserId) {
      fetchChatData();
    }
  }

  const handleSendRequestClick = () => {
    navigate("/send-request");
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      clearState();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white w-full lg:w-1/4 h-full border-r border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-200">
        Contacts
      </h2>
      <div className="p-4 flex flex-col space-y-2">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">No contacts available</p>
        ) : (
          contacts.map((contact, index) => (
            <button
              key={index}
              value={contact.id}
              onClick={() => onSelectUser(contact.id)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                {contact.name.charAt(0)}
              </div>
              <span>{contact.name}</span>
            </button>
          ))
        )}
      </div>
      <button
        onClick={handleSendRequestClick}
        className="m-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send Request
      </button>
      <button
        onClick={handleLogout}
        className="m-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
