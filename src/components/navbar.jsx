import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg theme-navabar">
      <div className="container-fluid gap-2">
        <NavLink className="nav-link" to="/contacts/add">
          Add Contact
        </NavLink>
        <span className="text-white-50">|</span>
        <NavLink className="nav-link" to="/contacts/list">
          Contact List
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
