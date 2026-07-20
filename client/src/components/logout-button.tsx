import { Button } from './ui/button';
import { useLogout } from '#/hooks/use-logout';
import { Loader2Icon, LogOutIcon } from 'lucide-react';

const LogoutButton = () => {
  const { isLoggingOut, logout } = useLogout();

  return (
    <Button onClick={() => logout()} variant={'ghost'}>
      {isLoggingOut ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      Logout
    </Button>
  );
};

export default LogoutButton;
