import { NavLink, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  // Set up navigate so we can send users to login if they are not logged in
  const goToPage = useNavigate();

  /** This runs when the user clicks Log Out*/
  function clickLogOut() {
    logout();
    // Send them back to the welcome page after logging out
    goToPage("/");
  }

  /** If not logged in, send them to login instead of the page they clicked*/
  function requireLogin(path) {
    if (!token) {
      goToPage("/login");
    } else {
      goToPage(path);
    }
  }

  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>Paw Dates 🐾</p>
      </NavLink>

      <nav>
        <button onClick={() => requireLogin("/search")}>Meet the Doggos</button>
        <button onClick={() => requireLogin("/profile")}>Profile</button>

        {/* TODO: add notification badge when backend is ready */}
        <button onClick={() => requireLogin("/messages")}>Messages</button>
        {token ? (
          // If the user IS logged in, show Log Out
          <button onClick={clickLogOut}>Log Out</button>
        ) : (
          // If the user is NOT logged in, show Login and Register
          <>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
