import React, { useEffect, useState } from "react";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  getCurrentUser,
  getLastMessage,
} from "../util/ApiRequest";
import { useActivecontacts, useLogedIn, useMessages } from "../context/AuthContext";
import { PaperPlane, DotsMenu } from "./Icons";
import Navbar from "./Navbar";
import { Search, UserData, AppLogo } from "./UtilComponents";

var stompClient = null;
function Chat(props) {

  const currentUser = useLogedIn();
  const aContact = useActivecontacts();
  const userMessages = useMessages();
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/login");
    }
    getCurrentUser().then((res) => {
      currentUser.setUser(res);
    })
  }, []);

  useEffect(() => {
    if (currentUser.user != null && contacts.length === 0) {
      connect();
      handleLoadContacts();
    }
  }, [currentUser.user]);

  useEffect(() => {
    if (aContact.activeContact !== undefined) {
      findChatMessages(aContact.activeContact.id, currentUser.user.id).then((msgs) =>
        userMessages.setMessages(msgs)
      );
    }
  }, [aContact.activeContact]);

  const connect = () => {
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({ "Authorization": localStorage.getItem("accessToken") }, onConnected, onError);
  };

  const onConnected = () => {
    console.log("connected");
    stompClient.subscribe(
      "/user/" + currentUser.user.id + "/queue/messages",
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (msg) => {
    const notification = JSON.parse(msg.body);

    var active = localStorage.getItem("activeContactId");

    if (active === notification.senderId) {
      findChatMessages(active, currentUser.user.id).then((msgs) =>
        userMessages.setMessages(msgs)
      );
    }
    handleLoadContacts();
  };

  const handleSendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.user.id,
        recipientId: aContact.activeContact.id,
        senderUsername: currentUser.user.username,
        recipientUsername: aContact.activeContact.username,
        content: msg,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));

      const newMessages = [...userMessages.messages];
      newMessages.push(message);
      userMessages.setMessages(newMessages);
    }
  };

  const handleLoadContacts = () => {

    getUsers().then((users) => {

      users.map((contact) => {
        countNewMessages(contact.id, currentUser.user.id).then(count => contact.newMessages = count)

        getLastMessage(contact.id, currentUser.user.id).then(msg => contact.lastMessage = msg.content)

        return contact;
      })
      setContacts(users);
    });
  }

  const handleSaveActiveContact = (contact) => {
    aContact.setActiveContact(contact);
    localStorage.setItem("activeContactId", contact.id); //save contact to get it on new message
  }

  return (
    <div id="chat">
      <Navbar history={props.history} user={currentUser.user ? currentUser.user : ""} />
      <div id="contacts">
        <div id="searchContainer"><Search /></div>
        <ul>
          {contacts.map((contact) => (
            <li
              onClick={() => handleSaveActiveContact(contact)}
              className={
                aContact.activeContact && contact.id === aContact.activeContact.id
                  ? "contact active"
                  : "contact"
              }
              key={contact.id}
            >
              <div className="ContactMessage">
                <span><UserData user={contact} isContact={true} /></span>
                {contact.newMessages !== undefined &&
                  contact.newMessages > 0 && (
                    <span className="newMessages">
                      {contact.newMessages}
                    </span>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {aContact.activeContact !== undefined ?
        (
          <div className="content">
            <div id="activeContactProfile">
              <UserData user={aContact.activeContact && aContact.activeContact} />
              <span className="dotsMenuIcon"><DotsMenu /></span>
            </div>
            <div className="messages">
              <ul>
                {userMessages.messages !== undefined ? (userMessages.messages.map((msg) => (
                  <li key={msg.id} className={msg.senderId === currentUser.user.id ? "sent" : "replies"}>
                    <p>{msg.content}</p>
                  </li>
                ))) : null}
              </ul>
            </div>
            <div className="messageInput">
              <input
                type="text"
                name="userInput"
                size="large"
                placeholder="Type message..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSendMessage(text);
                    setText("");
                  }
                }}
              />

              <button
                onClick={() => {
                  handleSendMessage(text);
                  setText("");
                }}
              > <PaperPlane /></button>
            </div>
          </div>
        ) :
        <AppLogo />}
    </div>
  );
};

export default Chat;