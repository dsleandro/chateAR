import React from "react";
import { UserCircle, ChatIcon } from "./Icons";

function Search() {

    return (
        <div id="baseSearch">
            <form className="formSearch">
                <div id="group">
                    <span id="searchIcon" className="fa fa-search"></span>
                    <input type="search" name="search"
                        className="searchInput"
                        id="search"
                        size="large"
                        placeholder="Search"
                    />
                </div>
            </form>
        </div>
    );
}

function UserData(props) {

    return (
        <div id="userData">
            <span className="userDataIcon"><UserCircle /></span>
            <div className="userDataContainer">
                <div className="names">{props.user.firstName + " " + props.user.lastName}</div>
                {props.isContact ? <div id="lastMessagePreview" className="messageOrUsername">{props.user.lastMessage}</div> : <div className="messageOrUsername">@{props.user.username}</div>}
            </div>
        </div>
    );
}

function ErrorMessage(props) {

    var displayMessage = props.display ? "block" : "none";

    return (
        <div className="errorMessage" style={{ display: displayMessage }}>{props.message}</div>
    )
}

function AppLogo() {
    return (
        <div id="defaultContent">
            <div id="chatName">Chatear App</div>
            <div id="chatIcon"><ChatIcon /></div>
        </div>
    )
}

export { Search, UserData, ErrorMessage, AppLogo };