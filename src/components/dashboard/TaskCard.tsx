import { useState } from "react";
import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";
import { IconClock, IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<ITask>({ ...task });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleSave = async () => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editedTask),
      });

      if (response.ok) {
        onTaskDeleted(); // Reuse this to refresh tasks
        setIsEditing(false);
      } else {
        console.error("Error updating task:", await response.text());
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value,
    });
  };

  return (
    <>
      <div className="bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-0">
        <div className="w-full">
          <div className="flex items-center justify-between">
            {isEditing ? <input type="text" name="name" value={editedTask.name} onChange={handleChange} className="text-lg font-medium leading-6 tracking-tight w-full border-b border-indigo-300 focus:outline-none focus:border-indigo-500 pb-1" autoFocus /> : <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>}

            <Tooltip text={task.user?.name || "Unknown User"}>
              <UserAvatar size={24} fontSize="0.7rem" name={task.user?.name || "XX"} />
            </Tooltip>
          </div>
        </div>

        {isEditing ? <textarea name="description" value={editedTask.description} onChange={handleChange} className="text-zinc-500 leading-6 tracking-tight text-sm w-full mt-2 border border-zinc-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500" rows={3} /> : <p className="text-zinc-500 leading-6 tracking-tight text-sm">{task.description}</p>}

        <div className="flex justify-between w-full items-center mt-2 text-xs text-zinc-400">
          <div className="flex items-center gap-x-1">
            <IconClock className="size-3 text-red-500" />
            {isEditing ? <input type="date" name="due_date" value={editedTask.due_date.split("T")[0]} onChange={handleChange} className="border border-zinc-200 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500" /> : formatDate(task.due_date)}
          </div>

          <div className="flex items-center gap-x-2">
            <StatusBadge text={task.status} variant={task.status as any} />
            {user?.email === task.user?.email && (
              <div className="flex items-center gap-x-1">
                {isEditing ? (
                  <>
                    <Tooltip text="Save changes">
                      <button onClick={handleSave} className="text-gray-400 hover:text-green-500 transition-colors">
                        <IconCheck className="size-4" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Cancel editing">
                      <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition-colors">
                        <IconX className="size-4" />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip text="Edit task">
                      <button onClick={handleEdit} className="text-gray-400 hover:text-blue-500 transition-colors">
                        <IconEdit className="size-4" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete task">
                      <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <IconTrash className="size-4" />
                      </button>
                    </Tooltip>
                  </>
                )}
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
