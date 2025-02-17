import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import '../css/Login.css'

export const Login = () => {
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [passwordValid, setPasswordValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })

        if (name === 'password') {
            const password = value
            const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            setPasswordValid(re.test(password));
        }

        if (name === 'email') {
            const email = value;
            setEmailValid(
                String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
            );
        }

    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = formData;

        fetch("http://localhost:8080/form/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, roll:"admin" })
        })
            .then(async (response) => {
                console.log("res", response);
                if (response.ok) {
                    return response.json();
                } else {    
                    const errorData = await response.json();
                    console.log("error data", errorData);
                    if (response.status === 400) {
                        throw new Error(errorData.message || 'Bad Request');
                    } else {
                        throw new Error(errorData.message || 'Something went wrong');
                    }
                }
            })
            .then((data) => {
                // console.log("Login successful:", data);
                toast.success("Login Successfully", { autoClose: 2000 });
                // const token = data.token;
                console.log('token', data.token);
                localStorage.setItem('token',data.token);
                navigate('/');

            })
            .catch(error => {
                console.log("error ", error);

                toast.error(error.message, {
                    autoClose: 3000,
                });
            });
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    return (
        <div className="main">
            <div className="container1 p-5">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <br />

                    <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="in" />

                    {!emailValid && formData.email !== '' && (
                        <div className="error-message">Invalid email format.</div>
                    )}

                    <div className="password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password :"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="in"
                        />
                        <span onClick={togglePasswordVisibility} className="eye-icon">
                            {!passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {!passwordValid && formData.password !== '' && (<div className="error-message">Invalid Password</div>)}

                    <div className="remember-forgot">

                        <label className="checkbox-container">
                            <input type="checkbox" />
                            Remember me
                        </label>


                        <Link
                            className="forgot-password-link"
                            to={`/forget-password?email=${encodeURIComponent(formData.email)}`}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <input type="submit" className="button" value="Login" />
                </form>

            </div>
        </div>
    )
}






