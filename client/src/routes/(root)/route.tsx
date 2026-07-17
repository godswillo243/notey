import { AuthAction } from '#/lib/api/actions/auth';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';

export const Route = createFileRoute('/(root)')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isSuccess, isPending } = useQuery({
    queryKey: ['auth-user'],
    queryFn: AuthAction.getAuthUser,
  });

  const navigate = Route.useNavigate();

  if (!isSuccess) navigate({ to: '/auth/login' });

  return (
    <div className="w-full h-screen  bg-background ">
      <h2>Helloo world</h2>
      {isPending ? (
        <Loader2Icon className="size-10 animate-spin" />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
