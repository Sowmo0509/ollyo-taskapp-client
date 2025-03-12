import { ITask, ITaskSubContainerProps } from "@/types";
import TaskCard from "@/components/dashboard/TaskCard";

interface TaskSubContainerProps extends ITaskSubContainerProps {
  onTaskDeleted: () => void;
}

const TaskSubContainer = ({ title, tasks = [], onTaskDeleted }: TaskSubContainerProps) => {
  return (
    <div className="border rounded-lg bg-zinc-100/50 p-4">
      <h6 className="text-lg font-medium">{title}</h6>
      <hr className="mt-2 mb-3" />
      {tasks.length > 0 ? <TaskList tasks={tasks} onTaskDeleted={onTaskDeleted} /> : <EmptyTaskList />}
    </div>
  );
};

export default TaskSubContainer;

const EmptyTaskList = () => <div className="text-center py-4 flex h-full justify-center items-center text-zinc-500">No task here!</div>;

const TaskList = ({ tasks, onTaskDeleted }: { tasks: ITask[]; onTaskDeleted: () => void }) => (
  <div className="flex flex-col gap-y-3">
    {tasks.map((task: ITask, i: number) => (
      <TaskCard task={task} key={i} onTaskDeleted={onTaskDeleted} />
    ))}
  </div>
);
