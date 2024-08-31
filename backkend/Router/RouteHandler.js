const express = require("express");
const { Signup, login } = require("../Controllers/Auth");
const {
  getMessages,
  getUsers,
  sendRequest,
} = require("../Controllers/Chathandler");
const authenticate = require("../Middlware/authVerify");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", login);
router.post("/contacts", authenticate, getUsers);
router.post("/chats", authenticate, getMessages);
router.post("/request", authenticate, sendRequest);

exports.router = router;
