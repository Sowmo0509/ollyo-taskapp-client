import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ isOpen }: { isOpen: boolean }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border transform origin-top-right transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
      {/* User info section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
      </div>

      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
        Profile
      </a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
        Settings
      </a>
      <div className="border-t border-gray-100"></div>
      <button 
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;
