import React, { useState, useEffect } from "react";
import { signup } from "../util/ApiUtil";
import { ErrorMessage } from "./ErrorMessage";
import { Spinner } from "./Icons";
import "../css/FormsAuth.css";

export default function SignUp(props) {

    const [inputs, setInputs] = useState({ username: "", password: "", confirmPassword: "" });
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("accessToken") !== null) {
            props.history.push("/");
        }
    }, []);

    function handleInputs(e) {
        var field = e.target;
        setInputs((prevState) => {
            return { ...prevState, [field.name]: field.value }
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (inputs.password === inputs.confirmPassword) {
            //delete confirmation input
            delete inputs.confirmPassword;

            //Loading icon
            setIsLoading(true);

            signup(inputs).then(res => {
                //Remove loading icon
                setIsLoading(false);

                if (res) {
                    props.history.push("/signin");
                } else {
                    return <ErrorMessage message="Username already exists" />;
                }
            }).catch(() => {
                //Remove loading icon
                setIsLoading(false);

                return <ErrorMessage message="Username already exists" />;
            });

        } else setIsError(true)

    }

    return (
        isLoading ? <Spinner /> :
            < div className="container" >
                {isError ? <ErrorMessage message="Password do not match" /> : null}

                <div className="card-body formSignin">
                    <h3>Create new user</h3>

                    <form onSubmit={(e) => handleSubmit(e)}>
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
                                autoComplete="new-password"
                                minLength="8"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                onChange={(e) => handleInputs(e)}
                                placeholder="Confirm Password"
                                required
                                autoComplete="new-password"
                                minLength="8"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary col-md-5">Save</button>
                    </form>
                </div>
            </div >
    )
}
