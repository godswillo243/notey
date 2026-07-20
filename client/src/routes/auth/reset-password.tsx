import { AuthAction } from '#/lib/api/actions/auth';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import z from 'zod';
import type { SubmitEvent } from 'react';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { CheckCircleIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
  validateSearch: z.object({ token: z.string() }),
});

function RouteComponent() {
  const { token } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [password, setPassword] = useState('');
  const { isPending, mutateAsync, isSuccess, error } = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      AuthAction.resetPassword(password, token),
  });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    await mutateAsync({ password, token });
  };

  const errorMsg =
    typeof error?.response.data.message === 'string'
      ? error?.response.data.message
      : error?.response.data.message[0];

  if (isSuccess)
    return (
      <div className="w-full p-10 max-w-120 bg-card flex items-center justify-center flex-col gap-2">
        <div className="flex w-full gap-2 justify-center ">
          <CheckCircleIcon className="size-10" />
          <p className="text-card-foreground">Password reset successfully!</p>
        </div>
        <Link to="/auth/login">
          <Button variant={'ghost'}>Go to login</Button>
        </Link>
      </div>
    );

  return (
    <div className="w-full p-10 max-w-120 bg-card">
      <div className="flex items-center justify-center flex-col gap-2">
        <h3 className="font-semibold text-xl">Reset password</h3>
        <p className="text-muted-foreground">Enter your new password.</p>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4 w-full "
        >
          <Input
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {errorMsg && (
            <div className="border-destructive-foreground border rounded-md p-2 flex items-start justify-start gap-2">
              <TriangleAlertIcon className="size-6 shrink-0 text-destructive-foreground stroke-1" />
              <p className="text-destructive-foreground font-medium text-base text-center">
                {errorMsg}
              </p>
            </div>
          )}
          <Button
            variant={'default'}
            disabled={!password || isPending}
            className="w-full"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Reset password
          </Button>
          <Link to="/auth/forgot-password" className="w-full">
            <Button variant={'outline'} className="w-full">
              Resend Link
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
