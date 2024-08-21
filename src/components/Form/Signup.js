import React, {useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import axios from 'axios';
import Loader from '../Loader';


const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();



    async function handleForm(event) {
        event.preventDefault();

        if (!name || !email || !password || !cPassword || !username) {
            alert("Please Fill all the fields");
            return;
        }
        else if (password !== cPassword) {
            alert("Paswword doesn't match");
            return;
        }
        else {
            const obj = { name, email, password, username };
            try {
                setLoading(true);
                const response = await axios.post("https://todo-app-backend-pjs8.onrender.com/register", obj);
                setLoading(false);
                if (response.status !== 201) {
                    alert(response.data.message);
                    return;
                }
                alert(response.data.message);
                navigate("/login");
                setName("");
                setEmail("");
                setPassword("");
                setCPassword("");
                setUsername("");
            }
            catch (err) {
                alert(err.response.data.message);
                setLoading(false);
            }
        }

    }

    if(loading)
    {
        return(
            <Loader />
        )
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
