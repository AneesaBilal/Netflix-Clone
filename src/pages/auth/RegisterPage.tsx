import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from './AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signUp, signIn } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';

const schema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const { success, error: toastError } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await signUp(values.fullName, values.email, values.password);
    if (error) {
      toastError(friendlyError(error));
      return;
    }
    if (data.session) {
      setSession(data.session);
      success('Account created. Welcome to StreamFlix!');
      navigate('/profiles');
    } else {
      success('Check your email to confirm your account, then sign in.');
      navigate('/login');
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start watching in under a minute.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="Full name" placeholder="Jane Doe" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="new-password" placeholder="At least 6 characters" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Create Account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
