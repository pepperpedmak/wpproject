import React, { useState } from "react";

// Define Task interface for this component too
interface Task {
    id: number;
    title: string;
    description: string;
}

interface EditTaskProps {
    task: Task;
    onSave: (updatedTask: Task) => void;
    onCancel: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onSave, onCancel }) => {
    const [editedTask, setEditedTask] = useState<Task>(task);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-xl font-bold mb-4">{task.title}</h3>
                <textarea
                    value={editedTask.title}
                    onChange={(e) =>
                        setEditedTask({ ...editedTask, title: e.target.value })
                    }
                    className="border-b border-1 outline-none w-28"
                    rows={4}
                ></textarea>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(editedTask)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
