// TYPES
export interface ITask {
  name: string;
  desc: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string;
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
