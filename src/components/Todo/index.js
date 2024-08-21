import React, { useEffect, useState } from 'react'
import "./style.css"
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios';
import Tr from '../Tr';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

import PaginationComponent from '../Pagination';


let SKIP = 0;

function Todo() {

    const [todo, setTodo] = useState("");
    const [todoArr, setTodoArr] = useState([]);
    const [editId, setEditId] = useState("");
    const [editText, setEditText] = useState("");
    // const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllTodos();
    }, [])

    function getToken() {
        const token = localStorage.getItem("token");
        if (!token)
        {
            setLoading(true);
            return false;
        }
        return token;
    }

    async function fetchAllTodos() {
        const token = getToken();
        if (!token) {
            setLoading(true);
            alert("Please Login Or Signup First");
            navigate("/login");
            return;
        }
        let response
        try {
            response = await axios.get(`/read-all-todos?skip=${SKIP}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            let total = response.data.totalTodos;

            if (response.data.data.length === 0 && SKIP > 0 && total > 0) {
                SKIP -= 5;
                setPage(page-1);
                response = await axios.get(`/read-all-todos?skip=${SKIP}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            }

            total = Math.ceil(total/5);
            setTotalPages(total);
            setTodoArr(response.data.data);

            setLoading(false);
        }
        catch (err) {
            alert(err.response.data.message);
            navigate("/login");
        }
    }


    async function handleAdd(e) {
        e.preventDefault();
        if (!todo) {
            alert("Please Enter Todo First");
        }
        else {
            const token = getToken();
            if (!token) {
                setLoading(true);
                alert("Please Login Or Signup First");
                navigate("/login");
                return;
            }
            const obj = { todo };
            try {
                const response = await axios.post("/create-todo", obj, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
                if (response.status !== 201) {
                    alert(response.data.message);
                    return;
                }

                fetchAllTodos();
                setTodo("");
            }
            catch (err) {
                console.log(err);
                alert(err.response.data.message);
            }
        }

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

        const token = getToken();
        if (!token) {
            setLoading(true);
            alert("Please Login Or Signup First");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post("/edit-todo", obj, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            if (response.status !== 200) {
                alert(response.data.message);
                return
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

        const token = getToken();
        if (!token) {
            setLoading(true);
            alert("Please Login Or Signup First");
            navigate("/login");
            return;
        }
        try {
            const response = await axios.post("/delete-todo", obj, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            if (response.status !== 200) {
                alert(response.data.message);
                return;
            }

            if (editId === item._id) {
                setEditId("");
                setEditText("");
            }
            fetchAllTodos();
        }
        catch (err) {
            alert(err.response.data.message);
        }
    }

    // function handleToogle() {
    //     setShow(!show);
    // }

    async function handleLogout() {
        const token = getToken();
        if (!token) {
            setLoading(true);
            alert("Please Login Or Signup First");
            navigate("/login");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get("/logout", { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
            setLoading(false);
            localStorage.removeItem("token");
        }
        catch (err) {
            alert(err.response.data.message);
            setLoading(false);
        }
        navigate("/");
    }

    // async function handleLogoutFromAllDevices() {
    //     const token = getToken();
    //     if (!token) {
    //         alert("Please Login Or Signup First");
    //         navigate("/login");
    //         return;
    //     }
    //     try {
    //         setLoading(true);
    //         const response = await axios.get("/logout-from-all-devices");
    //         alert(response.data.message);
    //         setLoading(false);
    //     }
    //     catch (err) {
    //         alert(err.response.data.message);
    //         setLoading(false);
    //     }
    //     navigate("/");
    // }


    function handlePageChange(e, value) {
        SKIP = (value - 1) * 5;
        setPage(value);
        fetchAllTodos();
    }


    if (loading) {
        return (
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
                                        <Tr editId={editId} item={item} editText={editText} setEditText={setEditText} handleEditUpdate={handleEditUpdate} handleEdit={handleEdit} handleDelete={handleDelete} fetchAllTodos={fetchAllTodos} key={item._id} index={i} />
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </motion.div> : <div className="main-container"><motion.h1 initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}>Empty</motion.h1></div>
            }

            {
                totalPages > 1 && <motion.div className='pagination' initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}>
                    <PaginationComponent page={page} handlePageChange={handlePageChange} totalPages={totalPages} />
                </motion.div>
            }


            {/* 
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
            </div> */}


            <motion.div className="button-container" initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}>
                <button className="main-button" onClick={handleLogout}>
                    Logout
                </button>
            </motion.div>

        </div>
    )
}

export default Todo
