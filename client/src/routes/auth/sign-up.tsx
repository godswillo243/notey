import AuthForm from '#/components/forms/auth-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full flex justify-center items-center ">
      <AuthForm mode="register" />
    </div>
  )
}
