import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { z } from "zod";

interface CreateTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

// Define the validation schema with Zod
const taskSchema = z.object({
  name: z.string()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name cannot exceed 100 characters"),
  description: z.string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  due_date: z.string()
    .refine(val => val.length > 0, "Due date is required")
    .refine(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid date format")
});

type TaskFormData = z.infer<typeof taskSchema>;

const CreateTaskForm = ({ isOpen, onClose, onTaskCreated }: CreateTaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    description: "",
    status: "TODO",
    due_date: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    try {
      // Create a partial schema for just this field
      const fieldSchema = z.object({ [name]: taskSchema.shape[name as keyof typeof taskSchema.shape] });
      fieldSchema.parse({ [name]: value });
      setErrors(prev => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path[0] === name);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [name]: fieldError.message }));
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate all fields
      const validatedData = taskSchema.parse(formData);
      
      const token = useAuthStore.getState().token;
      const response = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          status: "TODO",
          due_date: "",
        });
        setErrors({});
        onClose();
        onTaskCreated(); // Refresh the task list after creating a new task
      } else if (response.status === 401) {
        console.error("Unauthorized access");
        // Handle unauthorized access
      } else {
        console.error("Error creating task:", await response.text());
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error creating task:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate the field as the user types
    validateField(name, value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} 
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} 
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select 
              name="status" 
              id="status" 
              value={formData.status} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border ${errors.status ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.status ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input 
              type="date" 
              name="due_date" 
              id="due_date" 
              value={formData.due_date} 
              onChange={handleChange} 
              className={`mt-1 block w-full rounded-md border ${errors.due_date ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.due_date ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`} 
            />
            {errors.due_date && <p className="mt-1 text-xs text-red-500">{errors.due_date}</p>}
          </div>

          <div className="flex gap-x-3 justify-end mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || Object.values(errors).some(error => error !== "")}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting || Object.values(errors).some(error => error !== "") ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
