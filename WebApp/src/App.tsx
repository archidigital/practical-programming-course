import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <nav
        style={{
          width: 200,
          borderRight: "1px solid #dadada",
          height: "100vh",
        }}
      >
        <ul>
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`jobs`}>Jobs</Link>
          </li>
          <li>
            <Link to={`livemap`}>Livemap</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

export default App;
