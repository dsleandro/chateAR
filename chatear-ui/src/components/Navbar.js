import React from "react";
import { UserData } from "./UtilComponents"
import { LogoutIcon, SettingsIcon, ContactsIcon, ChatIcon, StarIcon } from "../components/Icons";

export default function Navbar(props) {

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("activeContactId");
        props.history.push("/login");
    };

    return (
        <div id="navbar">
            <UserData user={props.user} />
            <div id="navbarItems">
                <div className="navbarItem active">
                    <span id="userIconNav" className="navbarIcon"><ChatIcon /></span>
                    <span className="navbarText">Chats</span>
                </div>
                <div className="navbarItem">
                    <span className="navbarIcon"><ContactsIcon /></span>
                    <span className="navbarText">Contacts</span>
                </div>
                <div className="navbarItem">
                    <span className="navbarIcon"><StarIcon /></span>
                    <span className="navbarText">Favorites</span>
                </div>
                <div className="navbarItem">
                    <span className="navbarIcon"><SettingsIcon /></span>
                    <span className="navbarText">Settings</span>
                </div>
                <div className="navbarItem logout" onClick={() => logout()}>
                    <span className="navbarIcon"><LogoutIcon /></span>
                    <span className="navbarText">Logout</span>
                </div>
            </div>
        </div>
    )
}