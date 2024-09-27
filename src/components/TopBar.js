import React from "react";
import logo from "../assets/images/logo.svg";
// .. means go back to previous folder

import { LogoutOutlined } from "@ant-design/icons";

function TopBar(props) {
  // props is object
  const { isLoggedIn, handleLogout } = props; // destructuring, {} is used for object
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="App-title">Go Around</span>
      {isLoggedIn ? ( // tenary operation
        <LogoutOutlined className="logout" onClick={handleLogout} />
      ) : null}
    </header>
  );
}

export default TopBar;
