import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";

const TaskCard = ({ task }: { task: ITask }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-y-2">
      <StatusBadge text={task.status} variant={task.status} />
      <div className="w-full">
        <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>
        <p className="text-zinc-500 leading-6 tracking-tight text-sm">{task.description}</p>
        <div className="mt-2 text-xs text-zinc-400">
          Due: {formatDate(task.due_date)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
