import React, { useEffect, useRef, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { motion } from 'framer-motion';
import "./style.css";
import axios from 'axios';

function Tr({ editId, item, editText, setEditText, handleEditUpdate, handleEdit, index, handleDelete, fetchAllTodos }) {
    const [duration, setDuration] = useState(item.elapsedTime || 0);
    const [status, setStatus] = useState(item.status);
    const intervalRef = useRef(null); // Using useRef to store the interval ID


    useEffect(() => {
        console.log("reload");
        if (item.status === "Ongoing") {
            const startTime = new Date(item.startTime);
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime.getTime();

            setDuration(item.elapsedTime + elapsedTime);

            startTimer();
        }

        return () => stopTimer(); // Clear interval on component unmount
    }, []);

    const startTimer = () => {
        if (intervalRef.current) return; // Prevent multiple intervals
        intervalRef.current = setInterval(() => {
            setDuration((prevTime) => prevTime + 1000);
        }, 1000);
    };

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleStart = async () => {
        try {
            const obj = { id: item._id };
            const response = await axios.post(`/todo-start`, obj);
            setStatus(response.data.data.status);
            setDuration(0);  // Reset duration to 0 on start
            startTimer(); // Start the timer immediately after setting the status

        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const handlePause = async () => {
        try {
            const obj = { id: item._id };
            const response = await axios.post(`/todo-pause`, obj);
            setStatus(response.data.data.status);
            stopTimer();
            fetchAllTodos();
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const handleResume = async () => {
        try {
            const obj = { id: item._id };
            const response = await axios.post(`/todo-resume`, obj);
            setStatus(response.data.data.status);
            startTimer();
            fetchAllTodos();
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const handleEnd = async () => {
        try {
            const obj = { id: item._id };
            const response = await axios.post(`/todo-end`, obj);
            setStatus(response.data.data.status);
            stopTimer();
            fetchAllTodos();
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const formatTime = (ms) => {
        if (isNaN(ms)) return "00:00:00:00";

        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));

        return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.tr initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}>
            <td>{index + 1}</td>
            {editId === item._id ? (
                <td><input type='text' value={editText} onChange={(e) => setEditText(e.target.value)} className='edit-input' /></td>
            ) : (
                <td>{item.title}</td>
            )}

            {
                item.status == "Complete" ? <td style={{ color: "darkgreen", fontWeight: "600" }}>{formatTime(duration)}</td> : <td>{formatTime(duration)}</td>
            }

            <td>
                <button className='action-btn' disabled={status === 'Ongoing' || status === "Paused" || status === "Complete"} onClick={handleStart}>Start</button>
                <button className='action-btn' disabled={status === "Paused" || status === "Pending" || status === "Complete"} onClick={handlePause}>Pause</button>
                <button className='action-btn' disabled={status === "Complete"} onClick={handleEnd}>End</button>
                <button className='action-btn' disabled={status !== "Paused" || status === "Complete"} onClick={handleResume}>Resume</button>
            </td>
            {
                item.status == "Complete" ? <td style={{ color: "darkgreen", fontWeight: "600" }}>{status}</td> : <td>{status}</td>
            }

            {editId === item._id ? (
                <td><FaSave style={{ transform: "scale(1.25)", cursor: "pointer" }} onClick={handleEditUpdate} /></td>
            ) : (
                <td><FaEdit style={{ transform: "scale(1.25)", cursor: "pointer" }} onClick={() => handleEdit(item)} /></td>
            )}
            <td><RiDeleteBinLine style={{ color: "red", transform: "scale(1.25)", cursor: "pointer" }} onClick={() => handleDelete(item)} /></td>
        </motion.tr>
    );
}

export default Tr;
