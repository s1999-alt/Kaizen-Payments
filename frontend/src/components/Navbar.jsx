import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="w-full p-4 bg-gray-900 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Mail Automation</h1>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
