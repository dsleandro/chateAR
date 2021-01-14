import React, { useEffect, useState } from "react";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  getCurrentUser,
} from "../util/ApiUtil";
import { useActivecontacts, useLogedIn, useMessages } from "../context/AuthContext";
import "../css/Chat.css";
import { PaperPlane, UserCircle } from "./Icons";

var stompClient = null;
const Chat = (props) => {
  const currentUser = useLogedIn();
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const aContact = useActivecontacts();
  const userMessages = useMessages();

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      props.history.push("/signin");
    }
    getCurrentUser().then((res) => {
      currentUser.setUser(res);
    })
  }, []);

  useEffect(() => {
    if (currentUser.user != null) {
      connect();
      loadContacts();
    }
  }, [currentUser.user]);

  useEffect(() => {
    if (aContact.activeContact === undefined) return;
    findChatMessages(aContact.activeContact.id, currentUser.user.id).then((msgs) =>
      userMessages.setMessages(msgs)
    );
    loadContacts();
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
    loadContacts();
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.user.id,
        recipientId: aContact.activeContact.id,
        senderName: currentUser.user.username,
        recipientName: aContact.activeContact.username,
        content: msg,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));

      const newMessages = [...userMessages.messages];
      newMessages.push(message);
      userMessages.setMessages(newMessages);
    }
  };

  const loadContacts = () => {
    const promise = getUsers().then((users) =>

      users.map((contact) =>
        countNewMessages(contact.id, currentUser.user.id).then((count) => {
          contact.newMessages = count;
          return contact;
        })
      )
    );

    promise.then((promises) =>
      Promise.all(promises).then((users) => {
        setContacts(users);
        if (aContact.activeContact === undefined && users.length > 0) {
          aContact.setActiveContact(users[0]);
        }
      })
    );
  };

  //save contact to get it when new message
  const saveActiveContact = (contact) => {
    aContact.setActiveContact(contact);
    localStorage.setItem("activeContactId", contact.id);
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("activeContactId");
    props.history.push("/signin");
  };

  return (
    <div id="base">
      <div id="sidepanel">
        <div id="profile" className="d-flex flex-row justify-content-around">
          <div id="userProfile">
            <UserCircle />
            <p>{currentUser.user ? currentUser.user.username : null}</p>
          </div>
          {/*TODO: add User Profile component
          
           <span id="viewProfile">View Profile {'>'}</span> */}
          <button id="logoutBtn" className="btn btn-primary" onClick={() => logout()}>Logout</button>
        </div>
        <div id="contacts">
          <ul>
            {contacts.map((contact) => (
              <li
                onClick={() => saveActiveContact(contact)}
                className={
                  aContact.activeContact && contact.id === aContact.activeContact.id
                    ? "contact active"
                    : "contact"
                }
                key={contact.id}
              >
                <div className="wrap">
                  <UserCircle />
                  <div className="meta">
                    <p className="name">{contact.username}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p className="preview">
                          {contact.newMessages} new messages
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="content">
        <div className="contact-profile">
          <span><UserCircle /></span>
          <p>{aContact.activeContact && aContact.activeContact.username}</p>
        </div>
        <div className="messages">
          <ul>
            {userMessages.messages !== undefined ? (userMessages.messages.map((msg) => (
              <li key={msg.id} className={msg.senderId === currentUser.user.id ? "sent" : "replies"}>
                {msg.senderId !== currentUser.user.id && (
                  <UserCircle />
                )}
                <p>{msg.content}</p>
              </li>
            ))) : null}
          </ul>
        </div>
        <div className="message-input">
          <div className="wrap">
            <input
              name="user_input"
              size="large"
              placeholder="Type message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  sendMessage(text);
                  setText("");
                }
              }}
            />

            <button
              onClick={() => {
                sendMessage(text);
                setText("");
              }}
            > <PaperPlane /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;