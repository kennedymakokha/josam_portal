"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const link_1 = __importDefault(require("next/link"));
const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Vendors', path: '/dashboard/vendors' },
    { name: 'Users', path: '/users' },
    { name: 'Settings', path: '/settings' },
];
function Sidebar() {
    return (<div className="w-64 bg-slate-800 shadow-md hidden md:block">
            <div className="p-4 text-xl font-bold">Admin Portal</div>
            <nav className="p-4 space-y-2">
                {navItems.map(item => (<link_1.default key={item.path} href={item.path}>
                        <span className="block p-2 rounded hover:bg-gray-200">{item.name}</span>
                    </link_1.default>))}
            </nav>
        </div>);
}
