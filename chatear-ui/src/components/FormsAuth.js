import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { login, signup } from "../util/ApiRequest";
import { ErrorMessage, AppLogo } from "./UtilComponents";
import { Spinner } from "./Icons";

export default function FormsAuth() {

    const history = useHistory();

    return (
        <div className="formAuthContainer">
            <div className="appLogoContainer"> <AppLogo />
            </div>
            <div className="formAuth">
                <div className="changeForm">
                    <span><Link className={history.location.pathname === "/login" ? "formLink loginLink active" : "formLink loginLink"} to="/login">Login</Link></span>
                    <span> <Link className={history.location.pathname === "/signup" ? "formLink active signupLink" : "formLink signupLink"} to="/signup">Sign up</Link></span>
                </div>
                <Forms />
            </div>
        </div>
    )
}

function Forms() {

    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    function handleLogin(e) {
        e.preventDefault();

        setIsLoading(true);

        login(inputs).then((res) => {

            setIsLoading(false);

            if (res.accessToken) {
                localStorage.setItem("accessToken", res.accessToken);

                history.push("/");

            } else {
                setIsError(true);
            }
        }).catch(() => {

            setIsLoading(false);
            setIsError(true);

        });

    }

    function handleSignup(e) {
        e.preventDefault();

        setIsLoading(true);

        signup(inputs).then(res => {
            setIsLoading(false);

            if (res) {
                history.push("/login");
            } else {
                setIsError(true);
            }
        }).catch(() => {
            setIsLoading(false);
            setIsError(true);
        });
    }

    function handleInputs(e) {
        var field = e.target;
        setInputs((prevState) => {
            return { ...prevState, [field.name]: field.value }
        });
    }

    function closeErrorMessage() {
        setIsError(false);
    }

    if (isError) {
        setTimeout(closeErrorMessage, 2000);
    }

    return (
        <form className="formAuthData"
            onSubmit={history.location.pathname === "/login"
                ? (e) => handleLogin(e)
                : (e) => handleSignup(e)}>

            <div className={isLoading
                ? "spinnerContainer loading" : "spinnerContainer"}><Spinner />
            </div>

            <div className="dataContainer">
                {history.location.pathname === "/signup" &&
                    <> <input
                        type="text"
                        name="firstName"
                        className="formAuthInput"
                        onChange={(e) => handleInputs(e)}
                        placeholder="First Name"
                        value={inputs.firstName}
                        required />

                        <input
                            type="text"
                            name="lastName"
                            className="formAuthInput"
                            onChange={(e) => handleInputs(e)}
                            placeholder="Last Name (Optional)"
                            value={inputs.lastName} />
                    </>}

                <input
                    type="text"
                    name="username"
                    className="formAuthInput"
                    onChange={(e) => handleInputs(e)}
                    placeholder="Username"
                    value={inputs.username}
                    required
                    autoComplete="username"
                />
                <input
                    type="password"
                    name="password"
                    className="formAuthInput"
                    onChange={(e) => handleInputs(e)}
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                    minLength="8"
                />
            </div>
            <button type="submit" className="formAuthSubmit" disabled={isLoading}>
                {history.location.pathname === "/signup" ? "Sign up" : "Login"}</button>

        </form>
    )
}
