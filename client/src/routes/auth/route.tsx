import { AuthAction } from '#/lib/api/actions/auth';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess, isPending } = useQuery({
    queryKey: ['auth-user'],
    queryFn: AuthAction.getAuthUser,
  });

  const navigate = Route.useNavigate();

  if (isSuccess) navigate({ to: '/' });

  return (
    <div className="w-full h-screen flex flex-col gap-6 bg-background items-center justify-center">
      <h3 className="text-2xl font-semibold text-primary">Notey</h3>
      {isPending ? (
        <Loader2Icon className="size-10 animate-spin" />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
