const Contacts = require("../Models/Contacts");
const Message = require("../Models/Message");
const User = require("../Models/User");

exports.getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;
    const messages = await Message.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    });
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    const contacts = await Contacts.find({ userId: userId });

    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const { userId, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let contactEntry = await Contacts.findOne({ userId });

    if (contactEntry) {
      if (!contactEntry.contacts.includes(user._id)) {
        contactEntry.contacts.push({ id: user._id, name: user.name });
        await contactEntry.save();
      }
    } else {
      contactEntry = new Contacts({
        userId: userId,
        contacts: [{ id: user._id, name: user.name }],
      });
      await contactEntry.save();
    }

    return res.status(200).json({ message: "Contact updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
