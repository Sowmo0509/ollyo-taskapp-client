import { IconSearch } from "@tabler/icons-react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, onSearch }: SearchBarProps) => (
  <div className="relative w-full sm:w-80">
    <input type="text" placeholder="Search all tasks..." value={searchTerm} onChange={onSearch} className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
    <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
  </div>
);

export default SearchBar;
