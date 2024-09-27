import React, { useState } from "react";
import TopBar from "./TopBar"; 
import ResponsiveAppBar from "./ResponsiveAppBar";
import Main from "./Main";

import { TOKEN_KEY } from "../constants"; // {} is used here because not default

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    // useState returns a stateful value and a function to update it
    localStorage.getItem(TOKEN_KEY) ? true : false // this ensures when close out the tab and open a new one, i am still logged in
    // localStorage is a property of webpage, can only store String type 
  );
  // Token could be expired, which is specified in backend
  // frontend should also match and add an expiration to this token
  // and remove token when it's expired

  const logout = () => {
    console.log("log out");
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const loggedIn = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };
  return (
    <div className="App">
      {/* <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} /> */}
      <ResponsiveAppBar isLoggedIn={isLoggedIn} handleLogout={logout} />
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn} />
    </div>
  );
}

export default App;