import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const initialTask = {
  title: '',
  description: '',
  status: 'Todo',
  dueDate: '',
  assignedTo: '',
  projectId: ''
};

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', project: '', assignedTo: '', search: '' });
  const [form, setForm] = useState(initialTask);
  const [loading, setLoading] = useState(true);

  const loadMeta = async () => {
    try {
      const [projectResponse, userResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projectResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filters.status, filters.project, filters.assignedTo]);

  const groupedTasks = useMemo(
    () => ({
      Todo: tasks.filter((task) => task.status === 'Todo'),
      'In Progress': tasks.filter((task) => task.status === 'In Progress'),
      Done: tasks.filter((task) => task.status === 'Done')
    }),
    [tasks]
  );

  const handleSearch = (event) => {
    event.preventDefault();
    loadTasks();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks', form);
      setForm(initialTask);
      toast.success('Task created');
      loadTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      toast.success('Task updated');
      loadTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      loadTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Tasks</h2>
        <p className="mt-1 text-sm text-slate-600">Plan, assign, filter, and move work forward.</p>
      </div>

      <form
        className="grid gap-3 rounded-md border border-line bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_180px_auto]"
        onSubmit={handleSearch}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
          <input
            className="focus-ring h-10 w-full rounded-md border border-line pl-9 pr-3"
            placeholder="Search tasks"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </div>
        <select
          className="focus-ring h-10 rounded-md border border-line bg-white px-3"
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
        >
          <option value="">All statuses</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          className="focus-ring h-10 rounded-md border border-line bg-white px-3"
          value={filters.project}
          onChange={(event) => setFilters({ ...filters, project: event.target.value })}
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          className="focus-ring h-10 rounded-md border border-line bg-white px-3"
          value={filters.assignedTo}
          onChange={(event) => setFilters({ ...filters, assignedTo: event.target.value })}
          disabled={!isAdmin}
        >
          <option value="">All assignees</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {isAdmin ? (
        <form className="rounded-md border border-line bg-white p-4 shadow-sm" onSubmit={handleCreate}>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink">
            <Plus size={18} />
            Create task
          </h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Title">
              <input
                className="focus-ring h-10 w-full rounded-md border border-line px-3"
                required
                minLength={2}
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
            <Field label="Project">
              <select
                className="focus-ring h-10 w-full rounded-md border border-line bg-white px-3"
                required
                value={form.projectId}
                onChange={(event) => setForm({ ...form, projectId: event.target.value })}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <select
                className="focus-ring h-10 w-full rounded-md border border-line bg-white px-3"
                required
                value={form.assignedTo}
                onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}
              >
                <option value="">Select assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Due date">
              <input
                className="focus-ring h-10 w-full rounded-md border border-line px-3"
                type="date"
                required
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </Field>
            <Field label="Status">
              <select
                className="focus-ring h-10 w-full rounded-md border border-line bg-white px-3"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </Field>
            <div className="md:col-span-2 xl:col-span-3">
              <Field label="Description">
                <textarea
                  className="focus-ring min-h-24 w-full rounded-md border border-line px-3 py-2"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </Field>
            </div>
          </div>
          <Button className="mt-4" type="submit">
            Create task
          </Button>
        </form>
      ) : null}

      {loading ? <p className="text-sm text-slate-500">Loading tasks...</p> : null}
      <div className="grid gap-4 xl:grid-cols-3">
        {Object.entries(groupedTasks).map(([status, items]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink">{status}</h3>
              <span className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-600">
                {items.length}
              </span>
            </div>
            {items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isAdmin={isAdmin}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ))}
      </div>
      {!loading && tasks.length === 0 ? (
        <p className="rounded-md border border-line bg-white px-4 py-8 text-center text-sm text-slate-500">
          No tasks match the current filters.
        </p>
      ) : null}
    </section>
  );
}
