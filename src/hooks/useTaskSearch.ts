import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { ITask } from "@/types";
import { useAuthStore } from "@/store/authStore";

export const useTaskSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);

  const searchTasks = async (query: string) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/global-search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredTasks(data);
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchTasks(query);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setFilteredTasks([]);
    }
  };

  return {
    searchTerm,
    filteredTasks,
    handleSearch,
  };
};
