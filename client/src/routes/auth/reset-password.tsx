import { AuthAction } from '#/lib/api/actions/auth';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import z from 'zod';
import type { SubmitEvent } from 'react';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { Loader2Icon } from 'lucide-react';

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
  validateSearch: z.object({ token: z.string() }),
});

function RouteComponent() {
  const { token } = Route.useSearch();

  const [password, setPassword] = useState('');
  const { data, isPending, mutateAsync } = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      AuthAction.resetPassword(password, token),
  });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    await mutateAsync({ password, token });
    console.log(data);
  };

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
          <Button
            variant={'secondary'}
            disabled={!password || isPending}
            className="w-full"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
