import { z } from "zod";

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

// Helper function to validate a single field
export const validateField = (schema: z.ZodObject<any>, name: string, value: string): string => {
  try {
    const fieldSchema = z.object({ [name]: schema.shape[name as keyof typeof schema.shape] });
    fieldSchema.parse({ [name]: value });
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find((e) => e.path[0] === name);
      if (fieldError) {
        return fieldError.message;
      }
    }
    return "Invalid input";
  }
};
