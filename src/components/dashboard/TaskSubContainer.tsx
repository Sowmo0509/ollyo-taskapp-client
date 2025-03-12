import { ITask, ITaskSubContainerProps } from "@/types";
import TaskCard from "@/components/dashboard/TaskCard";
import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import debounce from "lodash/debounce";
import { IconSearch } from "@tabler/icons-react";

interface TaskSubContainerProps extends ITaskSubContainerProps {
  onTaskDeleted: () => void;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

const TaskSubContainer = ({ title, tasks = [], onTaskDeleted, status }: TaskSubContainerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const searchTasks = async (query: string) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/search?q=${query}&status=${status}`, {
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
      setFilteredTasks(tasks);
    }
  };

  return (
    <div className="border rounded-lg bg-zinc-100/50 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h6 className="text-lg font-medium">{title}</h6>
          <div className="relative">
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={handleSearch} className="w-full pl-9 pr-3 py-1.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>
        <hr />
        {(searchTerm ? filteredTasks : tasks).length > 0 ? <TaskList tasks={searchTerm ? filteredTasks : tasks} onTaskDeleted={onTaskDeleted} /> : <EmptyTaskList />}
      </div>
    </div>
  );
};

export default TaskSubContainer;

const EmptyTaskList = () => <div className="text-center py-4 flex h-full justify-center items-center text-zinc-500">No task here!</div>;

const TaskList = ({ tasks, onTaskDeleted }: { tasks: ITask[]; onTaskDeleted: () => void }) => (
  <div className="flex flex-col gap-y-3">
    {tasks.map((task: ITask, i: number) => (
      <TaskCard task={task} key={i} onTaskDeleted={onTaskDeleted} />
    ))}
  </div>
);
