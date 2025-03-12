// TYPES
export interface ITask {
  id?: number;
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  due_date: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
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
