import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, ClipboardCheck, Video, User } from 'lucide-react';

export default function AppShell() {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Job Scanner', path: '/dashboard/scanner', icon: Code }, // Using Code icon as placeholder or appropriate one
        { name: 'History', path: '/dashboard/history', icon: ClipboardCheck },
        { name: 'Practice', path: '/dashboard/practice', icon: Code },
        { name: 'Assessments', path: '/dashboard/assessments', icon: ClipboardCheck },
        { name: 'Resources', path: '/dashboard/resources', icon: Video },
        { name: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 hidden md:flex flex-col border-r border-indigo-800">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white tracking-wide">Placement Prep</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-700 text-white'
                                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            JS
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white">John Smith</p>
                            <p className="text-xs text-indigo-300">Student</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (visible only on small screens) */}
                <header className="bg-white border-b border-gray-200 md:hidden p-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-indigo-600">Placement Prep</h1>
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                </header>

                {/* Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
                    {/* Breadcrumb / Title could go here */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
                        {location.pathname.split('/').pop() || 'Dashboard'}
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
