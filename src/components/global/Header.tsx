import { useState, useRef, useEffect } from "react";
import UserDropdown from "@/components/global/UserDropdown";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="px-8 bg-white py-4 rounded-t-lg border-2 flex items-center justify-between">
      <h4 className="font-medium tracking-tighter">Board</h4>

      <div className="relative" ref={dropdownRef}>
        <img className="w-10 h-10 rounded-full object-cover cursor-pointer" src="https://static.vecteezy.com/system/resources/thumbnails/023/307/453/small/ai-generative-a-man-on-solid-color-backgroundshoot-with-surprise-facial-expression-photo.jpg" alt="User avatar" onClick={toggleDropdown} />

        <UserDropdown isOpen={isDropdownOpen} />
      </div>
    </div>
  );
};

export default Header;
