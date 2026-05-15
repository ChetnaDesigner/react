import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light theme-dark theme-navabar">
      <Link className="nav-link" to="/">Home</Link> |{" "}
      <Link className="nav-link" to="/card">Card</Link> |{" "}
      <Link className="nav-link" to="/login">Login</Link> |{" "}
      <Link className="nav-link" to="/contact">Contact</Link>
    </nav>
  );
}

export default Navbar;