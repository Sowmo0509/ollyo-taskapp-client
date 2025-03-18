import { useState, useEffect } from "react";
import TaskSubContainer from "@/components/dashboard/TaskSubContainer";
import CreateTaskForm from "@/components/dashboard/CreateTaskForm";
import SearchBar from "@/components/dashboard/SearchBar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTasks } from "@/hooks/useTasks";
import { useTaskSearch } from "@/hooks/useTaskSearch";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, fetchTasks, handleTaskStatusChange } = useTasks();
  const { searchTerm, filteredTasks, handleSearch } = useTaskSearch();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filtering tasks by status
  const getTasksByStatus = (status: string) => {
    if (searchTerm) {
      return filteredTasks.filter((task) => task.status === status);
    }
    return tasks.filter((task) => task.status === status);
  };

  const todoTasks = getTasksByStatus("TODO");
  const inProgressTasks = getTasksByStatus("IN_PROGRESS");
  const doneTasks = getTasksByStatus("DONE");

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4 rounded-b-lg border-zinc-100 border-x-2 border-b-2">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create New Task
        </button>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 bg-white p-4 rounded-lg">
          <TaskSubContainer title="To Do" tasks={todoTasks} onTaskDeleted={fetchTasks} status="TODO" onTaskStatusChange={handleTaskStatusChange} />
          <TaskSubContainer title="In Progress" tasks={inProgressTasks} onTaskDeleted={fetchTasks} status="IN_PROGRESS" onTaskStatusChange={handleTaskStatusChange} />
          <TaskSubContainer title="Done" tasks={doneTasks} onTaskDeleted={fetchTasks} status="DONE" onTaskStatusChange={handleTaskStatusChange} />
        </div>
      </DndProvider>

      <CreateTaskForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={fetchTasks} />
    </div>
  );
};

export default Dashboard;
