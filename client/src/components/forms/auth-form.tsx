import { useForm } from '@tanstack/react-form';
import { Button } from '../ui/button';
import FormField from '../form-field';
import { Link, useNavigate } from '@tanstack/react-router';
import { LoginSchema, RegisterSchema } from '#/lib/validations';
import { Loader2Icon } from 'lucide-react';
import { AuthAction } from '#/lib/api/actions/auth';

interface AuthFormProps {
  mode: 'register' | 'login';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const isRegister = mode === 'register';
  const navigate = useNavigate({
    from: isRegister ? '/auth/sign-up' : '/auth/login',
  });
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
      try {
        if (isRegister) {
          const data = await AuthAction.register(value);
          if (data) navigate({ to: '/auth/email-verification' });
          return;
        }
        const data = await AuthAction.login(value);
        console.log(data);
        // if (data) navigate({ to: '/' })
      } catch (error) {
        console.log(error);
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
