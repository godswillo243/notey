import { AuthAction } from '#/lib/api/actions/auth';
import { removeToken } from '#/utils/token';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useLogout = () => {
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: AuthAction.logout,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    const data = await mutateAsync();
    queryClient.setQueryData(['auth-user'], () => {
      return null;
    });
    removeToken();
    navigate({ to: '/auth/login' });
  };

  return { logout, isLoggingOut: isPending };
};
