import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { AuthAction } from '#/lib/api/actions/auth';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  Loader2Icon,
} from 'lucide-react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState('');
  const { data, isPending, mutateAsync, isSuccess } = useMutation({
    mutationFn: AuthAction.forgotPassword,
  });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    await mutateAsync(email);
    console.log(data);
  };

  return (
    <div className="w-full p-10 max-w-120 bg-card">
      <Link to="/auth/login">
        <Button variant={'link'}>
          {' '}
          <ArrowLeftIcon /> Back to login
        </Button>
      </Link>
      <div className="flex items-center justify-center flex-col gap-2">
        <h3 className="font-semibold text-xl">Forgot password</h3>
        <p className="text-muted-foreground">
          Enter your email address to get an email link to reset your password
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4 w-full "
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Button
            variant={'secondary'}
            disabled={!email || isPending || isSuccess}
            className="w-full"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Send reset link
          </Button>
        </form>

        {data && (
          <div className="flex w-full gap-2 ">
            <CheckCircleIcon className="size-10" />
            <p className="text-muted-foreground">{data.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
