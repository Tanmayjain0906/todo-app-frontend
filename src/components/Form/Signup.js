import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import axios from 'axios';


const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const navigate = useNavigate();



    async function handleForm(event) {
        event.preventDefault();

        // if (!name || !email || !password || !cPassword) {
        //     alert("Please Fill all the fields");
        //     return;
        // }
        // else if (password !== cPassword) {
        //     alert("Paswword doesn't match");
        //     return;
        // }
        // else {
        //     try {
        //         const response = await axios.get("/register");
        //         console.log(response)
        //     }
        //     catch (err) {
        //         console.log(err);
        //     }
        // }

        console.log(name, email, password, cPassword, username);

    }

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <form className="form-content" onSubmit={handleForm} action='/register' method='POST'>
                    <h2>Signup</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" placeholder="Enter your username" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter your email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" placeholder="Enter your username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter your password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cPassword">Confirm Password</label>
                        <input type="password" placeholder="Enter confirm password" name="cPassword" id="cPassword" value={cPassword} onChange={(e) => setCPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="form-button">Signup</button>
                    <p className="switch-form">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
