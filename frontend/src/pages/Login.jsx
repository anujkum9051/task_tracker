import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success('Welcome back');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Log in" subtitle="Enter your credentials to manage projects and tasks.">
      <form className="space-y-4" onSubmit={handleSubmit}>
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
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{' '}
        <Link className="font-semibold text-brand" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
