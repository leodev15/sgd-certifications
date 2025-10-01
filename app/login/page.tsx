"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/ui/header";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /*useEffect(() => {
    //
    if (status === "authenticated" && session) {
      // 🔹 Guardar la sesión en sessionStorage
      sessionStorage.setItem("user", JSON.stringify(session.user));

      console.log("✅ Sesión guardada en sessionStorage:", session.user);

      // Redirigir según rol
      switch (session.user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "verificador":
          router.push("/verificador/dashboard");
          break;
        case "postulante":
          router.push("/postulante/dashboard");
          break;
        default:
          router.push("/");
      }
    }
  }, [status, session, router]);*/

  // 🔹 Mostrar loading mientras verifica la autenticación
  if (status === "loading") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Verificando autenticación...</span>
          </div>
        </div>
      </>
    );
  }

  // 🔹 Si ya está autenticado, mostrar loading mientras redirige
  if (status === "authenticated") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Redirigiendo...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header></Header>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
