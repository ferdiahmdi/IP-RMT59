import { Link, useNavigate } from "react-router";
import ThemeController from "./ThemeController";
import { useEffect, useState } from "react";

const Navbar = ({ toggleTheme, theme }) => {
  const [loginStatus, setLoginStatus] = useState(null);
  const authorization = localStorage.getItem("authorization");
  const navigate = useNavigate();

  useEffect(() => {
    if (authorization)
      setLoginStatus(
        <ul className="menu menu-horizontal px-1">
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("authorization");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      );
    else
      setLoginStatus(
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      );
  }, [authorization, navigate]);

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Otakollect
        </Link>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/home">Recommendations</Link>
          </li>
          <li>
            <Link to="/collections">My Collections</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {loginStatus}
        <ThemeController toggleTheme={toggleTheme} theme={theme} />
      </div>
    </div>
  );
};

export default Navbar;
