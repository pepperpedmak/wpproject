import React, { useState, useEffect } from "react";
import { addTask, getTask, editTask, deleteTask } from "../serverAction/serverAction";

// Task Interface
interface Task {
  id: number;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
  member?: string;
}

// Task Detail Sidebar
interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  if (!task) return null;

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
        <p className="text-gray-600 mb-4">{task.description}</p>
        {task.startDate && <p className="text-sm text-gray-500">Start: {task.startDate}</p>}
        {task.endDate && <p className="text-sm text-gray-500">End: {task.endDate}</p>}
        {task.priority && <p className="text-sm text-gray-500">Priority: {task.priority}</p>}
        {task.member && <p className="text-sm text-gray-500">Assigned to: {task.member}</p>}
      </div>
    </div>
  );
};

// Add/Edit Task Modal
interface AddTaskModalProps {
  onAddTask: (task: Task) => void;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onAddTask, onClose, taskToEdit }) => {
  const [title, setTitle] = useState<string>(taskToEdit?.title || "");
  const [description, setDescription] = useState<string>(taskToEdit?.description || "");
  const [priority, setPriority] = useState<string>(taskToEdit?.priority || "");
  const [startDate, setStartDate] = useState<string>(taskToEdit?.startDate || "");
  const [endDate, setEndDate] = useState<string>(taskToEdit?.endDate || "");
  const [member, setMember] = useState<string>(taskToEdit?.member || "");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority || "");
      setStartDate(taskToEdit.startDate || "");
      setEndDate(taskToEdit.endDate || "");
      setMember(taskToEdit.member || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("");
      setStartDate("");
      setEndDate("");
      setMember("");
    }
  }, [taskToEdit]);

  const handleSave = () => {
    if (!title.trim()) return alert("Task title is required!");
    const updatedTask: Task = {
      id: taskToEdit?.id || Date.now(),
      title,
      description,
      priority,
      startDate,
      endDate,
    };
    onAddTask(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-lg rounded-md w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {taskToEdit ? "Edit Task" : "Add New Task"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Task Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            type="text"
            placeholder="Enter task name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Add task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            type="date"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            type="date"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTask();
        setTasks(data || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const convertTaskToFormData = (task: Task): FormData => {
    const formData = new FormData();
    formData.append("id", task.id.toString());
    formData.append("title", task.title);
    formData.append("description", task.description);
    if (task.startDate) formData.append("startDate", task.startDate);
    if (task.endDate) formData.append("endDate", task.endDate);
    if (task.priority) formData.append("priority", task.priority);
    if (task.member) formData.append("member", task.member);
    return formData;
  };

  const handleAddOrEditTask = async (task: Task) => {
    try {
      const formData = convertTaskToFormData(task);
      if (taskToEdit) {
        // If editing an existing task
        await editTask(task.id.toString(), formData);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? task : t))
        );
      } else {
        // If adding a new task
        await addTask(formData);
        setTasks((prevTasks) => [...prevTasks, task]);
      }
    } catch (error) {
      console.error("Failed to add or edit task:", error);
    }
    setTaskToEdit(null);
    setIsAdding(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id.toString() !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 w-64 font-sans shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">TO DO</h2>
      <div className="space-y-3 mb-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-2 rounded-lg shadow-sm flex justify-between items-center group relative"
            >
              <span onClick={() => setSelectedTask(task)} className="text-gray-800 flex-grow">
                {task.title}
              </span>
              <div className="hidden group-hover:flex space-x-2 absolute right-2">
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
                  onClick={() => handleDeleteTask(task.id.toString())}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tasks found.</p>
        )}
      </div>
      <button
        onClick={() => {
          setIsAdding(true);
          setTaskToEdit(null);
        }}
        className="bg-purple-500 text-white p-2 rounded-md w-full"
      >
        Add New Task
      </button>

      {isAdding && (
        <AddTaskModal
          onAddTask={handleAddOrEditTask}
          onClose={() => setIsAdding(false)}
          taskToEdit={taskToEdit}
        />
      )}
      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
};

export default ToDoList;