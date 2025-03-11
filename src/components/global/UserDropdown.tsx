const UserDropdown = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border transform origin-top-right transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
        Profile
      </a>
      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
        Settings
      </a>
      <div className="border-t border-gray-100"></div>
      <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200">
        Logout
      </a>
    </div>
  );
};

export default UserDropdown;
