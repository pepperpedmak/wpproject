import React, { useState } from "react";
import EditTask from "./EditTask";
import TaskDetail from "./TaskDetail";

// Define Task interface
interface Task {
    id: number;
    title: string;
    description: string;
}

const ToDoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: "Design Web", description: "Create a new web design for the client" },
    ]);
    const [newTask, setNewTask] = useState<string>("");

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For the sidebar

    const startEditing = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setEditTask(task);
        setIsEditing(true);
    };

    const saveEdit = (updatedTask: Task) => {
        setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
        setIsEditing(false);
        setEditTask(null);
    };

    const addTask = () => {
        if (newTask.trim() === "") return;
        const task: Task = { id: Date.now(), title: newTask, description: "" };
        setTasks([...tasks, task]);
        setNewTask("");
    };

    const deleteTask = (id: number,e: React.MouseEvent) => {
        setTasks(tasks.filter((task) => task.id !== id));
        e.stopPropagation(); 
    };

    const viewTaskDetails = (task: Task) => {
        setSelectedTask(task);
    };

    const closeTaskDetail = () => {
        setSelectedTask(null); // Close sidebar
    };

    return (
        <div className="bg-purple-100 rounded-lg p-6 w-64 font-sans shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">TO DO</h2>

            {/* Task List */}
            <div className="space-y-3 mb-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm relative group"
                        onClick={() => viewTaskDetails(task)}
                    >
                        <div className="flex items-center">
                            <span className="text-red-500">🚩</span>
                            <span className="text-gray-800 text-base font-semibold">{task.title}</span>
                        </div>

                        {/* Ellipsis Vertical */}
                        <div className="relative inline-block">
                            <div className="cursor-pointer hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </div>

                            {/* Hover Menu in Horizontal */}
                            <div className="absolute top-[-4px] right-0 hidden group-hover:flex flex-row bg-white shadow-md border rounded-lg h-8">
                                <button
                                    onClick={(e) => startEditing(task, e)}
                                    className="flex items-center text-sm text-gray-400 hover:text-black px-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => deleteTask(task.id,e)}
                                    className="flex items-center text-sm text-red-400 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                                <button
                                    className="flex items-center text-sm text-gray-400 "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>

                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Task Button */}
            <button
                onClick={addTask}
                className="bg-purple-500 text-white p-2 rounded-md w-full border border-dotted border-[2px] border-green-100"
            >
                <div className="flex items-center gap-2 justify-center">
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
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    <span>Add New Task</span>
                </div>
            </button>

            {isEditing && editTask && (
                <EditTask task={editTask} onSave={saveEdit} onCancel={() => setIsEditing(false)} />
            )}

            {/* Task Detail Sidebar */}
            {selectedTask && (
                <TaskDetail task={selectedTask} onClose={closeTaskDetail} />
            )}
        </div>
    );
};

export default ToDoList;
