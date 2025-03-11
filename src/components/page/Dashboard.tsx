import StatusBadge from "../global/StatusBadge";

const Dashboard = () => {
  return (
    <div className="px-8 py-4 rounded-b-lg border-x border-b">
      {/* 3 sections holder grid */}
      <div className="grid grid-cols-3 gap-x-8 bg-white p-4 rounded-lg">
        <div className="border rounded-lg bg-zinc-100 p-4">
          <h6 className="text-lg font-medium">Todo</h6>
          <hr className="mt-2 mb-3" />
          <div className="bg-white p-4 shadow-lg rounded-lg items-start flex flex-col gap-y-3">
            {/* name, desc, status, due date */}
            <StatusBadge text="Hi" variant="DONE" />
            <div>
              <p className="text-lg font-medium leading-6 tracking-tight">Name here</p>
              <p className="text-zinc-400 leading-6 tracking-tight">Description here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
