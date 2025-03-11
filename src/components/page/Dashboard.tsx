import { TASKS } from "@/data/dummy";
import TaskSubContainer from "@/components/dashboard/TaskSubContainer";

const Dashboard = () => {
  return (
    <div className="px-8 py-4 rounded-b-lg border-x-2 border-b-2">
      {/* 3 sections holder grid */}
      <div className="grid grid-cols-3 gap-x-8 bg-white p-4 rounded-lg">
        <TaskSubContainer title="To Do" tasks={TASKS} />
        <TaskSubContainer title="In Progress" tasks={TASKS} />
        <TaskSubContainer title="Done" tasks={[]} />
      </div>
    </div>
  );
};

export default Dashboard;
