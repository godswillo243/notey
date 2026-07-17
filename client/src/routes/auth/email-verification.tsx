import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MailIcon } from 'lucide-react'

export const Route = createFileRoute('/auth/email-verification')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full p-10 max-w-120 bg-card">
      <div className="flex items-center justify-center flex-col gap-2">
        <MailIcon className="size-16 stroke-1 text-primary" />
        <p className="text-muted-foreground text-center">
          Verification link has been sent to your email address.
          <br />
          Click the link to verify your account.
        </p>
        <Button variant={'secondary'}>Resend</Button>
        <Link to="/auth/login" className="font-medium text-sm">
          Go to login
        </Link>
      </div>
    </div>
  )
}
