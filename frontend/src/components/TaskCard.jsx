// import React from 'react';
import { CheckCircle, Circle, Trash2, Clock } from 'lucide-react';

const TaskCard = ({ task, onComplete, onDelete }) => {
    const isCompleted = task.status === 'Completed';
    const date = new Date(task.created_at).toLocaleDateString();

    return (
        <div className={`p-5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            isCompleted 
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75' 
                : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700'
        }`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                        isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-white'
                    }`}>
                        {task.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                        {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs font-medium">
                        <span className={`px-2.5 py-1 rounded-full ${
                            isCompleted 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : task.status === 'In Progress'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                            {task.status}
                        </span>
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Clock size={14} className="mr-1" />
                            {date}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                    {!isCompleted && (
                        <button 
                            onClick={() => onComplete(task.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-full transition-colors"
                            title="Mark as Complete"
                        >
                            <Circle size={20} />
                        </button>
                    )}
                    {isCompleted && (
                        <div className="p-2 text-green-500 dark:text-green-400">
                            <CheckCircle size={20} />
                        </div>
                    )}
                    <button 
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
