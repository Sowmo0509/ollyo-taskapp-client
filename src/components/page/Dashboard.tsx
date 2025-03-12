import { useState, useEffect } from "react";
import TaskSubContainer from "@/components/dashboard/TaskSubContainer";
import CreateTaskForm from "@/components/dashboard/CreateTaskForm";
import { ITask } from "@/types";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === "TODO");
  const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter(task => task.status === "DONE");

  return (
    <div className="px-8 py-4 rounded-b-lg border-x-2 border-b-2">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-8 bg-white p-4 rounded-lg">
        <TaskSubContainer title="To Do" tasks={todoTasks} />
        <TaskSubContainer title="In Progress" tasks={inProgressTasks} />
        <TaskSubContainer title="Done" tasks={doneTasks} />
      </div>

      <CreateTaskForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};

export default Dashboard;
