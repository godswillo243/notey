import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(root)/')({ component: App })

function App() {
  return <main className=""></main>
}
