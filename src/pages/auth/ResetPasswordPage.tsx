import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from './AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { updatePassword } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';

const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await updatePassword(values.password);
    if (error) {
      toastError(friendlyError(error));
      return;
    }
    success('Password updated. Please sign in.');
    navigate('/login');
  };

  return (
    <AuthShell title="Choose a new password" subtitle="Enter your new password below.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Update Password</Button>
      </form>
    </AuthShell>
  );
}
