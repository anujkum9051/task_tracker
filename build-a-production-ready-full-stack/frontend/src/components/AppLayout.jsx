import { ClipboardList, FolderKanban, LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import Button from './Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList }
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Team Task Manager</p>
            <h1 className="text-xl font-bold text-ink">Workspace command center</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-semibold text-ink">{user?.name}</p>
              <p className="capitalize text-slate-500">{user?.role}</p>
            </div>
            <Button variant="secondary" onClick={logout} title="Log out">
              <LogOut size={17} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `focus-ring flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-white'
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
