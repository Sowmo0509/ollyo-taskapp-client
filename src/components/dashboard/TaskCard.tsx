import { useState } from "react";
import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";
import { IconClock, IconTrash } from "@tabler/icons-react";
import Tooltip from "../global/Tooltip";
import { useAuthStore } from "@/store/authStore";
import ConfirmDialog from "../global/ConfirmDialog";
import UserAvatar from "../global/UserAvatar";

interface TaskCardProps {
  task: ITask;
  onTaskDeleted: () => void;
}

const TaskCard = ({ task, onTaskDeleted }: TaskCardProps) => {
  const user = useAuthStore((state) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        onTaskDeleted();
      } else {
        console.error("Error deleting task:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-0">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>

            <Tooltip text={task.user?.name || "Unknown User"}>
              <UserAvatar size="6" fontSize="0.7rem" name={task.user?.name || "XX"} />
            </Tooltip>
          </div>
        </div>

        <p className="text-zinc-500 leading-6 tracking-tight text-sm">{task.description}</p>
        <div className="flex justify-between w-full items-center mt-2 text-xs text-zinc-400">
          <div className="flex items-center gap-x-1">
            <IconClock className="size-3 text-red-500" />
            {formatDate(task.due_date)}
          </div>

          <div className="flex items-center gap-x-2">
            <StatusBadge text={task.status} variant={task.status as any} />
            {user?.email == task.user?.email && (
              <div className="flex items-center">
                <Tooltip text="Delete task">
                  <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <IconTrash className="size-4" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Task" message="Are you sure you want to delete this task? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />
    </>
  );
};

export default TaskCard;
