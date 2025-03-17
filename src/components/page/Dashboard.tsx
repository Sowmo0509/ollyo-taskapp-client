import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskSubContainer from "@/components/dashboard/TaskSubContainer";
import CreateTaskForm from "@/components/dashboard/CreateTaskForm";
import { ITask } from "@/types";
import { useAuthStore } from "@/store/authStore";
import debounce from "lodash/debounce";
import { IconSearch } from "@tabler/icons-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePusher } from '@/hooks/usePusher';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("http://localhost:8000/api/tasks?sort=asc", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  // Filter tasks by status
  const getTasksByStatus = (status: string) => {
    if (searchTerm) {
      return filteredTasks.filter((task) => task.status === status);
    }
    return tasks.filter((task) => task.status === status);
  };

  const todoTasks = getTasksByStatus("TODO");
  const inProgressTasks = getTasksByStatus("IN_PROGRESS");
  const doneTasks = getTasksByStatus("DONE");

  // Add real-time updates for tasks
  usePusher('tasks', 'task.updated', (data) => {
    fetchTasks(); // Refresh tasks when we receive an update
  });

  const handleTaskStatusChange = async (taskId: number, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // No need to call fetchTasks here as the broadcast event will trigger it
        // fetchTasks() is removed as it will be called by the Pusher event
      } else {
        console.error("Error updating task status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4 rounded-b-lg border-zinc-100 border-x-2 border-b-2">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="relative w-full sm:w-80">
          <input type="text" placeholder="Search all tasks..." value={searchTerm} onChange={handleSearch} className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create New Task
        </button>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 bg-white p-4 rounded-lg">
          <TaskSubContainer 
            title="To Do" 
            tasks={todoTasks} 
            onTaskDeleted={fetchTasks} 
            status="TODO" 
            onTaskStatusChange={handleTaskStatusChange}
          />
          <TaskSubContainer 
            title="In Progress" 
            tasks={inProgressTasks} 
            onTaskDeleted={fetchTasks} 
            status="IN_PROGRESS" 
            onTaskStatusChange={handleTaskStatusChange}
          />
          <TaskSubContainer 
            title="Done" 
            tasks={doneTasks} 
            onTaskDeleted={fetchTasks} 
            status="DONE" 
            onTaskStatusChange={handleTaskStatusChange}
          />
        </div>
      </DndProvider>

      <CreateTaskForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={fetchTasks} />
    </div>
  );
};

export default Dashboard;
