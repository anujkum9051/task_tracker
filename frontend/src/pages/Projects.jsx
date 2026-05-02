import { Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [invite, setInvite] = useState({ name: '', email: '', role: 'member' });
  const [memberEdits, setMemberEdits] = useState({});

  const load = async () => {
    try {
      const [projectResponse, userResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projectResponse.data);
      setUsers(userResponse.data);
      setMemberEdits(
        Object.fromEntries(
          projectResponse.data.map((project) => [
            project.id,
            project.members?.map((member) => member.id) || []
          ])
        )
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '', members: [] });
      toast.success('Project created');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/users/invite', invite);
      toast.success(`Temporary password: ${data.temporaryPassword}`);
      setInvite({ name: '', email: '', role: 'member' });
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMembersUpdate = async (projectId) => {
    try {
      await api.put(`/projects/${projectId}/members`, {
        members: memberEdits[projectId] || []
      });
      toast.success('Members updated');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink">Projects</h2>
        <p className="mt-1 text-sm text-slate-600">Organize teams and delivery streams.</p>
      </div>

      {isAdmin ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form className="rounded-md border border-line bg-white p-4 shadow-sm" onSubmit={handleCreateProject}>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-ink">
              <Plus size={18} />
              Create project
            </h3>
            <div className="space-y-3">
              <Field label="Name">
                <input
                  className="focus-ring h-10 w-full rounded-md border border-line px-3"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className="focus-ring min-h-24 w-full rounded-md border border-line px-3 py-2"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </Field>
              <Field label="Members">
                <select
                  className="focus-ring min-h-28 w-full rounded-md border border-line bg-white px-3 py-2"
                  multiple
                  value={form.members}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      members: Array.from(event.target.selectedOptions, (option) => option.value)
                    })
                  }
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </Field>
              <Button type="submit">Create project</Button>
            </div>
          </form>

          <form className="rounded-md border border-line bg-white p-4 shadow-sm" onSubmit={handleInvite}>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-ink">
              <UserPlus size={18} />
              Invite member
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className="focus-ring h-10 w-full rounded-md border border-line px-3"
                  required
                  minLength={2}
                  value={invite.name}
                  onChange={(event) => setInvite({ ...invite, name: event.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  className="focus-ring h-10 w-full rounded-md border border-line px-3"
                  type="email"
                  required
                  value={invite.email}
                  onChange={(event) => setInvite({ ...invite, email: event.target.value })}
                />
              </Field>
              <Field label="Role">
                <select
                  className="focus-ring h-10 w-full rounded-md border border-line bg-white px-3"
                  value={invite.role}
                  onChange={(event) => setInvite({ ...invite, role: event.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <div className="flex items-end">
                <Button type="submit">Invite</Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-md border border-line bg-white p-4 shadow-sm">
            <h3 className="font-bold text-ink">{project.name}</h3>
            <p className="mt-2 min-h-10 text-sm text-slate-600">{project.description || 'No description'}</p>
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Members</p>
              <p className="mt-1 text-sm text-slate-700">
                {project.members?.map((member) => member.name).join(', ') || 'No members'}
              </p>
              {isAdmin ? (
                <div className="mt-3 space-y-2">
                  <select
                    className="focus-ring min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                    multiple
                    value={memberEdits[project.id] || []}
                    onChange={(event) =>
                      setMemberEdits({
                        ...memberEdits,
                        [project.id]: Array.from(event.target.selectedOptions, (option) => option.value)
                      })
                    }
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" onClick={() => handleMembersUpdate(project.id)}>
                    Save members
                  </Button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {!loading && projects.length === 0 ? (
        <p className="rounded-md border border-line bg-white px-4 py-8 text-center text-sm text-slate-500">
          No projects found.
        </p>
      ) : null}
    </section>
  );
}
