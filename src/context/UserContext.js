import { createContext, useState, useEffect } from "react";
export const APIcontext = createContext();

function UserContext({ children }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState(null);
  const [otherId, setOtherId] = useState("");

  useEffect(() => {
    const Email = JSON.parse(localStorage.getItem("email"));
    if (Email) {
      setEmail(Email);
    }

    const fileId = JSON.parse(localStorage.getItem("userId"));
    if (fileId) {
      setUserId(fileId);
    }
    const t = localStorage.getItem("Token");
    if (t) {
      setToken(t);
    }
  }, []);

  function setcontacts(contacts) {
    setContacts(contacts);
  }
  function setmessages(mess) {
    setMessages(mess);
  }
  function setemail(email) {
    setEmail(email);
    localStorage.setItem("email", JSON.stringify(email));
  }
  function settoken(token) {
    setToken(token);
    localStorage.setItem("Token", JSON.stringify(token));
  }
  function setuserId(id) {
    setUserId(id);
    localStorage.setItem("userId", JSON.stringify(id));
  }

  function setotherId(id) {
    setOtherId(id);
  }
  function clearState() {
    setuserId("");
    setemail("");
    setmessages([]);
    setcontacts([]);
    setOtherId("");
  }

  const value = {
    email,
    setemail,
    token,
    settoken,
    userId,
    setuserId,
    contacts,
    setcontacts,
    messages,
    setmessages,
    otherId,
    setotherId,
    clearState,
  };

  return <APIcontext.Provider value={value}>{children}</APIcontext.Provider>;
}

export default UserContext;
