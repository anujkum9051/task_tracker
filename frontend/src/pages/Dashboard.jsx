import { AlertTriangle, CheckCircle2, ClipboardList } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'Done').length;
    const overdue = tasks.filter(
      (task) => task.status !== 'Done' && new Date(task.dueDate) < new Date()
    ).length;

    return { total: tasks.length, completed, overdue };
  }, [tasks]);

  const cards = [
    { label: 'Total tasks', value: summary.total, icon: ClipboardList, tone: 'text-brand' },
    { label: 'Completed', value: summary.completed, icon: CheckCircle2, tone: 'text-emerald-600' },
    { label: 'Overdue', value: summary.overdue, icon: AlertTriangle, tone: 'text-red-600' }
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Track delivery health across assigned work.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-md border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                <Icon className={card.tone} size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-ink">{loading ? '...' : card.value}</p>
            </article>
          );
        })}
      </div>

      <div className="rounded-md border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <h3 className="font-bold text-ink">Upcoming work</h3>
        </div>
        <div className="divide-y divide-line">
          {tasks.slice(0, 6).map((task) => (
            <div key={task.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto]">
              <div>
                <p className="font-semibold text-ink">{task.title}</p>
                <p className="text-sm text-slate-600">{task.projectId?.name}</p>
              </div>
              <p className="text-sm text-slate-600">{task.status}</p>
              <p className="text-sm text-slate-600">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          ))}
          {!loading && tasks.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">No tasks yet.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
