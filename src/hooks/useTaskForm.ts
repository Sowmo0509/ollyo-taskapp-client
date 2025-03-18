import { useState } from "react";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";

export const taskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters").max(100, "Task name cannot exceed 100 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").max(500, "Description cannot exceed 500 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  due_date: z
    .string()
    .refine((val) => val.length > 0, "Due date is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid date format"),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const useTaskForm = (onSuccess: () => void) => {
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
      const fieldSchema = z.object({ [name]: taskSchema.shape[name as keyof typeof taskSchema.shape] });
      fieldSchema.parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === name);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        }
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
        resetForm();
        onSuccess();
      } else if (response.status === 401) {
        console.error("Unauthorized access");
      } else {
        console.error("Error creating task:", await response.text());
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "TODO",
      due_date: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleChange,
    resetForm,
  };
};