import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import todoContext from '../../context/todoContext';
import axios from 'axios';


function Todo() {

    const [todo, setTodo] = useState("");
    const [todoArr, setTodoArr] = useState([]);
    const [ids, setIds] = useState(1);
    const [editId, setEditId] = useState("");
    const [editText, setEditText] = useState("");

    const url = useContext(todoContext);

    const navigate = useNavigate();

    useEffect(() => {
       fetchAllTodos();
    }, [])

    async function fetchAllTodos()
    {
      try{
          const response = await axios.get(`${url}/read-all-todos`, { withCredentials: true });
          console.log(response.data);
          console.log(response);
      }
      catch(err)
      {
        console.log(err);
        alert(err);
      }
    }

 
    function handleAdd(e) {
        e.preventDefault();
        if (todo) {
            setTodo("");
            setIds(ids + 1);
        }
    }

    function handleEdit(item) {
        setEditId(item.id);
        setEditText(item.title);
    }

    function handleEditUpdate() {
        if (editId) {
            setEditText("");
            setEditId("");
        }
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

            {/* {
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
                                        <Tr editId={editId} item={item} editText={editText} setEditText={setEditText} handleEditUpdate={handleEditUpdate} handleEdit={handleEdit} dispatch={dispatch} remove_item={remove_item} key={item.id} index={i} />
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </motion.div> : <div className="main-container"><motion.h1 initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}>Empty</motion.h1></div>
            } */}


        </div>
    )
}

export default Todo