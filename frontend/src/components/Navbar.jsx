import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, LogOut, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    return (
        <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                    <CheckSquare size={28} />
                    <span className="text-xl font-bold tracking-tight">MiniPM</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {token && (
                        <button 
                            onClick={logout}
                            className="flex items-center space-x-1 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline font-medium">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
