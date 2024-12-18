import React from "react";

// Define Task interface (you may already have this elsewhere in your code)
interface Task {
    id: number;
    title: string;
    description: string;
}

interface TaskDetailProps {
    task: Task | null;
    onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
    if (!task) {
        return null; // Return null if no task is selected
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
            <div className="w-96 bg-white p-6 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
            </div>
        </div>
    );
};

export default TaskDetail;
