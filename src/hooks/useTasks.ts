import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITask } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { usePusher } from "@/hooks/usePusher";

export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("http://82.25.105.116:8000/api/tasks?sort=asc", {
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

  const handleTaskStatusChange = async (taskId: number, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://82.25.105.116:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error("Error updating task status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Pusher listeners
  usePusher("tasks", "task.updated", fetchTasks);
  usePusher("tasks", "task.created", fetchTasks);
  usePusher("tasks", "task.deleted", fetchTasks);

  return {
    tasks,
    fetchTasks,
    handleTaskStatusChange,
  };
};
