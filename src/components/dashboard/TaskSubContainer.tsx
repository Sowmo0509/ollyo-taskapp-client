import { ITask, ITaskSubContainerProps } from "@/types";
import TaskCard from "@/components/dashboard/TaskCard";
import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import debounce from "lodash/debounce";
import { IconSearch, IconSortAscending, IconSortDescending } from "@tabler/icons-react";

interface TaskSubContainerProps extends ITaskSubContainerProps {
  onTaskDeleted: () => void;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

const TaskSubContainer = ({ title, tasks = [], onTaskDeleted, status }: TaskSubContainerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(false);

  const searchTasks = useCallback(async (query: string, sort: string) => {
    try {
      setIsLoading(true);
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/search?q=${query}&status=${status}&sort=${sort}`, {
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
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const debouncedSearch = useCallback(
    debounce((query: string, sort: string) => {
      searchTasks(query, sort);
    }, 300),
    [searchTasks]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim()) {
      debouncedSearch(query, sortDirection);
    } else {
      fetchSortedTasks();
    }
  };

  const fetchSortedTasks = async () => {
    try {
      setIsLoading(true);
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks?status=${status}&sort=${sortDirection}`, {
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
      console.error("Error fetching sorted tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = async () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    if (searchTerm) {
      await searchTasks(searchTerm, newDirection);
    } else {
      await fetchSortedTasks();
    }
  };

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <div className="border rounded-lg bg-zinc-100/50 p-4 h-fit">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <h6 className="text-lg font-medium">{title}</h6>
            <button onClick={handleSort} disabled={isLoading} className={`p-1 rounded-md transition-colors ${isLoading ? "bg-zinc-100 cursor-not-allowed" : "hover:bg-zinc-200"}`} title={`Sort by due date (${sortDirection === "asc" ? "ascending" : "descending"})`}>
              {sortDirection === "asc" ? <IconSortAscending className={`h-4 w-4 ${isLoading ? "text-zinc-400" : "text-zinc-600"}`} /> : <IconSortDescending className={`h-4 w-4 ${isLoading ? "text-zinc-400" : "text-zinc-600"}`} />}
            </button>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={handleSearch} className="w-full pl-9 pr-3 py-1.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>
        <hr />
        {filteredTasks.length > 0 ? <TaskList tasks={filteredTasks} onTaskDeleted={onTaskDeleted} /> : <EmptyTaskList />}
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
