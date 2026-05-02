import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signup(form);
      toast.success('Account created');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start as an admin or join as a member.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Name">
          <input
            className="focus-ring h-11 w-full rounded-md border border-line px-3"
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        <Field label="Email">
          <input
            className="focus-ring h-11 w-full rounded-md border border-line px-3"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Field>
        <Field label="Password">
          <input
            className="focus-ring h-11 w-full rounded-md border border-line px-3"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </Field>
        <Field label="Role">
          <select
            className="focus-ring h-11 w-full rounded-md border border-line bg-white px-3"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-semibold text-brand" to="/login">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
