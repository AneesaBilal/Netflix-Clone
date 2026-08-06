import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from './AuthShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { requestPasswordReset } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';

const schema = z.object({ email: z.string().email('Enter a valid email address') });
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { success, error: toastError } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const { error } = await requestPasswordReset(values.email);
    if (error) {
      toastError(friendlyError(error));
      return;
    }
    setSent(true);
    success('Reset link sent. Check your inbox.');
  };

  return (
    <AuthShell title="Reset your password" subtitle="We will email you a secure link to reset your password.">
      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            If an account exists for that email, you will receive a reset link shortly.
          </p>
          <Link to="/login"><Button className="w-full" variant="secondary">Back to sign in</Button></Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Send Reset Link</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-text-secondary">
        Remembered it? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
