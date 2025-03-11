import { ITask } from "@/types";

export const TASKS: ITask[] = [
  {
    name: "Complete React Assignment",
    description: "Finish the to-do app with all functionalities",
    status: "TODO",
    due_date: "2025-03-15",
  },
  {
    name: "Grocery Shopping",
    description: "Buy vegetables, fruits, and dairy products",
    status: "IN_PROGRESS",
    due_date: "2025-03-12",
  },
  {
    name: "Read Laravel Documentation",
    description: "Go through Eloquent ORM and Middleware sections",
    status: "DONE",
    due_date: "2025-03-10",
  },
];
