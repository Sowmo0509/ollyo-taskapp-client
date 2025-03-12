import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskSubContainer from "@/components/dashboard/TaskSubContainer";
import CreateTaskForm from "@/components/dashboard/CreateTaskForm";
import { ITask } from "@/types";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const navigate = useNavigate();

  // Update your fetchTasks function
  const fetchTasks = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("http://localhost:8000/api/tasks", {
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
        // Handle unauthorized access
        console.error("Unauthorized access, redirecting to login");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="px-8 py-4 rounded-b-lg border-zinc-100 border-x-2 border-b-2">
      <div className="mb-6 flex justify-end">
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create New Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 bg-white p-4 rounded-lg">
        <TaskSubContainer title="To Do" tasks={todoTasks} onTaskDeleted={fetchTasks} />
        <TaskSubContainer title="In Progress" tasks={inProgressTasks} onTaskDeleted={fetchTasks} />
        <TaskSubContainer title="Done" tasks={doneTasks} onTaskDeleted={fetchTasks} />
      </div>

      <CreateTaskForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={fetchTasks} />
    </div>
  );
};

export default Dashboard;
