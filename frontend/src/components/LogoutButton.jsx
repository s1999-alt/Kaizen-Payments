import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { logoutUser } from "../api/auth";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const ok = await logoutUser();

    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}
