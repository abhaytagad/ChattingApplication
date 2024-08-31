const express = require("express");
const Message = require("./Models/Message");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const { router } = require("./Router/RouteHandler");
const connect = require("./Config/Database");
const User = require("./Models/User");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyParser.json());

app.use("/api", router);

connect();

const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on("connection", async (ws) => {
  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === "auth") {
      const { userId } = parsedData;
      clients.set(userId, ws);
      return ws.send(
        JSON.stringify({
          type: "success",
          message: "Authentication successful",
        })
      );
    }
    if (parsedData.type === "message") {
      const { to, message, userId } = parsedData;

      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(to)
      ) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid user ID" }));
        return;
      }

      const newMessage = new Message({
        from: new mongoose.Types.ObjectId(userId),
        to: new mongoose.Types.ObjectId(to),
        message,
      });

      try {
        await newMessage.save();
      } catch (error) {
        console.error("Error saving message:", error);
        ws.send(
          JSON.stringify({ type: "error", message: "Error saving message" })
        );
      }

      const recipientWs = clients.get(to);

      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(
          JSON.stringify({
            type: "message",
            from: userId,
            to: to,
            message: message,
          })
        );
        ws.send(
          JSON.stringify({
            type: "success",
            message: "Message sent successfully",
          })
        );
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws.userId);
  });
});
