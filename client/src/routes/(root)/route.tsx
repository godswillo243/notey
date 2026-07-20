import LogoutButton from '#/components/logout-button';
import { AuthAction } from '#/lib/api/actions/auth';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';

export const Route = createFileRoute('/(root)')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: user,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: AuthAction.getAuthUser,
  });

  const navigate = Route.useNavigate();

  if (!isSuccess && !isFetching) navigate({ to: '/auth/login' });

  return (
    <div className="w-full h-screen  bg-background ">
      <h2>Helloo world {user?.name}</h2>
      <LogoutButton />
      {isFetching ? (
        <Loader2Icon className="size-10 animate-spin" />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
