import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Form/Signup";
import Login from "./components/Form/Login";
import Todo from "./components/Todo";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
