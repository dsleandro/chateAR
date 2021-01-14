import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import { ActiveContacts, LogedIn, Messages } from "./context/AuthContext";
import "./App.css";

export const AppContext = React.createContext();
const App = () => {

  const [user, setUser] = useState();
  const [messages, setMessages] = useState();
  const [activeContact, setActiveContact] = useState();


  return (
    <div className="App">
      <Router>
        <LogedIn.Provider value={{ user, setUser }}>
          <ActiveContacts.Provider value={{ activeContact, setActiveContact }}>
            <Messages.Provider value={{ messages, setMessages }}>

              <Route path="/signup" exact component={Signup} />
              <Route path="/signin" exact component={Signin} />
              <Route exact path="/" component={Chat} />

            </Messages.Provider>
          </ActiveContacts.Provider>
        </LogedIn.Provider>
      </Router>
    </div>
  );
};

export default App;
