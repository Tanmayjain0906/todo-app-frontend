import React, { useEffect, useState } from 'react'
import "./style.css"
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios';
import Tr from '../Tr';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';


function Todo() {

    const [todo, setTodo] = useState("");
    const [todoArr, setTodoArr] = useState([]);
    const [editId, setEditId] = useState("");
    const [editText, setEditText] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/authentication");
                const isAuth = response.data.isAuth;
                if (!isAuth) {
                    alert("Please Login or Signup First");
                    navigate("/");
                } else {
                    setLoading(false);
                    fetchAllTodos();
                }
            } catch (err) {
                console.error("Error during authentication:", err);
                alert(err.response.data.message);
                setLoading(false);
                navigate("/");
            }
        };

        authenticate();
        
    }, [])

    async function fetchAllTodos() {
        try {
            const response = await axios.get("/read-all-todos");
            setTodoArr(response.data.data);
        }
        catch (err) {
            alert(err.response.data.message);
        }
    }


    async function handleAdd(e) {
        e.preventDefault();
        if (!todo) {
            alert("Please Enter Todo First");
        }
        else {
            const obj = { todo };
            try {
                const response = await axios.post("/create-todo", obj);
                if (response.status !== 201) {
                    alert(response.data.message);
                }
                fetchAllTodos();
            }
            catch (err) {
                alert(err.response.data.message);
            }
        }
        setTodo("");
    }

    function handleEdit(item) {
        setEditId(item._id);
        setEditText(item.title);
    }

    async function handleEditUpdate() {

        const obj = {
            editId: editId,
            newTodo: editText,
        }

        try {
            const response = await axios.post("/edit-todo", obj);
            if (response.status !== 200) {
                alert(response.data.message);
            }
            fetchAllTodos();
        }
        catch (err) {
            alert(err.response.data.message);
        }

        if (editId) {
            setEditText("");
            setEditId("");
        }
    }

    async function handleDelete(item) {
        const obj = {
            deleteId: item._id
        }
        try {
            const response = await axios.post("/delete-todo", obj);
            console.log(response);
            if (response.status !== 200) {
                alert(response.data.message);
            }
            fetchAllTodos();
        }
        catch (err) {
            alert(err.response.data.message);
        }
    }

    function handleToogle() {
        setShow(!show);
    }

    async function handleLogout() {
        try {
            setLoading(true);
            const response = await axios.get("/logout");
            alert(response.data.message);
            setLoading(false);
        }
        catch (err) {
            alert(err.response.data.message);
            setLoading(false);
        }
        navigate("/");
    }

    async function handleLogoutFromAllDevices() {
        try {
            setLoading(true);
            const response = await axios.get("/logout-from-all-devices");
            alert(response.data.message);
            setLoading(false);
        }
        catch (err) {
            alert(err.response.data.message);
            setLoading(false);
        }
        navigate("/");
    }


    if(loading)
    {
        return(
            <Loader />
        )
    }

    return (
        <div>
            <motion.div className="header" initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}>
                <div className='logo'>
                    <h2>Todo List</h2>
                </div>
            </motion.div>

            <div className="form">
                <form onSubmit={handleAdd}>
                    <motion.input type='text' placeholder='What would you like to do?' value={todo} onChange={(e) => setTodo(e.target.value)} initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.15 }} />
                    <motion.button type='submit' initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.25 }}>Add</motion.button>
                </form>
            </div>

            {
                todoArr.length > 0 ? <motion.div className="main-container" initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}>
                    <div className='items'>
                        <motion.h3 initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.25 }}>Todo List</motion.h3>
                        <table>
                            <thead>
                                <motion.tr initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 }}>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </motion.tr>
                            </thead>
                            <tbody>
                                {
                                    todoArr.map((item, i) => (
                                        <Tr editId={editId} item={item} editText={editText} setEditText={setEditText} handleEditUpdate={handleEditUpdate} handleEdit={handleEdit} handleDelete={handleDelete} key={i} index={i} />
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </motion.div> : <div className="main-container"><motion.h1 initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}>Empty</motion.h1></div>
            }


            <div className="button-container">
                <button className="main-button" onClick={handleToogle}>
                    Logout
                </button>
                <AnimatePresence>
                    {show && (
                        <motion.div
                            className="extra-buttons"
                            initial={{ opacity: 0, maxHeight: 0, y: 20 }}
                            animate={{ opacity: 1, maxHeight: '100px', y: 0 }}
                            exit={{ opacity: 0, maxHeight: 0, y: 20 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <motion.button
                                className="sub-button"
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                onClick={handleLogout}
                            >
                                Logout
                            </motion.button>
                            <motion.button
                                className="sub-button"
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onClick={handleLogoutFromAllDevices}
                            >
                                Logout from all devices
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    )
}

export default Todo