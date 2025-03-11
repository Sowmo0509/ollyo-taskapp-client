import { ITask } from "@/types";
import StatusBadge from "../global/StatusBadge";

const TaskCard = ({ task }: { task: ITask }) => {
  return (
    <div className="bg-white p-4 shadow-lg shadow-zinc-300/40 rounded-lg items-start flex flex-col gap-y-2">
      {/* name, desc, status, due date */}
      {/* <StatusBadge text={task.status} variant={task.status} /> */}
      <div>
        <p className="text-lg font-medium leading-6 tracking-tight">{task.name}</p>
        <p className="text-zinc-400 leading-6 tracking-tight">Description here</p>
      </div>
    </div>
  );
};

export default TaskCard;
