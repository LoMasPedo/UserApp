// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./User";
import UserConsult from "./UserConsult";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<User />} />
        <Route exact path="/user-consult" element={<UserConsult />} />
      </Routes>
    </Router>
  );
};

export default App;
