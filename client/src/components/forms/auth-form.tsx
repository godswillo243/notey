import { useForm } from '@tanstack/react-form';
import { Button } from '../ui/button';
import FormField from '../form-field';
import { Link, useNavigate } from '@tanstack/react-router';
import { LoginSchema, RegisterSchema } from '#/lib/validations';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { AuthAction } from '#/lib/api/actions/auth';
import { setToken } from '#/utils/token';
import { useState } from 'react';

interface AuthFormProps {
  mode: 'register' | 'login';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const isRegister = mode === 'register';
  const navigate = useNavigate({
    from: isRegister ? '/auth/sign-up' : '/auth/login',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'register' ? { name: '' } : {}),
    },
    validators: {
      onSubmit: isRegister ? RegisterSchema : LoginSchema,
    },
    onSubmit: async ({ value }) => {
      setErrorMsg('');
      try {
        if (isRegister) {
          const data = await AuthAction.register(value);
          if (data) navigate({ to: '/auth/email-verification' });
          return;
        }
        const data = await AuthAction.login(value);
        setToken(data.accessToken);
        if (data) navigate({ to: '/' });
      } catch (error) {
        const msg = error.response?.data?.message || '';
        setErrorMsg(msg);
      }
    },
  });

  return (
    <div className="p-10 bg-card w-full max-w-120 space-y-1 rounded-md">
      <h3 className="text-xl font-semibold">
        {isRegister ? 'Create an account' : 'Welcome back'}
      </h3>
      <p className="text-muted-foreground">
        {isRegister ? 'Already have an account?' : "Don't have an account? "}
        <Link
          to={isRegister ? '/auth/login' : '/auth/sign-up'}
          className="font-medium hover:underline text-foreground"
        >
          {isRegister ? ' Login' : ' Create one'}
        </Link>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="mt-4 space-y-4">
          <form.Field
            name="email"
            children={(field) => <FormField field={field} label="Email" />}
          />
          <form.Field
            name="password"
            children={(field) => (
              <FormField field={field} label="Password" type="password" />
            )}
          />
          {isRegister && (
            <form.Field
              name="name"
              children={(field) => <FormField field={field} label="Name" />}
            />
          )}
          <p className="text-end text-muted-foreground hover:underline">
            <Link to="/auth/forgot-password">Forgot password</Link>
          </p>
          {errorMsg && (
            <div className="border-destructive-foreground border rounded-md p-2 flex items-start justify-start gap-2">
              <TriangleAlertIcon className="size-6 shrink-0 text-destructive-foreground stroke-1" />
              <p className="text-destructive-foreground font-medium text-base text-center">
                {errorMsg}
              </p>
            </div>
          )}
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="mt-6 w-full">
              {isSubmitting && <Loader2Icon className="size-5 animate-spin" />}
              {isSubmitting
                ? isRegister
                  ? 'Creating account...'
                  : 'Signing in...'
                : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
            </Button>
          )}
        />
      </form>
    </div>
  );
};

export default AuthForm;
