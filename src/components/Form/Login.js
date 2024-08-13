import React, {useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './form.css';
import axios from 'axios';
import Loader from '../Loader';


const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    // const url = useContext(todoContext)
    const navigate = useNavigate();

    async function handleForm (event) {
        event.preventDefault();

        if (!emailOrUsername || !password) {
            alert("Please fill all the fields");
            return;
        }
        else {
           try
           {
            setLoading(true);
             const obj = {
                loginId: emailOrUsername,
                password: password,
             }

             const response = await axios.post("https://todo-app-backend-pjs8.onrender.com/login", obj);
             console.log(response);
             setLoading(false);

             if(response.status !== 200)
             {
                alert(response.data.message);
                return;
             }
             setEmailOrUsername("");
             setPassword("");
             navigate("/dashboard");

           }
           catch(err)
           {
            console.log(err);
            //  alert(err.response.data.message);
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
                <form className="form-content" onSubmit={handleForm}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label>Email or Username</label>
                        <input type="text" placeholder="Enter your email" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="form-button">Login</button>
                    <p className="switch-form">
                        Don't have an account? <Link to="/">Signup here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
