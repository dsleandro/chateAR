import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { login } from "../util/ApiUtil";
import { ErrorMessage } from "../components/ErrorMessage";
import { Spinner } from "../components/Icons";
import "../css/FormsAuth.css";

export default function SignIn(props) {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();


    function handleInputs(e) {
        var field = e.target;
        setInputs((prevState) => {
            return { ...prevState, [field.name]: field.value }
        });
    }
    function handleSubmit(e) {
        e.preventDefault();

        //Loading icon
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

    return (
        isLoading ? <Spinner /> :
            <div className="container">
                <div className="divSignin">

                    {isError ? <ErrorMessage message="Invalid username or password" /> : null}
                    <form className="formSignin" onSubmit={(e) => handleSubmit(e)}>
                        <h3 id="welcomeBack">Welcome back!</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                onChange={(e) => handleInputs(e)}
                                placeholder="Username"
                                value={inputs.username}
                                required
                                autoComplete="username"
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control my-2"
                                onChange={(e) => handleInputs(e)}
                                placeholder="Password"
                                minLength="8"
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary col-md-5">Sign in</button>
                        <Link id="forgotPassword" to="">Forgot Password?</Link>
                    </form>
                </div>
            </div>
    )
}
