import { useState, useRef, useEffect } from "react";
import UserDropdown from "@/components/global/UserDropdown";
import UserAvatar from "@/components/global/UserAvatar";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="px-2 sm:px-4 md:px-8 bg-white py-4 rounded-t-lg border-zinc-100 border-2 flex items-center justify-between">
      <h4 className="font-medium tracking-tighter text-base sm:text-lg">Board</h4>

      <div className="relative" ref={dropdownRef}>
        <div onClick={toggleDropdown} className="cursor-pointer">
          <UserAvatar size={32} fontSize="0.875rem sm:1rem" name={user?.name || "XX"} />
        </div>
        <UserDropdown isOpen={isDropdownOpen} />
      </div>
    </div>
  );
};

export default Header;
