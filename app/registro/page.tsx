import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/ui/header"

export default function RegisterPage() {
  return (
    <>
    <Header></Header>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
    </>
  )
}
