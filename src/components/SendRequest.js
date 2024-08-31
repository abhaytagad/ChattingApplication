import React, { useContext, useState } from "react";
import axios from "axios";
import { APIcontext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SendRequest = () => {
  const { userId, token } = useContext(APIcontext);
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSendRequest = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/request",
        {
          userId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage("Request sent successfully!");
      setErrorMessage("");
      navigate("/chat");
    } catch (error) {
      setErrorMessage(
        "Error sending request: " +
          (error.response?.data?.message || error.message)
      );
      setResponseMessage("");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Send Friend Request
      </h2>
      <div className="mb-6">
        <label className="block text-white font-semibold text-sm mb-2">
          Email Address
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 bg-white text-gray-800 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        onClick={handleSendRequest}
        className="w-full bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200 transition duration-200 ease-in-out"
      >
        Send Request
      </button>
      {responseMessage && (
        <p className="mt-4 text-center text-green-200 font-semibold">
          {responseMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-center text-red-300 font-semibold">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SendRequest;
