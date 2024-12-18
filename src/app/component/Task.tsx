import React, { useState, useEffect } from "react";
import { getTask , addTask , editTask ,deleteTask } from "../serverAction/serverAction";
import TaskDetail from "./TaskDetail";
import AddTaskModal from "./AddtaskModal";


// Task Interface
interface Task {
  id: number;
  title: string;
  description: string;
  dueDate?: string;
  priority?: string;
  member?: string;
}

// Task Detail Sidebar
interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTask();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = async (id: number) => {
    try {
      await deleteTask(id); // Assuming deleteTask expects a string
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 w-64 font-sans shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">TO DO</h2>
      <div className="space-y-3 mb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-2 rounded-lg shadow-sm flex justify-between items-center cursor-pointer"
          >
            <span onClick={() => setSelectedTask(task)} className="text-gray-800 flex-grow">
              {task.title}
            </span>
            <button
              onClick={() => {
                setTaskToEdit(task);
                setIsAdding(true);
              }}
              className="text-blue-500 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setTaskToEdit(null);
          setIsAdding(true);
        }}
        className="bg-purple-500 text-white p-2 rounded-md w-full"
      >
        Add New Task
      </button>

      {isAdding && (
        <AddTaskModal
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onClose={() => setIsAdding(false)}
          taskToEdit={taskToEdit}
        />
      )}
      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
};

export default ToDoList;