import { AuthAction } from '#/lib/api/actions/auth';
import { VerifyEmailSearchSchema } from '#/lib/validations';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/auth/verify-email')({
  component: RouteComponent,
  validateSearch: VerifyEmailSearchSchema,
});

function RouteComponent() {
  const { token } = Route.useSearch();

  const { isPending, isSuccess } = useQuery({
    queryKey: [''],
    queryFn: () => AuthAction.verifyEmail(token),
  });
  const navigate = useNavigate();

  useEffect(() => {
    let timeout = undefined;
    const handleRedirect = () => {
      navigate({ to: '/' });
    };
    if (isSuccess === true) {
      timeout = setTimeout(handleRedirect, 2000);
      return;
    }

    return clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <div className="w-full p-10 max-w-120 bg-card">
      <div className="flex items-center justify-center flex-col gap-2">
        {isPending && (
          <>
            <Loader2Icon className="animate-spin size-10" />
            <p className="text-muted-foreground">Verifying your email...</p>
          </>
        )}
        {isSuccess && (
          <>
            <CheckIcon className="size-10" />
            <p className="text-muted-foreground">
              Email verified, logging you in...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
