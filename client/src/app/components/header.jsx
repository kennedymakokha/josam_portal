export default function Header() {
    return (<header className="bg-slate-800 shadow p-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                {/* Notifications, Profile, etc. */}
                <div className="w-8 h-8 bg-gray-300 rounded-full"/>
            </div>
        </header>);
}
