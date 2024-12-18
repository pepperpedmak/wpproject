import React, { useState, useEffect } from "react";

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate?: string;
    priority?: string;
    member?: string;
  }
  
export interface AddTaskModalProps {
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  onAddTask,
  onUpdateTask,
  onClose,
  taskToEdit,
}) => {
  // Component logic here
  return <div>Modal Content</div>;
};

export default AddTaskModal;
