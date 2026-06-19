import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Search, Plus, Filter, SortDesc, ListTodo, CheckCircle2, CircleDashed } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            params.sort = sortOrder;

            const res = await axios.get('http://localhost:5000/api/tasks', { params });
            setTasks(res.data);
            
            const statsRes = await axios.get('http://localhost:5000/api/tasks/stats');
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search slightly
        const delay = setTimeout(() => {
            fetchTasks();
        }, 300);
        return () => clearTimeout(delay);
    }, [search, statusFilter, sortOrder]);

    const handleCreateTask = async (taskData) => {
        try {
            await axios.post('http://localhost:5000/api/tasks', taskData);
            setIsFormOpen(false);
            fetchTasks();
        } catch (err) {
            console.error('Error creating task', err);
        }
    };

    const handleCompleteTask = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: 'Completed' });
            fetchTasks();
        } catch (err) {
            console.error('Error completing task', err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task', err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Hello, {user?.username}</h1>
                    <p className="text-slate-600 dark:text-slate-400">Here's a summary of your tasks.</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="mt-4 md:mt-0 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-indigo-600/20"
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <ListTodo size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.completed}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
                        <CircleDashed size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.pending}</h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white shadow-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white shadow-sm appearance-none"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
                    >
                        <SortDesc size={18} className={sortOrder === 'oldest' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                    </button>
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                        <ListTodo size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No tasks found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        {search || statusFilter ? "Try adjusting your filters or search query." : "You haven't created any tasks yet. Click 'New Task' to get started."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onComplete={handleCompleteTask} 
                            onDelete={handleDeleteTask} 
                        />
                    ))}
                </div>
            )}

            {isFormOpen && (
                <TaskForm 
                    onSubmit={handleCreateTask} 
                    onClose={() => setIsFormOpen(false)} 
                />
            )}
        </div>
    );
};

export default Dashboard;
