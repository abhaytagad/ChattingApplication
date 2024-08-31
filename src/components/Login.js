import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { APIcontext } from "../context/UserContext.js";

const Login = () => {
  const { email, setuserId, setemail, settoken } = useContext(APIcontext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email: email,
        password: password,
      });
      setuserId(response.data.id);
      settoken(response.data.token);
      localStorage.setItem("Token", response.data.token);
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded shadow-md w-80"
      >
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>

        {<div className="text-red-500 text-center mb-4">{}</div>}

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="username">
            Email
          </label>
          <input
            type="text"
            id="username"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <dir>
        <a href="/signup" className="text-white mt-4">
          Create an account
        </a>
      </dir>
    </div>
  );
};

export default Login;
