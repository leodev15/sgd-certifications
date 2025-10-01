"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Users, FileCheck, LogIn } from "lucide-react";
import { Header } from "@/components/ui/header";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Espera mientras NextAuth resuelve
    const user = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string)
      : null;

    console.log("👤 Usuario desde sessionStorage:", user);
    // Check if user is already logged in
    //const currentUser = getCurrentUser();

    if (session?.user) {
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
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header></Header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Evaluación del Sistema de Gestión Documental
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Plataforma oficial para la certificación en el uso del Sistema de
            Gestión Documental del Gobierno Regional de Ayacucho
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="gov-card text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Para Postulantes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Regístrese, tome el examen y obtenga su certificación oficial
              </CardDescription>
            </CardContent>

            <div className="w-90% mx-auto text-white flex justify-center">
              <Link
                href={"/login"}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-xl"
              >
                <div className="flex items-center rounded-2xl">
                  <LogIn className="mr-2 h-5 w-5" />
                  <span>Iniciar Examen</span>
                </div>
              </Link>
            </div>
          </Card>

          <Card className="gov-card text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Para Verificadores</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Verifique la autenticidad de certificados emitidos
              </CardDescription>
            </CardContent>

            <div className="w-90% mx-auto">
              <Button
                size="lg"
                variant="ghost"
                className="text-red-600 border hover:bg-red-500 hover:text-white dark:hover:bg-red-950 px-8 py-3"
                onClick={() => router.push("/verificar")}
              >
                <Shield className="mr-2 h-5 w-5" />
                Verificar Certificado
              </Button>
            </div>
          </Card>

          <Card className="gov-card text-center">
            <CardHeader>
              <FileCheck className="h-12 w-12 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Certificación Oficial</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenga su constancia oficial con código de verificación
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-red-600">¿Qué es el SGD?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                El Sistema de Gestión Documental es una plataforma integral que
                permite la gestión electrónica de documentos y procesos
                administrativos, mejorando la eficiencia y transparencia en la
                administración pública.
              </p>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-red-600">
                Proceso de Certificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Registro con datos personales</li>
                <li>• Examen de 10 preguntas (10 minutos)</li>
                <li>• Nota mínima aprobatoria: 16/20</li>
                <li>• Descarga de constancia oficial</li>
                <li>• Verificación pública disponible</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">
            © 2025 Gobierno Regional de Ayacucho - Oficina de Tecnologías de la
            Información
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Sistema de Evaluación del Sistema de Gestión Documental
          </p>
        </div>
      </footer>
    </div>
  );
}
