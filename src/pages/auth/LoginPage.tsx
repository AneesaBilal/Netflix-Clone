import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from './AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signIn } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { getUserRole } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const setRole = useAuthStore((s) => s.setRole);
  const { success, error: toastError } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const from = (location.state as { from?: string } | null)?.from || '/profiles';

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await signIn(values.email, values.password);
    if (error || !data.session) {
      toastError(friendlyError(error));
      return;
    }
    setSession(data.session);
    if (data.user) {
      const role = await getUserRole(data.user.id);
      setRole(role);
    }
    success('Welcome back!');
    navigate(from, { replace: true });
  };

  return (
    <AuthShell title="Sign in" subtitle="Welcome back. Enter your details to continue watching.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Sign In</Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        New to StreamFlix?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
