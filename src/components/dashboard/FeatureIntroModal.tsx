import { IconCheck } from "@tabler/icons-react";

interface FeatureIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureIntroModal = ({ isOpen, onClose }: FeatureIntroModalProps) => {
  const features = [
    { id: 1, title: "Drag and Drop Tasks", description: "Easily organize tasks by dragging them between columns" },
    { id: 2, title: "Real-time Updates", description: "See task updates instantly with real-time synchronization" },
    { id: 3, title: "Search Functionality", description: "Quick search across all your tasks" },
    { id: 4, title: "Task Management", description: "Create, edit, and delete tasks with ease" },
    { id: 5, title: "WebSocket Integrated", description: "WebSocket present for realtime update and collab" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">taskapp</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 mb-4">Here are some key features that has been applied:</p>
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <IconCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{feature.title}</h5>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default FeatureIntroModal;
