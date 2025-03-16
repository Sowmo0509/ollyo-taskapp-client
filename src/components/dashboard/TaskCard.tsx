import { useState, useRef } from "react";
import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";
import { IconClock, IconTrash, IconGripVertical, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import Tooltip from "../global/Tooltip";
import { useAuthStore } from "@/store/authStore";
import ConfirmDialog from "../global/ConfirmDialog";
import UserAvatar from "../global/UserAvatar";
import { useDrag, useDrop } from "react-dnd";
import { taskSchema, validateField } from "@/utils/validationSchemas";

interface TaskCardProps {
  task: ITask;
  onTaskDeleted: () => void;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  onTaskStatusChange: (taskId: number, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => Promise<void>;
  onMoveTask?: (draggedId: number, hoverId: number) => Promise<void>;
  index?: number;
}

const TaskCard = ({ task, onTaskDeleted, status, onTaskStatusChange, onMoveTask, index }: TaskCardProps) => {
  const user = useAuthStore((state) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: task.name,
    description: task.description,
    due_date: task.due_date.split('T')[0], // Format date for input
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Add useDrop hook for reordering within the same column
  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    hover: (item: { id: number; status: string; index: number }) => {
      if (!onMoveTask) return;
      
      // Don't replace items with themselves
      if (item.id === task.id) return;
      
      // Only handle items in the same column
      if (item.status !== status) return;
      
      // Call the onMoveTask function to reorder tasks
      onMoveTask(item.id, task.id);
      
      // Update the index of the dragged item
      item.index = index!;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Create a combined ref for both drag and drop
  const ref = (node: HTMLDivElement) => {
    dragRef(node);
    dropRef(node);
    cardRef.current = node;
  };

  // Replace the dragRef(cardRef) line with our combined ref
  // dragRef(cardRef); - Remove this line

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
    // Update this to ensure we have the correct date format when editing
    setEditData({
      name: task.name,
      description: task.description,
      due_date: new Date(task.due_date).toISOString().split("T")[0], // Properly format date for input
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: task.name,
      description: task.description,
      due_date: new Date(task.due_date).toISOString().split("T")[0], // Use same format here
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });

    // Validate the field as the user types
    const error = validateField(taskSchema, name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);

      // Validate all fields
      const validationResult = taskSchema.safeParse({
        ...editData,
        status: task.status, // Keep the current status
      });

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          formattedErrors[field] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }

      const token = useAuthStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...editData,
          status: task.status,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onTaskDeleted(); // Refresh the task list
      } else {
        console.error("Error updating task:", await response.text());
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div 
        ref={ref} 
        className={`bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-2 
          ${isDragging ? "opacity-50 scale-105 rotate-1 shadow-xl z-10" : "opacity-100"} 
          ${isOver ? "border-2 border-indigo-300 bg-indigo-50" : ""}
          ${isEditing ? "cursor-default" : "cursor-move"}
          transition-all duration-300 ease-in-out`}
      >
        {isEditing ? (
          // Edit mode
          <>
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Task Name</label>
              <input type="text" name="name" value={editData.name} onChange={handleChange} className={`w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.name ? "focus:ring-red-500" : "focus:ring-indigo-500"}`} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={editData.description} onChange={handleChange} rows={2} className={`w-full rounded-md border ${errors.description ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.description ? "focus:ring-red-500" : "focus:ring-indigo-500"}`} />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" name="due_date" value={editData.due_date} onChange={handleChange} className={`w-full rounded-md border ${errors.due_date ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.due_date ? "focus:ring-red-500" : "focus:ring-indigo-500"}`} />
              {errors.due_date && <p className="mt-1 text-xs text-red-500">{errors.due_date}</p>}
            </div>

            <div className="flex justify-end gap-x-2 mt-2 w-full">
              <button onClick={handleCancelEdit} className="flex items-center gap-x-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                <IconX size={14} />
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={isSaving || Object.values(errors).some((error) => error !== "")} className={`flex items-center gap-x-1 px-2 py-1 text-xs font-medium text-white rounded-md ${isSaving || Object.values(errors).some((error) => error !== "") ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                <IconCheck size={14} />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          // View mode
          <>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconGripVertical className="h-4 w-4 text-zinc-300" />
                  <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>
                </div>

                <div className="flex items-center gap-x-2">
                  <Tooltip text={task.user?.name || "Unknown User"}>
                    <UserAvatar size={24} fontSize="0.7rem" name={task.user?.name || "XX"} />
                  </Tooltip>

                  {user?.email === task.user?.email && (
                    <Tooltip text="Edit task">
                      <button onClick={handleEdit} className="text-gray-400 hover:text-indigo-500 transition-colors">
                        <IconEdit className="size-4" />
                      </button>
                    </Tooltip>
                  )}
                </div>
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
          </>
        )}
      </div>

      <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Task" message="Are you sure you want to delete this task? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />
    </>
  );
};

export default TaskCard;
