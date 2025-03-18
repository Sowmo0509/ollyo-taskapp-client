import { useTaskForm } from "@/hooks/useTaskForm";
import FormField from "@/components/form/FormField";

interface CreateTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskForm = ({ isOpen, onClose, onTaskCreated }: CreateTaskFormProps) => {
  const { formData, errors, isSubmitting, handleSubmit, handleChange } = useTaskForm(() => {
    onClose();
    onTaskCreated();
  });

  if (!isOpen) return null;

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

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
          <FormField label="Task Name" name="name" type="text" value={formData.name} onChange={handleChange} error={errors.name} />
          <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} error={errors.description} />
          <FormField label="Status" name="status" type="select" value={formData.status} onChange={handleChange} error={errors.status} options={statusOptions} />
          <FormField label="Due Date" name="due_date" type="date" value={formData.due_date} onChange={handleChange} error={errors.due_date} />

          <div className="flex gap-x-3 justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || Object.values(errors).some((error) => error !== "")} className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting || Object.values(errors).some((error) => error !== "") ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
