// TYPES
export interface ITask {
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  due_date: string;
}

// PROPS
export interface ITaskSubContainerProps {
  title: string;
  tasks: ITask[];
}

export interface IStatusBadgeProps {
  text: string;
  variant: "DEFAULT" | "TODO" | "IN_PROGRESS" | "DONE";
}
