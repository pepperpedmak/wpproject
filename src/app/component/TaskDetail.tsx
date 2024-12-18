import React from "react";
interface Task {
    id: number;
    title: string;
    description: string;
    dueDate?: string;
    priority?: string;
    member?: string;
  }
interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
      {/* Task Detail Content */}
    </div>
  );
};

export default TaskDetail;