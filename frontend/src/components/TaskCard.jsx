import { CalendarDays, Trash2 } from 'lucide-react';
import Button from './Button.jsx';

const statusStyles = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-amber-100 text-amber-800',
  Done: 'bg-emerald-100 text-emerald-700'
};

export default function TaskCard({ task, isAdmin, onStatusChange, onDelete }) {
  const overdue = task.isOverdue || (task.status !== 'Done' && new Date(task.dueDate) < new Date());

  return (
    <article
      className={`rounded-md border bg-white p-4 shadow-sm ${
        overdue ? 'border-red-300' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{task.description || 'No description'}</p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-bold ${statusStyles[task.status]}`}>
          {task.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Project: {task.projectId?.name || 'Unassigned'}</p>
        <p>Assignee: {task.assignedTo?.name || 'Unknown'}</p>
        <p className={`flex items-center gap-1 ${overdue ? 'font-semibold text-red-600' : ''}`}>
          <CalendarDays size={15} />
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          className="focus-ring h-10 rounded-md border border-line bg-white px-3 text-sm"
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        {isAdmin ? (
          <Button variant="danger" onClick={() => onDelete(task.id)} title="Delete task">
            <Trash2 size={16} />
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  );
}
