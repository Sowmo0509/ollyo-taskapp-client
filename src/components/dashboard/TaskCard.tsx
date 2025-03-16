import { useState, useRef } from "react";
import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";
import { IconClock, IconTrash, IconGripVertical } from "@tabler/icons-react";
import Tooltip from "../global/Tooltip";
import { useAuthStore } from "@/store/authStore";
import ConfirmDialog from "../global/ConfirmDialog";
import UserAvatar from "../global/UserAvatar";
import { useDrag, useDrop } from "react-dnd";

interface TaskCardProps {
  task: ITask;
  onTaskDeleted: () => void;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  onTaskStatusChange: (taskId: number, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => Promise<void>;
  onMoveTask: (draggedId: number, hoverId: number) => Promise<void>;
  index: number;
}

const TaskCard = ({ task, onTaskDeleted, status, onMoveTask, index }: TaskCardProps) => {
  const user = useAuthStore((state) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    hover: (item: { id: number, status: string, index: number }, monitor) => {
      if (!cardRef.current) return;
      
      // Don't replace items with themselves
      if (item.id === task.id) return;
      
      // Only handle if it's in the same column
      if (item.status === task.status) {
        // Time to actually perform the action
        onMoveTask(item.id, task.id);
        
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for performance reasons
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect the drag and drop refs to our element ref
  dragRef(cardRef);
  dropRef(cardRef);

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
      <div 
        ref={cardRef} 
        className={`bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-0 cursor-move ${isDragging ? "opacity-50" : "opacity-100"} ${isOver ? "border-2 border-indigo-300" : ""}`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <IconGripVertical className="h-4 w-4 text-zinc-300" />
              <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>
            </div>

            <Tooltip text={task.user?.name || "Unknown User"}>
              <UserAvatar size={24} fontSize="0.7rem" name={task.user?.name || "XX"} />
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
            {user?.email === task.user?.email && (
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
